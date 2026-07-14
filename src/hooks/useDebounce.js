import { useEffect, useState } from 'react';

// Menunda perubahan nilai selama `delay` ms.
// Dipakai untuk pencarian real-time agar tidak fetch tiap ketikan (default 350ms).
export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Bersihkan timer bila value berubah sebelum delay habis
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
