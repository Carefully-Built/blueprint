import type { Metadata } from 'next';

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
      <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
        <span className="text-muted-foreground">Launching soon</span>
      </div>
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Ship beautiful dashboards
        <span className="text-primary"> in hours, not weeks</span>
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Production-ready foundation with auth, payments, real-time data, and stunning UI.
        Stop rebuilding the same things. Start shipping.
      </p>
      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get Started
        </a>
        <a
          href="#features"
          className="inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium hover:bg-accent"
        >
          Learn More
        </a>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="container py-24">
      <h2 className="mb-12 text-center text-3xl font-bold">Everything you need</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-lg border p-6">
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

export default LandingPage;
