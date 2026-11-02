// 네이버 블로그(hmimo) RSS → data/blog.json  (인사이트 페이지 "블로그" 카드용)
import fs from "node:fs";
const RSS = "https://rss.blog.naver.com/hmimo.xml";
const xml = process.argv[2] ? fs.readFileSync(process.argv[2], "utf8") : await (await fetch(RSS, { headers: { "user-agent": "Mozilla/5.0" } })).text();
const pick = (s, tag) => { const m = s.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() : ""; };
const text = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const kst = d => new Date(new Date(d).getTime() + 9 * 3600e3).toISOString().slice(0, 10);
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
  const t = text(pick(it, "title")), d = text(pick(it, "description"));
  return { title: t, link: pick(it, "link").split("?")[0], date: kst(pick(it, "pubDate")), summary: d.length > 120 ? d.slice(0, 118) + "…" : d };
}).filter(i => i.title && i.link.startsWith("https://blog.naver.com/"));
if (!items.length) { console.error("RSS에서 글을 못 찾음 — 기존 파일 유지"); process.exit(0); }
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/blog.json", JSON.stringify({ source: "https://blog.naver.com/hmimo", items: items.slice(0, 20) }, null, 1) + "\n");
console.log(`글 ${items.length}개 저장`);
