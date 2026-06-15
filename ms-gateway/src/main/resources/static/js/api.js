const API = {
    USUARIOS: '/api/usuarios',
    ASISTENCIA: '/api/asistencia',
    SUSCRIPCIONES: '/api/suscripciones',
    PAGOS: '/api/pagos'
};

async function get(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error GET ${url}: ${res.status}`);
    return res.json();
}

async function post(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `Error POST ${url}: ${res.status}`);
    }
    return res.json();
}

async function put(url, data) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error PUT ${url}: ${res.status}`);
    return res.json();
}

async function del(url) {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error DELETE ${url}: ${res.status}`);
}

async function patch(url, data) {
    const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error PATCH ${url}: ${res.status}`);
    return res.json();
}
