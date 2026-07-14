// Validasi form (login & register). Mengembalikan pesan error (string) atau null bila valid.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  if (!name || !name.trim()) return 'Nama wajib diisi';
  if (name.trim().length < 3) return 'Nama minimal 3 karakter';
  return null;
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email wajib diisi';
  if (!EMAIL_REGEX.test(email.trim())) return 'Format email tidak valid';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password wajib diisi';
  if (password.length < 8) return 'Password minimal 8 karakter';
  return null;
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Konfirmasi password wajib diisi';
  if (password !== confirm) return 'Password tidak cocok';
  return null;
}
