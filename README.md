# Publicles.

Website frontend Publicles untuk membantu masyarakat menemukan informasi layanan publik secara jelas, ramah, dan mudah dimainkan.

## Jalankan project

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Struktur data

Semua konten frontend dibaca lewat lapisan `src/services/api.js`. Saat ini service membaca JSON lokal dan dapat diganti dengan panggilan backend nanti.

- `src/data/layanan.json`: daftar layanan.
- `src/data/updates.json`: kartu kabar terbaru.
- `src/data/promosi.json`: paket promosi.
- `src/data/links.json`: tautan Link Hub dan nomor WhatsApp.

### Menambah layanan

Tambahkan satu objek ke `src/data/layanan.json` dengan `id`, `nama`, `ringkas`, `syarat`, `langkah`, `biaya`, `masalah`, `sumber`, `diperbarui`, dan `status`. Gunakan `perlu-verifikasi` sampai isi biaya dan aturan diperiksa pemilik atau sumber resmi. Jangan mengubah `status` menjadi terverifikasi hanya berdasarkan asumsi.

### Menambah update

Tambahkan objek ke `src/data/updates.json` dengan kategori, jenis badge, ringkasan, tanggal diperbarui, status, dan sumber resmi bila tersedia.

## Keputusan desain

- Diambil dari UI/UX Pro Max: hierarki prioritas aksesibilitas dan touch, target sentuh minimal 44px, fokus terlihat, h3/heading berurutan, preferensi reduced motion, GSAP dalam `gsap.context()`, motion berbasis transform/opacity, chip yang dapat reflow, dan alternatif keyboard untuk operasi drag.
- Diambil dari pencarian tipografi: nuansa rounded/friendly dapat dipakai, tetapi brand meminta Poppins untuk heading dan Nunito untuk body.
- Diambil dari pencarian GSAP: reveal singkat 300–700ms, stagger kecil, easing expo/power, serta matchMedia untuk reduced motion.
- Diambil dari pencarian UX: drag memerlukan tombol atau keyboard alternatif; validasi error diletakkan dekat field dan ada aria-live; area interaktif tidak boleh bergantung pada hover.
- Di-override oleh brand: palet utama ungu-kuning-putih dari prompt, bukan palet navy/biru hasil pencarian desain sistem. Tipografi Poppins/Nunito override Atkinson karena brand feed sudah ditentukan. Brutalism keras diolah menjadi soft-brutalism dengan radius besar, border tebal, dan bayangan offset, bukan tanpa transisi.
- `MASTER.md` dan `tokens.css` ada di `design-system/publicles/`; palet brand di `src/styles/tokens.css` adalah token implementasi final dan sengaja meng-override rekomendasi navy/biru skill.

## Status implementasi

- Fase 1–6 telah diimplementasikan: hero dan Titik, layanan, update, kuis, countdown, promosi, LinkHub, dan fitur pendukung.
- `LAYOUT` menggunakan responsif mobile-first; seluruh fitur drag memiliki tombol atau kontrol keyboard.
- Reduced-motion didukung lewat hook dan GSAP matchMedia/CSS.
- Semua data pemilik yang belum terverifikasi ditandai jelas dan tidak disajikan sebagai fakta resmi.

## Checklist rilis singkat

- [ ] Jalankan visual test pada 375, 768, 1024, dan 1440px.
- [ ] Isi harga paket nyata setelah pemilik menentukan nilai.
- [ ] Verifikasi semua syarat, biaya, dan aturan dari sumber resmi.
- [ ] Jalankan Lighthouse dan perbaiki temuan kritik bila ada.

## Yang masih harus diisi pemilik

- Harga paket promosi nyata di `src/data/promosi.json`; saat ini masih `Hubungi untuk harga`.
- Verifikasi data layanan: syarat, biaya, prosedur, status verifikasi, dan tautan sumber resmi.
- Denah event asli gedung BINUS Anggrek/Meja 10.
- Gambar Open Graph untuk pratinjau tautan sosial.
- Email bisnis, bila Publicles memilikinya.
- Domain deployment/produksi final.

## Sumber desain

Sistem desain dan keputusan awal dibuat dengan UI/UX Pro Max dari `ui-ux-pro-max-skill-main`. Rekomendasi warna dari skill tidak dipakai sebagai brand final jika bertentangan dengan palet Publicles dalam prompt.

## Event countdown

Event pertama disimpan di `src/data/events.json`. Tambahkan event berikutnya sebagai item baru dan oper objek event ke `EventCountdown` serta komponen banner/hero yang menerima prop event. Waktu event memakai offset `+07:00` eksplisit.

Pengujian development:

- 5 hari sebelumnya: `http://127.0.0.1:5174/?now=2026-11-20T10:00:00%2B07:00`
- Hari-H: `http://127.0.0.1:5174/?now=2026-11-25T10:00:00%2B07:00`
- Berlangsung: `http://127.0.0.1:5174/?now=2026-11-25T13:30:00%2B07:00`
- Selesai: `http://127.0.0.1:5174/?now=2026-11-25T16:30:00%2B07:00`

Parameter `now` hanya aktif saat mode development dan tidak dipakai pada build produksi.
