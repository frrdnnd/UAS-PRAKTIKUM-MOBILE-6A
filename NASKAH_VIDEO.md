# 🎬 Naskah Video — Penjelasan Struktur Project KampusMarket

> Cara pakai: buka file explorer / VS Code di samping, tampilkan struktur folder, lalu baca naskah ini sambil menunjuk foldernya satu per satu. Santai saja, seperti ngobrol.

---

## 1. Pembukaan

"Halo, di video ini saya akan menjelaskan struktur project aplikasi **KampusMarket**. KampusMarket ini aplikasi mobile marketplace untuk jual-beli barang bekas mahasiswa, dibuat pakai **React Native** dan **Expo SDK 54**.

Saya nggak akan masuk ke dalam kodingannya biar nggak terlalu lama — kita fokus ke **struktur foldernya** aja: masing-masing folder dan file itu buat apa. Yuk kita mulai dari bagian paling luar."

---

## 2. File di Root (folder paling luar)

"Di folder paling luar ini ada beberapa file penting:

- **`App.js`** — ini pintu masuk utama aplikasi. Di sinilah semua komponen digabung: mulai dari memuat font, memasang semua 'penyimpan data global', sampai memanggil sistem navigasi. Jadi kalau aplikasi dijalankan, file ini yang pertama kali dibaca.

- **`app.json`** — file pengaturan aplikasi. Isinya nama aplikasi, ikon, warna splash screen saat loading, dan konfigurasi lainnya.

- **`package.json`** — daftar semua library atau 'bahan' yang dipakai aplikasi ini, misalnya library navigasi, penyimpanan data, dan lain-lain.

- **`index.js`** — file kecil yang tugasnya mendaftarkan `App.js` sebagai komponen utama. Biasanya nggak perlu diutak-atik.

- **`README.md`** — dokumentasi project: penjelasan aplikasi, fitur, cara menjalankan, sampai akun demo untuk login.

Nah, semua isi aplikasi yang sebenarnya ada di dalam folder **`src`** ini. Kita bahas satu per satu."

---

## 3. Folder `src` — Isi Utama Aplikasi

"Folder `src` ini singkatan dari *source*, artinya sumber kode. Di dalamnya saya pisah-pisah lagi jadi beberapa folder biar rapi dan gampang dicari. Ada `theme`, `utils`, `api`, `hooks`, `context`, `components`, `navigation`, dan `screens`."

---

### 3a. Folder `theme`

"Pertama, folder **`theme`**. Isinya satu file, `theme.js`.

Anggap ini seperti 'buku panduan tampilan' aplikasi. Semua warna, ukuran jarak, ukuran huruf, dan bentuk sudut membulat diatur di sini. Jadi kalau nanti mau ganti warna utama aplikasi, cukup ubah di satu tempat ini, dan seluruh aplikasi ikut berubah. Warna temanya saya kasih nama **'Aurora'**, nuansanya ungu-biru yang bersih dan modern."

---

### 3b. Folder `utils`

"Berikutnya folder **`utils`**, singkatan dari *utilities* atau alat bantu. Isinya fungsi-fungsi kecil yang sering dipakai berulang:

- **`format.js`** — buat mengubah angka jadi format Rupiah, dan menghitung diskon.
- **`validators.js`** — buat mengecek isian form, misalnya email harus valid dan password minimal 8 karakter.
- **`storage.js`** — buat menyimpan data ke memori HP, biar data nggak hilang saat aplikasi ditutup."

---

### 3c. Folder `api`

"Lalu folder **`api`**. Isinya `dummyjson.js`.

Ini bagian yang bertugas **mengambil data dari internet**. Data produk di aplikasi ini diambil dari layanan online bernama DummyJSON. Jadi semua perintah 'ambil daftar produk', 'cari produk', 'ambil detail produk' — semuanya diatur di file ini."

---

### 3d. Folder `hooks`

"Folder **`hooks`** isinya dua file alat bantu khusus:

- **`useProducts.js`** — mengatur pengambilan daftar produk, termasuk fitur *infinite scroll* alias produk yang terus dimuat saat kita scroll ke bawah.
- **`useDebounce.js`** — ini buat fitur pencarian. Fungsinya menunda pencarian sepersekian detik, jadi aplikasi nggak langsung mencari tiap huruf yang diketik. Bikin pencarian lebih ringan dan nggak lag."

---

### 3e. Folder `context`

"Nah, folder **`context`** ini penting. Isinya 'penyimpan data global' — data yang bisa diakses dari layar mana pun:

- **`AuthContext.js`** — mengurus login, logout, dan menyimpan sesi pengguna.
- **`CartContext.js`** — mengurus keranjang belanja: tambah barang, ubah jumlah, hapus.
- **`WishlistContext.js`** — mengurus daftar produk favorit.
- **`ToastContext.js`** — mengurus notifikasi kecil yang muncul di atas layar, misalnya 'Berhasil ditambahkan ke keranjang'.

Jadi kalau kita menambah barang ke keranjang di satu layar, jumlahnya langsung ikut berubah di layar lain juga. Itu karena datanya disimpan terpusat di sini."

---

### 3f. Folder `components`

"Selanjutnya folder **`components`**. Ini isinya 'komponen' — potongan tampilan yang bisa dipakai berulang-ulang di banyak layar, jadi nggak perlu bikin dari nol terus. Contohnya:

- **`AppButton.js`** — tombol serbaguna.
- **`AppInput.js`** — kotak isian untuk form.
- **`ProductCard.js`** — kartu produk yang menampilkan gambar, judul, harga, dan rating.
- **`CategoryChip.js`**, **`RatingStars.js`**, **`QuantityStepper.js`** — chip kategori, bintang rating, dan tombol tambah-kurang jumlah.
- **`SkeletonCard.js`** — tampilan 'kerangka' abu-abu yang muncul saat produk masih loading.
- **`EmptyState.js`** dan **`ErrorState.js`** — tampilan saat data kosong atau saat gagal memuat.
- **`SortSheet.js`** — menu untuk mengurutkan produk berdasarkan harga atau rating.

Jadi misalnya kartu produk ini, dipakai di halaman Home, Wishlist, dan hasil pencarian — semuanya pakai komponen yang sama."

---

### 3g. Folder `navigation`

"Folder **`navigation`** ini yang mengatur **perpindahan antar layar**. Ada tiga file:

- **`RootNavigator.js`** — ini semacam 'gerbang'. Dia yang menentukan: kalau pengguna belum login, tampilkan halaman login; kalau sudah login, tampilkan halaman utama.
- **`AuthStack.js`** — mengatur alur halaman login dan daftar akun.
- **`MainTabs.js`** — mengatur menu tab di bagian bawah: Beranda, Wishlist, Keranjang, dan Profil. Termasuk angka kecil di ikon keranjang yang menunjukkan jumlah barang."

---

### 3h. Folder `screens`

"Terakhir dan yang paling banyak isinya, folder **`screens`**. Ini isinya semua **halaman** yang dilihat pengguna. Saya kelompokkan lagi biar rapi:

Di dalam folder **`auth`**:
- **`LoginScreen.js`** — halaman masuk.
- **`RegisterScreen.js`** — halaman daftar akun baru.

Di dalam folder **`home`**:
- **`HomeScreen.js`** — halaman utama dengan banner promo, kategori, flash sale, dan daftar produk.
- **`SearchScreen.js`** — halaman pencarian produk.
- **`CategoryScreen.js`** — halaman yang menampilkan produk per kategori.
- **`ProductDetailScreen.js`** — halaman detail produk lengkap dengan foto, harga, deskripsi, dan tombol beli.

Di dalam folder **`profile`**:
- **`ProfileScreen.js`** — halaman profil pengguna.
- **`AboutScreen.js`** — halaman 'Tentang Aplikasi'.

Lalu ada beberapa halaman di luar sub-folder:
- **`CartScreen.js`** — halaman keranjang belanja.
- **`WishlistScreen.js`** — halaman produk favorit.
- **`CheckoutSuccessScreen.js`** — halaman yang muncul setelah checkout berhasil, dengan animasi centang."

---

## 4. Penutup

"Jadi itu tadi struktur project KampusMarket. Intinya, semuanya saya susun **terpisah berdasarkan fungsinya**: tampilan di folder `components`, halaman di folder `screens`, data global di folder `context`, pengaturan tampilan di folder `theme`, dan seterusnya.

Tujuannya biar kodenya **rapi, gampang dicari, dan gampang dikembangkan**. Kalau mau memperbaiki satu bagian, kita tinggal buka folder yang sesuai, nggak perlu bingung nyari.

Sekian penjelasan struktur project-nya. Di video selanjutnya kita akan lihat langsung aplikasinya berjalan. Terima kasih!"

---

### 💡 Tips saat rekaman
- Buka **VS Code** dan lebarkan panel Explorer di kiri supaya struktur folder kelihatan jelas.
- Klik folder satu per satu sambil menjelaskan, biar penonton bisa mengikuti.
- Bicara santai, nggak usah buru-buru. Perkiraan durasi: **4–6 menit**.
- Kalau mau lebih singkat, cukup baca bagian **judul folder + kalimat pertama** tiap bagian.
