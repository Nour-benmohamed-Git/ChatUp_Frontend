import { HTTPMethod } from "@/types/HTTPMethods";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FetchFromServerOptions<B> = {
  method: HTTPMethod;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  body?: B | FormData;
};

export type FetchResponse<T> = {
  data?: T;
  error?: FetchError;
};

export type FetchError = {
  status: number;
  message: string;
};

export async function fetchFromServer<T, B = undefined>(
  url: string,
  options: FetchFromServerOptions<B>,
  revalidation?: { tag?: string; path?: string; redirectTo?: string }
): Promise<FetchResponse<T>> {
  const token = cookies().get("authToken")?.value;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  if (!(options.body instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}${url}`,
    {
      ...options,
      headers,
      body:
        options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
    }
  );

  if (!response.ok) {
    const error: FetchError = await response.json();
    return { error };
  }

  const data: T = await response.json();
  revalidation?.tag && revalidateTag(revalidation.tag);
  revalidation?.path && revalidatePath(revalidation.path);
  revalidation?.redirectTo && redirect(revalidation.redirectTo);
  return { data };
}
