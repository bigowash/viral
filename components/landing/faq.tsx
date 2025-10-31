'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  items?: FAQItem[];
  eyebrow?: string;
  title?: string;
  id?: string;
};

const defaultFaqs: FAQItem[] = [
  {
    question: 'How do I get started?',
    answer:
      'Create a SideShift account, share your first brief, and our team will match vetted creators within 48 hours. We handle onboarding so you can start approving submissions immediately.'
  },
  {
    question: 'Does SideShift cost money?',
    answer:
      'Pricing starts with a simple platform fee plus performance-based pricing per campaign. View the full pricing breakdown or talk with sales for tailored plans.'
  },
  {
    question: 'Which brands work with creators?',
    answer:
      'Consumer brands in beauty, lifestyle, fintech, SaaS, and DTC partner with SideShift to activate micro and macro creators across every major channel.'
  },
  {
    question: 'How are payments handled?',
    answer:
      'Creators are paid automatically in their preferred currency once deliverables are approved. We manage invoices, tax docs, and compliance in over 50 countries.'
  }
];

export function FAQSection({
  items = defaultFaqs,
  eyebrow = 'FAQs',
  title = 'All your questions answered',
  id
}: FAQSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id ?? 'faq'}
      className="bg-white py-24"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--color-text-muted)]">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-bold text-[var(--color-text-dark)] sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/70 bg-[#F7F9FC] shadow-[0_14px_40px_-32px_rgba(16,24,40,0.6)] transition-all"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-[var(--color-text-dark)] sm:text-lg"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${index}`}
                >
                  {faq.question}
                  <ChevronDown
                    className={`size-5 flex-shrink-0 transition-transform duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  className={`grid transform-gpu transition-all duration-300 ease-out ${
                    open
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  } px-6 pb-5`}
                >
                  <div className="overflow-hidden text-sm text-[var(--color-text-muted)] sm:text-base">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
