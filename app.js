// ========== DARK MODE ==========
const ROOT = document.documentElement;
const STORED_THEME = localStorage.getItem('aurora-theme') || 'light';
ROOT.setAttribute('data-theme', STORED_THEME);
updateModeToggle(STORED_THEME);

function toggleTheme() {
  const current = ROOT.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  ROOT.setAttribute('data-theme', next);
  localStorage.setItem('aurora-theme', next);
  updateModeToggle(next);
}

function updateModeToggle(theme) {
  const isDark = theme === 'dark';
  const icon = isDark ? '🌙' : '☀️';
  const label = isDark ? 'Mod luminos' : 'Mod întunecat';
  const el = document.getElementById('modeToggle');
  const sidebar = document.getElementById('sidebarModeToggle');
  const sidebarIcon = document.getElementById('sidebarModeIcon');
  const sidebarLabel = document.getElementById('sidebarModeLabel');
  if (el) el.textContent = icon;
  if (sidebarIcon) sidebarIcon.textContent = icon;
  if (sidebarLabel) sidebarLabel.textContent = label;
}

document.getElementById('modeToggle').addEventListener('click', toggleTheme);
const sidebarToggle = document.getElementById('sidebarModeToggle');
if (sidebarToggle) sidebarToggle.addEventListener('click', toggleTheme);

// ========== DATA ==========
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const TOMORROW = new Date(TODAY);
TOMORROW.setDate(TOMORROW.getDate() + 1);

function isoDate(d) { return d.toISOString().split('T')[0]; }
function fmtDate(d) { return d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' }); }
function fmtDateShort(d) { return d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' }); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

let SALON = 'Salon Aurora';

// ========== SETTINGS ==========
const SETTINGS_KEY = 'aurora-settings';
let salonSettings = {
  salonName:  'Salon Aurora',
  ownerName:  'Maria',
  phone:      '0722 123 456',
  address:    'Strada Florilor 12, București',
  googleLink: 'https://g.page/r/salon-aurora',
};

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) { try { salonSettings = { ...salonSettings, ...JSON.parse(saved) }; } catch(e) {} }
  applySettings();
}

function applySettings() {
  SALON = salonSettings.salonName;

  // Greeting
  const ownerEl = document.getElementById('ownerName');
  if (ownerEl) ownerEl.textContent = salonSettings.ownerName;

  // Sidebar user card
  const sidebarName = document.getElementById('sidebarUserName');
  if (sidebarName) sidebarName.textContent = salonSettings.ownerName;
  const sidebarRole = document.getElementById('sidebarUserRole');
  if (sidebarRole) sidebarRole.textContent = salonSettings.salonName + ' · Premium';
  const sidebarAv = document.getElementById('sidebarAvatar');
  if (sidebarAv) {
    const parts = salonSettings.ownerName.trim().split(' ');
    sidebarAv.textContent = parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : salonSettings.ownerName.substring(0, 2).toUpperCase();
  }

  // Topbar subtitle on mobile (show salon name under app name)
  const topbarSub = document.getElementById('topbarSub');
  if (topbarSub) topbarSub.textContent = salonSettings.salonName;

  // Form inputs in Settings
  const sName  = document.getElementById('s_name');   if (sName)   sName.value   = salonSettings.salonName;
  const sOwner = document.getElementById('s_owner');  if (sOwner)  sOwner.value  = salonSettings.ownerName;
  const sPhone = document.getElementById('s_phone');  if (sPhone)  sPhone.value  = salonSettings.phone;
  const sAddr  = document.getElementById('s_address');if (sAddr)   sAddr.value   = salonSettings.address;
  const sGoogle= document.getElementById('s_google'); if (sGoogle) sGoogle.value = salonSettings.googleLink;
}

function saveSettings() {
  const v = (id) => (document.getElementById(id)?.value.trim() || '');
  salonSettings.salonName  = v('s_name')    || salonSettings.salonName;
  salonSettings.ownerName  = v('s_owner')   || salonSettings.ownerName;
  salonSettings.phone      = v('s_phone')   || salonSettings.phone;
  salonSettings.address    = v('s_address') || salonSettings.address;
  salonSettings.googleLink = v('s_google')  || salonSettings.googleLink;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(salonSettings));
  applySettings();
  showToast('Setări salvate ✓');
}

const appointments = [
  { id:1, name:'Maria Ionescu',      phone:'0722 100 200', service:'Vopsit + Tunsoare',        date:isoDate(TOMORROW), time:'09:00', duration:90,  price:280, deposit:80,  status:'confirmed',    newClient:false, previousNoShow:false, visits:14, totalSpent:3820, lastVisit:'12 apr 2026' },
  { id:2, name:'Elena Popescu',      phone:'0731 200 300', service:'Highlights',               date:isoDate(TOMORROW), time:'10:45', duration:120, price:420, deposit:120, status:'pending',      newClient:false, previousNoShow:false, visits:8,  totalSpent:2940, lastVisit:'08 apr 2026' },
  { id:3, name:'Andreea Dumitrescu', phone:'0744 300 400', service:'Manichiură + Pedichiură',  date:isoDate(TOMORROW), time:'12:00', duration:60,  price:150, deposit:0,   status:'risk',         newClient:false, previousNoShow:true,  visits:3,  totalSpent:420,  lastVisit:'02 mar 2026' },
  { id:4, name:'Raluca Niculescu',   phone:'0756 400 500', service:'Keratină',                 date:isoDate(TOMORROW), time:'13:30', duration:150, price:580, deposit:150, status:'pending',      newClient:true,  previousNoShow:false, visits:0,  totalSpent:0,    lastVisit:'—' },
  { id:5, name:'Ioana Munteanu',     phone:'0768 500 600', service:'Tuns + Coafat',            date:isoDate(TOMORROW), time:'15:30', duration:75,  price:200, deposit:60,  status:'deposit_paid', newClient:false, previousNoShow:false, visits:22, totalSpent:5840, lastVisit:'30 apr 2026' },
  { id:6, name:'Cristina Vasilescu', phone:'0712 600 700', service:'Vopsit complet',           date:isoDate(TOMORROW), time:'17:00', duration:120, price:350, deposit:100, status:'pending',      newClient:false, previousNoShow:false, visits:11, totalSpent:3120, lastVisit:'15 apr 2026' },
];

const clients = [
  { name:'Ioana Munteanu',     phone:'0768 500 600', visits:22, totalSpent:5840, last:'30 apr 2026', daysSince:22, vip:true,  status:'active',   color:'#5b7a4f' },
  { name:'Maria Ionescu',      phone:'0722 100 200', visits:14, totalSpent:3820, last:'12 apr 2026', daysSince:40, vip:true,  status:'active',   color:'#b8593f' },
  { name:'Cristina Vasilescu', phone:'0712 600 700', visits:11, totalSpent:3120, last:'15 apr 2026', daysSince:37, vip:false, status:'active',   color:'#a07a2c' },
  { name:'Elena Popescu',      phone:'0731 200 300', visits:8,  totalSpent:2940, last:'08 apr 2026', daysSince:44, vip:false, status:'active',   color:'#c47878' },
  { name:'Diana Mihalcea',     phone:'0789 700 800', visits:6,  totalSpent:2100, last:'18 mar 2026', daysSince:65, vip:false, status:'inactive', color:'#5b7a4f' },
  { name:'Roxana Stoian',      phone:'0721 800 900', visits:5,  totalSpent:1640, last:'22 mar 2026', daysSince:61, vip:false, status:'inactive', color:'#b8593f' },
  { name:'Andreea Dumitrescu', phone:'0744 300 400', visits:3,  totalSpent:420,  last:'02 mar 2026', daysSince:81, vip:false, status:'inactive', color:'#a07a2c' },
  { name:'Raluca Niculescu',   phone:'0756 400 500', visits:0,  totalSpent:0,    last:'—',           daysSince:0,  vip:false, status:'new',      color:'#c47878' },
];

const msgHistory = {
  1: [
    { time:'ieri 18:30', text:'Mesaj de confirmare trimis', type:'sent' },
    { time:'ieri 19:14', text:'Maria a răspuns: "Confirm! Mulțumesc."', type:'received' },
    { time:'azi 10:00',  text:'Status actualizat: Confirmat ✓', type:'system' },
  ],
  2: [
    { time:'azi 10:00', text:'Mesaj de confirmare trimis', type:'sent' },
    { time:'azi 14:30', text:'Aurora: fără răspuns. Follow-up programat 20:00.', type:'system' },
  ],
};

// ========== STATE ==========
let activeView = 'dashboard';
let activeFilter = 'all';

// ========== HELPERS ==========
function initials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function riskLevel(a) {
  let score = 0;
  if (a.previousNoShow) score += 3;
  if (a.newClient) score += 1;
  if (a.price >= 300) score += 2;
  if (a.duration >= 90) score += 1;
  if (a.status === 'no_answer') score += 2;
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

const STATUS = {
  confirmed:         { label:'Confirmat',     cls:'tag-green'  },
  pending:           { label:'Neconfirmat',   cls:'tag-orange' },
  risk:              { label:'Risc ridicat',  cls:'tag-red'    },
  deposit_requested: { label:'Avans cerut',   cls:'tag-orange' },
  deposit_paid:      { label:'Avans plătit',  cls:'tag-green'  },
  no_answer:         { label:'Fără răspuns',  cls:'tag-muted'  },
};

function genMessage(a) {
  const fn = a.name.split(' ')[0];
  const d = new Date(a.date).toLocaleDateString('ro-RO', { day:'numeric', month:'long' });
  if (a.price >= 300 || a.previousNoShow) {
    return `Bună, ${fn}! Pentru programarea de ${d} la ${a.time} (${a.service}) am nevoie de un avans de ${a.deposit} lei ca să rezerv intervalul. Se scade din prețul final. Îți trimit detalii de plată? 💛`;
  }
  return `Bună, ${fn}! 😊 Confirmăm programarea ta de mâine la ${SALON}: ${a.time} — ${a.service} (≈${a.duration} min). Răspunde cu DA dacă vii, sau anunță-mă dacă nu mai poți. Te aștept! ✂️`;
}

function waUrl(a, msg) {
  const num = a.phone.replace(/\D/g, '');
  const full = num.startsWith('0') ? '40' + num.slice(1) : num;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}

// ========== HERO CTA ==========
function renderHeroCta() {
  const pending = appointments.filter(a =>
    (a.status === 'pending' || a.status === 'risk') && a.date === isoDate(TOMORROW)
  );
  const cta = document.getElementById('heroCta');
  if (!cta) return;

  if (pending.length === 0) {
    cta.innerHTML = `
      <div class="hero-saved">
        <div class="hero-saved-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <div class="hero-saved-title">Toate confirmate ✓</div>
          <div class="hero-saved-sub">Toate programările de mâine au răspuns. Bine lucrat!</div>
        </div>
      </div>`;
    return;
  }

  cta.innerHTML = `
    <div class="hero-card">
      <div class="hero-eyebrow">🔔 Acțiune necesară</div>
      <div class="hero-title">${pending.length} programări neconfirmate pentru mâine</div>
      <div class="hero-sub">Trimite confirmările acum și evită neprezentările. Estimat: 5 min.</div>
      <button class="hero-btn" onclick="sendAllUnconfirmed()">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.7 1 3.7 1.5 5.7 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0"/></svg>
        Trimite ${pending.length} pe WhatsApp →
      </button>
    </div>`;
}

// ========== RENDER APPOINTMENTS ==========
function apptCardHTML(a) {
  const risk = riskLevel(a);
  const s = STATUS[a.status] || STATUS.pending;
  const tags = [`<span class="tag ${s.cls}">${s.label}</span>`];
  if (a.newClient) tags.push('<span class="tag tag-blue">Client nou</span>');
  if (a.previousNoShow) tags.push('<span class="tag tag-red">A mai lipsit</span>');
  if (a.deposit > 0 && a.status !== 'deposit_paid' && (a.price >= 300 || a.previousNoShow)) {
    tags.push(`<span class="tag tag-orange">Avans ${a.deposit} lei</span>`);
  }

  return `
    <div class="appt-item" data-risk="${risk}" data-id="${a.id}" onclick="openClientDetail(${a.id}, event)">
      <div class="appt-time-block">
        <div class="appt-hour">${a.time}</div>
        <div class="appt-dur">${a.duration}′</div>
      </div>
      <div class="appt-info">
        <div class="appt-name">${a.name}</div>
        <div class="appt-svc">${a.service} · ${a.phone}</div>
        <div class="appt-tags">${tags.join('')}</div>
      </div>
      <div class="appt-right">
        <div>
          <div class="appt-price-big">${a.price} lei</div>
          ${a.deposit > 0 ? `<div class="appt-deposit-label">avans ${a.deposit}</div>` : ''}
        </div>
        <div class="appt-actions">
          <button class="appt-btn wa" onclick="event.stopPropagation(); openWhatsApp(${a.id})" title="Trimite WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.7 1 3.7 1.5 5.7 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0"/></svg>
          </button>
          <button class="appt-btn check" onclick="event.stopPropagation(); markStatus(${a.id}, 'confirmed')" title="Marchează confirmat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>
    </div>`;
}

function renderAppointments(targetId, filterFn) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const filtered = appointments.filter(filterFn);
  if (filtered.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-title">Nicio programare</div><div class="empty-sub">Nu există programări în această categorie</div></div>`;
    return;
  }
  el.innerHTML = filtered.map(apptCardHTML).join('');
}

function renderDashboard() {
  const fns = {
    all:     a => a.date === isoDate(TOMORROW),
    pending: a => a.date === isoDate(TOMORROW) && (a.status === 'pending' || a.status === 'risk'),
    risk:    a => a.date === isoDate(TOMORROW) && riskLevel(a) === 'high',
  };
  renderAppointments('apptList', fns[activeFilter] || fns.all);
  renderHeroCta();
  updateApptBadge();
}

function renderAllAppts() {
  const fns = {
    all:       () => true,
    today:     a => a.date === isoDate(TODAY),
    tomorrow:  a => a.date === isoDate(TOMORROW),
    pending:   a => a.status === 'pending',
    risk:      a => riskLevel(a) === 'high',
    deposit:   a => a.deposit > 0 && a.status !== 'deposit_paid',
    confirmed: a => a.status === 'confirmed' || a.status === 'deposit_paid',
  };
  renderAppointments('apptListFull', fns[activeFilter] || fns.all);
}

function updateApptBadge() {
  const count = appointments.filter(a =>
    (a.status === 'pending' || a.status === 'risk') && a.date === isoDate(TOMORROW)
  ).length;
  const dot = document.getElementById('apptDot');
  const badge = document.getElementById('sidebarBadge');
  if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  if (badge) badge.textContent = count;
}

// ========== TOP CLIENTS ==========
function renderTopClients() {
  const el = document.getElementById('topClients');
  if (!el) return;
  el.innerHTML = clients.slice(0, 4).map(c => `
    <div class="client-item" onclick="openClientByName('${c.name}')">
      <div class="client-avatar" style="background:linear-gradient(135deg,${c.color},${c.color}bb);">${initials(c.name)}</div>
      <div class="client-info">
        <div class="client-name">${c.name}${c.vip ? ' <span style="font-size:11px;color:var(--orange);font-weight:700;">⭐ VIP</span>' : ''}</div>
        <div class="client-meta">${c.visits} vizite · ${c.totalSpent.toLocaleString('ro-RO')} lei</div>
      </div>
    </div>`).join('');
}

function renderAllClients(filterKey) {
  const el = document.getElementById('clientList');
  if (!el) return;
  let list = clients;
  if (filterKey === 'vip') list = clients.filter(c => c.vip);
  else if (filterKey === 'inactive') list = clients.filter(c => c.status === 'inactive');

  if (list.length === 0) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-title">Nicio clientă</div><div class="empty-sub">Nu există clienți în această categorie</div></div>';
    return;
  }

  el.innerHTML = list.map(c => {
    const statusTag = c.status === 'inactive'
      ? `<span class="tag tag-red">Inactiv ${c.daysSince}z</span>`
      : c.status === 'new' ? '<span class="tag tag-blue">Nou</span>'
      : '<span class="tag tag-green">Activ</span>';
    return `
      <div class="client-item" onclick="openClientByName('${c.name}')">
        <div class="client-avatar" style="background:linear-gradient(135deg,${c.color},${c.color}bb);">${initials(c.name)}</div>
        <div class="client-info">
          <div class="client-name">${c.name}${c.vip ? ' <span style="font-size:11px;color:var(--orange);font-weight:700;">⭐</span>' : ''}</div>
          <div class="client-meta">${c.visits} vizite · ultima: ${c.last}</div>
        </div>
        <div class="client-right">${statusTag}</div>
      </div>`;
  }).join('');
}

function filterClients(q) {
  const el = document.getElementById('clientList');
  if (!el) return;
  el.querySelectorAll('.client-item').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q.toLowerCase()) ? '' : 'none';
  });
}

// ========== REVENUE BARS ==========
function renderRevenue() {
  const vals = [820, 1150, 980, 1420, 1680, 1310, 1090];
  const max = Math.max(...vals);
  const el = document.getElementById('revenueBars');
  if (!el) return;
  el.innerHTML = vals.map(v =>
    `<div class="revenue-bar${v > max * 0.7 ? ' high' : ''}" style="height:${(v/max)*100}%" title="${v} lei"></div>`
  ).join('');
}

// ========== ANALYTICS CHART ==========
function renderChart() {
  const path = document.getElementById('linePath');
  const area = document.getElementById('lineArea');
  if (!path) return;
  const data = [620,580,720,810,650,890,920,780,1020,1150,980,1080,1240,1100,1320,1180,1420,1380,1280,1480,1620,1540,1450,1680,1580,1720,1660,1820,1750,1900];
  const w = 600, h = 180, pad = 16;
  const max = Math.max(...data);
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - 2 * pad),
    h - pad - (v / max) * (h - 2 * pad)
  ]);
  const d = 'M ' + pts.map(p => p.join(',')).join(' L ');
  path.setAttribute('d', d);
  area.setAttribute('d', d + ` L ${pts[pts.length-1][0]},${h-pad} L ${pts[0][0]},${h-pad} Z`);
}

// ========== NAVIGATION ==========
function switchView(view) {
  activeView = view;
  activeFilter = 'all';

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');

  document.querySelectorAll('.nav-tab, .sidebar-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === view);
  });

  document.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.f === 'all');
  });

  if (view === 'dashboard')    renderDashboard();
  if (view === 'appointments') renderAllAppts();
  if (view === 'clients')      renderAllClients('all');
  if (view === 'analytics')    setTimeout(renderChart, 60);

  window.scrollTo({ top: 0, behavior: 'instant' });
  closeDetail();
}

document.querySelectorAll('.nav-tab, .sidebar-item').forEach(n => {
  if (n.dataset.view) n.addEventListener('click', () => switchView(n.dataset.view));
});

// ========== FILTER PILLS ==========
document.querySelectorAll('.filter-row').forEach(row => {
  row.addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill || !pill.dataset.f) return;
    row.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.f;

    if (activeView === 'dashboard')    renderDashboard();
    if (activeView === 'appointments') renderAllAppts();
    if (activeView === 'clients')      renderAllClients(pill.dataset.f);
  });
});

// ========== TABS ==========
document.querySelectorAll('.tabs-row').forEach(group => {
  group.addEventListener('click', e => {
    const tab = e.target.closest('.tab-btn');
    if (!tab) return;
    group.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ========== MODALS ==========
function openModal(name) {
  const el = document.getElementById('overlay-' + name);
  if (!el) return;
  el.classList.add('show');
  if (name === 'addAppt') {
    document.getElementById('f_date').value = isoDate(TOMORROW);
  }
}

function closeModal() {
  document.querySelectorAll('.overlay').forEach(o => o.classList.remove('show'));
}

document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o) closeModal(); });
});

// ========== SAVE APPOINTMENT ==========
function saveAppt() {
  const name    = document.getElementById('f_name').value.trim();
  const phone   = document.getElementById('f_phone').value.trim();
  const service = document.getElementById('f_service').value;
  const date    = document.getElementById('f_date').value;
  const time    = document.getElementById('f_time').value;

  if (!name || !phone || !date) { showToast('Completează câmpurile obligatorii'); return; }

  const a = {
    id: Date.now(),
    name, phone, service, date, time,
    duration:        parseInt(document.getElementById('f_dur').value) || 60,
    price:           parseInt(document.getElementById('f_price').value) || 150,
    deposit:         parseInt(document.getElementById('f_deposit').value) || 0,
    status:          'pending',
    newClient:       document.getElementById('f_new').checked,
    previousNoShow:  document.getElementById('f_noshow').checked,
    visits: 0, totalSpent: 0, lastVisit: '—'
  };

  appointments.push(a);
  appointments.sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));

  // Adaugă clientul în lista de clienți dacă nu există deja
  const AVATAR_COLORS = ['#5b7a4f','#b8593f','#a07a2c','#c47878','#4f7a7a','#7a4f6a'];
  if (!clients.find(c => c.name === name)) {
    clients.push({
      name, phone,
      visits: 0, totalSpent: 0,
      last: '—', daysSince: 0,
      vip: false,
      status: a.newClient ? 'new' : 'active',
      color: AVATAR_COLORS[clients.length % AVATAR_COLORS.length]
    });
  }

  closeModal();
  if (activeView === 'dashboard')    renderDashboard();
  if (activeView === 'appointments') renderAllAppts();
  if (activeView === 'clients')      renderAllClients('all');
  renderTopClients();
  updateApptBadge();
  showToast('Programare adăugată ✓');
}

// ========== WHATSAPP ==========
function openWhatsApp(id) {
  const a = appointments.find(x => x.id === id);
  if (!a) return;
  const msg = genMessage(a);
  document.getElementById('waTitle').textContent = a.name;
  document.getElementById('waSub').textContent   = `${a.time} · ${a.service} · ${a.phone}`;
  document.getElementById('waMessage').textContent = msg;

  const link = document.getElementById('waLink');
  link.href = waUrl(a, msg);
  link.onclick = () => {
    setTimeout(() => {
      if (a.status === 'pending') a.status = 'no_answer';
      closeModal();
      if (activeView === 'dashboard')    renderDashboard();
      if (activeView === 'appointments') renderAllAppts();
      showToast('Mesaj deschis în WhatsApp ✓');
    }, 400);
  };
  openModal('wa');
}

function markStatus(id, status) {
  const a = appointments.find(x => x.id === id);
  if (!a) return;
  a.status = status;
  if (activeView === 'dashboard')    renderDashboard();
  if (activeView === 'appointments') renderAllAppts();
  showToast(status === 'confirmed' ? '✓ Marcat confirmat' : 'Status actualizat');
}

function sendAllUnconfirmed() {
  const list = appointments.filter(a =>
    (a.status === 'pending' || a.status === 'risk') && a.date === isoDate(TOMORROW)
  );
  if (list.length === 0) { showToast('Toate programările sunt deja confirmate ✓'); return; }

  showToast(`Se deschid ${list.length} conversații WhatsApp…`);
  list.forEach((a, i) => {
    setTimeout(() => {
      window.open(waUrl(a, genMessage(a)), '_blank');
      a.status = 'no_answer';
      if (i === list.length - 1) {
        if (activeView === 'dashboard')    renderDashboard();
        if (activeView === 'appointments') renderAllAppts();
        showToast('Toate mesajele au fost deschise ✓');
      }
    }, i * 750);
  });
}

// ========== CLIENT DETAIL ==========
function openClientDetail(id, e) {
  if (e && (e.target.closest('button') || e.target.closest('a'))) return;
  const a = appointments.find(x => x.id === id);
  if (!a) return;
  showDetail(a);
}

function openClientByName(name) {
  const c = clients.find(x => x.name === name);
  if (!c) return;
  const appt = appointments.find(a => a.name === name);
  showDetail(appt || { name: c.name, phone: c.phone, visits: c.visits, totalSpent: c.totalSpent, lastVisit: c.last, _clientOnly: true });
}

function showDetail(a) {
  const panel   = document.getElementById('detailPanel');
  const content = document.getElementById('detailContent');
  const body    = document.getElementById('detailBody');
  const ptitle  = document.getElementById('detailPanelTitle');

  const colors  = ['#5b7a4f','#b8593f','#a07a2c','#c47878'];
  const col     = colors[(a.id || 1) % 4];

  document.getElementById('detailPanelTitle').textContent = a.name || 'Client';

  content.innerHTML = `
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:16px;">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${col},${col}cc);display:grid;place-items:center;color:white;font-size:20px;font-weight:800;letter-spacing:-0.5px;flex-shrink:0;">
        ${initials(a.name)}
      </div>
      <div>
        <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;">${a.name}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:2px;">${a.phone || ''}</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-wa btn-sm" onclick="openWhatsApp(${a.id || 0})">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.3-1.6c1.7 1 3.7 1.5 5.7 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0"/></svg>
        WhatsApp
      </button>
      <a class="btn btn-secondary btn-sm" href="tel:${a.phone}">📞 Sună</a>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Editare disponibilă în curând')">✏️ Editează</button>
    </div>`;

  const visits = a.visits || 0;
  const spent  = a.totalSpent || 0;
  const avg    = visits > 0 ? Math.round(spent / visits) : 0;
  const last   = a.lastVisit || '—';

  body.innerHTML = `
    ${(!a._clientOnly && a.id) ? `
      <div class="detail-section">
        <div class="detail-section-label">Programarea curentă</div>
        <div style="background:var(--surface-2);border-radius:var(--r);padding:14px;">
          <div style="font-size:15px;font-weight:700;">${a.service || ''}</div>
          <div style="font-size:13px;color:var(--muted);margin-top:3px;">${fmtDateShort(new Date(a.date))} · ${a.time} · ${a.duration} min</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
            <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;">${a.price} lei</div>
            ${a.deposit ? `<span class="tag tag-orange">Avans ${a.deposit} lei</span>` : ''}
          </div>
        </div>
      </div>` : ''}

    <div class="detail-section">
      <div class="detail-section-label">Statistici clientă</div>
      <div class="detail-row"><span class="detail-row-label">Total vizite</span><span class="detail-row-val">${visits}</span></div>
      <div class="detail-row"><span class="detail-row-label">Bani cheltuiți</span><span class="detail-row-val">${spent.toLocaleString('ro-RO')} lei</span></div>
      <div class="detail-row"><span class="detail-row-label">Valoare medie / vizită</span><span class="detail-row-val">${avg} lei</span></div>
      <div class="detail-row"><span class="detail-row-label">Ultima vizită</span><span class="detail-row-val">${last}</span></div>
      <div class="detail-row"><span class="detail-row-label">Neprezentări istorice</span>
        <span class="detail-row-val" style="color:${a.previousNoShow ? 'var(--red)' : 'var(--green)'}">
          ${a.previousNoShow ? '⚠️ 1 neprezentare' : '✓ Niciuna'}
        </span>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-label">Comunicări recente</div>
      ${(msgHistory[a.id] || [
        { time:'15 apr', text:'Mesaj de confirmare trimis', type:'sent' },
        { time:'15 apr', text:'A confirmat: "DA, vin! Mulțumesc."', type:'received' },
        { time:'12 mar', text:'Reminder întreținere trimis', type:'sent' },
      ]).map(h => `
        <div class="history-item">
          <div class="history-dot${h.type === 'received' ? ' orange' : h.type === 'system' ? ' red' : ''}"></div>
          <div>
            <div class="history-text">${h.text}</div>
            <div class="history-time">${h.time}</div>
          </div>
        </div>`).join('')}
    </div>

    <div class="detail-section">
      <div class="detail-section-label">Servicii preferate</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <span class="tag tag-accent">Vopsit (8x)</span>
        <span class="tag tag-blue">Tuns (5x)</span>
        <span class="tag tag-orange">Coafat (2x)</span>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-label">Recomandare Aurora</div>
      <div style="background:var(--orange-bg);border:0.5px solid rgba(255,149,0,0.2);border-radius:var(--r);padding:12px;font-size:13px;line-height:1.5;color:var(--ink-2);">
        💡 Această clientă revine la ~5 săptămâni pentru vopsit. Ultima vizită a fost acum ${(() => { const c = clients.find(x => x.name === a.name); return c ? c.daysSince : (visits > 0 ? 35 : 0); })()} zile. Programează un reminder proactiv.
      </div>
    </div>`;

  panel.classList.add('show');
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('show');
}

// ========== TOAST ==========
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ========== INIT ==========
(function init() {
  // Set date labels
  document.getElementById('dateLabel').textContent = capitalize(fmtDate(TODAY));
  document.getElementById('tomorrowLabel').textContent =
    `${capitalize(fmtDate(TOMORROW))} · ${appointments.length} programări`;

  loadSettings();
  renderDashboard();
  renderTopClients();
  renderRevenue();
  updateApptBadge();
})();
