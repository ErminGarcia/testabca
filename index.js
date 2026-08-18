const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

let sb = null;
function getSupabase() {
  if (!sb && typeof supabase !== 'undefined') {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return sb;
}

function markActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .drawer-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === path || (path === '' && hrefFile === 'index.html')) {
      a.classList.add('active');
    }
  });
}

function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('drawerOverlay');
  const drawer = document.getElementById('drawer');
  const closeBtn = document.getElementById('drawerClose');
  if (!toggle || !overlay || !drawer) return;

  function openDrawer() {
    overlay.style.display = 'block';
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

function initCarousel(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  const track = wrap.querySelector('.carousel-track');
  const slides = wrap.querySelectorAll('.carousel-slide');
  const dots = wrap.querySelectorAll('.carousel-dot');
  const prevBtn = wrap.querySelector('.carousel-btn.prev');
  const nextBtn = wrap.querySelector('.carousel-btn.next');
  if (!track || !slides.length) return;

  let current = 0;
  let timer = null;

  function go(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function startAuto() {
    timer = setInterval(next, 4000);
  }

  function stopAuto() { clearInterval(timer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); go(i); startAuto(); }));

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  go(0);
  startAuto();
}

function initAdmissionSlider() {
  const wrap = document.getElementById('admissionSlider');
  if (!wrap) return;
  const slides = wrap.querySelectorAll('.slide');
  const dots = wrap.querySelectorAll('.slider-dot');
  const prevBtn = wrap.querySelector('.slider-btn.prev');
  const nextBtn = wrap.querySelector('.slider-btn.next');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  let paused = false;

  function go(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => { if (!paused) go(current + 1); }, 5000);
  }

  function stopAuto() { clearInterval(timer); }

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); go(current - 1); paused = true; setTimeout(() => { paused = false; startAuto(); }, 5000); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); go(current + 1); paused = true; setTimeout(() => { paused = false; startAuto(); }, 5000); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); go(i); paused = true; setTimeout(() => { paused = false; startAuto(); }, 5000); }));

  let touchStartX = 0;
  wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { stopAuto(); dx < 0 ? go(current + 1) : go(current - 1); startAuto(); }
  }, { passive: true });

  go(0);
  startAuto();
}

function initFeedbackModal() {
  const trigger = document.getElementById('feedbackTrigger');
  const overlay = document.getElementById('feedbackModal');
  const closeBtn = document.getElementById('feedbackModalClose');
  const form = document.getElementById('feedbackForm');
  if (!trigger || !overlay) return;

  trigger.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const msg = document.getElementById('fbMsg');
      const name = document.getElementById('fbName');
      const submit = form.querySelector('[type="submit"]');
      const feedback = msg ? msg.value.trim() : '';
      if (!feedback) return;

      submit.disabled = true;
      submit.textContent = 'Submitting...';

      const client = getSupabase();
      if (client) {
        const { error } = await client.from('feedbacks').insert({
          name: name ? (name.value.trim() || null) : null,
          feedback
        });
        if (!error) {
          form.reset();
          submit.textContent = 'Thank you!';
          setTimeout(() => { submit.textContent = 'Submit Feedback'; submit.disabled = false; close(); }, 1800);
          return;
        }
      }
      submit.textContent = 'Submit Feedback';
      submit.disabled = false;
    });
  }
}

async function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const msgEl = form.querySelector('.form-message');
    const data = {
      name: form.querySelector('#cName').value.trim(),
      email: form.querySelector('#cEmail').value.trim(),
      phone: form.querySelector('#cPhone').value.trim() || null,
      subject: form.querySelector('#cSubject').value.trim(),
      message: form.querySelector('#cMessage').value.trim()
    };

    if (!data.name || !data.email || !data.subject || !data.message) return;

    btn.disabled = true;
    btn.textContent = 'Sending...';

    const client = getSupabase();
    if (client) {
      const { error } = await client.from('enquiries').insert(data);
      if (msgEl) {
        msgEl.className = 'form-message ' + (error ? 'error' : 'success');
        msgEl.textContent = error
          ? 'Something went wrong. Please try again or contact us directly.'
          : 'Your message has been sent. We will get back to you soon.';
      }
      if (!error) form.reset();
    }
    btn.disabled = false;
    btn.textContent = 'Send Message';
  });
}

async function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const client = getSupabase();
  if (!client) return;

  const { data: { session } } = await client.auth.getSession();
  if (session) { location.href = 'admin.html'; return; }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.querySelector('#loginEmail').value.trim();
    const password = form.querySelector('#loginPassword').value;
    const btn = form.querySelector('[type="submit"]');
    const errEl = document.getElementById('loginError');

    if (!email || !password) return;

    btn.disabled = true;
    btn.textContent = 'Signing in...';
    if (errEl) errEl.style.display = 'none';

    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      if (errEl) {
        errEl.textContent = 'Invalid email or password. Please try again.';
        errEl.style.display = 'block';
      }
      btn.disabled = false;
      btn.textContent = 'Sign In';
    } else {
      location.href = 'admin.html';
    }
  });
}

async function initAdmin() {
  const client = getSupabase();
  if (!client) { location.href = 'login.html'; return; }

  const { data: { session } } = await client.auth.getSession();
  if (!session) { location.href = 'login.html'; return; }

  const userEmail = session.user.email || '';
  const initials = userEmail.slice(0, 2).toUpperCase();
  const avatarEl = document.getElementById('adminAvatar');
  const userEmailEl = document.getElementById('adminUserEmail');
  if (avatarEl) avatarEl.textContent = initials;
  if (userEmailEl) userEmailEl.textContent = userEmail;

  initAdminNav();
  initDarkMode();
  initSidebarToggle();
  loadDashboard();
  setupSection('enquiries', loadEnquiries);
  setupSection('feedbacks', loadFeedbacks);
  setupSection('users', loadUsers);

  document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', async () => {
    await client.auth.signOut();
    location.href = 'login.html';
  });
}

function initAdminNav() {
  const items = document.querySelectorAll('.admin-nav-item[data-section]');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      const target = document.getElementById('section-' + section);
      if (target) target.classList.add('active');
      const topbarTitle = document.getElementById('topbarTitle');
      if (topbarTitle) topbarTitle.textContent = item.querySelector('.nav-label') ? item.querySelector('.nav-label').textContent : item.textContent.trim();
      if (section === 'enquiries') loadEnquiries();
      if (section === 'feedbacks') loadFeedbacks();
      if (section === 'users') loadUsers();
      if (section === 'dashboard') loadDashboard();
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });
}

function setupSection(name, loadFn) {
  const tabBtns = document.querySelectorAll(`[data-tab="${name}"]`);
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadFn(btn.dataset.view || 'active');
    });
  });
}

function initDarkMode() {
  const toggle = document.getElementById('darkToggle');
  const body = document.querySelector('.admin-body');
  if (!toggle || !body) return;
  const stored = localStorage.getItem('abca-dark');
  if (stored === '1') { body.classList.add('dark'); updateDarkIcon(true); }

  toggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('abca-dark', isDark ? '1' : '0');
    updateDarkIcon(isDark);
  });
}

function updateDarkIcon(isDark) {
  const icon = document.querySelector('#darkToggle .dark-icon');
  const label = document.querySelector('#darkToggle .dark-label');
  if (icon) {
    icon.innerHTML = isDark
      ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
  if (label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function initSidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

function closeSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  if (sidebar) sidebar.classList.remove('open');
}

function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

async function loadDashboard() {
  const client = getSupabase();
  if (!client) return;

  const [{ data: enquiries }, { data: feedbacks }, { data: users }] = await Promise.all([
    client.from('enquiries').select('status'),
    client.from('feedbacks').select('status'),
    client.from('admin_profiles').select('is_deleted')
  ]);

  const eq = enquiries || [];
  const fb = feedbacks || [];
  const us = users || [];

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statNewEnq', eq.filter(r => r.status === 'new').length);
  set('statNewFb', fb.filter(r => r.status === 'new').length);
  set('statTotalEnq', eq.filter(r => r.status !== 'deleted').length);
  set('statTotalFb', fb.filter(r => r.status !== 'deleted').length);
  set('statUsers', us.filter(r => !r.is_deleted).length);

  updateBadge('badgeEnq', eq.filter(r => r.status === 'new').length);
  updateBadge('badgeFb', fb.filter(r => r.status === 'new').length);
}

function updateBadge(id, count) {
  const el = document.getElementById(id);
  if (!el) return;
  if (count > 0) {
    el.textContent = count > 9 ? '9+' : count;
    el.style.display = 'inline-flex';
  } else {
    el.style.display = 'none';
  }
}

let currentEnqView = 'active';
async function loadEnquiries(view) {
  if (view) currentEnqView = view;
  const client = getSupabase();
  if (!client) return;
  const tableBody = document.getElementById('enqTableBody');
  const mobileList = document.getElementById('enqMobileList');
  if (!tableBody) return;

  let query = client.from('enquiries').select('*').order('created_at', { ascending: false });
  if (currentEnqView === 'active') query = query.eq('status', 'new');
  else if (currentEnqView === 'archived') query = query.eq('status', 'archived');
  else if (currentEnqView === 'deleted') query = query.eq('status', 'deleted');

  const { data, error } = await query;
  if (error || !data) return;

  tableBody.innerHTML = '';
  if (mobileList) mobileList.innerHTML = '';

  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><p>No enquiries found.</p></div></td></tr>`;
    if (mobileList) mobileList.innerHTML = '<div class="empty-state"><p>No enquiries found.</p></div>';
    return;
  }

  data.forEach(row => {
    const actions = getEnqActions(row);
    tableBody.innerHTML += `
      <tr>
        <td>${escHtml(row.name)}</td>
        <td>${escHtml(row.email)}</td>
        <td>${escHtml(row.phone || '—')}</td>
        <td class="td-wrap">${escHtml(row.subject)}</td>
        <td class="td-wrap">${escHtml(truncate(row.message, 80))}</td>
        <td>${fmtDate(row.created_at)}</td>
        <td><span class="status-badge ${row.status}">${row.status}</span></td>
        <td><div class="action-btns">${actions}</div></td>
      </tr>`;
    if (mobileList) {
      mobileList.innerHTML += `
        <div class="enquiry-m-card">
          <div class="enquiry-m-header"><span class="enquiry-m-name">${escHtml(row.name)}</span><span class="enquiry-m-date">${fmtDate(row.created_at)}</span></div>
          <div class="enquiry-m-meta">${escHtml(row.email)}${row.phone ? ' &bull; ' + escHtml(row.phone) : ''}<br><strong>${escHtml(row.subject)}</strong></div>
          <div class="enquiry-m-message">${escHtml(truncate(row.message, 160))}</div>
          <span class="status-badge ${row.status}">${row.status}</span>
          <div class="action-btns" style="margin-top:12px">${actions}</div>
        </div>`;
    }
  });

  document.querySelectorAll('[data-enq-action]').forEach(btn => {
    btn.addEventListener('click', () => handleEnqAction(btn.dataset.enqAction, btn.dataset.id));
  });
}

function getEnqActions(row) {
  if (row.status === 'new') return `<button class="action-btn archive" data-enq-action="archive" data-id="${row.id}">Archive</button><button class="action-btn delete" data-enq-action="soft-delete" data-id="${row.id}">Delete</button>`;
  if (row.status === 'archived') return `<button class="action-btn unarchive" data-enq-action="unarchive" data-id="${row.id}">Unarchive</button><button class="action-btn delete" data-enq-action="soft-delete" data-id="${row.id}">Delete</button>`;
  if (row.status === 'deleted') return `<button class="action-btn restore" data-enq-action="restore" data-id="${row.id}">Restore</button><button class="action-btn permanent" data-enq-action="permanent" data-id="${row.id}">Purge</button>`;
  return '';
}

async function handleEnqAction(action, id) {
  const client = getSupabase();
  if (!client) return;
  if (action === 'archive') await client.from('enquiries').update({ status: 'archived' }).eq('id', id);
  else if (action === 'unarchive') await client.from('enquiries').update({ status: 'new' }).eq('id', id);
  else if (action === 'soft-delete') {
    const { data: { session } } = await client.auth.getSession();
    await client.from('enquiries').update({ status: 'deleted', deleted_at: new Date().toISOString(), deleted_by: session.user.id }).eq('id', id);
  } else if (action === 'restore') await client.from('enquiries').update({ status: 'new', deleted_at: null, deleted_by: null }).eq('id', id);
  else if (action === 'permanent') {
    showConfirm('Permanently delete this enquiry? This cannot be undone.', async () => {
      await client.from('enquiries').delete().eq('id', id);
      loadEnquiries();
    });
    return;
  }
  loadEnquiries();
  loadDashboard();
}

let currentFbView = 'active';
async function loadFeedbacks(view) {
  if (view) currentFbView = view;
  const client = getSupabase();
  if (!client) return;
  const tableBody = document.getElementById('fbTableBody');
  const mobileList = document.getElementById('fbMobileList');
  if (!tableBody) return;

  let query = client.from('feedbacks').select('*').order('created_at', { ascending: false });
  if (currentFbView === 'active') query = query.eq('status', 'new');
  else if (currentFbView === 'archived') query = query.eq('status', 'archived');
  else if (currentFbView === 'deleted') query = query.eq('status', 'deleted');

  const { data, error } = await query;
  if (error || !data) return;

  tableBody.innerHTML = '';
  if (mobileList) mobileList.innerHTML = '';

  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><p>No feedback found.</p></div></td></tr>`;
    if (mobileList) mobileList.innerHTML = '<div class="empty-state"><p>No feedback found.</p></div>';
    return;
  }

  data.forEach(row => {
    const actions = getFbActions(row);
    tableBody.innerHTML += `
      <tr>
        <td>${escHtml(row.name || '(Anonymous)')}</td>
        <td class="td-wrap">${escHtml(truncate(row.feedback, 120))}</td>
        <td>${fmtDate(row.created_at)}</td>
        <td><span class="status-badge ${row.status}">${row.status}</span></td>
        <td><div class="action-btns">${actions}</div></td>
      </tr>`;
    if (mobileList) {
      mobileList.innerHTML += `
        <div class="enquiry-m-card feedback">
          <div class="enquiry-m-header"><span class="enquiry-m-name">${escHtml(row.name || 'Anonymous')}</span><span class="enquiry-m-date">${fmtDate(row.created_at)}</span></div>
          <div class="enquiry-m-message">${escHtml(row.feedback)}</div>
          <span class="status-badge ${row.status}">${row.status}</span>
          <div class="action-btns" style="margin-top:12px">${actions}</div>
        </div>`;
    }
  });

  document.querySelectorAll('[data-fb-action]').forEach(btn => {
    btn.addEventListener('click', () => handleFbAction(btn.dataset.fbAction, btn.dataset.id));
  });
}

function getFbActions(row) {
  if (row.status === 'new') return `<button class="action-btn archive" data-fb-action="archive" data-id="${row.id}">Archive</button><button class="action-btn delete" data-fb-action="soft-delete" data-id="${row.id}">Delete</button>`;
  if (row.status === 'archived') return `<button class="action-btn unarchive" data-fb-action="unarchive" data-id="${row.id}">Unarchive</button><button class="action-btn delete" data-fb-action="soft-delete" data-id="${row.id}">Delete</button>`;
  if (row.status === 'deleted') return `<button class="action-btn restore" data-fb-action="restore" data-id="${row.id}">Restore</button><button class="action-btn permanent" data-fb-action="permanent" data-id="${row.id}">Purge</button>`;
  return '';
}

async function handleFbAction(action, id) {
  const client = getSupabase();
  if (!client) return;
  if (action === 'archive') await client.from('feedbacks').update({ status: 'archived' }).eq('id', id);
  else if (action === 'unarchive') await client.from('feedbacks').update({ status: 'new' }).eq('id', id);
  else if (action === 'soft-delete') {
    const { data: { session } } = await client.auth.getSession();
    await client.from('feedbacks').update({ status: 'deleted', deleted_at: new Date().toISOString(), deleted_by: session.user.id }).eq('id', id);
  } else if (action === 'restore') await client.from('feedbacks').update({ status: 'new', deleted_at: null, deleted_by: null }).eq('id', id);
  else if (action === 'permanent') {
    showConfirm('Permanently delete this feedback? This cannot be undone.', async () => {
      await client.from('feedbacks').delete().eq('id', id);
      loadFeedbacks();
    });
    return;
  }
  loadFeedbacks();
  loadDashboard();
}

async function loadUsers() {
  const client = getSupabase();
  if (!client) return;
  const tbody = document.getElementById('usersTableBody');
  const mobileList = document.getElementById('usersMobileList');
  if (!tbody) return;

  const { data, error } = await client.from('admin_profiles').select('*').order('created_at', { ascending: false });
  if (error || !data) return;

  const { data: { session } } = await client.auth.getSession();
  const myId = session ? session.user.id : null;

  tbody.innerHTML = '';
  if (mobileList) mobileList.innerHTML = '';

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>No users found.</p></div></td></tr>`;
    return;
  }

  data.forEach(row => {
    const isMe = row.id === myId;
    const canDelete = !isMe && !row.is_deleted;
    const actions = row.is_deleted
      ? `<button class="action-btn restore" data-user-action="restore" data-id="${row.id}">Restore</button><button class="action-btn permanent" data-user-action="permanent" data-id="${row.id}">Purge</button>`
      : `${!isMe ? `<button class="action-btn archive" data-user-action="toggle-role" data-id="${row.id}" data-role="${row.role}">Toggle Role</button>` : ''}<button class="action-btn delete" data-user-action="soft-delete" data-id="${row.id}" ${isMe ? 'disabled title="Cannot delete yourself"' : ''}>Delete</button>`;

    tbody.innerHTML += `
      <tr>
        <td>${escHtml(row.display_name || row.email)}</td>
        <td>${escHtml(row.email)}</td>
        <td><span class="status-badge ${row.role === 'super_admin' ? 'archived' : 'new'}">${row.role}</span></td>
        <td><span class="status-badge ${row.is_deleted ? 'deleted' : 'new'}">${row.is_deleted ? 'deleted' : 'active'}</span></td>
        <td>${fmtDate(row.created_at)}</td>
        <td><div class="action-btns">${actions}</div></td>
      </tr>`;

    if (mobileList) {
      mobileList.innerHTML += `
        <div class="enquiry-m-card">
          <div class="enquiry-m-header"><span class="enquiry-m-name">${escHtml(row.display_name || row.email)}</span><span class="status-badge ${row.role === 'super_admin' ? 'archived' : 'new'}">${row.role}</span></div>
          <div class="enquiry-m-meta">${escHtml(row.email)}</div>
          <div class="action-btns" style="margin-top:12px">${actions}</div>
        </div>`;
    }
  });

  initAddUserForm();

  document.querySelectorAll('[data-user-action]').forEach(btn => {
    btn.addEventListener('click', () => handleUserAction(btn.dataset.userAction, btn.dataset.id, btn.dataset.role));
  });
}

function initAddUserForm() {
  const form = document.getElementById('addUserForm');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const client = getSupabase();
    if (!client) return;
    const { data: { session } } = await client.auth.getSession();
    if (!session) return;

    const email = form.querySelector('#newUserEmail').value.trim();
    const role = form.querySelector('#newUserRole').value;
    const name = form.querySelector('#newUserName').value.trim();
    const pass = form.querySelector('#newUserPass').value;
    const errEl = document.getElementById('addUserError');
    const btn = form.querySelector('[type="submit"]');

    if (!email || !pass) return;

    btn.disabled = true;
    btn.textContent = 'Creating...';

    const adminClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data: signupData, error: signupErr } = await adminClient.auth.signUp({ email, password: pass });

    if (signupErr || !signupData.user) {
      if (errEl) { errEl.textContent = signupErr ? signupErr.message : 'Failed to create user.'; errEl.style.display = 'block'; }
      btn.disabled = false;
      btn.textContent = 'Create User';
      return;
    }

    await client.from('admin_profiles').insert({
      id: signupData.user.id,
      email,
      display_name: name || null,
      role,
      created_by: session.user.id
    });

    form.reset();
    if (errEl) errEl.style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'Create User';
    loadUsers();
  });
}

async function handleUserAction(action, id, currentRole) {
  const client = getSupabase();
  if (!client) return;
  const { data: { session } } = await client.auth.getSession();
  if (!session) return;

  if (action === 'toggle-role') {
    const newRole = currentRole === 'super_admin' ? 'admin' : 'super_admin';
    await client.from('admin_profiles').update({ role: newRole, updated_at: new Date().toISOString(), updated_by: session.user.id }).eq('id', id);
  } else if (action === 'soft-delete') {
    await client.from('admin_profiles').update({ is_deleted: true, deleted_at: new Date().toISOString(), deleted_by: session.user.id }).eq('id', id);
  } else if (action === 'restore') {
    await client.from('admin_profiles').update({ is_deleted: false, deleted_at: null, deleted_by: null }).eq('id', id);
  } else if (action === 'permanent') {
    showConfirm('Permanently delete this user? This cannot be undone.', async () => {
      await client.from('admin_profiles').delete().eq('id', id);
      loadUsers();
    });
    return;
  }
  loadUsers();
}

function escHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let confirmCallback = null;
function showConfirm(message, cb) {
  const overlay = document.getElementById('confirmOverlay');
  const msgEl = document.getElementById('confirmMessage');
  if (!overlay) { if (confirm(message)) cb(); return; }
  confirmCallback = cb;
  if (msgEl) msgEl.textContent = message;
  overlay.classList.add('open');
}

function initConfirmDialog() {
  const overlay = document.getElementById('confirmOverlay');
  const okBtn = document.getElementById('confirmOk');
  const cancelBtn = document.getElementById('confirmCancel');
  if (!overlay) return;
  if (okBtn) okBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    if (confirmCallback) { confirmCallback(); confirmCallback = null; }
  });
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    confirmCallback = null;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav();
  initMobileNav();
  initScrollReveal();
  initFeedbackModal();
  initCarousel('conventionCarousel');
  initAdmissionSlider();
  initContactForm();
  initConfirmDialog();

  const isLogin = document.body.classList.contains('login-page-body');
  const isAdmin = document.body.classList.contains('admin-page-body');

  if (isLogin) initLogin();
  if (isAdmin) initAdmin();
});
