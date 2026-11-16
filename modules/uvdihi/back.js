/* menu-sekme — Klasör sekmeli menü (15 Kas 2026, G3 · mcp:webmaker/20261115-202336-i5p2).
   Yer tutucular (koşulsuz): skmsinif skmsekme skmiletisim. {{langbar}} motor çözer; @anahtar@ lang.json'dan.
   Öğeler: @home@ + pagesetting sayfaları (status play, category "") + json.data[] ({name{dil…}, url}).
   İletişim: desing.tel/eposta boşsa setting.phone/email; ikisi de yoksa hiç basılmaz (uydurma yok). */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");

const { desing: des = {}, data: ek = [] } = json;
const sayfa = page || {};
const setting = webmakerdata?.setting ?? {};

const ogeler = [{ ad: "@home@", href: wxLangInternalHref(""), aktif: !sayfa.path }];
const ps = Array.isArray(webmakerdata?.pagesetting?.data)
  ? webmakerdata.pagesetting.data.find((it) => it?.modulestatus?.page)
  : null;
const satirlar = ps && Array.isArray(webmakerdata?.[ps.path]?.data) ? webmakerdata[ps.path].data : [];
for (const r of satirlar) {
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (!ad) continue;
  ogeler.push({ ad: esc(ad), href: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && sayfa.path === r.path });
}
for (const e of Array.isArray(ek) ? ek : []) {
  const ad = pick(e?.name ?? e?.text).trim();
  const url = href(e?.url ?? e?.href);
  if (ad && url) ogeler.push({ ad: esc(ad), href: url, aktif: false });
}
const skmSekme = ogeler.map((o) =>
  `<li class="modulex-skm-li"><a class="modulex-skm-sekme" href="${esc(o.href)}"${o.aktif ? ' aria-current="page"' : ""}>${o.ad}</a></li>`
).join("");

let skmIletisim = "";
if (dogru(des.iletisim, true)) {
  const tel = pick(des.tel).trim() || (typeof setting.phone === "string" ? setting.phone.trim() : "");
  const posta = pick(des.eposta).trim() || (typeof setting.email === "string" ? setting.email.trim() : "");
  if (tel) skmIletisim += `<a class="modulex-skm-bilgi" href="tel:${tel.replace(/[^+\d]/g, "")}" aria-label="@telephone@: ${esc(tel)}"><span class="material-symbols-outlined" aria-hidden="true">call</span><bdi dir="ltr" class="modulex-skm-bilgi-yazi">${esc(tel)}</bdi></a>`;
  if (posta) skmIletisim += `<a class="modulex-skm-bilgi" href="mailto:${esc(posta)}" aria-label="@email@: ${esc(posta)}"><span class="material-symbols-outlined" aria-hidden="true">mail</span><bdi dir="ltr" class="modulex-skm-bilgi-yazi">${esc(posta)}</bdi></a>`;
}

const skmSinif = [
  dogru(des.sticky, false) ? " modulex-skm--sticky" : "",
  skmIletisim ? "" : " modulex-skm--iletisimsiz",
].join("");

html = html
  .replaceAll("{{skmsinif}}", () => skmSinif)
  .replaceAll("{{skmsekme}}", () => skmSekme)
  .replaceAll("{{skmiletisim}}", () => skmIletisim);
