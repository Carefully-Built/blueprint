import Link from 'next/link';
import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { FaqSection } from './_components/faq-section';
import { FeaturesSection } from './_components/features-section';
import { TechStackSection } from './_components/tech-stack-section';

export const metadata: Metadata = {
  title: 'Blueprint - Ship B2B SaaS in Hours',
  description: 'Production-ready Next.js template with auth, payments, real-time data, and stunning UI. Stop rebuilding. Start shipping.',
};

export default function LandingPage(): React.ReactElement {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--tw-gradient-from)_0%,transparent_100%)] from-primary/5" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 pb-24 pt-20 text-center md:pt-32">
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Now in public beta
            </Badge>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Ship beautiful B2B SaaS
              <span className="block text-primary">in hours, not months</span>
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Production-ready foundation with auth, payments, real-time data, and stunning UI. 
              Stop rebuilding the same infrastructure. Start shipping what matters.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="min-w-40" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-40" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Social proof placeholder */}
            <p className="mt-8 text-sm text-muted-foreground">
              Trusted by developers building the next generation of SaaS
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to ship faster?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started with Blueprint today and launch your SaaS in record time.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/login">Start Building</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
