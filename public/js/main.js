(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#yr').textContent = new Date().getFullYear();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .1});
  $$('.rv').forEach(el => io.observe(el));
  const once = (el, fn, th = .4) => new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { fn(); o.disconnect(); } }, {threshold: th}).observe(el);

  once($('#art'), () => $$('#art .bars i').forEach((b, i) => setTimeout(() => b.style.height = b.dataset.h + '%', reduce ? 0 : 150 + i * 120)), .2);

  const lines = $$('#claim .lines div'), sum = $('#sum');
  if (!reduce) sum.textContent = '₹0';
  once($('#claim'), () => lines.forEach((l, i) => setTimeout(() => { l.classList.add('on'); sum.textContent = '₹' + ((i + 1) * 1000).toLocaleString('en-IN'); }, reduce ? 0 : 250 + i * 600)));

  // real outputs from the Markix tool on its demo brand
  const row = (n, v, m, t, g) => `<div><span>${n}</span><i class="${g ? 'g' : ''}" style="width:${v / m * 100}%"></i><span>${t}</span></div>`;
  const A = {
    diwali: ['Diwali is 6 weeks out and I have ₹6 lakh. How do I split it?',
      `<div class="big">Spread it over 5 weeks, heaviest in Diwali week.</div><div class="bars2">${row('Meta', 3.54, 3.54, '₹3.5L')}${row('Influencer', 1.19, 3.54, '₹1.2L', 1)}${row('Google', 1, 3.54, '₹1.0L', 1)}${row('Email', .27, 3.54, '₹0.3L', 1)}</div>`],
    google: ['What happens if I pause Google?',
      `<div class="big">You'd lose about 8.8% of sales.</div><p>Roughly ₹5.5 lakh a quarter, and profit drops too. Keep it on.</p><span class="rng">Likely −5.9% to −12.9%</span>`],
    infl: ['Should I cut influencers in half?',
      `<div class="big">Sales dip 4%, but profit goes up.</div><p>You save more than that spend was earning.</p><span class="rng">Likely −3.5% to −4.3% sales</span>`],
    best: ['Which channel is working best right now?',
      `<div class="big">Meta. Your next ₹1 there brings back ₹1.86.</div><div class="bars2">${row('Meta', 1.86, 1.86, '₹1.86')}${row('Google', 1.49, 1.86, '₹1.49', 1)}${row('Email', 1.26, 1.86, '₹1.26', 1)}${row('Influencer', 1.25, 1.86, '₹1.25', 1)}</div>`]
  };
  let tm = [];
  const ask = k => {
    tm.forEach(clearTimeout); tm = [];
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.q === k));
    const [q, a] = A[k];
    $('#reply').innerHTML = '';
    if (reduce) { $('#typed').textContent = q; $('#reply').innerHTML = a; return; }
    let i = 0;
    const type = () => {
      $('#typed').innerHTML = q.slice(0, i) + '<span class="caret"></span>';
      if (i++ < q.length) tm.push(setTimeout(type, 24));
      else tm.push(setTimeout(() => { $('#typed').textContent = q; $('#reply').innerHTML = a; }, 400));
    };
    type();
  };
  $$('.chip').forEach(c => c.addEventListener('click', () => ask(c.dataset.q)));
  once($('#ask .askbox'), () => ask('diwali'), .3);

  // contact form (Formspree) with a copy-and-email fallback
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/myewzwqz';
  const fallback = failed => {
    const w = $('#fWorry').value.trim();
    $('#msgText').textContent = `Hi Markix, I'd like a free first look.\n\nName: ${$('#fName').value}\nBrand: ${$('#fBrand').value}\nEmail: ${$('#fEmail').value}\nMonthly ad spend: ${$('#fSpend').value || 'not sure'}` + (w ? `\nNote: ${w}` : '');
    if (failed) $('#msgLead').firstChild.nodeValue = "We couldn't send that. Copy this and email it to ";
    $('#msg').classList.add('show');
  };
  $('#form').addEventListener('submit', async e => {
    e.preventDefault();
    const b = $('#send'); b.disabled = true; b.firstChild.nodeValue = 'Sending ';
    try {
      const r = await fetch(FORMSPREE_ENDPOINT, {method: 'POST', headers: {Accept: 'application/json'}, body: new FormData($('#form'))});
      if (!r.ok) throw 0;
      $('#form').hidden = true; $('#msg').classList.remove('show'); $('#sent').hidden = false;
    } catch { fallback(true); }
    finally { b.disabled = false; b.firstChild.nodeValue = 'Send request '; }
  });
  $('#copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#msgText').textContent); $('#copied').textContent = 'Copied.'; }
    catch { $('#copied').textContent = 'Select and copy the text above.'; }
  });
})();
