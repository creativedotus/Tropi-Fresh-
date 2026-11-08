/* TropiFresh – homepage mockup
   Edit FRUITS to change hero colours/prices. Hero images live in assets/img/<key>.webp
   and are listed (in the same order) in index.html inside .stage */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HERO_MS = 3800;      // time each fruit stays in the hero
  const BOX_MAX = 12, BOX_MIN = 4, FIRST_ORDER = 0.10;
  const money = (n) => "$" + n.toFixed(2);

  /* a = light glow, b = base, c = deep shade, k = text colour */
  const FRUITS = [
    { n: "Alphonso Mango",   i: "mango",      a: "#FFD36B", b: "#F5A01C", c: "#E0661B", k: "#3B1A00", d: "1kg",           p: 12.99 },
    { n: "Sweet Pineapple",  i: "pineapple",  a: "#FFF08A", b: "#F1CF2B", c: "#E3A01A", k: "#3A3000", d: "1pc (1.5–2kg)", p: 8.99 },
    { n: "Red Dragon Fruit", i: "dragon",     a: "#F26BB0", b: "#CC2A79", c: "#96155A", k: "#FFFFFF", d: "1kg",           p: 11.99 },
    { n: "Mangosteen",       i: "mangosteen", a: "#B77DC4", b: "#7A3A82", c: "#4B1B58", k: "#FFFFFF", d: "1kg",           p: 15.99 },
    { n: "Papaya",           i: "papaya",     a: "#FFB07A", b: "#FF7A3A", c: "#E5501C", k: "#3A1200", d: "New arrival",   p: 0 },
    { n: "Passion Fruit",    i: "passion",    a: "#C06BBA", b: "#8A3A86", c: "#54194F", k: "#FFFFFF", d: "500g",          p: 9.99 },
    { n: "Red Kiwi",         i: "kiwi",       a: "#E0586C", b: "#B92A41", c: "#7E1626", k: "#FFFFFF", d: "New arrival",   p: 0 }
  ];
  const N = FRUITS.length;
  const hero = $("hero"), stage = $("stage");
  const frs = $$(".fr", stage);
  let cur = 0, timer, heroVisible = true;

  /* ---------- toast ---------- */
  let tt;
  const toast = (m) => { const t = $("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2400); };

  /* ---------- cart ---------- */
  let cart = [];
  const total = () => cart.reduce((a, c) => a + c.p, 0);
  function renderCart() {
    $("cnt").textContent = cart.length;
    $("cl").innerHTML = cart.length
      ? cart.map((c, x) => `<li><span>${c.n}${c.d ? `<small>${c.d}</small>` : ""}</span><b>${money(c.p)}</b><button class="rm" type="button" data-x="${x}" aria-label="Remove ${c.n}">×</button></li>`).join("")
      : '<li style="color:#777">Nothing yet. Add a fruit.</li>';
    $("tot").textContent = money(total());
    $("gocheck").disabled = !cart.length;
  }
  function add(name, price, detail) {
    if (!price) { toast(name + ": we’ll notify you when it lands"); return; }
    cart.push({ n: name, p: price, d: detail || "" });
    renderCart(); toast(name + " added to cart");
  }
  $("cl").onclick = (e) => { const b = e.target.closest(".rm"); if (b) { cart.splice(+b.dataset.x, 1); renderCart(); } };

  /* ---------- hero ---------- */
  FRUITS.forEach((f, x) => {
    const d = document.createElement("div");
    d.className = "bgl"; d.dataset.i = x;
    d.style.background = `radial-gradient(70% 80% at 80% 25%,${f.a},transparent 70%),radial-gradient(60% 70% at 0% 100%,${f.c},transparent 70%),linear-gradient(135deg,${f.b},${f.c})`;
    hero.prepend(d);
  });
  const POS = {
    next: "translate(-50%,-50%) translate(60%,58%) scale(.34) rotate(-38deg)",
    prev: "translate(-50%,-50%) translate(52%,-62%) scale(.28) rotate(32deg)",
    away: "translate(-50%,-50%) translate(40%,40%) scale(.08) rotate(90deg)"
  };
  function lay() {
    frs.forEach((e, x) => {
      const o = (x - cur + N) % N;
      let t = "translate(-50%,-50%)", op = 1, z = 1;
      if (o === 0) z = 2; else if (o === 1) t = POS.next; else if (o === N - 1) t = POS.prev; else { t = POS.away; op = 0; }
      e.style.transform = t; e.style.opacity = op; e.style.zIndex = z;
      e.setAttribute("aria-hidden", o === 0 ? "false" : "true");
    });
    [["l1", -1], ["l2", 1], ["l3", -1]].forEach(([id, s], j) => { $(id).style.transform = `translate(${cur * s * 9}px,${cur * s * -7}px) rotate(${cur * s * 50 + j * 40}deg)`; });
  }
  function paint() {
    const f = FRUITS[cur], h = hero.style;
    h.setProperty("--hbg", f.b); h.setProperty("--hink", f.k);
    $$(".bgl", hero).forEach((e) => e.classList.toggle("on", +e.dataset.i === cur));
    $("cn").textContent = f.n;
    $("cp").textContent = f.p ? `${f.d} · ${money(f.p)}` : f.d;
    $("ca").textContent = f.p ? "Add" : "Notify me";
    $("ca").setAttribute("aria-label", (f.p ? "Add " : "Get notified about ") + f.n);
    const th = $("thumbs"); th.innerHTML = "";
    [1, 2, 3].forEach((j) => {
      const x = (cur + j) % N, g = FRUITS[x], b = document.createElement("button");
      b.className = "th"; b.type = "button";
      b.innerHTML = `<img src="assets/img/${g.i}.webp" alt="" width="46" height="46"><span><b>${g.n}</b><small>${g.p ? money(g.p) : "New arrival"}</small></span>`;
      b.setAttribute("aria-label", "Show " + g.n);
      b.onclick = () => go(x);
      th.appendChild(b);
    });
    lay();
  }
  function go(x) { cur = (x + N) % N; paint(); play(); }
  function play() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(() => { if (heroVisible && !document.hidden) go(cur + 1); }, HERO_MS);
  }
  frs.forEach((e, x) => { e.onclick = () => go(x); });
  $("nx").onclick = () => go(cur + 1);
  $("pv").onclick = () => go(cur - 1);
  $("ca").onclick = () => add(FRUITS[cur].n, FRUITS[cur].p, FRUITS[cur].d);
  stage.onmouseenter = () => clearInterval(timer);
  stage.onmouseleave = play;
  new IntersectionObserver((e) => { heroVisible = e[0].isIntersecting; }, { threshold: 0.2 }).observe(hero);
  document.addEventListener("keydown", (e) => {
    if (!heroVisible || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1);
  });
  let sx = null;
  stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => { if (sx === null) return; const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 40) go(cur + (d < 0 ? 1 : -1)); sx = null; });

  /* ---------- explore panels ---------- */
  const xis = $$(".xi");
  const openX = (el) => xis.forEach((x) => x.classList.toggle("on", x === el));
  xis.forEach((el) => {
    el.addEventListener("mouseenter", () => { if (matchMedia("(hover:hover)").matches && innerWidth > 1000) openX(el); });
    el.addEventListener("focus", () => openX(el));
    el.addEventListener("click", (e) => { if (!el.classList.contains("on")) { e.preventDefault(); openX(el); } });
  });

  /* ---------- bestsellers marquee ---------- */
  $("mq").addEventListener("click", (e) => { const b = e.target.closest(".add"); if (b) add(b.dataset.n, +b.dataset.p, b.dataset.d); });

  /* ---------- build-your-own box ---------- */
  const bx = $$(".bx"), qty = {}, order = [];
  bx.forEach((el) => { qty[el.dataset.n] = 0; });
  const count = () => Object.values(qty).reduce((a, b) => a + b, 0);
  const sub = () => bx.reduce((a, el) => a + qty[el.dataset.n] * +el.dataset.p, 0);
  function drawBox(added) {
    const n = count(), s = sub(), disc = $("fo").checked ? s * FIRST_ORDER : 0, t = s - disc;
    bx.forEach((el) => {
      const q = qty[el.dataset.n];
      el.querySelector("output").textContent = q; el.classList.toggle("sel", q > 0);
      el.querySelector(".mi").disabled = q === 0; el.querySelector(".pl").disabled = n >= BOX_MAX;
    });
    const cin = $("cin");
    if (added === "+") { const im = document.createElement("img"); im.alt = ""; im.src = order[order.length - 1].src; cin.appendChild(im); }
    else if (!added) { cin.innerHTML = ""; }
    $("emp").hidden = n > 0;
    $("pgb").style.width = (n / BOX_MAX * 100) + "%";
    $("pgl").textContent = `${n} of ${BOX_MAX} fruits`;
    $("sm").innerHTML = bx.filter((el) => qty[el.dataset.n]).map((el) => `<li><span>${qty[el.dataset.n]} × ${el.dataset.n}</span><b>${money(qty[el.dataset.n] * +el.dataset.p)}</b></li>`).join("");
    $("bt").innerHTML = (disc ? `<s>${money(s)}</s>` : "") + money(t);
    $("bh").textContent = n === 0 ? "Pick your fruits to fill the box." : n < BOX_MIN ? `Add ${BOX_MIN - n} more to complete your box.` : n >= BOX_MAX ? "Your box is full. Ready to go!" : "Looking good. Add more or check out.";
    $("badd").disabled = n < BOX_MIN; $("bclr").disabled = n === 0;
  }
  $("bp").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const el = b.closest(".bx"), k = el.dataset.n;
    if (b.classList.contains("pl") && count() < BOX_MAX) { qty[k]++; order.push({ k, src: el.querySelector("img").src }); drawBox("+"); }
    if (b.classList.contains("mi") && qty[k] > 0) {
      qty[k]--; const at = order.map((o) => o.k).lastIndexOf(k); order.splice(at, 1);
      const cin = $("cin"); cin.innerHTML = ""; order.forEach((o) => { const im = document.createElement("img"); im.alt = ""; im.src = o.src; im.style.animation = "none"; cin.appendChild(im); });
      drawBox("keep");
    }
  });
  $("fo").onchange = () => drawBox("keep");
  $("bclr").onclick = () => { Object.keys(qty).forEach((k) => { qty[k] = 0; }); order.length = 0; drawBox(); };
  $("badd").onclick = () => {
    const n = count(); if (n < BOX_MIN) return;
    const s = sub(), t = s - ($("fo").checked ? s * FIRST_ORDER : 0);
    const d = bx.filter((el) => qty[el.dataset.n]).map((el) => `${qty[el.dataset.n]}× ${el.dataset.n}`).join(", ");
    cart.push({ n: `Custom fruit box (${n} fruits)`, p: t, d }); renderCart();
    toast("Your fruit box was added to the cart"); setTimeout(() => { $("panel").classList.add("on"); $("cartb").setAttribute("aria-expanded", "true"); }, 0);
  };
  drawBox();

  /* ---------- header, menus, links ---------- */
  const dd = $("dd"), ddb = dd.querySelector("button"), menu = $("menu"), panel = $("panel");
  $("cartb").onclick = () => { const o = panel.classList.toggle("on"); $("cartb").setAttribute("aria-expanded", o); };
  $("bg").onclick = () => { const o = menu.classList.toggle("on"); $("bg").setAttribute("aria-expanded", o); };
  ddb.onclick = () => { const o = dd.classList.toggle("open"); ddb.setAttribute("aria-expanded", o); };
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#dd")) { dd.classList.remove("open"); ddb.setAttribute("aria-expanded", "false"); }
    if (!e.target.closest("#panel,#cartb,.rm")) panel.classList.remove("on");
    if (e.target.closest("#menu a")) menu.classList.remove("on");
    const a = e.target.closest("[data-t]");
    if (a) { if (a.getAttribute("href") === "#") e.preventDefault(); toast(a.dataset.t + " (WordPress link)"); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("open"); panel.classList.remove("on"); menu.classList.remove("on"); } });
  $("totop").onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  /* ---------- checkout (demo, no real payment) ---------- */
  const co = $("co"), cf = $("cof");
  const showPay = () => { const v = cf.pay.value; $$(".pn").forEach((p) => { p.hidden = p.dataset.m !== v; }); };
  function openCheckout() {
    if (!cart.length) return;
    $("os").innerHTML = cart.map((c) => `<li><span>${c.n}${c.d ? `<small>${c.d}</small>` : ""}</span><b>${money(c.p)}</b></li>`).join("");
    $("ot").textContent = money(total()); $("paybtn").textContent = "Pay " + money(total());
    $("cok").hidden = true; $("cogrid").hidden = false; $("cerr").textContent = "";
    panel.classList.remove("on"); showPay();
    if (co.showModal) co.showModal(); else co.setAttribute("open", "");
  }
  $("gocheck").onclick = openCheckout;
  $("cclose").onclick = () => co.close();
  co.addEventListener("click", (e) => { if (e.target === co) co.close(); });
  $$('input[name="pay"]', cf).forEach((r) => r.addEventListener("change", showPay));
  $("cc").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(); });
  $("cx").addEventListener("input", (e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); e.target.value = v; });
  cf.onsubmit = (e) => {
    e.preventDefault();
    const bad = []; const chk = (el, ok) => { el.setAttribute("aria-invalid", String(!ok)); if (!ok) bad.push(el); };
    chk(cf.cname, cf.cname.value.trim().length > 1);
    chk(cf.cmail, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cf.cmail.value.trim()));
    chk(cf.caddr, cf.caddr.value.trim().length > 4);
    chk(cf.ccity, cf.ccity.value.trim().length > 1);
    if (cf.pay.value === "card") {
      const digits = $("cc").value.replace(/\s/g, ""), [mm, yy] = $("cx").value.split("/"), now = new Date();
      chk($("cc"), digits.length >= 13);
      chk($("cx"), !!yy && +mm >= 1 && +mm <= 12 && (2000 + +yy > now.getFullYear() || (2000 + +yy === now.getFullYear() && +mm >= now.getMonth() + 1)));
      chk($("cv"), /^\d{3,4}$/.test($("cv").value));
    }
    if (bad.length) { $("cerr").textContent = "Please check the highlighted fields."; bad[0].focus(); return; }
    $("cerr").textContent = ""; $("paybtn").disabled = true; $("paybtn").textContent = "Processing…";
    setTimeout(() => {
      $("onum").textContent = "TF-" + Math.floor(100000 + Math.random() * 900000);
      $("cogrid").hidden = true; $("cok").hidden = false; $("paybtn").disabled = false;
      cart = []; renderCart(); cf.reset(); $("cc").value = ""; $("cx").value = "";
    }, reduce ? 50 : 1300);
  };
  $("cdone").onclick = () => co.close();

  /* ---------- newsletter ---------- */
  $("nf").onsubmit = (e) => {
    e.preventDefault();
    const v = $("em").value.trim(), m = $("nm");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { m.textContent = "Enter a valid email address."; $("em").setAttribute("aria-invalid", "true"); return; }
    $("em").removeAttribute("aria-invalid");
    m.textContent = "You’re subscribed. Fresh offers are on the way."; $("em").value = "";
  };

  /* ---------- scroll reveal ---------- */
  const rv = $$(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add("in"));

  renderCart(); paint(); play();
})();
