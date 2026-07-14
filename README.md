# 🛍️ KampusMarket

Marketplace jual-beli barang bekas mahasiswa — aplikasi mobile yang dibangun dengan **Expo SDK 54** & **React Native**. Proyek UAS Praktikum Pemrograman Mobile.

Tema visual **"Aurora"** (indigo-violet premium): bersih, lapang, dan modern — bukan neo-brutalism.

---

## ✨ Fitur

- **Autentikasi lokal** — Login & Register dengan validasi per-field, sesi persisten (auto-login saat app dibuka ulang), auth gate (belum login → hanya AuthStack). Ada juga **Login via API** (DummyJSON) sebagai bonus.
- **Home kaya** — sapaan pengguna, hero banner promo (gradient), chip kategori, section **Flash Sale** (diskon tertinggi), dan grid "Untuk Kamu" dengan **infinite scroll** + **pull-to-refresh**.
- **Pencarian real-time** — `useDebounce` 350ms, riwayat pencarian tersimpan (bisa dihapus), empty state "tidak ditemukan".
- **Filter & Sort** — bottom-sheet: harga termurah/termahal, rating tertinggi; filter per kategori.
- **Detail produk premium** — carousel gambar (paging + dot indicator), rating & ulasan, harga + badge diskon % + harga coret, stok, deskripsi, QuantityStepper, Tambah ke Keranjang, Beli Sekarang, wishlist, dan **Produk Serupa**.
- **Keranjang fungsional** — ubah qty (+/−), hapus, ringkasan (subtotal, ongkir gratis, total), checkout → animasi sukses → keranjang dikosongkan. Persist.
- **Wishlist** — grid favorit, toggle hati, "pindahkan ke keranjang". Persist.
- **Profil** — kartu profil (avatar inisial gradient, badge "Mahasiswa UIR"), statistik, menu, dan Logout.
- **Toast global**, **haptic feedback**, **skeleton shimmer**, **format Rupiah**, dan **badge cart realtime** di tab bar.

---

## 🧰 Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Expo SDK 54, React Native 0.81, React 19.1 (New Architecture) |
| Bahasa | JavaScript (`.js`) |
| Navigasi | React Navigation v7 (native-stack + bottom-tabs) |
| State | Context API + `useReducer` (cart) |
| Persistensi | AsyncStorage |
| Data | DummyJSON REST API |
| UI | expo-image, expo-linear-gradient, expo-haptics, expo-blur, Plus Jakarta Sans, Ionicons |

---

## 🚀 Cara Menjalankan

```bash
# 1. Masuk ke folder proyek
cd KampusMarket

# 2. Install dependency
npm install

# 3. Jalankan
npx expo start
```

Lalu:
- Pindai QR code dengan **Expo Go** (Android/iOS), atau
- Tekan `a` untuk emulator Android / `i` untuk simulator iOS.

Cek kesehatan dependency: `npx expo-doctor` (harus **18/18 checks passed**).

---

## 🔑 Kredensial Demo

Akun demo di-seed otomatis saat pertama kali app dibuka. Di layar Login, ketuk kotak demo untuk mengisi otomatis.

```
Email    : demo@kampusmarket.id
Password : demo1234
```

**Login via API (bonus)** memakai kredensial DummyJSON `emilys` / `emilyspass` (dipanggil otomatis oleh tombolnya).

---

## 📁 Struktur Folder

```
KampusMarket/
├─ App.js                     # root: font loader + provider + navigation
├─ app.json                   # config (warna splash/adaptive icon sesuai tema)
├─ src/
│  ├─ api/dummyjson.js        # semua fungsi fetch + base URL (try/catch + timeout)
│  ├─ components/             # AppButton, AppInput, ProductCard, CategoryChip,
│  │                          # RatingStars, QuantityStepper, SkeletonCard,
│  │                          # EmptyState, ErrorState, SortSheet
│  ├─ context/                # AuthContext, CartContext (useReducer),
│  │                          # WishlistContext, ToastContext
│  ├─ hooks/                  # useDebounce, useProducts (pagination + state)
│  ├─ navigation/             # RootNavigator (auth gate), AuthStack, MainTabs
│  ├─ screens/
│  │  ├─ auth/                # LoginScreen, RegisterScreen
│  │  ├─ home/                # HomeScreen, SearchScreen, CategoryScreen, ProductDetailScreen
│  │  ├─ profile/             # ProfileScreen, AboutScreen
│  │  ├─ CartScreen.js
│  │  ├─ WishlistScreen.js
│  │  └─ CheckoutSuccessScreen.js
│  ├─ theme/theme.js          # design token "Aurora"
│  └─ utils/                  # validators, format (rupiah/diskon), storage
└─ README.md
```

---

## 🌐 Endpoint API (DummyJSON)

Base URL: `https://dummyjson.com`

```
GET  /products?limit=&skip=
GET  /products/search?q=
GET  /products/categories
GET  /products/category/<slug>
GET  /products/<id>
POST /auth/login              # bonus (emilys / emilyspass)
```

Setiap fetch menangani state **loading (skeleton)** · **sukses** · **kosong** · **gagal + Coba lagi**, dibungkus `try/catch` + timeout agar app tidak crash saat offline.

---

## 📸 Screenshot & Demo

> _Placeholder — tambahkan tangkapan layar setelah menjalankan app._

| Login | Home | Detail | Cart |
|-------|------|--------|------|
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

🎥 **Video demo:** _(tambahkan link video di sini)_

---

## 🎨 Design Token "Aurora"

Semua warna, radius, spacing, tipografi, dan shadow didefinisikan di [`src/theme/theme.js`](src/theme/theme.js) dan dipakai konsisten di seluruh layar (tidak ada nilai hardcode acak). Warna utama `#5B4BF5` (indigo-violet) dengan gradient `#6D5DF6 → #9B8CFA`.

---

_Dibuat dengan 💜 untuk UAS Praktikum Pemrograman Mobile._
