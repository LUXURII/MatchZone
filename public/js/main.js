async function loadProfile() {
  const token = localStorage.getItem('token');
  if (!token) {
      // window.location.href = '/login.html'; // Descomente quando tiver login
      return;
  }
  const response = await fetch('/api/auth/me', { headers: { 'x-auth-token': token } });
  if (response.ok) {
    const user = await response.json();
    document.getElementById('username-display').innerText = user.username;
  } else {
    console.error("Falha ao carregar perfil");
  }
}
loadProfile();
