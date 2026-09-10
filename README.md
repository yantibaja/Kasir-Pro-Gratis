# Kasir Pro — Aplikasi Point of Sale

Aplikasi kasir digital (POS) berbasis web, terhubung ke [Supabase](https://supabase.com) sebagai database. Satu file `index.html` (HTML/CSS/JS murni, tanpa proses build) plus skema SQL untuk Supabase.

## Fitur

- **Login berbasis PIN** — akun Pemilik (akses penuh) dan Staf Kasir (akses transaksi)
- **Kasir (POS)** — katalog produk, pencarian & filter kategori, keranjang, diskon, pembayaran Tunai/QRIS/Debit dengan kalkulator kembalian, nomor antrean otomatis
- **Produk & Stok** — CRUD produk dan kategori, potong stok otomatis saat transaksi, peringatan stok menipis
- **Kasbon** — catat piutang pelanggan, jatuh tempo, tandai lunas
- **Karyawan & Absensi** — kelola akun staf, absen masuk otomatis saat login, absen pulang manual
- **Laporan** — omzet, metode pembayaran, riwayat transaksi, ekspor CSV
- **Dasbor** — ringkasan omzet, grafik penjualan 7 hari, produk terlaris

## 1. Menyiapkan database Supabase

1. Buka project Supabase Anda: `https://doferqedtwfbnobhkuxq.supabase.co`
2. Masuk ke **SQL Editor** → **New query**
3. Salin seluruh isi file [`supabase/schema.sql`](supabase/schema.sql), tempel, lalu klik **Run**
4. Ini akan membuat semua tabel (staff, categories, products, customers, kasbon, transactions, transaction_items, attendance), mengaktifkan Row Level Security, dan mengisi beberapa data contoh (2 kategori, 8 produk, 3 akun staf demo)

> ⚠️ **Catatan keamanan.** Aplikasi ini login memakai PIN kustom tersimpan di tabel `staff`, bukan Supabase Auth, sehingga skema SQL mengizinkan akses baca/tulis penuh untuk `anon key`. Ini praktis untuk demo/prototipe dan penggunaan internal dengan jaringan terpercaya, tetapi **siapa pun yang memiliki anon key bisa membaca dan mengubah seluruh data**. Sebelum dipakai untuk data produksi/pelanggan sungguhan, pertimbangkan untuk:
> - Memindahkan operasi tulis (transaksi, update stok) ke **Supabase Edge Function**, atau
> - Mengganti login PIN dengan **Supabase Auth** dan menulis kebijakan RLS berbasis `auth.uid()`.

## 2. Kredensial Supabase

Kredensial berikut sudah tertanam langsung di `index.html` (baris `SUPABASE_URL` dan `SUPABASE_ANON_KEY`):

```
URL Project : https://doferqedtwfbnobhkuxq.supabase.co
Anon Key    : (lihat index.html)
```

Anon key memang didesain untuk berada di sisi klien/browser (dilindungi oleh Row Level Security di atas), jadi aman untuk disertakan dalam kode front-end seperti ini — bukan seperti kunci rahasia (`service_role key`) yang **tidak boleh** pernah dimasukkan ke kode front-end atau repo publik.

## 3. Menjalankan secara lokal

Karena aplikasi memuat modul dari CDN, cukup buka `index.html` langsung di browser, atau jalankan server statis sederhana:

```bash
npx serve .
# atau
python3 -m http.server 8080
```

## 4. Push ke GitHub

```bash
git init
git add .
git commit -m "Kasir Pro: initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<nama-repo>.git
git push -u origin main
```

## 5. Deploy (opsional)

**GitHub Pages**
1. Buka repo di GitHub → **Settings** → **Pages**
2. Source: pilih branch `main`, folder `/ (root)`
3. Simpan — situs akan tersedia di `https://<username>.github.io/<nama-repo>/`

**Netlify / Vercel** — cukup import repo GitHub ini, tidak perlu build command (static site).

## Struktur folder

```
kasir-pro/
├── index.html            # Aplikasi lengkap (HTML/CSS/JS)
├── logo-kasir-pro.png    # Logo — harus sejajar dengan index.html
├── supabase/
│   └── schema.sql        # WAJIB dijalankan di SQL Editor Supabase (lihat langkah 1)
├── README.md
└── .gitignore
```

> **Penting:** mengunggah `supabase/schema.sql` ke GitHub saja **tidak** membuat tabelnya otomatis dibuat. File ini hanya dokumentasi/riwayat perintah — Anda tetap harus menyalin isinya dan menjalankannya secara manual di **Supabase Dashboard → SQL Editor** (langkah 1 di atas). Jika ini belum dilakukan, aplikasi tidak akan bisa login karena tabel `staff` belum ada.

## Akun demo

| Peran   | PIN  |
|---------|------|
| Pemilik | 1234 |
| Kasir   | 0000 |

Tambah/ubah akun lewat menu **Karyawan** di aplikasi (login sebagai Pemilik), atau langsung ubah tabel `staff` di Supabase.
