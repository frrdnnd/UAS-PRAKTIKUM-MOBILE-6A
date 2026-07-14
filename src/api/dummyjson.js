// Semua fungsi fetch + base URL. Dibungkus try/catch + timeout agar app tak crash.
const BASE_URL = 'https://dummyjson.com';
const TIMEOUT_MS = 12000;

// fetch dengan timeout via AbortController
async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Normalisasi pesan error
    if (e.name === 'AbortError') throw new Error('Koneksi timeout. Coba lagi.');
    throw new Error('Gagal memuat data. Periksa koneksi internet.');
  } finally {
    clearTimeout(timer);
  }
}

// GET /products?limit=&skip=  -> { products, total, skip, limit }
export function getProducts({ limit = 20, skip = 0 } = {}) {
  return request(`/products?limit=${limit}&skip=${skip}`);
}

// GET /products/search?q=
export function searchProducts(q, { limit = 20, skip = 0 } = {}) {
  return request(`/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`);
}

// GET /products/categories -> array of {slug,name,url} (kadang string) -> normalisasi
export async function getCategories() {
  const data = await request('/products/categories');
  return (Array.isArray(data) ? data : []).map((c) =>
    typeof c === 'string'
      ? { slug: c, name: c }
      : { slug: c.slug || c.name || '', name: c.name || c.slug || '' }
  );
}

// GET /products/category/<slug>
export function getProductsByCategory(slug, { limit = 20, skip = 0 } = {}) {
  return request(`/products/category/${slug}?limit=${limit}&skip=${skip}`);
}

// GET /products/<id>
export function getProductById(id) {
  return request(`/products/${id}`);
}

// POST /auth/login (opsional bonus) — pakai fetch langsung karena method POST
export async function apiLogin(username, password) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Kredensial API salah');
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Koneksi timeout. Coba lagi.');
    throw new Error(e.message || 'Login API gagal');
  } finally {
    clearTimeout(timer);
  }
}
