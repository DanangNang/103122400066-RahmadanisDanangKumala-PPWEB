const { useState, useEffect } = React;

function App() {
    // State untuk GET Peserta
    const [skenario, setSkenario] = useState('berhasil');
    const [peserta, setPeserta] = useState([]);
    const [loadingGet, setLoadingGet] = useState(false);
    const [errorGet, setErrorGet] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    // State untuk Form POST Pendaftaran
    const [formNama, setFormNama] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [loadingPost, setLoadingPost] = useState(false);
    const [responsePost, setResponsePost] = useState(null);
    const [errorPost, setErrorPost] = useState('');

    // Mapping Skenario ke URL dan Timeout
    const getSkenarioConfig = (key) => {
        switch (key) {
            case 'berhasil':
                return { url: '/api/users?delay=1000', timeout: 5000 };
            case 'kosong':
                return { url: '/api/users?mode=empty&delay=1000', timeout: 5000 };
            case 'error':
                return { url: '/api/users?mode=error&delay=1000', timeout: 5000 };
            case 'timeout':
                return { url: '/api/users?delay=2500', timeout: 700 };
            default:
                return { url: '/api/users?delay=1000', timeout: 5000 };
        }
    };

    // Effect untuk GET Peserta (dengan AbortController & Flag Pembersihan)
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            setLoadingGet(true);
            setErrorGet('');
            setPeserta([]);

            const config = getSkenarioConfig(skenario);

            try {
                const res = await axios.get(config.url, {
                    timeout: config.timeout,
                    signal: controller.signal
                });

                if (isMounted) {
                    setPeserta(res.data);
                }
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request dibatalkan oleh skenario baru');
                    return;
                }
                if (isMounted) {
                    if (err.code === 'ECONNABORTED') {
                        setErrorGet('Request Timeout! Waktu tunggu melebihi batas.');
                    } else if (err.response) {
                        setErrorGet(`HTTP Error ${err.response.status}: Service Unavailable / Failed`);
                    } else {
                        setErrorGet(`Gagal memuat data: ${err.message}`);
                    }
                }
            } finally {
                if (isMounted) {
                    setLoadingGet(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [skenario, reloadKey]);

    // Handle Submit Form (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setResponsePost(null);
        setErrorPost('');

        const namaClean = formNama.trim();
        const emailClean = formEmail.trim();

        // Validasi Input
        if (!namaClean) {
            setFormError('Nama tidak boleh kosong atau hanya berisi spasi.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailClean)) {
            setFormError('Format email tidak valid.');
            return;
        }

        setLoadingPost(true);

        try {
            const res = await axios.post('/api/users', {
                name: namaClean,
                email: emailClean
            });

            setResponsePost({
                status: res.status,
                data: res.data
            });
            setFormNama('');
            setFormEmail('');
        } catch (err) {
            setErrorPost(`Pengiriman gagal: ${err.message}`);
        } finally {
            setLoadingPost(false);
        }
    };

    return (
        <div>
            <h1>Aplikasi Registrasi Peserta (React & Axios)</h1>

            {/* BAGIAN GET PESERTA */}
            <div class="box">
                <h2>Daftar Peserta</h2>
                
                <div class="field">
                    <label>Skenario: </label>
                    <select value={skenario} onChange={(e) => setSkenario(e.target.value)}>
                        <option value="berhasil">Berhasil</option>
                        <option value="kosong">Data Kosong</option>
                        <option value="error">Error HTTP (503)</option>
                        <option value="timeout">Timeout (700ms)</option>
                    </select>
                    {' '}
                    <button onClick={() => setReloadKey(prev => prev + 1)}>Muat Ulang</button>
                </div>

                {loadingGet && <p class="info">Memuat data peserta...</p>}
                {errorGet && <p class="error">{errorGet}</p>}

                {!loadingGet && !errorGet && peserta.length === 0 && (
                    <p class="info">Data peserta kosong.</p>
                )}

                {!loadingGet && !errorGet && peserta.length > 0 && (
                    <ul>
                        {peserta.map(u => (
                            <li key={u.id}>
                                <strong>{u.name}</strong> - {u.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* BAGIAN POST FORMULIR */}
            <div class="box">
                <h2>Formulir Pendaftaran Peserta</h2>
                <form onSubmit={handleSubmit}>
                    <div class="field">
                        <label htmlFor="nama">Nama:</label>
                        <input
                            id="nama"
                            type="text"
                            value={formNama}
                            onChange={(e) => setFormNama(e.target.value)}
                        />
                    </div>
                    <div class="field">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="text"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loadingPost}>
                        {loadingPost ? 'Mengirim...' : 'Kirim Pendaftaran'}
                    </button>
                </form>

                {formError && <p class="error">{formError}</p>}
                {errorPost && <p class="error">{errorPost}</p>}

                {responsePost && (
                    <div class="success" style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                        <p>Simulasi berhasil, data tidak disimpan.</p>
                        <ul>
                            <li>HTTP Status: {responsePost.status}</li>
                            <li>ID: {responsePost.data.id}</li>
                            <li>Nama: {responsePost.data.name}</li>
                            <li>Email: {responsePost.data.email}</li>
                            <li>Simulated: {String(responsePost.data.simulated)}</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);