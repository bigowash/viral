'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, Copy } from 'lucide-react';

import { theme } from '@/lib/theme';

type TerminalProps = {
  label: string;
  steps: readonly string[];
};

const { palette } = theme;

const STEP_DELAY = 850;

export function Terminal({ label, steps }: TerminalProps) {
  const [visibleStep, setVisibleStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visibleStep >= steps.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setVisibleStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [visibleStep, steps.length]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const formattedSteps = useMemo(
    () =>
      steps.map((step) => {
        const [speaker, detail] = step.split('·').map((part) => part.trim());
        return {
          speaker,
          detail: detail ?? '',
          raw: step
        };
      }),
    [steps]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(steps.join('\n'));
    setCopied(true);
  };

  return (
    <div
      className="relative rounded-[40px] border shadow-xl"
      style={{
        backgroundColor: palette.surface,
        borderColor: palette.border,
        boxShadow: palette.shadow
      }}
    >
      <div
        className="flex items-center justify-between border-b px-6 py-5"
        style={{ borderColor: palette.border }}
      >
        <p
          className="text-xs font-heading uppercase tracking-[0.32em]"
          style={{ color: palette.textSecondary }}
        >
          {label}
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-heading uppercase tracking-[0.18em] transition-colors hover:opacity-80"
          style={{
            borderColor: palette.border,
            color: palette.textSecondary
          }}
          aria-label="Copy Jack and Jill workflow"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <ul className="space-y-6 px-6 py-8">
        {formattedSteps.map((step, index) => (
          <li
            key={step.raw}
            className={`transition-all duration-500 ${index > visibleStep ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}
          >
            {step.speaker && (
              <span
                className="text-[10px] font-heading uppercase tracking-[0.28em]"
                style={{
                  color:
                    step.speaker.toLowerCase().startsWith('jill') ||
                    step.speaker.toLowerCase().startsWith('jack')
                      ? palette.accent
                      : palette.textSecondary
                }}
              >
                {step.speaker}
              </span>
            )}
            <p
              className="mt-3 text-base leading-6"
              style={{ color: palette.textPrimary }}
            >
              {step.detail || step.raw}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
