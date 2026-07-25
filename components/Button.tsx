import type { ComponentChildren } from "preact";
import { cn } from "@/lib/utils.ts";

export interface ButtonProps {
  id?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={cn("btn", { "btn-disabled": props.disabled })}
    />
  );
}
