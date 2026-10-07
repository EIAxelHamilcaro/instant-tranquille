const POLICY_PATH = "/.well-known/mta-sts.txt";
const POLICY = [
  "version: STSv1",
  "mode: enforce",
  "mx: *.mx.cloudflare.net",
  "max_age: 604800",
  "",
].join("\n");

export default {
  fetch(request): Response {
    if (new URL(request.url).pathname !== POLICY_PATH) {
      return new Response("Only the MTA-STS policy is served here", {
        status: 404,
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Only GET and HEAD are accepted", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    return new Response(POLICY, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  },
} satisfies ExportedHandler;
