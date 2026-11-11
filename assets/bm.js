/* BrewMaps site script, shared by café, area and fallback pages (2026-11 redesign).
   The two dots (port of the app's src/components/brand/TwoDots.tsx), store buttons for the visitor's phone,
   today's opening hours, the table-card "Rate it" button and the corner Ask chat (answers come with the page). */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var IOS = "https://apps.apple.com/ae/app/id6775899450", PLAY = "https://play.google.com/store/apps/details?id=com.brewmaps.app", DL = "/download";
  var ua = navigator.userAgent || "", device = /iPhone|iPad|iPod/i.test(ua) ? "ios" : /Android/i.test(ua) ? "android" : "desktop";
  var storeHref = device === "ios" ? IOS : device === "android" ? PLAY : DL;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- two dots ---------- */
  var R = 15, GAP = 60, all = [];
  function P(x1, y1, x2, y2, s) { return { x1: x1 || 0, y1: y1 || 0, x2: x2 || 0, y2: y2 || 0, s: s == null ? 1 : s }; }
  function tilt(dx, dy, deg, ds) { var h = (GAP + ds) / 2, r = deg * Math.PI / 180, c = Math.cos(r), sn = Math.sin(r); return P(dx + (-h * c + GAP / 2), dy - h * sn, dx + (h * c - GAP / 2), dy + h * sn); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function track(keys, t, loop) { var end = keys[keys.length - 1][0]; if (loop) t = t % end; else if (t >= end) return keys[keys.length - 1][1];
    for (var i = 1; i < keys.length; i++) { if (t <= keys[i][0]) { var ta = keys[i - 1][0], a = keys[i - 1][1], tb = keys[i][0], b = keys[i][1], k = ease((t - ta) / Math.max(1, tb - ta));
      return P(a.x1 + (b.x1 - a.x1) * k, a.y1 + (b.y1 - a.y1) * k, a.x2 + (b.x2 - a.x2) * k, a.y2 + (b.y2 - a.y2) * k, a.s + (b.s - a.s) * k); } } return keys[keys.length - 1][1]; }
  function idle(t) { var amp = 1.6, dx = Math.sin(t / 2300) * amp * .8 + Math.sin(t / 3700) * amp * .4, dy = Math.sin(t / 2900) * amp * .6, br = Math.sin(t / 3100) * .9; return P(dx - br, dy, dx + br, dy); }
  function curious(t) { var side = t % 6400 < 3200 ? -1 : 1, u = t % 3200, look = tilt(side * 10, -2, side * 11, 0), peer = tilt(side * 15, -3, side * 13, -4);
    return track([[0, P()], [650, look], [1250, look], [1750, peer], [2550, peer], [3000, P()], [3200, P()]], u, false); }
  function thinking(t) { var up = -9, UR = tilt(9, up, 0, -3), UL = tilt(-9, up, 0, -3), URf = tilt(7, up - 1, 0, -9), ULs = tilt(-4, up + 1, 0, -2);
    if (t < 450) return track([[0, P()], [450, UR]], t, false);
    return track([[0, UR], [700, UR], [860, UL], [1500, UL], [1640, ULs], [1900, ULs], [2060, URf], [2600, URf], [2760, UR], [3000, UR]], t - 450, true); }
  function found(t) { var c = (GAP - 2 * R - 6) / 2; return track([[0, P()], [340, P(c, 0, -c, 0)], [520, P(c, 0, -c, 0, 1.06)], [900, P(0, -4, 0, -4, 1)], [1300, P()]], t, false); }
  function Dots(el, o) {
    o = o || {}; var size = o.size || 40, color = o.color || "currentColor", scale = size / 132, d = R * 2 * scale;
    el.style.cssText += ";position:relative;display:block;width:" + size + "px;height:" + (size * .6) + "px;direction:ltr";
    function mk() { var s = document.createElement("span"); s.style.cssText = "position:absolute;left:50%;top:50%;width:" + d + "px;height:" + d + "px;margin:" + (-d / 2) + "px 0 0 " + (-d / 2) + "px;border-radius:50%;background:" + color; el.appendChild(s); return s; }
    var a = mk(), b = mk();
    var me = { el: el, pose: P(), mode: "idle", t0: performance.now(), interactive: !!o.interactive,
      set: function (m) { me.mode = m; me.t0 = performance.now(); },
      draw: function () { var p = me.pose; a.style.transform = "translate(" + ((-GAP / 2 + p.x1) * scale) + "px," + (p.y1 * scale) + "px) scale(" + p.s + ")"; b.style.transform = "translate(" + ((GAP / 2 + p.x2) * scale) + "px," + (p.y2 * scale) + "px) scale(" + p.s + ")"; } };
    me.draw(); all.push(me); return me;
  }
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(64, now - last); last = now;
    for (var i = 0; i < all.length; i++) { var o = all[i]; if (!o.el.isConnected) continue;
      var t = now - o.t0, tg;
      if (o.mode === "found") { tg = found(t); if (t > 1500) { o.mode = "idle"; o.t0 = now; } }
      else if (o.mode === "thinking") tg = thinking(t);
      else if (o.mode === "curious") tg = curious(t);
      else if (o.interactive && t % 14000 > 9000) tg = curious((t % 14000) - 9000);
      else tg = idle(t);
      var k = 1 - Math.exp(-dt / 70), c = o.pose;
      o.pose = P(c.x1 + (tg.x1 - c.x1) * k, c.y1 + (tg.y1 - c.y1) * k, c.x2 + (tg.x2 - c.x2) * k, c.y2 + (tg.y2 - c.y2) * k, c.s + (tg.s - c.s) * k);
      o.draw(); }
    requestAnimationFrame(frame);
  }
  if (!reduce) requestAnimationFrame(frame);
  window.BMDots = Dots;

  /* ---------- store buttons ---------- */
  var apple = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6-.1 0-2.5-1-2.5-3.8zM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z"/></svg>';
  var play = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#00C3FF" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z"/><path fill="#FFCE00" d="m16.9 15.5-3.5-3.5 3.5-3.5 3.9 2.2c1.1.6 1.1 1.6 0 2.2z"/><path fill="#00E676" d="M3.6 2.3c.3-.2.8-.2 1.3.1l12 6.1-3.5 3.5z"/><path fill="#FF3A44" d="m13.4 12 3.5 3.5-12 6.1c-.5.3-1 .3-1.3.1z"/></svg>';
  var ios = '<a class="store" href="' + IOS + '">' + apple + '<span><small>Download on the</small>App Store</span></a>';
  var and = '<a class="store" href="' + PLAY + '">' + play + '<span><small>Get it on</small>Google Play</span></a>';
  function fillStores(root) {
    (root || document).querySelectorAll("[data-stores]").forEach(function (el) { el.innerHTML = device === "ios" ? ios : device === "android" ? and : ios + and; });
    (root || document).querySelectorAll("[data-store]").forEach(function (a) { a.href = storeHref; });
  }
  window.BMFill = fillStores;

  function start() {
    fillStores();
    document.querySelectorAll("[data-dots]").forEach(function (el) { Dots(el, { size: +el.dataset.dots || 56, color: el.dataset.color || "#DFF903", interactive: true }); });

    /* today's hours */
    var hrs = document.getElementById("hours-data");
    if (hrs) { try { var H = JSON.parse(hrs.textContent), k = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()], el = document.getElementById("today-hours"); if (el) el.textContent = H[k] || "Closed"; } catch (e) {} }

    /* table-card scan: open the app, else the store */
    var rate = document.getElementById("rate-open");
    if (rate) rate.addEventListener("click", function (e) {
      e.preventDefault(); var bailed = false, onHide = function () { bailed = true; };
      document.addEventListener("visibilitychange", onHide, { once: true });
      setTimeout(function () { document.removeEventListener("visibilitychange", onHide); if (!bailed && !document.hidden) location.href = DL; }, 1400);
      location.href = rate.dataset.deep;
    });

    /* corner chat */
    var cfg = window.BM_CHAT; if (!cfg || !cfg.questions || !cfg.questions.length) return;
    var fab = document.createElement("button"); fab.className = "fab"; fab.type = "button"; fab.setAttribute("aria-label", "Ask BrewMaps");
    fab.innerHTML = '<span class="lbl">' + esc(cfg.label || "Ask me") + '</span><span class="b"><span class="fd"></span></span>';
    var panel = document.createElement("aside"); panel.className = "panel closed"; panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = '<div class="ph"><span class="av"></span><h3>Ask BrewMaps</h3><button class="x" type="button" aria-label="Close">×</button></div><div class="pb"></div>';
    document.body.appendChild(fab); document.body.appendChild(panel);
    Dots(fab.querySelector(".fd"), { size: 32, color: "#FFFFFF" }); Dots(panel.querySelector(".av"), { size: 22, color: "#111111" });
    setTimeout(function () { fab.classList.add("quiet"); }, 5000);
    var pb = panel.querySelector(".pb"), used = {}, started = false;
    function bot(html) { var r = document.createElement("div"); r.className = "bot"; r.innerHTML = '<span class="av"></span><div class="bd">' + html + "</div>"; pb.appendChild(r); return r; }
    function chips() {
      var left = cfg.questions.filter(function (q, i) { return !used[i]; });
      if (!left.length) { bot('<div class="bub">Ask anything else in the app. It\'s free.</div><div class="nudge"><span>Your own questions, saved cafés, the map.</span><a href="' + storeHref + '">Get the app</a></div>'); pb.scrollTop = pb.scrollHeight; return; }
      var w = document.createElement("div"); w.className = "chips";
      w.innerHTML = cfg.questions.map(function (q, i) { return used[i] ? "" : '<button class="chip" type="button" data-q="' + i + '">' + esc(q.q) + "</button>"; }).join(""); pb.appendChild(w);
    }
    function open() { panel.classList.remove("closed"); panel.setAttribute("aria-hidden", "false"); fab.hidden = true;
      if (!started) { started = true; var r = bot('<div class="bub">' + esc(cfg.hello || "Ask me about this place.") + "</div>"); Dots(r.querySelector(".av"), { size: 22, color: "#111111" }); chips(); } }
    fab.addEventListener("click", open);
    panel.querySelector(".x").addEventListener("click", function () { panel.classList.add("closed"); panel.setAttribute("aria-hidden", "true"); fab.hidden = false; });
    pb.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]"); if (!b) return; var i = +b.dataset.q, q = cfg.questions[i]; used[i] = true;
      pb.querySelectorAll(".chips").forEach(function (c) { c.remove(); });
      var m = document.createElement("div"); m.className = "bub me"; m.textContent = q.q; pb.appendChild(m);
      var r = bot(""), d = Dots(r.querySelector(".av"), { size: 22, color: "#111111" }); d.set("thinking"); pb.scrollTop = pb.scrollHeight;
      setTimeout(function () { r.querySelector(".bd").innerHTML = '<div class="bub">' + q.a + '</div><div class="nudge"><span>See more in the app.</span><a href="' + storeHref + '">Get the app</a></div>'; d.set("found"); chips(); pb.scrollTop = pb.scrollHeight; }, reduce ? 200 : 1300);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
