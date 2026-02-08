import {
  NextjsLogo,
  ConvexLogo,
  WorkOSLogo,
  ShadcnLogo,
  TailwindLogo,
  TypeScriptLogo,
} from '@/components/logos';

import type { SVGProps } from 'react';

interface TechItem {
  readonly name: string;
  readonly description: string;
  readonly Logo: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
}

const techStack: readonly TechItem[] = [
  {
    name: 'Next.js 15',
    description: 'App Router & Server Actions',
    Logo: NextjsLogo,
  },
  {
    name: 'Convex',
    description: 'Real-time backend',
    Logo: ConvexLogo,
  },
  {
    name: 'WorkOS',
    description: 'Enterprise auth',
    Logo: WorkOSLogo,
  },
  {
    name: 'shadcn/ui',
    description: 'Beautiful components',
    Logo: ShadcnLogo,
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first styling',
    Logo: TailwindLogo,
  },
  {
    name: 'TypeScript',
    description: 'Type-safe development',
    Logo: TypeScriptLogo,
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

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <div 
              key={tech.name} 
              className="group flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-muted"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background transition-colors group-hover:border-primary/50 overflow-hidden">
                <tech.Logo className="size-8" />
              </div>
              <div>
                <h3 className="font-semibold">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
