import { createDefine } from "fresh";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
}

export const define = createDefine<State>();

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
