import { ReactNode } from "react";
import React from "react";
import { cn } from "@/utils/cn";

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
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-sans",
  h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-sans",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight font-sans",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight font-sans",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight font-sans",
  h6: "scroll-m-20 text-base font-semibold tracking-tight font-sans",
  p: "leading-7 [&:not(:first-child)]:mt-6 font-sans",
  lead: "text-xl text-muted-foreground font-sans",
  large: "text-lg font-semibold font-sans",
  small: "text-sm font-medium leading-none font-sans",
  muted: "text-sm text-muted-foreground font-sans",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  blockquote: "mt-6 border-l-2 pl-6 italic font-sans",
  list: "my-6 ml-6 list-disc [&>li]:mt-2 font-sans",
  listItem: "leading-7 font-sans",
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
