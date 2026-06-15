window.GW = window.GW || {};

GW.toast = function (message, type = 'info') {
    const stack = document.getElementById('toastStack');
    if (!stack) { alert(message); return; }
    const el = document.createElement('div');
    el.className = 'gw-toast ' + type;
    const icon = type === 'success' ? 'check-circle-fill'
               : type === 'error'   ? 'x-circle-fill'
               :                       'info-circle-fill';
    el.innerHTML = `<i class="bi bi-${icon}"></i><span>${message}</span>`;
    stack.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; }, 2800);
    setTimeout(() => el.remove(), 3200);
};

GW.modal = function ({ title, body, primaryText = 'Guardar', onPrimary }) {
    const wrap = document.createElement('div');
    wrap.className = 'gw-modal-backdrop open';
    wrap.innerHTML = `
        <div class="gw-modal">
            <div class="gw-modal-head">
                <h3>${title}</h3>
                <button type="button" class="gw-close" data-close><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="gw-modal-body">${body}</div>
            <div class="gw-modal-foot">
                <button type="button" class="gw-btn ghost" data-close>Cancelar</button>
                <button type="button" class="gw-btn primary" data-primary>${primaryText}</button>
            </div>
        </div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
    wrap.addEventListener('click', e => { if (e.target === wrap) close(); });
    const primaryBtn = wrap.querySelector('[data-primary]');
    primaryBtn.addEventListener('click', async () => {
        try {
            primaryBtn.disabled = true;
            primaryBtn.textContent = 'Procesando...';
            await onPrimary(wrap, close);
        } catch (e) {
            GW.toast(e.message || 'Error', 'error');
            primaryBtn.disabled = false;
            primaryBtn.textContent = primaryText;
        }
    });
    return { wrap, close };
};

GW.fmtDate = function (iso) {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleDateString('es-CL'); } catch { return iso; }
};
GW.fmtDateTime = function (iso) {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleString('es-CL'); } catch { return iso; }
};
GW.fmtMoney = function (n) {
    if (n == null) return '-';
    return '$' + Number(n).toLocaleString('es-CL');
};
