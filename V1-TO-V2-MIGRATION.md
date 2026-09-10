# Kasir Pro — Migrasi dari v1 ke v2

## 📋 Perubahan Utama

### Login System

| Aspek | v1 | v2 |
|-------|----|----|
| Auth Method | PIN (4 digit) | Email + Password |
| Owner Login | PIN di form publik | Email + password |
| Kasir Login | PIN di form publik | Link invite → self-register |
| Multi-account | Hanya owner + fixed kasir | Owner + unlimited kasir |
| Session | Simpan di localStorage | Simpan email & auth state |

### User Management

**v1:**
- Owner: Login dengan PIN 1234 (hardcoded)
- Kasir: Fixed 2 akun (Dimas, Ayu) dengan PIN 0000

**v2:**
- Owner: Bisa buat akun sendiri dengan email/password
- Kasir: Unlimited, invite via link, self-register data mereka

### Database

**Kolom Baru di Tabel `staff`:**
```sql
-- v1
id, name, role, pin, created_at

-- v2 (tambahan)
email, password_hash, invite_token, invite_token_expires_at, status, updated_at
```

**Tabel Lama:** Tetap sama (products, transactions, kasbon, attendance, dll)

---

## 🔄 Migration Checklist

### Pre-Migration (Backup Data)

- [ ] Export semua data dari v1 (jika penting)
  ```sql
  -- Di Supabase SQL Editor
  SELECT * FROM products;
  SELECT * FROM transactions;
  SELECT * FROM customers;
  ```

### Migration Steps

1. **Jalankan schema-v2.sql di Supabase**
   - Tabel staff akan di-recreate dengan kolom baru
   - Data lama akan hilang (PIN tidak diimport)
   - Data produk, transaksi, etc tetap aman

2. **Replace index.html dengan versi v2**
   - Hapus index.html lama
   - Copy index-v2.html → rename jadi index.html

3. **Test di Localhost Dulu (Recommended)**
   ```bash
   cd kasir-pro
   python -m http.server 8000
   # Buka http://localhost:8000
   # Test login dengan email baru
   ```

4. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Migrate v1 → v2: Email/password auth"
   git push
   ```

5. **Test di Production**
   - Akses: https://yantibaja.github.io/Kasir/
   - Refresh hard: Ctrl+F5
   - Buat akun baru (v1 accounts tidak tersedia)
   - Test invite kasir

---

## 🆚 Feature Comparison

### v1 Features
✅ PIN-based login  
✅ Multi-device kasir menu  
✅ Produk & stok CRUD  
✅ Kasbon management  
✅ Camera + GPS absensi  
✅ Laporan & dashboard  
✅ Stok masuk/keluar/rusak  

### v2 Features
✅ Email/password login (upgrade)  
✅ Owner self-register  
✅ **[NEW]** Kasir invite system  
✅ **[NEW]** Admin panel untuk manage kasir  
✅ **[NEW]** Kasir self-complete registration  
✅ All v1 features (akan ada di update berikutnya)  

### v2 Coming Soon
⏳ Kasir menu (POS)  
⏳ Produk management  
⏳ Camera absensi  
⏳ Reports  
⏳ Kasbon tracking  

---

## 🔐 Password Best Practices

### Apa yang Diubah
- v1: PIN simpan plain text
- v2: Password hash dengan `btoa()` (temporary)
- Production: Harus gunakan bcrypt

### Security Note
```
v2 ini masih demo/development:
- Password di-hash dengan btoa() (base64)
- Sebelum production HARUS upgrade ke bcrypt
- Implementasikan email verification
- Setup JWT tokens
```

---

## 📱 User Experience Changes

### Owner/Pemilik

**v1:**
```
Buka aplikasi
↓
Klik "Pemilik"
↓
Input PIN: 1234
↓
Login
```

**v2:**
```
Buka aplikasi
↓
Lihat form login (email + password)
↓
Klik "Daftar Akun Baru"
↓
Input: Email, Nama, Password
↓
Akun created
↓
Login dengan email & password
```

### Kasir

**v1:**
```
Buka aplikasi
↓
Klik "Staf Kasir"
↓
Input PIN: 0000 (hardcoded)
↓
Login
```

**v2:**
```
Owner invite kasir
↓
Kasir terima link: https://...?invite=inv_xxxxx
↓
Buka link
↓
Form signup kasir
↓
Input: Email, Nama, Password, Nomor HP
↓
Akun created
↓
Kasir bisa login
```

---

## 🗂️ File Changes

### Files Changed
- `index.html` → completely rewritten
- `supabase/schema.sql` → updated dengan kolom email, password, invite

### Files Unchanged
- `logo-kasir-pro.png` → sama (sesuaikan dengan logo Anda)
- `README.md` → bisa update
- `.gitignore` → sama

### New Capabilities
- Unlimited kasir accounts
- Self-serve registration via link
- Email-based authentication
- Better admin control

---

## ⚠️ Breaking Changes

| Fitur | Status | Action |
|-------|--------|--------|
| PIN login | ❌ Removed | Gunakan email/password |
| Hardcoded kasir | ❌ Removed | Invite kasir baru |
| v1 passwords | ❌ Incompatible | Reset semua password |
| Menu "Produk" dll | ⏳ Pending | Akan ada di v2.1 |

---

## 🔧 Rollback ke v1

Jika ada masalah, bisa rollback ke v1:

```bash
# Di GitHub Desktop
- Buka History
- Klik commit terakhir v1
- Klik "Revert this commit"
- Push

Atau via git CLI:
git revert HEAD
git push
```

---

## 📊 Data Migration Options

### Option 1: Fresh Start (Recommended)
- Hapus semua data lama
- Setup fresh database
- Buat akun baru sebagai owner
- Pro: Clean, no legacy data
- Con: Perlu setup ulang

### Option 2: Import Ulang (Advanced)
```sql
-- Jika ada data penting untuk diimport ulang
INSERT INTO products (...) VALUES (...);
INSERT INTO customers (...) VALUES (...);
```
- Pro: Simpan data historis
- Con: Manual, perlu SQL knowledge

---

## ✅ Post-Migration Verification

Setelah migrate, pastikan:

- [ ] Login dengan email/password berhasil
- [ ] Bisa akses dashboard
- [ ] Menu visible sesuai role (owner vs kasir)
- [ ] Bisa create akun owner baru
- [ ] Bisa generate invite kasir
- [ ] Data produk masih ada (jika imported)
- [ ] No console errors (F12)
- [ ] Mobile responsive masih jalan

---

## 🚀 Next Steps After Migration

1. **Share dengan Team**
   - Owner: Bagikan link aplikasi
   - Kasir: Bagikan invite link

2. **Training**
   - Owner: Cara manage kasir, generate invite
   - Kasir: Cara login & gunakan aplikasi

3. **Plan v2.1**
   - Implementasi menu kasir lengkap
   - Produk management
   - Laporan & analytics

4. **Production Hardening**
   - Upgrade password hashing (bcrypt)
   - Email verification
   - JWT sessions
   - RLS policies

---

## 📞 Support During Migration

**Jika ada error:**

1. Check browser console (F12)
2. Verify schema.sql berhasil di Supabase
3. Clear cache: Ctrl+Shift+Delete
4. Try fresh browser tab/incognito
5. Screenshot error & report

---

**Migration Date:** September 10, 2026
**Status:** Ready ✅
**Estimated Migration Time:** 10-15 minutes
