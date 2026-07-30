import { ChevronRight } from "lucide-react";
import ScrollReveal from "./scroll-reveal";
import { cn } from "@/src/lib/utils";

type StepAccent = "blue" | "pink" | "yellow" | "green";

const ACCENT_STYLES: Record<StepAccent, string> = {
  blue: "border-primary-blue/40 text-primary-blue shadow-primary-blue/20",
  pink: "border-primary-pink/40 text-primary-pink shadow-primary-pink/20",
  yellow: "border-primary-yellow/40 text-primary-yellow shadow-primary-yellow/20",
  green: "border-primary-green/40 text-primary-green shadow-primary-green/20",
};

const steps: { step: string; title: string; description: string; accent: StepAccent }[] = [
  {
    step: "01",
    title: "Create your workspace",
    description: "Sign up free and spin up a workspace for your team in seconds — no setup required.",
    accent: "blue",
  },
  {
    step: "02",
    title: "Invite your team",
    description: "Bring teammates in, assign roles, and give everyone a home for their work.",
    accent: "pink",
  },
  {
    step: "03",
    title: "Organize the work",
    description: "Create projects, then fill them with tasks, docs, whiteboards, and files as you go.",
    accent: "yellow",
  },
  {
    step: "04",
    title: "Ship together",
    description: "Track progress in real time and see recent activity so nothing falls through the cracks.",
    accent: "green",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="border-t border-border bg-background-200/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-medium text-primary-blue">How it works</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            From sign-up to shipping in minutes
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.step}
              delay={index * 0.1}
              y={20}
              className="relative flex flex-col gap-4"
            >
              <div
                className={cn(
                  "relative z-10 flex size-12 items-center justify-center rounded-full border-2 bg-background-200 text-sm font-bold shadow-lg",
                  ACCENT_STYLES[step.accent],
                )}
              >
                {step.step}
                {index < steps.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    size={18}
                    className="absolute top-1/2 -right-7 hidden -translate-y-1/2 text-border lg:block"
                  />
                )}
              </div>

              <h3 className="text-h1 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-100">{step.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
