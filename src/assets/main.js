/* =========================================================
   Grupa Garden — hyper-modern interactions (multi-page)
   ========================================================= */
(function () {
  'use strict';
  const root = document.documentElement;
  const body = document.body;

  /* ---------- image fallback (never show a broken image) ---------- */
  const PAL = [['#1c4a2c', '#0c1f13'], ['#2f8347', '#12331f'], ['#256b3a', '#0c1f13'],
               ['#3d7a4c', '#14231a'], ['#46a35d', '#1c4a2c'], ['#123d24', '#050b07']];
  let fbi = 0;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function guard(img) {
    if (img.dataset.fb) return;
    img.dataset.fb = '1';
    const fig = img.closest('figure');
    const cap = (((fig && fig.querySelector('figcaption')) ? fig.querySelector('figcaption').textContent : '') || img.alt || 'Grupa Garden').slice(0, 42);
    const p = PAL[fbi++ % PAL.length];
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>" +
      "<defs><linearGradient id='lg' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + p[0] + "'/><stop offset='1' stop-color='" + p[1] + "'/></linearGradient></defs>" +
      "<rect width='800' height='600' fill='url(#lg)'/>" +
      "<circle cx='650' cy='150' r='130' fill='rgba(255,255,255,0.05)'/>" +
      "<circle cx='120' cy='470' r='90' fill='rgba(255,255,255,0.04)'/>" +
      "<g fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' transform='translate(56,52) scale(2.2)'>" +
      "<path d='M12 22V12M12 12c0-4 2-7 7-8 0 4-2 7-7 8zM12 14C12 10 10 7 5 6c0 4 2 7 7 8z'/></g>" +
      "<text x='58' y='548' fill='rgba(255,255,255,0.95)' font-family='Georgia,serif' font-style='italic' font-size='44'>" + esc(cap) + "</text></svg>";
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => guard(img));
    if (img.complete && img.naturalWidth === 0) guard(img);
  });

  /* ---------- inject: scroll progress bar ---------- */
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  body.appendChild(prog);

  /* ---------- inject: page-transition columns ---------- */
  const pt = document.createElement('div');
  pt.className = 'pt';
  pt.setAttribute('aria-hidden', 'true');
  pt.innerHTML =
    '<div class="layer g1"></div><div class="layer g2"></div><div class="layer g3"></div>' +
    '<div class="sheen"></div>' +
    '<span class="pt-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12c0-4 2-7 7-8 0 4-2 7-7 8zM12 14C12 10 10 7 5 6c0 4 2 7 7 8z"/></svg></span>';
  body.appendChild(pt);
  const layers = Array.from(pt.querySelectorAll('.layer')); // [g1,g2,g3]
  setTimeout(() => { pt.style.visibility = 'hidden'; }, 1300);

  /* ---------- inject: marquee ticker before footer ---------- */
  const footer = document.querySelector('footer');
  if (footer) {
    const words = ['Ogrody', 'Pergole', 'Baseny', 'Stawy kąpielowe', 'Bramy', 'Ogrodzenia', 'Nawierzchnie', 'Tarasy'];
    const leaf = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12M12 12c0-4 2-7 7-8 0 4-2 7-7 8zM12 14C12 10 10 7 5 6c0 4 2 7 7 8z"/></svg>';
    let one = '';
    words.forEach((w, i) => { one += '<span class="it' + (i % 2 ? ' out' : '') + '">' + w + ' ' + leaf + '</span>'; });
    const mq = document.createElement('div');
    mq.className = 'marquee';
    mq.innerHTML = '<div class="track">' + one + one + '</div>';
    footer.parentNode.insertBefore(mq, footer);
  }

  /* ---------- header scrolled + progress ---------- */
  const hdr = document.getElementById('hdr');
  let ticking = false;
  function frame() {
    const st = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? st / h : 0) + ')';
    if (hdr) hdr.classList.toggle('scrolled', st > 20);
    // hero parallax + fade
    const hi = document.querySelector('.hero-inner');
    const hb = document.querySelector('.hero-bg');
    if (hi && st < window.innerHeight) {
      hi.style.transform = 'translateY(' + st * 0.18 + 'px)';
      hi.style.opacity = String(Math.max(0, 1 - st / (window.innerHeight * 0.75)));
    }
    if (hb && st < window.innerHeight) hb.style.transform = 'translate3d(0,' + (st * 0.12) + 'px,0) scale(1.06)';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(frame); ticking = true; } }, { passive: true });
  frame();

  /* ---------- theme toggle (light / dark) ---------- */
  const themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    root.classList.add('theming'); // freeze transitions so bg + text flip together
    const dark = root.getAttribute('data-theme') === 'dark';
    if (dark) { root.removeAttribute('data-theme'); try { localStorage.setItem('gg-theme', 'light'); } catch (e) {} }
    else { root.setAttribute('data-theme', 'dark'); try { localStorage.setItem('gg-theme', 'dark'); } catch (e) {} }
    root.style.colorScheme = dark ? 'light' : 'dark';
    // force an immediate repaint so backgrounds using CSS vars update now (not on reload)
    void document.body.offsetWidth;
    requestAnimationFrame(() => root.classList.remove('theming'));
  });

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', () => { menu.classList.toggle('mob'); burger.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('mob'); burger.classList.remove('open'); }));
  }

  /* ---------- accordion ---------- */
  document.querySelectorAll('.acc button').forEach(b => {
    b.addEventListener('click', () => {
      const acc = b.parentElement, panel = acc.querySelector('.panel'), open = acc.classList.contains('open');
      document.querySelectorAll('.acc').forEach(a => { a.classList.remove('open'); a.querySelector('.panel').style.maxHeight = null; });
      if (!open) { acc.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });

  /* ---------- reveal on scroll (staggered) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const sibs = Array.from(e.target.parentElement.querySelectorAll(':scope > .reveal'));
        const idx = sibs.indexOf(e.target);
        e.target.style.transitionDelay = (idx > 0 ? Math.min(idx, 6) * 0.09 : 0) + 's';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- gallery filtering ---------- */
  const filterBtns = document.querySelectorAll('.filters button');
  if (filterBtns.length) {
    const items = document.querySelectorAll('.gal-grid figure, .project');
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => it.classList.toggle('hide', !(f === 'all' || it.dataset.cat === f)));
    }));
  }

  /* ---------- project lightbox (collections) ---------- */
  const projects = document.querySelectorAll('.project');
  if (projects.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Zamknij">&#10005;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Poprzednie">&#8249;</button>' +
      '<button class="lb-nav lb-next" aria-label="Następne">&#8250;</button>' +
      '<figure class="lb-stage"><img alt=""><figcaption></figcaption></figure>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('.lb-stage img');
    const lbCap = lb.querySelector('figcaption');
    const lbCount = lb.querySelector('.lb-count');
    lbImg.addEventListener('error', () => guard(lbImg));
    let photos = [], title = '', idx = 0;
    const show = i => {
      idx = (i + photos.length) % photos.length;
      lbImg.removeAttribute('data-fb');
      lbImg.src = photos[idx];
      lbCap.textContent = title;
      lbCount.textContent = (idx + 1) + ' / ' + photos.length;
    };
    const openLb = pr => {
      photos = (pr.dataset.photos || '').split('|').filter(Boolean);
      title = pr.dataset.title || '';
      if (!photos.length) return;
      document.body.style.overflow = 'hidden';
      lb.classList.add('open');
      show(0);
    };
    const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    projects.forEach(pr => (pr.querySelector('.project-cover') || pr).addEventListener('click', () => openLb(pr)));
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
    lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- custom glass dropdown (keeps native <select> in sync) ---------- */
  document.querySelectorAll('.form select, .field select').forEach(sel => {
    const wrap = document.createElement('div');
    wrap.className = 'selectx';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'select-btn';
    btn.textContent = sel.options[sel.selectedIndex].text;
    const menu = document.createElement('div');
    menu.className = 'select-menu';
    Array.from(sel.options).forEach((o, i) => {
      const it = document.createElement('div');
      it.className = 'select-opt' + (i === sel.selectedIndex ? ' sel' : '');
      it.textContent = o.text;
      it.addEventListener('click', () => {
        sel.selectedIndex = i;
        btn.textContent = o.text;
        menu.querySelectorAll('.select-opt').forEach(x => x.classList.remove('sel'));
        it.classList.add('sel');
        wrap.classList.remove('open');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      menu.appendChild(it);
    });
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.selectx.open').forEach(w => { if (w !== wrap) w.classList.remove('open'); });
      wrap.classList.toggle('open');
    });
    wrap.appendChild(btn);
    wrap.appendChild(menu);
  });
  document.addEventListener('click', () => document.querySelectorAll('.selectx.open').forEach(w => w.classList.remove('open')));

  /* ---------- year ---------- */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- inquiry form -> mailto ---------- */
  const form = document.getElementById('inquiry');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    const g = id => (form.querySelector('#' + id)?.value || '').trim();
    const subject = encodeURIComponent('Zapytanie o wycenę — ' + g('service'));
    const bodyTxt = encodeURIComponent(
      'Imię i nazwisko: ' + g('name') + '\n' + 'Telefon: ' + g('phone') + '\n' +
      'E-mail: ' + g('email') + '\n' + 'Usługa: ' + g('service') + '\n' +
      'Miejscowość: ' + g('city') + '\n\n' + 'Opis projektu:\n' + g('msg'));
    window.location.href = 'mailto:biuro@grupagarden.pl?subject=' + subject + '&body=' + bodyTxt;
    const msg = form.querySelector('.formmsg');
    if (msg) msg.classList.add('show');
  });

  /* ---------- staggered slide page transition ---------- */
  const isInternal = (a) => {
    const href = a.getAttribute('href');
    if (!href) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (/^(mailto:|tel:|#)/.test(href)) return false;
    return a.host === window.location.host;
  };
  document.querySelectorAll('a[href]').forEach(a => {
    if (!isInternal(a)) return;
    a.addEventListener('click', (e) => {
      const url = a.getAttribute('href');
      if (url === window.location.pathname.split('/').pop()) return;
      e.preventDefault();
      pt.style.visibility = 'visible';
      pt.style.pointerEvents = 'none';
      const logo = pt.querySelector('.pt-logo');
      const sheen = pt.querySelector('.sheen');
      layers.forEach(c => { c.style.animation = 'none'; c.style.transition = 'none'; c.style.transform = 'translateY(101%)'; });
      if (logo) { logo.style.animation = 'none'; logo.style.opacity = '0'; logo.style.transition = 'opacity .45s ease .18s'; logo.style.transform = 'scale(.9)'; }
      void pt.offsetWidth;
      // g1 covers first, g3 (front, most defined) last -> glass builds up
      layers.forEach((c, i) => { c.style.transition = 'transform .62s cubic-bezier(.76,0,.24,1)'; c.style.transitionDelay = (i * 0.07) + 's'; c.style.transform = 'translateY(0)'; });
      if (sheen) { sheen.style.animation = 'none'; void sheen.offsetWidth; sheen.style.animation = 'sheen 1.15s cubic-bezier(.5,0,.2,1) forwards'; }
      if (logo) { logo.style.opacity = '1'; logo.style.transform = 'scale(1)'; }
      setTimeout(() => { window.location.href = url; }, 820);
    });
  });
})();
