// 네이버 블로그(hmimo) RSS → data/blog.json + 글마다 대표 사진 data/blog-img/<글번호>.jpg
import fs from "node:fs";
const RSS = "https://rss.blog.naver.com/hmimo.xml";
const UA = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36", referer: "https://blog.naver.com/" };
const xml = process.argv[2] ? fs.readFileSync(process.argv[2], "utf8") : await (await fetch(RSS, { headers: UA })).text();
const pick = (s, tag) => { const m = s.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : ""; };
const text = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const kst = d => new Date(new Date(d).getTime() + 9 * 3600e3).toISOString().slice(0, 10);
const unent = s => s.replace(/&amp;/g, "&");
async function photoFor(no, desc) {
  // 1) RSS 본문 첫 사진  2) 글 페이지의 대표 사진(og:image)  3) 글 속 유튜브 영상 썸네일
  let u = (desc.match(/<img[^>]+src="([^"]+)"/) || [])[1];
  let html = "";
  try { html = await (await fetch(`https://blog.naver.com/PostView.naver?blogId=hmimo&logNo=${no}`, { headers: UA })).text(); } catch {}
  if (!u) u = (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1];
  const yt = (html.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/) || [])[1];
  if ((!u || /blog_profile|og_default|noimage/i.test(u)) && yt) u = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  if (!u) return null;
  u = unent(u).replace(/\?type=\w+$/, "") + (/pstatic\.net/.test(u) ? "?type=w800" : "");
  try {
    const r = await fetch(u, { headers: UA });
    if (!r.ok || !/image/.test(r.headers.get("content-type") || "")) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 3000) return null;
    fs.mkdirSync("data/blog-img", { recursive: true });
    fs.writeFileSync(`data/blog-img/${no}.jpg`, buf);
    return `blog-img/${no}.jpg`;
  } catch { return null; }
}
const raw = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
const items = [];
for (const it of raw.slice(0, 20)) {
  const link = unent(pick(it, "link")).split("?")[0];
  if (!link.startsWith("https://blog.naver.com/")) continue;
  const no = link.split("/").pop(), desc = pick(it, "description"), d = text(desc);
  items.push({ title: text(pick(it, "title")), link, date: kst(pick(it, "pubDate")), summary: d.length > 120 ? d.slice(0, 118) + "…" : d, image: await photoFor(no, desc) });
}
if (!items.length) { console.error("RSS에서 글을 못 찾음 — 기존 파일 유지"); process.exit(0); }
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/blog.json", JSON.stringify({ source: "https://blog.naver.com/hmimo", items }, null, 1) + "\n");
console.log(`글 ${items.length}개, 사진 ${items.filter(i => i.image).length}개`);
