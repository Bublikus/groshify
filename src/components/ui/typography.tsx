import { ReactNode } from "react";
import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "code"
    | "blockquote"
    | "list"
    | "listItem";
  as?: keyof HTMLElementTagNameMap;
  ellipsis?: boolean;
}

const variantStyles = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  list: "my-6 ml-6 list-disc [&>li]:mt-2",
  listItem: "leading-7",
};

const defaultElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
  code: "code",
  blockquote: "blockquote",
  list: "ul",
  listItem: "li",
};

export function Typography({
  children,
  className,
  variant = "p",
  as,
  ellipsis = false,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) {
  const Component = as || defaultElements[variant];

  return React.createElement(
    Component,
    {
      className: cn(variantStyles[variant], ellipsis && "truncate", className),
      ...props,
    },
    children
  );
}
