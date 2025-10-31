import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";;
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        sideshift:
          "bg-[linear-gradient(135deg,var(--color-cta-dark-gradient-start),var(--color-cta-dark-gradient-end))] text-white shadow-[0_12px_28px_-14px_rgba(32,32,32,0.7)] hover:translate-y-[-1px] hover:shadow-[0_14px_32px_-12px_rgba(32,32,32,0.65)] focus-visible:ring-white/40 focus-visible:ring-[3px]",
        sideshiftLight:
          "bg-[linear-gradient(135deg,var(--color-cta-light-gradient-start),var(--color-cta-light-gradient-end))] text-[var(--color-text-dark)] border border-white/60 shadow-[0_10px_24px_-18px_rgba(16,24,40,0.35)] hover:bg-[linear-gradient(135deg,var(--color-cta-light-gradient-start),var(--color-cta-light-gradient-end))] hover:translate-y-[-1px] hover:shadow-[0_16px_32px_-18px_rgba(16,24,40,0.25)] focus-visible:ring-ring/40 focus-visible:ring-[3px]"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
