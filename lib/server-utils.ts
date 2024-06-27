import { cookies } from "next/headers";

import { getCookie } from "cookies-next";

// Utility function to handle API fetch
export async function serverFetch(
  route: string,
  method: string,
  bodyData: object = {},
) {
  const url = `${process.env.VERCEL_ENV === "development" ? "http" : "https"}://${process.env.NEXT_PUBLIC_VERCEL_URL}/${route}`;
  const jwtCookie = getCookie("_vercel_jwt", { cookies });
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  };

  options.headers = {
    ...options.headers,
    ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
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
