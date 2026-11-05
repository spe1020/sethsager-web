import { setTimeout as sleep } from "node:timers/promises";

export const USER_AGENT =
  "sethsager.com-content-sync/1.0 (+https://sethsager.com; GitHub Actions)";

/**
 * GET a URL as text with a timeout and a few retries on transient failures
 * (network errors, 429, 5xx). Throws a short, readable Error when it gives up.
 * `fetchImpl` is injectable so tests never touch the network.
 */
export async function fetchText(url, { fetchImpl = fetch, timeoutMs = 20000, retries = 2, headers = {}, backoffMs = 1500 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "*/*", ...headers },
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });
      const transient = res.status === 429 || res.status >= 500;
      if (res.ok) return { status: res.status, text: await res.text(), contentType: res.headers.get("content-type") ?? "" };
      lastError = new Error(`HTTP ${res.status} from ${url}`);
      if (!transient) break; // 4xx will not get better by retrying
    } catch (err) {
      lastError = new Error(`${err?.name === "TimeoutError" ? "timed out" : "request failed"} for ${url}: ${err?.cause?.code ?? err?.message}`);
    }
    if (attempt < retries) await sleep(backoffMs * 2 ** attempt);
  }
  throw lastError;
}
