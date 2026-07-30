import dynamic from "next/dynamic";
import MarketingNavbar from "./marketing-navbar";
import HeroSection from "./hero-section";
import MarketingFooter from "./marketing-footer";

// Below-the-fold sections are code-split out of the hero's initial JS chunk —
// they still render on the server (ssr stays on, so no CLS/SEO impact), but
// their framer-motion-heavy client bundles load in parallel instead of
// blocking the hero from becoming interactive first.
const ShowcaseSection = dynamic(() => import("./showcase-section"));
const FeaturesSection = dynamic(() => import("./features-section"));
const HowItWorksSection = dynamic(() => import("./how-it-works-section"));
const CtaSection = dynamic(() => import("./cta-section"));

const LandingPage = () => {
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1">
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
};

export default LandingPage;
