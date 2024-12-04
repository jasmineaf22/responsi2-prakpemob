Jasmine Adzra Fakhirah
H1D022071
Prak Mobile Shift D PEREMUAN 10
![alt text](Animation.gif)


Autentikasi Login dengan Google

Login dengan Google:

Pengguna diminta untuk mengklik tombol "Login dengan Google" pada halaman login.
Setelah mengklik tombol tersebut, pengguna akan diarahkan ke halaman otentikasi Google, di mana mereka harus memasukkan kredensial akun Google mereka (email dan password).
Verifikasi dan Otorisasi:

Setelah pengguna berhasil login, Google akan meminta izin untuk membagikan informasi dasar pengguna dengan aplikasi, seperti nama lengkap dan foto profil.
Pengguna dapat memilih untuk memberikan izin atau menolak. Jika izin diberikan, aplikasi akan menerima data pengguna.
Akses Token:

Aplikasi akan menerima token otentikasi dari Google yang digunakan untuk melakukan panggilan API ke Google untuk mendapatkan data pengguna yang relevan.
Mendapatkan Data Pengguna:

Dengan token yang diterima, aplikasi melakukan permintaan API ke Google untuk mengambil data pengguna, seperti:
Nama lengkap
Foto profil
Alamat email
Data ini digunakan untuk memperbarui tampilan profil pengguna di aplikasi, memberi pengalaman pengguna yang lebih personal.
Menampilkan Profil:

Setelah data berhasil diambil, aplikasi akan menampilkan nama dan foto profil pengguna di halaman utama atau dashboard aplikasi.


Jasmine Adzra Fakhirah
H1D022071
Prak Mobile Shift D PEREMUAN 11
![alt text](Animation2.gif)

Proyek ini merupakan implementasi CRUD sederhana menggunakan Ionic Framework dan Firebase Firestore untuk mengelola data berbasis NoSQL. Langkah pertama adalah menyiapkan proyek dengan menyambungkannya ke Firebase, mengaktifkan Firestore, dan mengatur mode uji (test mode) untuk mempermudah pengembangan. Setelah itu, tambahkan dependensi seperti date-fns untuk memformat waktu. Konfigurasi Firebase dilakukan pada file src/utils/firebase.ts, sedangkan file src/utils/firestore.ts digunakan untuk mendefinisikan fungsi CRUD, seperti menambah, membaca, memperbarui, dan menghapus data. Komponen utama seperti ion-card digunakan untuk menampilkan data, ion-refresher untuk fitur tarik-untuk-muat, dan ion-fab sebagai tombol untuk menambah data. Modal input dibuat menggunakan komponen InputModal untuk menangani penambahan dan pengeditan data. Styling dilakukan pada file src/views/HomePage.vue untuk memastikan tampilan responsif. Terakhir, aplikasi dapat diuji pada browser atau emulator dengan perintah ionic serve. Pastikan aturan keamanan Firestore telah disesuaikan sebelum memindahkan aplikasi ke mode produksi.






# responsi2-prakpemob
