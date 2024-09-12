import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import daysjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

daysjs.extend(relativeTime);
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromNow(date: string) {
  return daysjs(date).fromNow();
}

export function str2ab(str:string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
  }
  return buf;
}