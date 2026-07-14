import React, { createContext, useContext, useEffect, useState } from 'react';
import { getItem, setItem, removeItem, KEYS } from '../utils/storage';

const AuthContext = createContext(null);

// Akun demo yang di-seed saat pertama kali app dibuka.
const DEMO_USER = {
  name: 'Mahasiswa Demo',
  email: 'demo@kampusmarket.id',
  password: 'demo1234',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // sesi aktif { name, email }
  const [booting, setBooting] = useState(true); // cek sesi saat start (tampilkan splash)

  // Saat app dibuka: seed demo (sekali) + pulihkan sesi tersimpan.
  useEffect(() => {
    (async () => {
      try {
        const seeded = await getItem(KEYS.SEEDED, false);
        if (!seeded) {
          await setItem(KEYS.USERS, [DEMO_USER]);
          await setItem(KEYS.SEEDED, true);
        }
        const session = await getItem(KEYS.SESSION, null);
        if (session) setUser(session);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  // Login lokal: cek email+password terhadap users tersimpan.
  const login = async (email, password) => {
    const users = await getItem(KEYS.USERS, []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Email atau password salah');
    const session = { name: found.name, email: found.email };
    await setItem(KEYS.SESSION, session);
    setUser(session);
    return session;
  };

  // Register lokal: cegah duplikat email -> simpan -> auto-login.
  const register = async ({ name, email, password }) => {
    const users = await getItem(KEYS.USERS, []);
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) throw new Error('Email sudah terdaftar');
    const newUser = { name: name.trim(), email: email.trim(), password };
    await setItem(KEYS.USERS, [...users, newUser]);
    const session = { name: newUser.name, email: newUser.email };
    await setItem(KEYS.SESSION, session);
    setUser(session);
    return session;
  };

  // Login via API DummyJSON (bonus networking pada auth).
  const loginWithApi = async (apiUser) => {
    const session = {
      name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
      email: apiUser.email,
      viaApi: true,
    };
    await setItem(KEYS.SESSION, session);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await removeItem(KEYS.SESSION);
    setUser(null);
  };

  const value = { user, booting, login, register, loginWithApi, logout, isAuthed: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
