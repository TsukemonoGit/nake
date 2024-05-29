import { className } from "@/util";
import { JSX } from "solid-js";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  class?: string;
  children: any;
}

export default function Button({ class: classProp, ...props }: ButtonProps) {
  return (
    <button class={`${className} ${classProp ?? ""}`} {...props}>
      {props.children}
    </button>
  );
}
