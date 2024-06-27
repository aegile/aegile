import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export async function clientFetch(
  route: string,
  method: string,
  bodyData: object = {},
) {
  const url = `${route}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };

  if (method !== "GET") {
    options.body = JSON.stringify(bodyData);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `Error ${response.status}: ${errorDetails.message || response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
