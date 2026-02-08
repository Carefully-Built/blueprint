'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

const faqs: readonly FaqItem[] = [
  {
    question: 'What is Blueprint?',
    answer:
      'Blueprint is a production-ready B2B SaaS starter kit built with Next.js 15, Convex, and WorkOS. It provides everything you need to launch a modern SaaS application: authentication, organization management, real-time data, payments, and more.',
  },
  {
    question: 'Is Blueprint free to use?',
    answer:
      'Blueprint is open source and free to use for any project. You only pay for the services you use (Convex, WorkOS, Stripe, etc.) based on their pricing tiers. Most have generous free tiers for getting started.',
  },
  {
    question: 'Why WorkOS instead of other auth providers?',
    answer:
      'WorkOS provides enterprise-grade authentication with SSO, SCIM, and directory sync out of the box. This makes Blueprint ideal for B2B SaaS where your customers need to connect their identity providers.',
  },
  {
    question: 'Can I use Blueprint for B2C applications?',
    answer:
      'While Blueprint is optimized for B2B with organization management and enterprise auth, you can adapt it for B2C use cases. The core architecture, real-time backend, and payment integration work great for any SaaS.',
  },
  {
    question: 'How does real-time data work?',
    answer:
      'Convex provides automatic real-time subscriptions. When data changes in the database, all connected clients update instantly without any additional configuration. No WebSocket setup or state management required.',
  },
  {
    question: 'Is Blueprint production-ready?',
    answer:
      'Yes! Blueprint includes production essentials: TypeScript for type safety, ESLint for code quality, proper error handling, secure authentication, and a scalable architecture. Deploy to Vercel with one click.',
  },
  {
    question: 'How do I customize the design?',
    answer:
      'Blueprint uses Tailwind CSS and shadcn/ui components. Customize the theme in your CSS variables, or modify individual components. Everything is unstyled by default and designed to be extended.',
  },
  {
    question: 'What about payments and subscriptions?',
    answer:
      'Blueprint integrates with Stripe for payments. Handle one-time charges, subscriptions, usage-based billing, and customer portals. Webhook handlers and billing state management are included.',
  },
];

function FaqItem({ question, answer }: FaqItem): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            'size-5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection(): React.ReactElement {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Blueprint.
          </p>
        </div>

        <div className="mt-12">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="mailto:support@blueprint.dev" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
