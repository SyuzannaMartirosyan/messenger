type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestData = Record<string, unknown> | FormData | null;

export type RequestOptions = {
  method: HTTPMethod;
  data?: RequestData;
  headers?: Record<string, string>;
  timeout?: number;
};

export class HTTPClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl.replace(/\/$/, ""); 
  }

  public get<T = unknown>(
    path: string,
    params?: Record<string, unknown>,
    options: Omit<RequestOptions, "method" | "data"> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "GET",
      data: params ?? null,
    });
  }

  public post<T = unknown>(
    path: string,
    data?: RequestData,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      data: data ?? null,
    });
  }

  public put<T = unknown>(
    path: string,
    data?: RequestData,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      data: data ?? null,
    });
  }

  public delete<T = unknown>(
    path: string,
    data?: RequestData,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "DELETE",
      data: data ?? null,
    });
  }


  private request<T = unknown>(
    path: string,
    options: RequestOptions
  ): Promise<T> {
    const { method, data, headers = {}, timeout = 5000 } = options;

    return new Promise<T>((resolve, reject) => {
      if (!method) {
        reject(new Error("HTTP method is required"));
        return;
      }

      const isGet = method === "GET";

      let url = this.baseUrl + path;

      if (isGet && data && !(data instanceof FormData)) {
        const query = this.queryStringify(data as Record<string, unknown>);
        if (query) {
          url += (url.includes("?") ? "&" : "?") + query;
        }
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      xhr.withCredentials = true;

      xhr.timeout = timeout;

      if (!(data instanceof FormData)) {
        const hasContentType = Object.keys(headers).some(
          (key) => key.toLowerCase() === "content-type"
        );

        if (!hasContentType && !isGet && data) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
      }

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        const contentType = xhr.getResponseHeader("Content-Type") || "";
        let response: unknown = xhr.responseText;

        if (contentType.includes("application/json")) {
          try {
            response = JSON.parse(xhr.responseText);
          } catch {
            
          }
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response as T);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response,
          });
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.ontimeout = () => {
        reject(new Error("Request timeout"));
      };

      xhr.onabort = () => {
        reject(new Error("Request aborted"));
      };

      let body: Document | BodyInit | null = null;

      if (!isGet && data) {
        if (data instanceof FormData) {
          body = data;
        } else {
          body = JSON.stringify(data);
        }
      }

      xhr.send(body);
    });
  }

  private queryStringify(data: Record<string, unknown>): string {
    const pairs: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          pairs.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
          );
        });
      } else {
        pairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        );
      }
    });

    return pairs.join("&");
  }
}
