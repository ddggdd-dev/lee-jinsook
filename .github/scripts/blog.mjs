// 네이버 블로그(hmimo) RSS → data/blog.json + 글마다 대표 사진 data/blog-img/<글번호>.jpg
import fs from "node:fs";
const RSS = "https://rss.blog.naver.com/hmimo.xml";
const UA = { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120 Safari/537.36", referer: "https://blog.naver.com/" };
const xml = process.argv[2] ? fs.readFileSync(process.argv[2], "utf8") : await (await fetch(RSS, { headers: UA })).text();
const pick = (s, tag) => { const m = s.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : ""; };
const text = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const kst = d => new Date(new Date(d).getTime() + 9 * 3600e3).toISOString().slice(0, 10);
const unent = s => s.replace(/&amp;/g, "&");
const freshDesc = {};
async function photoFor(no, desc) {
  // 글 속 사진(postfiles/blogfiles) → 글 속 유튜브 썸네일 → RSS 본문 사진 → og:image 순서
  let html = "";
  try { html = await (await fetch(`https://m.blog.naver.com/PostView.naver?blogId=hmimo&logNo=${no}`, { headers: UA })).text(); } catch {}
  const cands = [];
  const og = (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1];
  const od = (html.match(/property="og:description"\s+content="([^"]*)"/) || [])[1]; if (od) freshDesc[no] = od;
  if (og && !/\/static\//.test(og)) { if (/blogthumb\.pstatic\.net/.test(og)) cands.push(og.replace(/^https?:\/\/blogthumb\.pstatic\.net/, "https://mblogthumb-phinf.pstatic.net")); cands.push(og); }   // 블로그에서 고른 대표 썸네일(2026-11-09: blogthumb 주소는 w800 이 안 받혀 본문 첫 사진으로 밀렸음)                     // 글마다 다른 대표 사진(blogthumb)
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "");           // 광고 배너(스크립트 안) 제외
  const yt = (body.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/) || [])[1];
  if (yt) cands.push(`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`);
  for (const m of body.matchAll(/https?:\/\/(?:postfiles|blogfiles|mblogthumb-phinf|blogthumb)\.pstatic\.net\/[^"'\s)<>\\]+/g)) cands.push(m[0]);
  const d = (desc.match(/<img[^>]+src="([^"]+)"/) || [])[1]; if (d) cands.push(d);
  for (let u of cands) {
    u = unent(u).replace(/\?type=\w+$/, "");
    if (/blog_profile|profile|og_default|noimage|static\/blog|spc\.gif/i.test(u)) continue;
    if (/pstatic\.net/.test(u)) u += "?type=w800";
    try {
      const r = await fetch(u, { headers: UA });
      if (!r.ok || !/image/.test(r.headers.get("content-type") || "")) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 5000) continue;
      fs.mkdirSync("data/blog-img", { recursive: true });
      fs.writeFileSync(`data/blog-img/${no}.jpg`, buf);
      return `blog-img/${no}.jpg`;
    } catch {}
  }
  return null;
}
const raw = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
const items = [];
for (const it of raw.slice(0, 20)) {
  const link = unent(pick(it, "link")).split("?")[0];
  if (!link.startsWith("https://blog.naver.com/")) continue;
  const no = link.split("/").pop(), desc = pick(it, "description"), d = text(desc);
  items.push({ title: text(pick(it, "title")), link, date: kst(pick(it, "pubDate")), summary: "", image: await photoFor(no, desc) }); { const it = items[items.length - 1], f = freshDesc[no] ? text(freshDesc[no]) : d; it.summary = f.length > 120 ? f.slice(0, 118) + "…" : f; }
}
if (!items.length) { console.error("RSS에서 글을 못 찾음 — 기존 파일 유지"); process.exit(0); }
// 여러 글에 똑같은 사진이 걸리면(블로그 기본 사진) 그 사진은 버린다
import crypto from "node:crypto";
const seen = {};
for (const i of items) if (i.image) { const h = crypto.createHash("md5").update(fs.readFileSync("data/" + i.image)).digest("hex"); (seen[h] ||= []).push(i); }
for (const list of Object.values(seen)) if (list.length > 2) for (const i of list) { fs.rmSync("data/" + i.image, { force: true }); i.image = null; }
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/blog.json", JSON.stringify({ source: "https://blog.naver.com/hmimo", items }, null, 1) + "\n");
console.log(`글 ${items.length}개, 사진 ${items.filter(i => i.image).length}개`);
