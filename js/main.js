// Rusty Dads - copy IP to clipboard
function copyIP() {
  const code = document.getElementById('server-ip');
  const text = 'client.connect 135.148.136.48:60408';
  navigator.clipboard.writeText(text).then(() => {
    const original = code.textContent;
    code.textContent = 'Copied! Paste into F1 console';
    code.style.color = 'var(--good)';
    setTimeout(() => {
      code.textContent = original;
      code.style.color = '';
    }, 2000);
  });
}
