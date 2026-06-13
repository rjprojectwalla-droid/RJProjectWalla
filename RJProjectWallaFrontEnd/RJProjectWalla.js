// ── DATA STORE ──
// if(!localStorage.getItem("role")){
//   window.location.href = "login.html";
// }
let projects = [];  // keep empty, not commented
let editingId = null;
let orders = [
  { id: "ORD001", student: "Rahul M.", email: "rahul@gmail.com", project: "Library Management System", amount: 499, payment: "PayPal", status: "delivered", date: "2025-01-10" },
  { id: "ORD002", student: "Priya K.", email: "priya@gmail.com", project: "Face Recognition Attendance", amount: 799, payment: "WhatsApp", status: "delivered", date: "2025-01-12" },
  { id: "ORD003", student: "Aditya R.", email: "aditya@gmail.com", project: "E-Commerce Website", amount: 699, payment: "PayPal", status: "pending", date: "2025-01-15" },
  { id: "ORD004", student: "Sneha T.", email: "sneha@gmail.com", project: "Bank Database System", amount: 349, payment: "WhatsApp", status: "delivered", date: "2025-01-17" },
];

let currentProject = null;
const WA_NUMBER = "+918904204550";
// const WA_NUMBER = "+917619283208";
const PAYPAL_EMAIL = "ak5142466@gmail.com";
const PAYPAL_USERNAME = "Akshaykumar";
function renderProjects(filter = 'all') {
  const grid = document.getElementById('proj-grid');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => {

    const thumbClass =
      p.cat === 'java' ? 'proj-thumb-java' :
        p.cat === 'python' ? 'proj-thumb-py' :
          p.cat === 'web' ? 'proj-thumb-web' :
            p.cat === 'database' ? 'proj-thumb-db' : '';

    const tagClass =
      p.cat === 'java' ? 'tag-java' :
        p.cat === 'python' ? 'tag-python' :
          p.cat === 'web' ? 'tag-web' :
            p.cat === 'database' ? 'tag-db' : '';

    return `
      <div class="proj-card" data-cat="${p.cat}">
        <div class="proj-thumb ${thumbClass}">${p.icon}</div>

        <div class="proj-body">
         <div class="proj-tags">
  <span class="proj-tag ${tagClass}">${p.cat.toUpperCase()}</span>
  ${p.popular ? '<span class="proj-tag tag-hot">🔥 POPULAR</span>' : ''}
</div>

          <div class="proj-title">${p.title}</div>
         <div class="proj-desc">${p.description || p.desc}</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:1rem;">
           ${(p.tech || []).map(t => `
  <span style="font-family:var(--font-mono);font-size:10px;background:var(--bg3);color:var(--muted);padding:2px 8px;border-radius:4px;">
    ${t}
  </span>
`).join('')}
          </div>

          <div class="proj-footer">
            <div class="proj-price">₹${p.price} <span>/ project</span></div>

            <div class="proj-actions">
              <button class="btn-wa" onclick="openWhatsApp('Hi! I want to order: ${p.title} (₹${p.price})')">💬</button>
              <button class="btn-buy" onclick="openBuyModal(${p.id})">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(cat);
}

// ── MODAL ──
function openBuyModal(id) {
  currentProject = projects.find(p => p.id === id);
  document.getElementById('modal-proj-name').textContent = currentProject.title;
  document.getElementById('modal-proj-price').textContent = '₹' + currentProject.price;
  document.getElementById('buy-modal').classList.add('open');
}
function closeModal() { document.getElementById('buy-modal').classList.remove('open'); }
document.getElementById('buy-modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });

function handlePayPal() {
  if (!currentProject) return;
  const url = `https://www.paypal.com/paypalme/${PAYPAL_EMAIL}/${currentProject.price}`;
  showToast('Redirecting to PayPal...');
  setTimeout(() => window.open(url, '_blank'), 800);
  logOrder(currentProject, 'PayPal');
}

function handleWhatsApp() {
  if (!currentProject) return;
  openWhatsApp(`Hi! I want to buy: *${currentProject.title}* for ₹${currentProject.price}. Please share payment details.`);
  logOrder(currentProject, 'WhatsApp');
}

function logOrder(proj, method) {
  const id = 'ORD' + String(orders.length + 1).padStart(3, '0');
  orders.push({ id, student: 'New Student', email: '—', project: proj.title, amount: proj.price, payment: method, status: 'pending', date: new Date().toISOString().slice(0, 10) });
  updateAdminStats();
}

// ── WHATSAPP ──
function openWhatsApp(msg) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── CONTACT ──
function sendContact() {
  const name = document.getElementById('c-name').value.trim();
  const msg = document.getElementById('c-msg').value.trim();
  if (!name || !msg) { showToast('Please fill all fields', 'error'); return; }
  const waMsg = `Hi! I'm ${name}.\n\nProject Type: ${document.getElementById('c-type').value}\n\nMessage: ${msg}`;
  openWhatsApp(waMsg);
  showToast('Opening WhatsApp...');
}

// ── ADMIN ──
function showAdminTab(tab) {
  ['dashboard', 'projects', 'orders', 'add'].forEach(t => {
    document.getElementById('admin-' + t).style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.admin-nav-item').forEach((el, i) => {
    el.classList.toggle('active', ['dashboard', 'projects', 'orders', 'add'][i] === tab);
  });
  if (tab === 'projects') renderAdminProjects();
  if (tab === 'orders') renderAllOrders();
  if (tab === 'dashboard') updateAdminStats();
}

function renderAdminProjects() {
  document.getElementById('admin-proj-table').innerHTML = projects.map(p => `
    <tr>
      <td><strong>${p.icon} ${p.title}</strong></td>
      <td><span style="text-transform:capitalize;color:var(--muted);">${p.cat}</span></td>
      <td style="font-family:var(--font-mono);">₹${p.price}</td>
      <td><span class="status-badge s-active">Active</span></td>
      <td><div class="action-btns">
        <button class="act-btn" onclick="editProject(${p.id})">Edit</button>
        <button class="act-btn act-del" onclick="deleteProject(${p.id})">Delete</button>
      </div></td>
    </tr>
  `).join('');
}

function renderAllOrders() {
  document.getElementById('all-orders-body').innerHTML = orders.map(o => `
    <tr>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--muted);">${o.id}</td>
      <td>${o.student}</td>
      <td>${o.project}</td>
      <td style="font-family:var(--font-mono);">₹${o.amount}</td>
      <td>${o.payment}</td>
      <td><span class="status-badge ${o.status === 'delivered' ? 's-active' : o.status === 'pending' ? 's-pending' : 's-sold'}">${o.status}</span></td>
    </tr>
  `).join('');
}


function updateAdminStats() {
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.amount, 0);
  document.getElementById('stat-revenue').textContent = '₹' + revenue;
  document.getElementById('stat-orders').textContent = orders.length;
  document.getElementById('stat-projects').textContent = projects.length;
  document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'pending').length;
  document.getElementById('orders-table-body').innerHTML = orders.slice(-5).reverse().map(o => `
    <tr>
      <td>${o.student}</td>
      <td>${o.project}</td>
      <td style="font-family:var(--font-mono);">₹${o.amount}</td>
      <td><span class="status-badge ${o.status === 'delivered' ? 's-active' : 's-pending'}">${o.status}</span></td>
      <td style="color:var(--muted);font-size:12px;">${o.date}</td>
    </tr>
  `).join('');
}
function addProject() {
  const title = document.getElementById('ap-title').value.trim();
  const cat = document.getElementById('ap-cat').value;
  const description = document.getElementById('ap-desc').value.trim();
  const price = parseInt(document.getElementById('ap-price').value);
  const icon = document.getElementById('ap-icon').value.trim() || '📁';
  const popular = document.getElementById('ap-popular').checked;
  const tech = document.getElementById('ap-tech')
    .value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  if (!title || !description || !price) {
    showToast('Please fill all fields', 'error');
    return;
  }

  const newProj = {
    title,
    cat,
    icon,
    description,
    price,
    popular,
    tech
  };

  // 🔥 MAIN LOGIC HERE
  if (editingId) {

    fetch(`http://localhost:8080/api/projects/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newProj)
    })
      .then(res => res.json())
      .then(updated => {

        projects = projects.map(p => p.id === editingId ? updated : p);

        editingId = null;

        renderProjects();
        renderAdminProjects();
        updateAdminStats();
        showAdminTab('projects');

        showToast('Project updated!');
        document.getElementById('ap-title').value = "";
        document.getElementById('ap-desc').value = "";
        document.getElementById('ap-price').value = "";
        document.getElementById('ap-tech').value = "";
        document.getElementById('ap-icon').value = "";
        document.getElementById('ap-popular').checked = false;
      })
      .catch(err => {
        console.error(err);
        showToast('Update failed', 'error');
      });

  } else {
    fetch('http://localhost:8080/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newProj)
    })
      .then(res => res.json())
      .then(savedProject => {

        projects.push(savedProject);

        renderProjects();
        renderAdminProjects();
        updateAdminStats();
        showAdminTab('projects');

        showToast('Saved to database!');
        document.getElementById('ap-title').value = "";
        document.getElementById('ap-desc').value = "";
        document.getElementById('ap-price').value = "";
        document.getElementById('ap-tech').value = "";
        document.getElementById('ap-icon').value = "";
        document.getElementById('ap-popular').checked = false;
      })
      .catch(err => {
        console.error(err);
        showToast('Error saving project', 'error');
      });
  }
}


function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  fetch(`http://localhost:8080/api/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Delete failed');

      // remove from local array
      projects = projects.filter(p => p.id !== id);

      // refresh BOTH UIs
      renderProjects();        // 👉 fixes "All Projects" section
      renderAdminProjects();
      updateAdminStats();

      showToast('Deleted from database!');
    })
    .catch(err => {
      console.error(err);
      showToast('Delete failed', 'error');
    });
}
window.editProject = function (id) {
  const proj = projects.find(p => p.id === id);

  if (!proj) {
    showToast("Project not found", "error");
    return;
  }

  editingId = id;

  document.getElementById('ap-title').value = proj.title || "";
  document.getElementById('ap-cat').value = proj.cat || "";
  document.getElementById('ap-desc').value = proj.description || "";
  document.getElementById('ap-price').value = proj.price || "";
  document.getElementById('ap-icon').value = proj.icon || "";

  document.getElementById('ap-popular').checked =
    proj.popular || false;

  document.getElementById('ap-tech').value =
    Array.isArray(proj.tech)
      ? proj.tech.join(", ")
      : "";

  document.querySelector('#admin-add button')
    .textContent = "Update Project";

  showAdminTab('add');
};

// ── PAGE SWITCHING ──
function showPage(name) {

  if (name === 'admin' && !localStorage.getItem("token")) {
    showToast("Login required", "error");
    openLogin();
    return;
  }

  document.querySelectorAll('.page').forEach(p =>
    p.classList.remove('active')
  );

  document.getElementById('page-' + name)
    .classList.add('active');

  window.scrollTo(0, 0);

  if (name === 'admin') {
    updateAdminStats();
  }
}



function scrollToSection(id) {
  showPage('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

// ── TOAST ──
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = type === 'error' ? 'var(--red)' : 'var(--green)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── SCROLL ANIMATIONS ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

// ── HAMBURGER ──
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  links.style.flexDirection = 'column';
  links.style.position = 'absolute';
  links.style.top = '64px';
  links.style.left = '0';
  links.style.right = '0';
  links.style.background = 'var(--bg2)';
  links.style.padding = '1rem 2rem';
  links.style.borderBottom = '1px solid var(--border)';
}

document.addEventListener("DOMContentLoaded", () => {

  renderProjects();   // ✅ ADD THIS FIRST (important)

  const token = localStorage.getItem("token");


  if (token) {

    document.getElementById("login-link").style.display = "none";

    document.getElementById("admin-link").style.display = "inline";

    document.getElementById("logout-link").style.display = "inline";

  } else {

    document.getElementById("login-link").style.display = "inline";

    document.getElementById("admin-link").style.display = "none";

    document.getElementById("logout-link").style.display = "none";
  }

  if (!token) {
    document.getElementById("admin-link").style.display = "none";
    document.getElementById("admin-footer").style.display = "none";
  }
  fetch('http://localhost:8080/api/projects')
    .then(res => res.json())
    .then(data => {
      projects = data;
      renderProjects();
      updateAdminStats();
    })
    .catch(err => {
      console.error("API error:", err);
      renderProjects();  // fallback
    });

});

function openLogin() {
  document.getElementById("login-modal").style.display = "flex";

}
async function loginAdmin() {

  const user = document.getElementById("admin-user").value.trim();
  const pass = document.getElementById("admin-pass").value.trim();

  try {

    const response = await fetch(
      "http://localhost:8080/auth/login",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({
          username: user,
          password: pass
        })
      }
    );

    if (!response.ok) {
      showToast("Invalid credentials", "error");
      return;
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    document.getElementById("login-link").style.display = "none";

    document.getElementById("admin-link").style.display = "inline";

    document.getElementById("logout-link").style.display = "inline";

    document.getElementById("login-modal").style.display = "none";

    document.getElementById("admin-link").style.display = "inline";
    document.getElementById("admin-footer").style.display = "inline";

    showToast("Login successful");

    showPage("admin");

  } catch (e) {
    console.error(e);
    showToast("Login failed", "error");
  }
}
function logout() {

  localStorage.removeItem("token");

  document.getElementById("login-link").style.display = "inline";

  document.getElementById("admin-link").style.display = "none";

  document.getElementById("logout-link").style.display = "none";

  showPage("home");

  showToast("Logged out successfully");
}
function loginUser(username) {

  localStorage.setItem("role", "USER");
  localStorage.setItem("user", username);

  // hide admin
  document.getElementById("admin-link").style.display = "none";
  document.getElementById("admin-footer").style.display = "none";

  showPage('home');
}