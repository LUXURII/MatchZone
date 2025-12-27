const socket = io();
const token = localStorage.getItem("token");

function toggleMenu() {
    const s = document.getElementById('sidebar'), o = document.getElementById('overlay');
    if (s && o) { s.classList.toggle('open'); o.classList.toggle('active'); }
}

function showSection(id, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const t = document.getElementById(id);
    if (t) t.classList.remove('hidden');
    if (el) {
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        el.classList.add('active');
    }
    if (id === 'rankings') loadRankingsReal();
}

async function loadProfile() {
    if (!token) { if (!window.location.pathname.includes('login.html')) window.location.href = "/login.html"; return; }
    try {
        const res = await fetch("/api/auth/me", { headers: { "x-auth-token": token } });
        if (res.ok) {
            const u = await res.json();
            document.querySelector("#userNameDisplay").innerText = u.username;
            document.getElementById('profile-avatar').src = u.avatarUrl || 'i.pravatar.cc';
            document.getElementById('profile-bio').innerText = u.bio || '';
            document.getElementById('edit-bio').value = u.bio || '';
        }
    } catch (err) { console.error(err); }
}

function compressAndSave(file, bio, btn) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 200;
            canvas.width = size; canvas.height = size;
            canvas.getContext('2d').drawImage(img, 0, 0, size, size);
            sendUpdate(canvas.toDataURL('image/jpeg', 0.7), bio, btn);
        };
    };
    reader.readAsDataURL(file);
}

async function sendUpdate(avatar, bio, btn) {
    const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ avatarUrl: avatar, bio })
    });
    if (res.ok) { alert("Sucesso!"); loadProfile(); showSection('profile'); }
    btn.innerText = "Salvar Alterações"; btn.disabled = false;
}

function saveProfileChanges() {
    const btn = document.getElementById('save-profile-btn');
    const bio = document.getElementById('edit-bio').value;
    const file = document.getElementById('edit-avatar-file').files[0];
    btn.innerText = "Processando..."; btn.disabled = true;
    if (file) compressAndSave(file, bio, btn);
    else sendUpdate(document.getElementById('profile-avatar').src, bio, btn);
}

async function loadRankingsReal() {
    const res = await fetch('/api/stats/rankings');
    const data = await res.json();
    document.getElementById('ranking-list').innerHTML = data.map((p, i) => `<div>#${i+1} ${p.username} - ${p.elo} ELO</div>`).join('');
}

async function loadUserCount() {
    const res = await fetch('/api/stats/count');
    const data = await res.json();
    document.getElementById('user-count-display').innerText = `${data.count} Jogadores Ativos`;
}

function setupChat() {
    const input = document.getElementById('chat-input'), btn = document.querySelector('#chat button');
    if (!input || !btn) return;
    btn.onclick = () => {
        const text = input.value.trim();
        if (text) { socket.emit('sendMessage', { user: document.querySelector("#userNameDisplay").innerText, text }); input.value = ""; }
    };
}

socket.on('receiveMessage', (d) => {
    const m = document.getElementById('chat-messages');
    if (m) { m.innerHTML += `<p><strong>${d.user}:</strong> ${d.text}</p>`; m.scrollTop = m.scrollHeight; }
});

document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); loadUserCount(); setupChat();
    document.querySelector('.logout').onclick = () => { localStorage.removeItem("token"); window.location.href = "/login.html"; };
});
      
