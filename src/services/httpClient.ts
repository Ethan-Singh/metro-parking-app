export async function httpGet<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
    }

    return res.json();
}