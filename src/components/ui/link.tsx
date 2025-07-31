import * as React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/utils/cn";

export interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "button";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
}

const linkVariants = {
  variant: {
    default: "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    button: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  },
  size: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md gap-1.5 px-3",
    lg: "h-10 rounded-md px-6",
  },
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    children, 
    className, 
    variant = "default", 
    size = "default", 
    disabled = false,
    ...props 
  }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      // Handle Enter key for navigation
      if (event.key === 'Enter') {
        event.preventDefault();
        // Programmatically click the link
        event.currentTarget.click();
      }
    };

    return (
      <NextLink
        ref={ref}
        className={cn(
          linkVariants.variant[variant],
          variant === "button" && linkVariants.size[size],
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onKeyDown={handleKeyDown}
        role={variant === "button" ? "button" : undefined}
        tabIndex={0}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link"; 