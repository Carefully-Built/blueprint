import Link from 'next/link';
import Image from 'next/image';

interface TechItem {
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly href: string;
  readonly className?: string;
}

const techStack: readonly TechItem[] = [
  {
    name: 'Next.js 15',
    description: 'App Router & Server Actions',
    logo: '/images/stack/next-js.svg',
    href: 'https://nextjs.org',
    className: 'dark:invert',
  },
  {
    name: 'Convex',
    description: 'Real-time backend',
    logo: '/images/stack/convex.webp',
    href: 'https://convex.dev',
  },
  {
    name: 'WorkOS',
    description: 'Enterprise auth & SSO',
    logo: '/images/stack/workos.png',
    href: 'https://workos.com',
  },
  {
    name: 'shadcn/ui',
    description: 'Beautiful components',
    logo: '/images/stack/shadcn.png',
    href: 'https://ui.shadcn.com',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling',
    logo: '/images/stack/tailwind.png',
    href: 'https://tailwindcss.com',
  },
  {
    name: 'TypeScript',
    description: 'Type-safe development',
    logo: '/images/stack/typescript.png',
    href: 'https://typescriptlang.org',
  },
  {
    name: 'Zod',
    description: 'Schema validation',
    logo: '/images/stack/zod.webp',
    href: 'https://zod.dev',
  },
  {
    name: 'Resend',
    description: 'Transactional emails',
    logo: '/images/stack/resend.webp',
    href: 'https://resend.com',
    className: 'dark:invert',
  },
  {
    name: 'Stripe',
    description: 'Payments & billing',
    logo: '/images/stack/sripe.png',
    href: 'https://stripe.com',
  },
  {
    name: 'OpenAI',
    description: 'AI & LLM integration',
    logo: '/images/stack/openai.webp',
    href: 'https://openai.com',
    className: 'dark:invert',
  },
  {
    name: 'TanStack',
    description: 'Query & table utilities',
    logo: '/images/stack/tanstack.png',
    href: 'https://tanstack.com',
  },
  {
    name: 'nuqs',
    description: 'Type-safe search params',
    logo: '/images/stack/nuqs.jpg',
    href: 'https://nuqs.47ng.com',
  },
];

export function TechStackSection(): React.ReactElement {
  return (
    <section className="border-t bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Built with the best
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            The perfect stack for AI-generated B2B SaaS
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A carefully curated combination of modern tools that work beautifully together. 
            Designed for developers who want to move fast without sacrificing quality.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Link
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-muted/20">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={40}
                  height={40}
                  className={`size-10 object-contain ${tech.className ?? ''}`}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
