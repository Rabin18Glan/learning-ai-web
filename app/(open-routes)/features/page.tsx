import CallToActionSection from "./_components/call-to-action-section";
import HeroSection from "./_components/hero-section";
import KeyFeatureSection from "./_components/key-feature-section";
import WorkFlowSection from "./_components/work-flow-section";

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      {/* Page Divided into sections */}
      <HeroSection />
      <KeyFeatureSection />
      <WorkFlowSection />
      <CallToActionSection />
    </main>

  )
}
