# Refactor Production-Ready Tanpa Perubahan Fungsi dan UI

## Ringkasan

Refactor seluruh `src` secara bertahap dengan pendekatan feature-first. Prioritas pertama adalah `ServiceOverview.tsx`, `PreDeployFlow.tsx`, dan `index.css`, kemudian area agents, sidebar, serta komponen bersama. Tidak ada perubahan desain, alur pengguna, URL, data tersimpan, atau dependency baru.

Perubahan lokal yang saat ini belum di-commit pada `ServiceOverview.tsx`, `PreDeployFlow.tsx`, dan `index.css` harus dipertahankan sebagai baseline.

## Perubahan Utama

- Gunakan struktur production-ready:
  - `src/app`: hanya routing, layout, dan entry page.
  - `src/features/projects`: daftar proyek, detail proyek, service canvas, deployment, hooks, data, dan storage.
  - `src/features/agents`: halaman agent dan chat.
  - `src/features/navigation`: sidebar, command palette, profile, dan mobile navigation.
  - `src/components`: komponen lintas fitur seperti application shell dan visual primitives.
  - `src/lib` dan `src/styles`: utilitas serta stylesheet global.

- Terapkan penamaan konsisten:
  - Semua nama file non-Next.js memakai `kebab-case`, misalnya `service-overview.tsx` dan `project-card.tsx`.
  - Export komponen tetap `PascalCase`, hooks memakai `use...`, konstanta memakai `SCREAMING_SNAKE_CASE`.
  - Hilangkan ketergantungan silang seperti tipe region milik agents yang saat ini mengambilnya dari fitur projects.

- Pecah `ServiceOverview` menjadi orchestration dan bagian presentasional:
  - Controller hook menangani state, timer, toast, deployment transition, dan sinkronisasi `localStorage`.
  - Model terpisah menangani tipe, konstanta, validasi data tersimpan, pembuatan service, dan perhitungan connector.
  - Komponen terpisah untuk canvas, node, detail panel, setup steps, dan dialog.
  - Semua status, delay simulasi, posisi node, aksi menu, pan/zoom/drag, serta responsivitas dipertahankan identik.

- Pecah alur pre-deployment menjadi source, configuration, progress, summary, serta shared fields tanpa mengubah kontrak perilakunya. Cleanup seluruh timeout dibuat terpusat agar tidak berjalan setelah unmount atau perpindahan proyek.

- Rapikan fitur lain:
  - Satukan wrapper halaman Projects dan Agents dalam application shell bersama tanpa memperbesar Client Component boundary.
  - Pisahkan state/filtering dari presentasi pada halaman projects dan agents.
  - Pertahankan focus trap, keyboard shortcut, reduced-motion, theme switching, dan pemulihan scroll sidebar mobile.

- Pecah `index.css` berdasarkan tanggung jawab:
  - Tailwind entry, token/theme, global base, service overview, dan pre-deploy styles.
  - Gunakan satu entry stylesheet dengan urutan import eksplisit.
  - Pertahankan selector, specificity, breakpoint, ukuran, warna, animasi, dan urutan cascade selama refactor; tidak mengonversi CSS ke utility class atau CSS Modules pada tahap ini.

## Antarmuka dan Kompatibilitas

- URL `/`, `/agent`, dan `/projects/[projectId]` tetap sama.
- Pertahankan seluruh key serta format data `localStorage`, termasuk daftar proyek, service canvas per proyek, deployment workflow, dan theme.
- Data lama yang valid tetap terbaca; data rusak tetap kembali ke default tanpa crash.
- Nama custom browser event dan perilaku keyboard yang sudah digunakan tetap kompatibel.
- Perubahan export/import hanya internal; tidak ada API pengguna atau bentuk data publik baru.
- Tambahkan script `typecheck` dan `check` ke `package.json` menggunakan TypeScript serta Next build yang sudah tersedia, tanpa dependency baru.

## Strategi Implementasi dan Verifikasi

1. Rekam status Git, baseline screenshot, dan checklist fungsi sebelum memindahkan file.
2. Lakukan rename/move terlebih dahulu dan pastikan aplikasi masih lolos pemeriksaan sebelum mengubah isi komponen.
3. Refactor projects/deployment dalam potongan kecil: model dan storage, controller, canvas/panel/dialog, lalu pre-deploy.
4. Refactor application shell, agents, navigation, shared types, dan terakhir stylesheet.
5. Setelah setiap tahap jalankan typecheck, production build, dan smoke test seluruh route.

Pengujian regresi tanpa dependency baru:

- Bandingkan screenshot sebelum/sesudah pada desktop dan mobile, dark dan light theme, dengan animasi distabilkan.
- Uji Projects: loading, pencarian, filter, sort, grid/list, empty state, membuat proyek, refresh, dan membuka proyek lokal.
- Uji detail proyek: drag/pan/zoom, memilih node, menu service, logs, settings, add service, stop/restart/redeploy, toast, dan persistence.
- Uji pre-deploy: memilih source, konfigurasi, environment variables, back, queued/building/deploying/live, failure, retry, refresh, dan kembali ke overview.
- Uji navigation/agents: sidebar desktop dan mobile, focus/escape, command palette, theme, filter agent, serta chat.
- Uji data rusak atau storage tidak tersedia, pergantian project ID, timer cleanup, hydration tanpa mismatch, dan reduced-motion.
- Kriteria selesai: tidak ada perubahan visual yang disengaja, seluruh interaksi menghasilkan state yang sama, data lama tetap terbaca, tidak ada error console baru, typecheck berhasil, dan production build berhasil.

## Asumsi dan Batasan

- “Production-ready” diterjemahkan menjadi struktur berbasis fitur dan nama file `kebab-case`, sementara nama komponen React tetap `PascalCase`.
- Refactor tidak menambah fitur, mengubah copy, memperbaiki desain, mengganti animasi, atau mengubah durasi simulasi.
- Tidak ada dependency testing, linting, state-management, atau styling baru.
- Bila baseline build kembali tersangkut karena proses lingkungan, penyebab proses tersebut harus dipisahkan dari error kode dan diselesaikan sebelum hasil refactor dinyatakan selesai.

## Instruksi untuk AI Pelaksana

- Baca `AGENTS.md` dan dokumentasi Next.js 16.3.2 yang relevan di `node_modules/next/dist/docs/` sebelum mengubah kode.
- Jangan menghapus, menimpa, atau me-reset perubahan lokal pengguna yang sudah ada.
- Kerjakan refactor secara bertahap dan validasi setelah setiap kelompok perubahan; jangan melakukan rewrite besar sekaligus.
- Jangan mengubah UI, copy, fungsi, route, key penyimpanan, bentuk data, timing animasi/simulasi, atau dependency tanpa persetujuan baru.
- Gunakan `git diff` untuk memastikan setiap tahap hanya berisi perubahan struktural yang direncanakan.
