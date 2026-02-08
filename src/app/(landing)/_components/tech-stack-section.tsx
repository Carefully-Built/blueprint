import Link from 'next/link';

import {
  NextjsLogo,
  ConvexLogo,
  WorkOSLogo,
  ShadcnLogo,
  TailwindLogo,
  TypeScriptLogo,
  ZodLogo,
  ResendLogo,
  StripeLogo,
  OpenAILogo,
  TanStackLogo,
  I18nLogo,
} from '@/components/logos';

import type { SVGProps } from 'react';

interface TechItem {
  readonly name: string;
  readonly description: string;
  readonly Logo: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  readonly href: string;
}

const techStack: readonly TechItem[] = [
  {
    name: 'Next.js 15',
    description: 'App Router & Server Actions',
    Logo: NextjsLogo,
    href: 'https://nextjs.org',
  },
  {
    name: 'Convex',
    description: 'Real-time backend',
    Logo: ConvexLogo,
    href: 'https://convex.dev',
  },
  {
    name: 'WorkOS',
    description: 'Enterprise auth & SSO',
    Logo: WorkOSLogo,
    href: 'https://workos.com',
  },
  {
    name: 'shadcn/ui',
    description: 'Beautiful components',
    Logo: ShadcnLogo,
    href: 'https://ui.shadcn.com',
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling',
    Logo: TailwindLogo,
    href: 'https://tailwindcss.com',
  },
  {
    name: 'TypeScript',
    description: 'Type-safe development',
    Logo: TypeScriptLogo,
    href: 'https://typescriptlang.org',
  },
  {
    name: 'Zod',
    description: 'Schema validation',
    Logo: ZodLogo,
    href: 'https://zod.dev',
  },
  {
    name: 'Resend',
    description: 'Transactional emails',
    Logo: ResendLogo,
    href: 'https://resend.com',
  },
  {
    name: 'Stripe',
    description: 'Payments & billing',
    Logo: StripeLogo,
    href: 'https://stripe.com',
  },
  {
    name: 'OpenAI',
    description: 'AI & LLM integration',
    Logo: OpenAILogo,
    href: 'https://openai.com',
  },
  {
    name: 'TanStack',
    description: 'Query & table utilities',
    Logo: TanStackLogo,
    href: 'https://tanstack.com',
  },
  {
    name: 'next-intl',
    description: 'Internationalization',
    Logo: I18nLogo,
    href: 'https://next-intl-docs.vercel.app',
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
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl overflow-hidden">
                <tech.Logo className="size-10" />
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
