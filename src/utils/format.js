// Utilitas format harga & diskon.
// Harga DummyJSON dalam USD; kita konversi ke "rasa Rupiah" agar terasa lokal.
const USD_TO_IDR = 16000;

// Format angka ke Rupiah, mis. 1500000 -> "Rp1.500.000"
export function formatRupiah(amount) {
  const value = Math.round(Number(amount) || 0);
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    // Fallback manual bila Intl tidak tersedia
    const s = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return 'Rp' + s;
  }
}

// Konversi harga USD produk -> Rupiah
export function toIDR(usd) {
  return Math.round((Number(usd) || 0) * USD_TO_IDR);
}

// Harga jual (setelah diskon) dalam Rupiah
export function priceIDR(product) {
  return toIDR(product?.price);
}

// Harga asli sebelum diskon (harga coret) dalam Rupiah
export function originalPriceIDR(product) {
  const pct = Number(product?.discountPercentage) || 0;
  const original = (Number(product?.price) || 0) / (1 - pct / 100);
  return toIDR(original);
}

// Bulatkan persentase diskon
export function discountLabel(product) {
  const pct = Math.round(Number(product?.discountPercentage) || 0);
  return pct > 0 ? `-${pct}%` : null;
}

// Ubah slug kategori "mens-shirts" -> "Mens Shirts"
export function titleCase(text = '') {
  return String(text)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
