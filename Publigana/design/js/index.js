// Role toggle
  document.querySelectorAll('.role-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.role-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Form submit (provisional: shows confirmation locally; conectar a backend real más adelante)
  document.getElementById('leadForm').addEventListener('submit', function(e){
    e.preventDefault();
    const form = e.target;
    const successMsg = document.getElementById('successMsg');
    form.querySelectorAll('input').forEach(i => i.value = '');
    successMsg.style.display = 'block';
    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  });