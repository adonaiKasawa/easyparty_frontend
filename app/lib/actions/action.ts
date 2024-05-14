import { auth } from "@/app/auth/[...nextauth]";

export const file_url = `https://d31uetu06bkcms.cloudfront.net/`;

export const api_url = `http://localhost:4500/easyparty/api/`; // localhost
export const local_file_url = `${api_url}rooms/picture/`;

export const front_url = `http://localhost:3000/`;

export async function HttpRequest(path: string, method: string, body?: any) {
  const session = await auth();
  
  console.log("pathRequest", path);
  const headers: any = body instanceof FormData ? {
    Authorization: `Bearer ${session?.token.access_token}`
  } : {
    'Content-Type': "application/json",
    Authorization: `Bearer ${session?.token.access_token}`
  }
  try {
    const res = await fetch(`${api_url}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error);
    throw error
  }

}

export async function AuthHttpRequest(path: string, method: string, data?: any, params?: any) {
  try {
    const response = await fetch(`${api_url}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null
    });
    const res = await response.json();
    console.log(res);
    return res
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}

export async function RequestApi(path: string, method: string, data?: any, params?: any) {
  try {
    const url = new URL(path);
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null
    });

    if (!response.ok) {
      console.error('Response Error:', response);
      if (response.status === 401) {
        document.location = 'https://ecclesiabook.org/AuthConnexionView';
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}
