import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

export const fetchServerAPIRequest = async (
  route: string,
  method: string,
  bodyData: object = {}
): Promise<any> => {
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

  const session = await auth();
  const jwtCookie = getCookie('_vercel_jwt', { cookies });
  const authToken = session?.accessToken;

  options.headers = {
    ...options.headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(jwtCookie ? { Cookie: `_vercel_jwt=${jwtCookie}` } : {}),
  };

  const routeProtocolPrefix =
    process.env.NODE_ENV === 'production' && process.env.LOCAL !== 'true'
      ? 'https://'
      : 'http://';

  const url = `${routeProtocolPrefix}${process.env.NEXT_PUBLIC_VERCEL_URL}${route}`;
  const response = await fetch(url, options);

  return response;
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.msg}`);
  }

  return data;
};
