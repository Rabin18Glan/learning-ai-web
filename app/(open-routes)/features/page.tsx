import CallToActionSection from "./components/call-to-action-section";
import HeroSection from "./components/hero-section";
import KeyFeatureSection from "./components/key-feature-section";
import WorkFlowSection from "./components/work-flow-section";

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
