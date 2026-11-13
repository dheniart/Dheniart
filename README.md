[lengkapi-sop-README.md](https://github.com/user-attachments/files/34779930/lengkapi-sop-README.md)
# Lengkapi SOP

Aplikasi latihan SOP interaktif dengan dua bagian yang terpisah:

- **`index.html`**: kuis untuk peserta (teks rumpang dan pilihan ganda).
- **`admin.html`**: dashboard trainer untuk menambah, mengubah, dan menghapus pertanyaan tanpa menyentuh kode.

Keduanya memakai data yang sama lewat **LocalStorage** browser (`js/store.js`).

## Struktur

```
index.html          kuis peserta
admin.html          dashboard trainer (simpan di perangkat trainer saja)
css/styles.css      Tailwind CSS hasil kompilasi (tanpa CDN, bisa offline)
js/seed.js          data awal (144 pertanyaan dari 20 SOP)
js/ui.js            ikon, toast, unduh file
js/store.js         data: CRUD, pengaturan, riwayat, impor/ekspor, pemeriksaan jawaban
js/quiz.js          logika kuis
js/admin.js         logika dashboard
data/questions.json salinan bank soal untuk dibagikan ke perangkat crew
src/input.css, tailwind.config.js, package.json   untuk membangun ulang CSS
```

## Menjalankan

LocalStorage dipakai bersama oleh dua halaman, jadi buka lewat alamat `http://` atau `https://` (bukan klik dua kali file).

- **Lokal:** di folder ini jalankan `python3 -m http.server 8000`, lalu buka `http://localhost:8000/admin.html` dan `http://localhost:8000/index.html`.
- **Hosting:** unggah folder ke layanan hosting statis (GitHub Pages, Netlify, dan sejenisnya). Crew cukup membuka link `index.html`; tidak perlu akun apa pun.

## Mengelola pertanyaan lewat dashboard

**Menambah**
1. Buka `admin.html` → menu **Pertanyaan** → **Tambah pertanyaan**.
2. Isi **Topik SOP** (nama SOP, misalnya "Thawing Ayam"). Ketik topik baru atau pilih yang ada.
3. Pilih tipe:
   - **Teks rumpang:** tulis kalimat SOP, bungkus jawaban dengan `[[ ]]`. Contoh: `Suhu chiller untuk thawing [[2-5]] °C.` Beberapa jawaban yang diterima dipisah `|`: `[[golden brown|keemasan]]`.
   - **Pilihan ganda:** tulis pertanyaan, isi 2 sampai 6 pilihan, lalu tandai bulatan pada jawaban yang benar.
4. Periksa pratinjau, isi penjelasan (opsional), lalu **Simpan**. Tombol Simpan baru aktif jika isian valid.

**Mengubah:** ikon pensil pada baris. **Duplikat:** ikon salin. **Menonaktifkan sementara:** geser saklar *Aktif* (pertanyaan disembunyikan dari kuis, tidak dihapus).

**Menghapus:** ikon tempat sampah → konfirmasi **Ya, hapus**. Penghapusan permanen; unduh cadangan dulu (Pengaturan → Unduh questions.json) bila ragu.

## Membagikan perubahan ke perangkat crew

LocalStorage hanya menyimpan data di browser tempat kamu bekerja. Agar perubahan sampai ke crew:

1. Dashboard → **Pengaturan** → **Unduh questions.json**.
2. Ganti `data/questions.json` di hosting dengan file tersebut.
3. Saat crew membuka `index.html`, soal terbaru diambil otomatis jika versinya lebih baru dari yang tersimpan di perangkat mereka.

Tanpa hosting, kirim `questions.json` ke perangkat lain lalu pakai **Pengaturan → Impor JSON** (gabungkan atau ganti semua).

## Catatan penting

- **PIN dashboard** (Pengaturan) hanyalah kunci ringan di browser, bukan keamanan sungguhan. Simpan `admin.html` hanya di perangkat trainer dan jangan unggah ke hosting crew.
- Jawaban benar tertanam di halaman kuis sehingga bisa dilihat lewat kode sumber. Cocok untuk latihan, bukan ujian tertutup.
- Riwayat hasil kuis tersimpan di browser perangkat yang dipakai peserta, jadi dashboard hanya menampilkan riwayat dari browser trainer. Untuk mengumpulkan hasil crew, gunakan tombol **Salin hasil** di akhir kuis.
- Isi SOP pada data awal diambil dari dokumen SOP Crisbar; sebagian dibaca dari gambar, jadi cek ulang angkanya sebelum dipakai untuk penilaian.

## Membangun ulang CSS (opsional)

```
npm install
npx tailwindcss -c tailwind.config.js -i src/input.css -o css/styles.css --minify
```
