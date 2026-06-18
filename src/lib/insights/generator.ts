import type { AssessmentData, EmissionCategory, FootprintResult } from '@/types';
import { calculateTotalFootprint } from '../calculator/calculator';
import { formatPercentage } from '@/utils/formatting';

export interface InsightMessage {
  type: 'improvement' | 'suggestion' | 'achievement';
  message: string;
  category?: EmissionCategory;
}

/**
 * Generate personal insight messages based on the user's assessment history.
 */
export function generateInsights(assessments: AssessmentData[]): InsightMessage[] {
  const insights: InsightMessage[] = [];

  if (assessments.length === 0) {
    return [
      {
        type: 'suggestion',
        message: 'Complete your first footprint assessment to see personalized insights and suggestions here!',
      },
    ];
  }

  // Calculate results for all assessments
  const results = assessments.map((a) => ({
    date: a.date,
    result: calculateTotalFootprint(a),
  }));

  const latest = results[results.length - 1];
  if (!latest) return insights;

  const latestResult = latest.result;

  // 1. First-assessment check
  if (assessments.length === 1) {
    insights.push({
      type: 'achievement',
      message: "Congratulations on taking your first footprint assessment! You've taken the first step toward a more sustainable lifestyle.",
    });

    // Suggest reducing the highest category
    const sortedCats = [...latestResult.categories].sort((a, b) => b.emissions - a.emissions);
    const highest = sortedCats[0];
    if (highest && highest.emissions > 0) {
      insights.push({
        type: 'suggestion',
        message: `Your highest emission source is ${highest.category} (${highest.percentage}% of your total). Check out the recommendations for simple changes in this area.`,
        category: highest.category,
      });
    }

    return insights;
  }

  // 2. Comparison check (multiple assessments)
  const previous = results[results.length - 2];
  if (previous) {
    const prevResult = previous.result;
    
    // Overall change
    const overallDiff = latestResult.totalYearly - prevResult.totalYearly;
    const overallPct = (overallDiff / prevResult.totalYearly) * 100;

    if (overallPct < -1) {
      insights.push({
        type: 'improvement',
        message: `Great job! Your carbon footprint decreased by ${formatPercentage(Math.abs(overallPct))}% compared to your last assessment.`,
      });
    } else if (overallPct > 1) {
      insights.push({
        type: 'suggestion',
        message: `Your carbon footprint increased by ${formatPercentage(overallPct)}% compared to your last assessment. Review your habits to see where you can trim emissions.`,
      });
    } else {
      insights.push({
        type: 'achievement',
        message: 'Your carbon footprint has remained stable. Keep up your current sustainable practices!',
      });
    }

    // Category-specific changes
    latestResult.categories.forEach((latCat) => {
      const prevCat = prevResult.categories.find((c) => c.category === latCat.category);
      if (prevCat && prevCat.emissions > 0) {
        const catDiff = latCat.emissions - prevCat.emissions;
        const catPct = (catDiff / prevCat.emissions) * 100;

        if (catPct < -5) {
          insights.push({
            type: 'improvement',
            message: `Awesome effort! You reduced your ${latCat.category} emissions by ${formatPercentage(Math.abs(catPct))}%!`,
            category: latCat.category,
          });
        } else if (catPct > 5) {
          insights.push({
            type: 'suggestion',
            message: `Your ${latCat.category} emissions went up by ${formatPercentage(catPct)}%. Check the habits tab for new ideas in this area.`,
            category: latCat.category,
          });
        }
      }
    });
  }

  // 3. Absolute threshold achievements
  if (latestResult.totalYearly <= 2000) {
    insights.push({
      type: 'achievement',
      message: "Incredible! Your footprint is under 2,000 kg CO₂e/year, meeting the global Paris Agreement climate target! 🌟",
    });
  } else if (latestResult.totalYearly < 4800) {
    insights.push({
      type: 'achievement',
      message: "Nice! Your carbon footprint is below the global average of 4.8 tonnes per year. Keep sliding down!",
    });
  }

  return insights;
}

/**
 * Generate a textual monthly summary.
 */
export function generateMonthlySummary(current: FootprintResult, previous: FootprintResult | null): string {
  if (!previous) {
    const sorted = [...current.categories].sort((a, b) => b.emissions - a.emissions);
    const highest = sorted[0];
    return `Your estimated carbon footprint is ${formatPercentage(current.comparisonToAverage, true)} compared to the average global citizen, with ${highest ? highest.category : 'N/A'} being your largest source of emissions.`;
  }

  const diff = current.totalYearly - previous.totalYearly;
  const pct = (diff / previous.totalYearly) * 100;

  if (diff < 0) {
    return `You saved an estimated ${Math.round(Math.abs(diff))} kg CO₂e/year (${formatPercentage(Math.abs(pct))}) compared to your previous assessment, primarily through reductions in your habits.`;
  } else if (diff > 0) {
    return `Your footprint is up by ${Math.round(diff)} kg CO₂e/year (${formatPercentage(pct)}) compared to your previous assessment. Take a look at the personalized actions below to find ways to reduce.`;
  } else {
    return 'Your carbon emissions are identical to your last assessment. Try adopting one of our recommended habits to start decreasing your footprint!';
  }
}
