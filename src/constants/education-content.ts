/**
 * @module constants/education-content
 * @description Educational content for the platform — articles, myths & facts,
 * glossary, and FAQ. Content is in markdown for flexible rendering.
 */

import type { EmissionCategory } from '@/types/common';

// ────────────────────────────────────────────────────────────────
// Articles
// ────────────────────────────────────────────────────────────────

/** A single educational article. */
export interface EducationArticle {
  /** Human-readable title. */
  title: string;
  /** URL-safe slug. */
  slug: string;
  /** Markdown body content. */
  content: string;
  /** Related emission category (if applicable). */
  category: EmissionCategory | 'general';
}

export const EDUCATION_ARTICLES: readonly EducationArticle[] = [
  {
    title: 'What is CO₂e?',
    slug: 'what-is-co2e',
    category: 'general',
    content: `
## What is CO₂e?

**CO₂e** stands for **carbon dioxide equivalent**. It is a standard unit for measuring carbon footprints that expresses the impact of each different greenhouse gas in terms of the amount of CO₂ that would create the same amount of warming.

### Why do we need CO₂e?

Different greenhouse gases trap different amounts of heat:

| Gas | Global Warming Potential (100-year) |
|-----|--------------------------------------|
| Carbon dioxide (CO₂) | 1 |
| Methane (CH₄) | 28 |
| Nitrous oxide (N₂O) | 265 |
| HFCs | 1,000–10,000+ |

By converting all gases to their CO₂ equivalent, we can compare emissions across different activities on a single scale.

### How is it used in this platform?

Every emission value you see on this platform is expressed in **kg CO₂e** — the total warming effect of all greenhouse gases produced, expressed as kilograms of CO₂.

For example, producing 1 kg of beef generates roughly **27 kg CO₂e**, which includes CO₂, methane from cattle, and nitrous oxide from fertilisers.
    `.trim(),
  },
  {
    title: 'Why Transport Matters',
    slug: 'why-transport-matters',
    category: 'transport',
    content: `
## Why Transport Matters

Transport accounts for roughly **27%** of the average person's carbon footprint. In developed countries, this number is often even higher.

### The biggest contributors

1. **Private cars** — A petrol car emits ~0.21 kg CO₂e per kilometre. A 30 km daily commute adds up to **2,300 kg CO₂e per year**.
2. **Flights** — A single return long-haul flight can add **2,500–4,000 kg CO₂e** — more than many people emit in an entire year.
3. **Ride-hailing** — Services like taxis and ride-shares can emit **69% more** than the trips they replace, due to empty cruising miles.

### What you can do

- **Walk or cycle** for trips under 5 km.
- **Use public transport** — buses emit 5×less per passenger-km than cars.
- **Work from home** even 1–2 days/week to reduce commute emissions.
- **Choose trains over flights** for trips under 800 km.
    `.trim(),
  },
  {
    title: 'How Food Affects Emissions',
    slug: 'how-food-affects-emissions',
    category: 'food',
    content: `
## How Food Affects Emissions

The food system is responsible for roughly **23%** of global greenhouse gas emissions. What you eat matters more than where it comes from.

### Key facts

- **Beef and lamb** have the highest carbon footprint — up to **27 kg CO₂e per kg** of food produced.
- **Plant-based proteins** (lentils, beans, tofu) produce **10–50× fewer** emissions than beef.
- **Food waste** accounts for **6%** of global emissions. When food rots in landfills, it releases methane.
- **Transport of food** (food miles) accounts for only **5–10%** of food's total emissions — how food is produced matters far more.

### Diet impact comparison (annual kg CO₂e)

| Diet | Annual emissions |
|------|-----------------|
| High meat | ~2,625 |
| Medium meat | ~2,055 |
| Low meat | ~1,705 |
| Vegetarian | ~1,390 |
| Vegan | ~1,055 |

### Quick wins

- Have **one meat-free day** per week — saves ~200 kg CO₂e/year.
- **Reduce food waste** — plan meals and use leftovers.
- Choose **seasonal, local produce** when possible.
    `.trim(),
  },
  {
    title: 'Small Actions, Big Impact',
    slug: 'small-actions-big-impact',
    category: 'general',
    content: `
## Small Actions, Big Impact

You don't need to transform your entire life to make a difference. Many small, easy changes add up to a substantial reduction in your carbon footprint.

### Top 10 easy actions

1. **Switch to LED bulbs** — saves ~60 kg CO₂e/year per household.
2. **Unplug devices** when not in use — saves ~50 kg CO₂e/year.
3. **Take shorter showers** (5 min vs 10 min) — saves ~150 kg CO₂e/year.
4. **Line-dry clothes** instead of using a dryer — saves ~150 kg CO₂e/year.
5. **Carry a reusable water bottle** — prevents ~100 plastic bottles/year.
6. **Walk for trips under 2 km** — saves ~100 kg CO₂e/year.
7. **Eat one meatless meal per day** — saves ~200 kg CO₂e/year.
8. **Buy second-hand** when possible — clothing, electronics, furniture.
9. **Reduce thermostat by 1°C** in winter — saves ~300 kg CO₂e/year.
10. **Recycle properly** — aluminium recycling saves 95% of production energy.

### The compound effect

If you adopt just **5 of these actions**, you could reduce your annual footprint by **500–1,000 kg CO₂e** — that's equivalent to planting 25–50 trees!
    `.trim(),
  },
] as const;

// ────────────────────────────────────────────────────────────────
// Myths vs Facts
// ────────────────────────────────────────────────────────────────

/** A single myth–fact pair. */
export interface MythFact {
  myth: string;
  fact: string;
}

export const MYTHS_VS_FACTS: readonly MythFact[] = [
  {
    myth: "Individual actions don't matter — it's all about big corporations.",
    fact: 'While systemic change is crucial, household consumption drives ~72% of global emissions. Individual choices create market demand for low-carbon alternatives and influence policy.',
  },
  {
    myth: 'Electric cars are worse for the environment because of battery production.',
    fact: 'Over their lifetime, EVs produce 50–70% fewer emissions than petrol cars, even accounting for battery manufacturing. This gap widens as grids get greener.',
  },
  {
    myth: 'Buying local food is the best way to reduce food emissions.',
    fact: 'Transport accounts for only 5–10% of food emissions. What you eat matters far more — switching from beef to chicken just one day a week saves more CO₂ than buying all local produce.',
  },
  {
    myth: 'Recycling solves the waste problem.',
    fact: 'Recycling is important but only addresses end-of-pipe waste. Reducing consumption and reusing items are far more effective — recycling still requires energy and has material losses.',
  },
  {
    myth: 'Carbon offsets cancel out your emissions.',
    fact: 'Many offset projects have questionable additionality and permanence. Offsets should complement — never replace — genuine emission reductions. Reduce first, offset the remainder.',
  },
  {
    myth: 'Renewable energy is too expensive to be practical.',
    fact: 'Solar and wind are now the cheapest sources of new electricity in most of the world. In 2023, renewables accounted for over 30% of global electricity generation.',
  },
  {
    myth: 'Flying is only a small part of emissions.',
    fact: 'A single return long-haul flight can equal an entire year of car driving. Aviation also has significant non-CO₂ effects (contrails, NOx) that roughly double its climate impact.',
  },
  {
    myth: 'Going vegan is the only diet change that helps.',
    fact: 'Any reduction in meat consumption helps. Simply cutting beef consumption in half can reduce food-related emissions by 25%. Flexitarian diets are a practical middle ground.',
  },
] as const;

// ────────────────────────────────────────────────────────────────
// Glossary
// ────────────────────────────────────────────────────────────────

/** A single glossary term. */
export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const GLOSSARY: readonly GlossaryEntry[] = [
  {
    term: 'Carbon Footprint',
    definition:
      'The total amount of greenhouse gases produced directly and indirectly by an individual, organisation, event, or product, expressed in CO₂ equivalent (CO₂e).',
  },
  {
    term: 'CO₂e (Carbon Dioxide Equivalent)',
    definition:
      'A standard unit that converts all greenhouse gases to the equivalent amount of CO₂ based on their global warming potential.',
  },
  {
    term: 'Greenhouse Gas (GHG)',
    definition:
      'A gas that absorbs and emits radiant energy in the infrared range, causing the greenhouse effect. Major GHGs include CO₂, methane, and nitrous oxide.',
  },
  {
    term: 'Net Zero',
    definition:
      'Achieving a balance between the amount of greenhouse gases emitted and the amount removed from the atmosphere.',
  },
  {
    term: 'Carbon Offset',
    definition:
      'A reduction or removal of CO₂ emissions to compensate for emissions made elsewhere, often through funding renewable energy or reforestation projects.',
  },
  {
    term: 'Scope 1 Emissions',
    definition:
      'Direct emissions from owned or controlled sources, such as burning fuel in a car or gas boiler.',
  },
  {
    term: 'Scope 2 Emissions',
    definition:
      'Indirect emissions from the generation of purchased electricity, steam, heating, and cooling.',
  },
  {
    term: 'Scope 3 Emissions',
    definition:
      'All other indirect emissions in a value chain, including purchased goods, business travel, and waste disposal.',
  },
  {
    term: 'Paris Agreement',
    definition:
      'An international treaty adopted in 2015, aiming to limit global warming to well below 2°C, preferably 1.5°C, compared to pre-industrial levels.',
  },
  {
    term: 'Emission Factor',
    definition:
      'A coefficient that quantifies the emissions produced per unit of activity (e.g., kg CO₂ per kWh of electricity or per km driven).',
  },
  {
    term: 'Renewable Energy',
    definition:
      'Energy generated from natural resources that are replenished on a human timescale — solar, wind, hydro, geothermal, and biomass.',
  },
  {
    term: 'Carbon Sink',
    definition:
      'A natural or artificial reservoir that absorbs more carbon from the atmosphere than it releases — forests, oceans, and soil are key sinks.',
  },
] as const;

// ────────────────────────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────────────────────────

/** A single FAQ entry. */
export interface FAQEntry {
  question: string;
  answer: string;
}

export const FAQ: readonly FAQEntry[] = [
  {
    question: 'How is my carbon footprint calculated?',
    answer:
      'We use scientifically-backed emission factors from sources like DEFRA, the EPA, and IPCC reports. Your inputs (transport, energy, food, shopping, waste, travel) are multiplied by standard CO₂e conversion factors to estimate your annual emissions.',
  },
  {
    question: 'What is a good carbon footprint?',
    answer:
      'The global average is about 4.8 tonnes CO₂e per year, but to meet Paris Agreement goals, we need to reach roughly 2 tonnes per person by 2030. In the US, the average is about 16 tonnes, so there is significant room for improvement.',
  },
  {
    question: 'How accurate is this calculator?',
    answer:
      'This calculator provides a reasonable estimate based on average emission factors. Individual circumstances vary — local energy grids, specific vehicle models, and lifestyle nuances can affect actual emissions. Use your results as a guide, not a precise measurement.',
  },
  {
    question: 'Why do flights have such a big impact?',
    answer:
      'Aircraft burn large amounts of jet fuel, and the emissions are released at high altitude where they have a greater warming effect. A single round-trip transatlantic flight produces about 1.6 tonnes CO₂e per passenger — nearly a year\'s worth of sustainable budget.',
  },
  {
    question: 'Does switching to renewable energy really help?',
    answer:
      'Yes! Grid electricity has an average emission factor of ~0.42 kg CO₂/kWh, while renewables produce as little as 0.02 kg CO₂/kWh (lifecycle). Switching to a 100% renewable electricity plan can reduce your energy emissions by over 95%.',
  },
  {
    question: 'How can I track my progress over time?',
    answer:
      'Complete the assessment periodically (e.g., monthly or quarterly). The platform stores your history and shows trends, helping you see how your lifestyle changes translate into real emission reductions.',
  },
  {
    question: 'What are habits and how do they help?',
    answer:
      'Habits are small, daily or weekly sustainable actions you can track on the platform. By building streaks and tracking completion, you create lasting behaviour changes that compound into significant emission reductions over time.',
  },
] as const;
