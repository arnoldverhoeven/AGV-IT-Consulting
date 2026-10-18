// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Quote request form -> sent server-side (/api/quote), no email client needed
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const status = document.getElementById('qf-status');
    const btn = quoteForm.querySelector('button[type="submit"]');
    const data = {
      name: document.getElementById('qf-name').value.trim(),
      email: document.getElementById('qf-email').value.trim(),
      company: document.getElementById('qf-company').value.trim(),
      type: document.getElementById('qf-type').value,
      message: document.getElementById('qf-message').value.trim(),
      website: (document.getElementById('qf-website') || {}).value || ''
    };
    if (!data.name || !data.email || !data.type || !data.message) {
      status.textContent = 'Please fill in the required fields.';
      status.className = 'qf-status err';
      return;
    }
    btn.disabled = true;
    status.textContent = 'Sending…';
    status.className = 'qf-status';
    try {
      const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) { throw new Error('send failed'); }
      if (window.agvConversion) { window.agvConversion('form'); }
      quoteForm.reset();
      status.textContent = 'Thanks! Your request has been sent — I\'ll get back to you within one working day.';
      status.className = 'qf-status ok';
    } catch (err) {
      status.textContent = 'Something went wrong. Please email arnold.verhoeven@agv-it.be directly.';
      status.className = 'qf-status err';
    } finally {
      btn.disabled = false;
    }
  });
}
