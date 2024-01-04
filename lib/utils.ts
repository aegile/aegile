import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchServerAPIRequest = async (route: string, method: string, token: string = '', bodyData: object = {}): Promise<any> => {
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

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(`http://${process.env.NEXT_PUBLIC_VERCEL_URL}${route}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status}: ${data.msg}`);
  }

  return data;
};


// export async function checkAuth() {
//   const token = getCookie('accessToken', { cookies }) || ''
//   if (!token) {
//     return false;
//   }
  
//   try {
//     await fetchAPIRequest('/api/v1/auth/check', 'GET');
//   } catch (error) {
//     return false;
//   }
//   return true;
// }