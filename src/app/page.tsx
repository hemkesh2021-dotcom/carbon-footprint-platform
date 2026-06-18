import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ImpactStats from '@/components/landing/ImpactStats';
import DashboardPreview from '@/components/landing/DashboardPreview';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';

export const metadata = {
  title: 'Carbon Footprint Platform — Understand & Reduce Your Impact',
  description:
    'Track your lifestyle impact, discover your biggest emission sources, and get personalized tips to live more sustainably.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BenefitsSection />
      <ImpactStats />
      <DashboardPreview />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
