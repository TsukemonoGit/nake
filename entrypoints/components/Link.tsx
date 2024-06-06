import { className } from "@/util";
import { JSX } from "solid-js";

interface Link extends JSX.HTMLAttributes<HTMLAnchorElement> {
  class?: string;
  href: string;
  children: any;
}

export default function Link({ class: classProp, href: href, ...props }: Link) {
  return (
    <a
      class={`${className} ${classProp ?? ""}`}
      {...props}
      target="_blank"
      rel="noreferrer noopener"
      href={href}
    >
      {props.children}
    </a>
  );
}
