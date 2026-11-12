// ── ROLE-BASED SIGN IN ──
  // ═══════════════════════════════════════════════════════════
  // CLASH DATA (simulated state)
  // ═══════════════════════════════════════════════════════════
  const clashData = {
    1: { id:1, course1:'Computer Networks', course2:'Database Systems Lab', reporter:'Cameron Reed', role:'Lecturer', day:'Monday', time:'13:00 – 15:00', reported:'Feb 5, 2026', status:'pending', note:'' },
    2: { id:2, course1:'Web Development', course2:'Software Engineering', reporter:'Jane Smith', role:'Lecturer', day:'Thursday', time:'14:00 – 16:00', reported:'Feb 6, 2026', status:'pending', note:'' },
    3: { id:3, course1:'Data Structures', course2:'Machine Learning', reporter:'Mike Johnson', role:'Lecturer', day:'Friday', time:'11:00 – 13:00', reported:'Feb 3, 2026', status:'resolved', note:'Room reassigned to Room 210. Schedule adjusted to avoid overlap.' }
  };
  let activeClashId = null;

  // ── SIGN IN ──
  function signIn() {
    const activePage = document.querySelector('.page.active');
    const activeRole = activePage ? activePage.querySelector('.role-btn.active') : null;
    const role = activeRole ? activeRole.textContent.trim() : 'Lecturer';
    goTo(role === 'Student' ? 'page-student-dashboard' : 'page-dashboard');
  }

  // ── NAVIGATION ──
  function goTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const t = document.getElementById(pageId);
    if (t) t.classList.add('active');
    window.scrollTo(0,0);
  }
  function switchPage(pageId) { goTo(pageId); closeAllDropdowns(); }

  // ── ROLE TOGGLE ──
  function setRole(el, role) {
    el.parentElement.querySelectorAll('.role-btn').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  }

  // ── TOAST ──
  function showToast(msg, type='success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const colors = { success:'#00a63e', error:'#e7000b', info:'#3b82f6', warning:'#e17100' };
    toast.style.background = colors[type] || '#00a63e';
    toast.style.color = '#fff';
    const icons = { success:'✓', error:'✗', info:'ℹ', warning:'⚠' };
    toast.innerHTML = (icons[type]||'✓') + ' ' + msg;
    toast.style.display = 'flex';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { toast.style.display = 'none'; }, 3500);
  }

  // ── CLASH: VIEW ──
  function viewClash(id) {
    const c = clashData[id];
    if (!c) return;
    activeClashId = id;
    document.getElementById('view-clash-title').textContent = 'Clash Report #' + id;
    const resolveBtn = document.getElementById('view-clash-resolve-btn');
    if (resolveBtn) resolveBtn.style.display = c.status === 'resolved' ? 'none' : 'inline-flex';
    const badge = c.status === 'resolved'
      ? '<div class="resolved-badge">&#10003; Resolved</div>'
      : '<div class="clash-badge">&#9888; Pending</div>';
    document.getElementById('view-clash-body').innerHTML = badge + [
      ['Clash Type','Schedule Conflict'],
      ['Course 1', c.course1],
      ['Course 2', c.course2],
      ['Reported By', c.reporter + ' (' + c.role + ')'],
      ['Day', c.day],
      ['Time', c.time],
      ['Date Reported', c.reported],
      c.note ? ['Resolution Note', c.note] : null
    ].filter(Boolean).map(([l,v]) =>
      `<div class="detail-row"><span class="detail-label">${l}</span><span class="detail-val">${v}</span></div>`
    ).join('');
    openModal('modal-view-clash');
  }

  // ── CLASH: RESOLVE ──
  function resolveClash(id) {
    activeClashId = id;
    const c = clashData[id];
    if (!c) return;
    document.getElementById('resolve-clash-desc').textContent =
      'Resolve: "' + c.course1 + ' vs ' + c.course2 + '" on ' + c.day + ' at ' + c.time + '?';
    document.getElementById('resolve-note').value = '';
    openModal('modal-resolve-clash');
  }

  function resolveFromView() {
    closeModal('modal-view-clash');
    resolveClash(activeClashId);
  }

  function confirmResolve() {
    const c = clashData[activeClashId];
    if (!c) return;
    c.status = 'resolved';
    c.note = document.getElementById('resolve-note').value.trim() || 'Clash resolved by lecturer.';
    rebuildClashTable();
    closeModal('modal-resolve-clash');
    showToast('Clash #' + activeClashId + ' marked as resolved!', 'success');
  }

  function rebuildClashTable() {
    const tbody = document.querySelector('#page-clashes .clash-table tbody');
    if (!tbody) return;
    const pending = Object.values(clashData).filter(c => c.status === 'pending').length;
    const resolved = Object.values(clashData).filter(c => c.status === 'resolved').length;
    const total = Object.keys(clashData).length;
    // update stat cards
    const vals = document.querySelectorAll('#page-clashes .stat-card');
    if (vals[0]) vals[0].querySelector('.stat-value').textContent = total;
    if (vals[1]) vals[1].querySelector('.stat-value').textContent = pending;
    if (vals[2]) vals[2].querySelector('.stat-value').textContent = resolved;
    // update filter tabs
    const tabs = document.querySelectorAll('#page-clashes .filter-tab');
    if (tabs[0]) tabs[0].textContent = 'All (' + total + ')';
    if (tabs[1]) tabs[1].textContent = 'Pending (' + pending + ')';
    if (tabs[2]) tabs[2].textContent = 'Resolved (' + resolved + ')';
    // rebuild rows
    tbody.innerHTML = Object.values(clashData).map(c => `
      <tr>
        <td><div class="clash-courses">Schedule Clash</div><div class="clash-courses">${c.course1}<span>vs</span>${c.course2}</div></td>
        <td><div style="font-size:14px;font-weight:600;">${c.reporter}</div><span class="tag lecturer">${c.role}</span></td>
        <td><div style="font-size:13px;">${c.day}</div><div style="font-size:13px;color:var(--text-muted);">${c.time}</div></td>
        <td><div style="font-size:13px;">${c.reported}</div></td>
        <td><span class="tag ${c.status === 'resolved' ? 'resolved' : 'pending'}">${c.status === 'resolved' ? 'Resolved' : 'Pending'}</span></td>
        <td><div class="action-btns">
          <button class="btn btn-ghost btn-sm" onclick="viewClash(${c.id})">View</button>
          ${c.status === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="resolveClash(${c.id})">Resolve</button>` : ''}
        </div></td>
      </tr>`).join('');
  }

  // ── TIMETABLE EVENT CLICK ──
  function openEventModal(course, lecturer, room, time, day) {
    document.getElementById('event-modal-title').textContent = course;
    document.getElementById('event-modal-body').innerHTML = [
      ['Course', course], ['Lecturer', lecturer], ['Room', room], ['Time', time], ['Day', day]
    ].map(([l,v]) =>
      `<div class="detail-row"><span class="detail-label">${l}</span><span class="detail-val">${v}</span></div>`
    ).join('');
    openModal('modal-event');
  }

  // ── PROFILE SAVE ──
  function saveProfile() { showToast('Profile saved successfully!', 'success'); }

  // ── EDIT SCHEDULE ──
  function showEditSuccess() {
    closeAllModals();
    showToast('Schedule updated successfully!', 'success');
  }

  // ── STUDENT CLASH SUBMIT ──
  function showClashSuccess() {
    const t = document.getElementById('clash-success-toast');
    if (t) { t.style.display = 'flex'; setTimeout(() => { t.style.display = 'none'; }, 3500); }
    showToast('Clash report submitted! The lecturer has been notified.', 'success');
  }

  // ── PASSWORD TOGGLE ──
  function togglePw(id) {
    const inp = document.getElementById(id);
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
  }

  // ── SEARCH ──
  function openSearch() {
    const el = document.getElementById('search-overlay');
    if (el) { el.classList.add('active'); setTimeout(() => { const i = el.querySelector('input'); if(i) i.focus(); }, 100); }
  }
  function closeSearch(e) {
    const el = document.getElementById('search-overlay');
    if (el && (!e || e.target === el)) el.classList.remove('active');
  }

  // ── MODALS ──
  function openModal(id) { const el = document.getElementById(id); if(el) el.classList.add('active'); }
  function closeModal(id) { const el = document.getElementById(id); if(el) el.classList.remove('active'); }
  function closeModalOverlay(id) { closeModal(id); }
  function closeAllModals() { document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active')); }

  // ── DROPDOWNS ──
  function toggleDropdown(id) {
    const menu = document.getElementById(id);
    if (!menu) return;
    const wasActive = menu.classList.contains('active');
    closeAllDropdowns();
    if (!wasActive) menu.classList.add('active');
  }
  function closeDropdown(id) { const el = document.getElementById(id); if(el) el.classList.remove('active'); }
  function closeAllDropdowns() { document.querySelectorAll('.dropdown-menu.active').forEach(m => m.classList.remove('active')); }

  // ── FILTER TABS ──
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        this.closest('.filter-tabs').querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const txt = this.textContent.toLowerCase();
        document.querySelectorAll('#page-clashes .clash-table tbody tr').forEach(row => {
          const s = (row.querySelector('.tag') || {}).textContent || '';
          row.style.display = txt.includes('all') ? '' : txt.includes(s.toLowerCase()) ? '' : 'none';
        });
      });
    });

    // Clash table search
    const si = document.querySelector('.search-bar input');
    if (si) {
      si.addEventListener('input', function() {
        const q = this.value.toLowerCase();
        document.querySelectorAll('#page-clashes .clash-table tbody tr').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    }
  });

  // ── KEYBOARD ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAllModals(); closeSearch(); closeAllDropdowns(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-wrap')) closeAllDropdowns();
  });