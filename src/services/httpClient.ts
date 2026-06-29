import type {ApiError} from "../features/parking/types.ts";

export class HttpError extends Error {
    public readonly status: number;
    public readonly body: ApiError | null;

    constructor(status: number, body: ApiError | null) {
        super(body?.error ?? `HTTP ${status}`);

        this.name = "HttpError";
        this.status = status;
        this.body = body;
    }
}

export async function httpGet<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
        // Try to parse the backend's ErrorResponse; fall back gracefully.
        let body: ApiError | null = null;
        try {
            body = await res.json();
        } catch {
            // response body wasn't JSON — that's fine
        }
        throw new HttpError(res.status, body);
    }

    return res.json() as Promise<T>;
}