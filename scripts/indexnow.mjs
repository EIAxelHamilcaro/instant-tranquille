const HOST = "www.instant-tranquille.com";
const KEY = "2581ae0a74c0b697b5ba4e97e30eaa41";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const BATCH_SIZE = 10000;

async function sitemapUrls() {
  const response = await fetch(SITEMAP);
  if (!response.ok) {
    throw new Error(`Sitemap ${SITEMAP} answered ${response.status}`);
  }

  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((match) => match[1].replaceAll("&amp;", "&"))
    .filter((url) => new URL(url).host === HOST);

  return [...new Set(urls)];
}

async function keyIsPublished() {
  const response = await fetch(`https://${HOST}/${KEY}.txt`);

  return response.ok && (await response.text()).trim() === KEY;
}

async function submit(urlList) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });
  if (!response.ok) {
    throw new Error(
      `IndexNow answered ${response.status}: ${await response.text()}`,
    );
  }

  return response.status;
}

if (!(await keyIsPublished())) {
  throw new Error(
    `Key file https://${HOST}/${KEY}.txt is not online yet, deploy before submitting`,
  );
}

const urls = await sitemapUrls();
if (urls.length === 0) throw new Error(`No URL found in ${SITEMAP}`);

for (let start = 0; start < urls.length; start += BATCH_SIZE) {
  const batch = urls.slice(start, start + BATCH_SIZE);
  const status = await submit(batch);

  console.log(`IndexNow ${status}: ${batch.length} URL submitted`);
}
