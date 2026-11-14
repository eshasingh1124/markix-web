(() => {
  const $ = s => document.querySelector(s);
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  $('#yr').textContent = new Date().getFullYear();

  // Diminishing-returns demo. inc(s) = M * s / (s + K), fitted to the demo brand's report.
  const CH = [
    {name:'Meta Ads',   now:46177, M:296000, K:59500},
    {name:'Google Ads', now:15186, M:106000, K:42700},
    {name:'Influencer', now:25320, M:117000, K:60800},
    {name:'Email',      now:4339,  M:33000,  K:13700},
  ];
  const BE = 1 / 0.65;   // sales needed per extra rupee to cover the ad and the product
  let cur = 2;
  const inc = (c,s) => c.M * s / (s + c.K);
  const marg = (c,s) => c.M * c.K / Math.pow(s + c.K, 2);
  const beSpend = c => Math.max(0, Math.sqrt(c.M * c.K / BE) - c.K);
  const tabs = $('#tabs'), range = $('#spend'), svg = $('#curve');

  CH.forEach((c,i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = c.name;
    b.addEventListener('click', () => select(i)); tabs.appendChild(b);
  });

  const W = 640, H = 300, P = {l:54, r:16, t:26, b:34};
  function draw(s){
    const c = CH[cur], xmax = c.now * 3, ymax = inc(c, xmax) * 1.15;
    const X = v => P.l + v / xmax * (W - P.l - P.r), Y = v => H - P.b - v / ymax * (H - P.t - P.b);
    const short = v => v >= 1e5 ? (v/1e5).toFixed(1) + 'L' : Math.round(v/1e3) + 'K';
    let d = '', area = `M${X(0)} ${Y(0)} `;
    for (let i = 0; i <= 100; i++){ const v = xmax*i/100; d += (i?'L':'M') + X(v).toFixed(1) + ' ' + Y(inc(c,v)).toFixed(1) + ' '; }
    for (let i = 0; i <= 100; i++){ const v = s*i/100; area += 'L' + X(v).toFixed(1) + ' ' + Y(inc(c,v)).toFixed(1) + ' '; }
    area += `L${X(s)} ${Y(0)} Z`;
    const be = beSpend(c), over = s > be * 1.05;
    const beLabelLeft = X(be) > W * 0.6;
    svg.innerHTML = `
      ${[0,.5,1].map(f => `<line x1="${P.l}" x2="${W-P.r}" y1="${Y(ymax*f)}" y2="${Y(ymax*f)}" stroke="#0e1530" stroke-opacity=".12"/><text x="${P.l-10}" y="${Y(ymax*f)+5}" fill="#0e1530" font-size="13" font-weight="600" text-anchor="end">${short(ymax*f)}</text>`).join('')}
      ${[1,2,3].map(k => `<text x="${X(c.now*k)}" y="${H-10}" fill="#0e1530" font-size="13" font-weight="600" text-anchor="middle">${short(c.now*k)}</text>`).join('')}
      <rect x="${X(be)}" y="${P.t}" width="${W-P.r-X(be)}" height="${H-P.b-P.t}" fill="#c4313f" fill-opacity=".09"/>
      <line x1="${X(be)}" x2="${X(be)}" y1="${P.t}" y2="${H-P.b}" stroke="#c4313f" stroke-width="2.5"/>
      <text x="${X(be) + (beLabelLeft ? -8 : 8)}" y="${P.t-8}" fill="#c4313f" font-size="13" font-weight="700" text-anchor="${beLabelLeft ? 'end' : 'start'}">Past here, extra spend loses money</text>
      <path d="${area}" fill="#1d3fc9" fill-opacity=".14"/>
      <path d="${d}" fill="none" stroke="#1d3fc9" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${X(c.now)}" cy="${Y(inc(c,c.now))}" r="6" fill="#0e1530"/>
      <text x="${X(c.now)}" y="${Y(inc(c,c.now))+24}" fill="#0e1530" font-size="13" font-weight="700" text-anchor="middle">Today</text>
      <circle cx="${X(s)}" cy="${Y(inc(c,s))}" r="12" fill="${over ? '#c4313f' : '#1d3fc9'}" stroke="#ffffff" stroke-width="4"/>`;
  }
  function update(){
    const c = CH[cur], s = c.now * range.value / 100, i = inc(c,s), m = marg(c,s), be = beSpend(c);
    $('#spendOut').textContent = inr(s);
    $('#incOut').textContent = inr(i);
    $('#avgOut').textContent = s > 0 ? '₹' + (i/s).toFixed(2) : '₹0';
    $('#margOut').textContent = inr(m * 1000);
    let v, e, bad = false;
    if (s < 1) { v = 'Switched off.'; e = `With nothing on ${c.name}, the sales you'd make anyway carry on without it.`; }
    else if (m >= BE * 1.1) { v = 'Room to grow.'; e = `The next ₹1,000 brings in ${inr(m*1000)}, enough to cover the ad and the product. Worth growing towards ${inr(be)} a week.`; }
    else if (m >= BE * 0.9) { v = 'About right. Hold here.'; e = `The next ₹1,000 brings in ${inr(m*1000)}, which just about pays for itself.`; }
    else if (m >= 1) { v = 'Too much. Leaking margin.'; bad = true; e = `The next ₹1,000 brings in ${inr(m*1000)} in sales. After product costs, that loses money. Ease back towards ${inr(be)} a week.`; }
    else { v = 'Well past the limit.'; bad = true; e = `The next ₹1,000 brings in only ${inr(m*1000)}, less than the ad itself costs.`; }
    $('#verdict').textContent = v; $('#verdict').classList.toggle('bad', bad);
    $('#explain').textContent = e;
    draw(s);
  }
  function select(i){ cur = i; [...tabs.children].forEach((b,j) => b.setAttribute('aria-pressed', j === i)); range.value = 100; update(); }
  range.addEventListener('input', update);
  select(cur);


  // Scroll highlight: each word in a .lit line brightens as the line moves up the screen.
  const lit = [...document.querySelectorAll('.lit')].map(el => {
    const wrap = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) { f.appendChild(document.createTextNode(t)); return; }
          const w = document.createElement('span'); w.className = 'w'; w.textContent = t; f.appendChild(w);
        });
        n.replaceWith(f);
      } else wrap(n);
    });
    wrap(el);
    return {el, words: el.querySelectorAll('.w')};
  });
  let ticking = false;
  const paint = () => {
    ticking = false;
    const vh = innerHeight;
    lit.forEach(({el, words}) => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.45 + r.height)));
      const n = Math.ceil(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, {passive:true});
  addEventListener('resize', paint);
  paint();

  // Booking. Paste the Formspree endpoint below (it looks like https://formspree.io/f/abcdwxyz).
  // While it is empty, or if sending fails, the page writes the message for the visitor to email instead,
  // so a request is never reported as sent unless Formspree confirmed it.
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewzwqz';

  const showFallback = failed => {
    const w = $('#fWorry').value.trim();
    $('#msgText').textContent = `Hi Markix, I'd like a free first look at my ad spend.\n\nName: ${$('#fName').value}\nEmail: ${$('#fEmail').value}\nBrand: ${$('#fBrand').value}\nMonthly ad spend: ${$('#fSpend').value || 'not sure'}` + (w ? `\nWhat worries me: ${w}` : '') + `\n\nHappy to give read-only access to our store and ad accounts.`;
    if (failed) $('#msgLead').firstChild.nodeValue = "We couldn't send that just now. Copy this and email it to ";
    $('#msg').classList.add('show');
    $('#msg').scrollIntoView({behavior:'smooth', block:'nearest'});
  };

  $('#form').addEventListener('submit', async ev => {
    ev.preventDefault();
    if (!FORMSPREE_ENDPOINT) return showFallback(false);
    const btn = $('#send'); btn.disabled = true; btn.textContent = 'Sending';
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {'Accept': 'application/json'},
        body: new FormData($('#form')),
      });
      if (!res.ok) throw new Error('not sent');
      $('#form').hidden = true; $('#msg').classList.remove('show'); $('#sent').hidden = false;
    } catch (e) {
      showFallback(true);
    } finally {
      btn.disabled = false; btn.textContent = 'Send my request';
    }
  });
  $('#copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#msgText').textContent); $('#copied').textContent = 'Copied. Paste it into an email to us.'; }
    catch { $('#copied').textContent = 'Select the text above and copy it.'; }
  });
})();
