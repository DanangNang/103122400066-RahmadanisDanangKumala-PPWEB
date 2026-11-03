document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Waktu Awal dan Counter
    const waktuAwalEl = document.getElementById('waktuAwal');
    const angkaHitunganEl = document.getElementById('angkaHitungan');
    const btnTambahHitungan = document.getElementById('btnTambahHitungan');
    
    let counter = 0;
    waktuAwalEl.textContent = new Date().toLocaleTimeString('id-ID');

    btnTambahHitungan.addEventListener('click', () => {
        counter++;
        angkaHitunganEl.textContent = counter;
    });

    // 2. XMLHttpRequest untuk Pengumuman
    const btnMuatPengumuman = document.getElementById('btnMuatPengumuman');
    const isiPengumuman = document.getElementById('isiPengumuman');
    const statusPengumuman = document.getElementById('statusPengumuman');

    btnMuatPengumuman.addEventListener('click', () => {
        btnMuatPengumuman.disabled = true;
        statusPengumuman.className = 'info';
        statusPengumuman.textContent = 'Memuat pengumuman...';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'pengumuman.txt', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                btnMuatPengumuman.disabled = false;
                if (xhr.status === 200) {
                    statusPengumuman.textContent = '';
                    isiPengumuman.textContent = xhr.responseText;
                } else {
                    statusPengumuman.className = 'error';
                    statusPengumuman.textContent = `Gagal memuat pengumuman. HTTP Status: ${xhr.status}`;
                }
            }
        };

        xhr.onerror = function () {
            btnMuatPengumuman.disabled = false;
            statusPengumuman.className = 'error';
            statusPengumuman.textContent = 'Terjadi kesalahan jaringan saat memuat pengumuman.';
        };

        xhr.send();
    });

    // 3. Fetch API untuk Direktori Peserta
    const selectSumber = document.getElementById('selectSumber');
    const btnAmbilPeserta = document.getElementById('btnAmbilPeserta');
    const statusPeserta = document.getElementById('statusPeserta');
    const infoDirektori = document.getElementById('infoDirektori');
    const daftarPeserta = document.getElementById('daftarPeserta');

    btnAmbilPeserta.addEventListener('click', async () => {
        const sumber = selectSumber.value;
        const url = sumber === 'local' 
            ? '/api/users?delay=1500' 
            : 'https://jsonplaceholder.typicode.com/users';
        const namaSumber = sumber === 'local' ? 'Mock Lokal' : 'JSONPlaceholder';

        btnAmbilPeserta.disabled = true;
        statusPeserta.className = 'info';
        statusPeserta.textContent = 'Memuat data peserta...';
        infoDirektori.textContent = '';
        daftarPeserta.innerHTML = '';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await window.responseToJSON(response); // Mengurai response JSON
            const maxTampil = data.slice(0, 3);

            statusPeserta.textContent = '';
            infoDirektori.innerHTML = `<strong>Sumber:</strong> ${namaSumber} | <strong>Jumlah Tampil:</strong> ${maxTampil.length} dari ${data.length}`;

            maxTampil.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} (${user.email})`;
                daftarPeserta.appendChild(li);
            });
        } catch (err) {
            statusPeserta.className = 'error';
            if (sumber === 'external') {
                statusPeserta.textContent = `Gagal memuat data eksternal (${err.message}). Periksa koneksi internet atau gunakan Mock Lokal.`;
            } else {
                statusPeserta.textContent = `Gagal memuat data: ${err.message}`;
            }
        } finally {
            btnAmbilPeserta.disabled = false;
        }
    });

    // Helper untuk memproses JSON
    window.responseToJSON = function(res) {
        return res.json();
    };
});