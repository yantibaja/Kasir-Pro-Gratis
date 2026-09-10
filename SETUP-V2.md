# Kasir Pro v2 — Setup Guide

## 🎯 Fitur Baru

✨ **Login System Upgrade:**
- ❌ Lepas dari PIN login
- ✅ Email + Password untuk owner/admin
- ✅ Invite system: Admin bisa invite kasir via link
- ✅ Kasir self-register via invite link
- ✅ Modern UI dengan design professional

📊 **Architecture:**
- Admin (Owner): Full access ke semua menu
- Kasir: Terbatas menu (Kasir, Kasbon, Absensi)
- Multi-device sync via Supabase

---

## ⚡ Setup dalam 3 Langkah

### Step 1: Database Setup (2 menit)

**Buka Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Pilih project Kasir Pro Anda
3. Pergi ke **SQL Editor** → **New Query**
4. **Copy-Paste** isi file `schema-v2.sql` (file terbaru)
5. Klik **Run** (tunggu sampai hijau ✓)

**Apa yang akan terjadi:**
- Tabel `staff` diupdate (tambah kolom: email, password_hash, invite_token)
- Tabel produk, transaksi, stok, dll tetap sama
- RLS policies di-setup untuk demo access

### Step 2: Update Aplikasi (2 menit)

**Dari GitHub Desktop / Git CLI:**
```bash
cd kasir-pro
# Copy file baru
cp /path/to/index-v2.html index.html
cp /path/to/schema-v2.sql supabase/schema.sql

# Push ke GitHub
git add .
git commit -m "Upgrade v2: Email/password login + invite system"
git push
```

**Atau Manual (copy file):**
1. Download `index-v2.html`
2. Rename ke `index.html`
3. Replace di repo Kasir Pro Anda
4. Push ke GitHub

### Step 3: Akses & Login (1 menit)

**Refresh aplikasi:**
- Buka: `https://yantibaja.github.io/Kasir/`
- Refresh halaman (Ctrl+F5)

**Akun Demo:**

| Role | Email | Password | Fungsi |
|------|-------|----------|--------|
| Owner | `owner@kasirpro.id` | `admin123` | Manage kasir, laporan, produk |
| - | Buat akun baru | Via daftar button | Pemilik baru |

---

## 🔐 Login Flow

### Owner/Pemilik Login
```
1. Buka aplikasi
2. Masukkan email: owner@kasirpro.id
3. Masukkan password: admin123
4. Klik "🔒 Masuk"
5. Masuk ke dashboard admin
```

### Owner Invite Kasir
```
1. Login sebagai owner
2. Menu: Karyawan
3. Klik "+ Invite Kasir Baru"
4. Isi nama kasir
5. Copy link invite → kirim ke kasir
```

### Kasir Register via Link
```
1. Kasir terima link: https://...?invite=inv_xxxxx
2. Buka link tersebut
3. Form muncul: Isi email, password
4. Selesai! Kasir bisa login
```

---

## 📋 Struktur File

```
kasir-pro/
├── index.html                    # ✨ Aplikasi (versi 2)
├── logo-kasir-pro.png           # Logo (sesuaikan)
├── supabase/
│   └── schema.sql               # ✨ Database schema (versi 2)
├── README.md
└── .gitignore
```

---

## 🔧 Customization

### 1. Ubah Logo
Letakkan file logo Anda dengan nama `logo-kasir-pro.png` di root folder repo.
- Format: PNG atau JPG
- Size: 200x200px ideal
- Aplikasi auto-hide jika tidak ditemukan

### 2. Ubah Nama Aplikasi
Di file `index.html`, cari & replace:
- `Kasir Pro` → nama aplikasi Anda
- `logo-kasir-pro.png` → nama file logo

### 3. Ubah Warna Brand
Di file `index.html`, bagian `:root` CSS:
```css
:root {
  --primary: #FF6B35;           /* Warna utama - ubah di sini */
  --secondary: #004E89;         /* Warna sidebar */
  /* ... warna lainnya ... */
}
```

---

## ✅ Checklist Setup

- [ ] Schema SQL versi 2 sudah dijalankan di Supabase
- [ ] File `index-v2.html` sudah diganti jadi `index.html`
- [ ] File `schema-v2.sql` sudah diganti jadi `supabase/schema.sql`
- [ ] Logo `logo-kasir-pro.png` sudah di-replace dengan logo Anda
- [ ] Git push ke GitHub berhasil
- [ ] Bisa login dengan email: `owner@kasirpro.id` password: `admin123`
- [ ] Dashboard owner muncul dengan baik
- [ ] Bisa akses menu: Kasir, Produk, Kasbon, Absensi, Laporan, Karyawan

---

## 🐛 Troubleshooting

### Error: "Email atau password salah"
**Penyebab:** Akun belum terdaftar atau password salah

**Solusi:**
1. Klik "Daftar Akun Baru"
2. Isi data owner/pemilik Anda
3. Klik "Buat Akun"
4. Login dengan akun baru yang dibuat

### Error saat jalankan schema.sql
**Penyebab:** File lama belum dihapus atau syntax error

**Solusi:**
1. Di Supabase, buka SQL Editor
2. Buat **New Query** (bukan edit query lama)
3. Copy-paste schema-v2.sql **lengkap**
4. Klik **Run**

### Logo tidak muncul
**Penyebab:** File `logo-kasir-pro.png` tidak ada di root

**Solusi:**
1. Pastikan file logo ada di folder root repo
2. Nama file EXACTLY: `logo-kasir-pro.png`
3. Refresh browser (Ctrl+F5)

### Multi-device tidak sync
**Penyebab:** Internet putus atau Supabase offline

**Solusi:**
1. Cek koneksi internet
2. Refresh halaman (F5)
3. Cek status Supabase: https://status.supabase.com

---

## 📊 Database Schema v2

### Tabel `staff` (updated)
```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,           -- ✨ Baru
  password_hash TEXT,          -- ✨ Baru
  name TEXT,
  role TEXT ('owner' | 'kasir'),
  phone TEXT,
  status TEXT ('active' | 'inactive'),
  invite_token TEXT UNIQUE,    -- ✨ Baru
  invite_token_expires_at TIMESTAMPTZ,  -- ✨ Baru
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

---

## 🚀 Next Features (Roadmap)

- [ ] KasirMenu (POS full implementation)
- [ ] Kasir self-register completion
- [ ] Absensi dengan camera + GPS (sudah ada di v1)
- [ ] Kasbon tracking detail
- [ ] Laporan export PDF/Excel
- [ ] Analytics dashboard
- [ ] WhatsApp notification
- [ ] Barcode scanning

---

## 💡 Tips

**Development Mode (localhost):**
```bash
# Jika ingin test lokal sebelum push
python -m http.server 8000
# Akses: http://localhost:8000
```

**Production Best Practices:**
1. Ganti password hashing manual dengan bcrypt
2. Implementasikan email verification
3. Setup JWT tokens untuk session management
4. Enable RLS berbasis auth.uid()
5. Pindahkan login/register ke Edge Functions

---

## 📞 Support

Jika ada error atau pertanyaan:
1. Buka browser console (F12)
2. Lihat tab **Console** untuk error details
3. Screenshot error & langkah untuk reproduce
4. Report ke developer dengan informasi lengkap

---

**Version:** Kasir Pro v2.0 (Email/Password + Invite System)
**Status:** Ready to Deploy ✅
**Last Updated:** September 10, 2026
