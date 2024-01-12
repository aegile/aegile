import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCookie } from 'cookies-next';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchClientAPIRequest = async (
  route: string,
  method: string,
  bodyData: object = {}
) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method === 'GET') {
    // append payload to path
  } else {
    options.body = JSON.stringify(bodyData);
  }

  const session = await getSession();
  const authToken = session?.accessToken;
  // const jwtCookie = getCookie('_vercel_jwt');
  // const authToken = session.data?.accessToken;
  console.warn('authToken', authToken);

  options.headers = {
    ...options.headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    // ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
  };

  const routeProtocolPrefix =
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PUBLIC_LOCAL !== 'true'
      ? 'https://'
      : 'http://';

  const url = `${routeProtocolPrefix}${process.env.NEXT_PUBLIC_VERCEL_URL}${route}`;
  console.log(
    "🚀 ~ process.env.NODE_ENV === 'production':",
    process.env.NODE_ENV === 'production'
  );
  console.log('🚀 ~ process.env.LOCAL:', process.env.LOCAL);
  console.log('🚀 ~ url:', url);
  const response = await fetch(url, options);

  // if (!response.ok) toast.error(data.message);

  return response;

  const data = await response.json();
  console.warn('response', response);
  if (!response.ok) {
    throw new Error(`${response.status}: ${data.msg}`);
  }

  return data;
};
