import MarketingNavbar from "./marketing-navbar";
import HeroSection from "./hero-section";
import ShowcaseSection from "./showcase-section";
import FeaturesSection from "./features-section";
import HowItWorksSection from "./how-it-works-section";
import CtaSection from "./cta-section";
import MarketingFooter from "./marketing-footer";

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
