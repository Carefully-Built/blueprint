import Link from 'next/link';

import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Production-ready Next.js dashboard template',
};

const features = [
  { title: 'Type-Safe', description: 'Full TypeScript with strict mode, zero anys' },
  { title: 'Modern Stack', description: 'Next.js 15, React 19, Tailwind CSS 4' },
  { title: 'Auth Ready', description: 'WorkOS + Clerk multi-tenant out of the box' },
  { title: 'Real-time', description: 'Convex for instant data sync' },
];

const LandingPage = (): React.ReactElement => (
  <>
    {/* Hero */}
    <section className="container flex flex-col items-center gap-8 pb-24 pt-16 text-center md:pt-24">
      <Badge variant="outline">Launching soon</Badge>
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Ship beautiful dashboards
        <span className="text-primary"> in hours, not weeks</span>
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Production-ready foundation with auth, payments, real-time data, and stunning UI.
        Stop rebuilding the same things. Start shipping.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="#features">Learn More</Link>
        </Button>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="container py-24">
      <h2 className="mb-12 text-center text-3xl font-bold">Everything you need</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  </>
);

export default LandingPage;
