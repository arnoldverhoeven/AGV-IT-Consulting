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

// Quote request form -> pre-filled email (no backend required)
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const status = document.getElementById('qf-status');
    const name = document.getElementById('qf-name').value.trim();
    const email = document.getElementById('qf-email').value.trim();
    const company = document.getElementById('qf-company').value.trim();
    const type = document.getElementById('qf-type').value;
    const message = document.getElementById('qf-message').value.trim();

    if (!name || !email || !type || !message) {
      status.textContent = 'Please fill in the required fields.';
      status.className = 'qf-status err';
      return;
    }

    const subject = 'Website quote request — ' + type + (company ? ' — ' + company : '');
    const bodyLines = [
      'Name: ' + name,
      'Email: ' + email,
      company ? 'Company: ' + company : null,
      'Project type: ' + type,
      '',
      'Project details:',
      message
    ].filter(Boolean);

    const mailto = 'mailto:arnold.verhoeven@agv-it.be'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(bodyLines.join('\n'));

    window.location.href = mailto;
    status.textContent = 'Opening your email client with the request pre-filled…';
    status.className = 'qf-status ok';
  });
}
