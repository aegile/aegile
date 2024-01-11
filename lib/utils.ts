import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCookie } from 'cookies-next';

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

  // const jwtCookie = getCookie('_vercel_jwt');
  const authToken = getCookie('accessToken');

  options.headers = {
    ...options.headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    // ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
  };

  const routeProtocolPrefix =
    process.env.NODE_ENV === 'production' && process.env.LOCAL !== 'true'
      ? 'https://'
      : 'http://';

  const url = `${routeProtocolPrefix}${process.env.NEXT_PUBLIC_VERCEL_URL}${route}`;
  console.log(url);
  const response = await fetch(url, options);

  return response;
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.msg}`);
  }

  return data;
};
