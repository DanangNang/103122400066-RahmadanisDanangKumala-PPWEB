import React, { useState } from 'react';
import RingkasanPeserta from './components/RingkasanPeserta';
import FormPeserta from './components/FormPeserta';
import FilterPeserta from './components/FilterPeserta';
import DaftarPeserta from './components/DaftarPeserta';
import './App.css';

const INITIAL_DATA = [
  { id: 'm-1', nama: 'Ani', nim: '10121001', kelas: 'TI-2A', hadir: true },
  { id: 'm-2', nama: 'Budi', nim: '10121002', kelas: 'TI-2B', hadir: false },
  { id: 'm-3', nama: 'Citra', nim: '10121003', kelas: 'TI-2A', hadir: false },
];

export default function App() {
  const [peserta, setPeserta] = useState(INITIAL_DATA);
  const [form, setForm] = useState({ id: null, nama: '', nim: '', kelas: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua kelas');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNama = form.nama.trim();
    const cleanNim = form.nim.trim();

    if (!cleanNama || cleanNama.length < 3) {
      setErrorMessage('Nama wajib diisi dan minimal 3 karakter.');
      return;
    }

    const nimRegex = /^\d{8}$/;
    if (!nimRegex.test(cleanNim)) {
      setErrorMessage('NIM wajib diisi dan harus tepat 8 digit angka.');
      return;
    }

    if (!form.kelas || form.kelas === 'Pilih kelas') {
      setErrorMessage('Silakan pilih kelas yang valid (TI-2A atau TI-2B).');
      return;
    }

    const isNimExist = peserta.some(
      (p) => p.nim === cleanNim && p.id !== form.id
    );
    if (isNimExist) {
      setErrorMessage(`NIM ${cleanNim} sudah digunakan oleh peserta lain.`);
      return;
    }

    if (isEdit) {
      setPeserta(
        peserta.map((p) =>
          p.id === form.id
            ? { ...p, nama: cleanNama, nim: cleanNim, kelas: form.kelas }
            : p
        )
      );
      resetForm();
    } else {
      const newPeserta = {
        id: `m-${Date.now()}`,
        nama: cleanNama,
        nim: cleanNim,
        kelas: form.kelas,
        hadir: false,
      };
      setPeserta([...peserta, newPeserta]);
      resetForm();
    }
  };

  const resetForm = () => {
    setForm({ id: null, nama: '', nim: '', kelas: '' });
    setIsEdit(false);
    setErrorMessage('');
  };

  const handleEdit = (item) => {
    setForm({ id: item.id, nama: item.nama, nim: item.nim, kelas: item.kelas });
    setIsEdit(true);
    setErrorMessage('');
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = (id) => {
    if (isEdit && form.id === id) {
      resetForm();
    }
    setPeserta(peserta.filter((p) => p.id !== id));
  };

  const handleToggleHadir = (id) => {
    setPeserta(
      peserta.map((p) => (p.id === id ? { ...p, hadir: !p.hadir } : p))
    );
  };

  const cleanSearch = search.trim().toLowerCase();
  const filteredPeserta = peserta.filter((p) => {
    const matchSearch =
      cleanSearch === '' ||
      p.nama.toLowerCase().includes(cleanSearch) ||
      p.nim.toLowerCase().includes(cleanSearch);

    const matchKelas =
      filterKelas === 'Semua kelas' || p.kelas === filterKelas;

    return matchSearch && matchKelas;
  });

  const total = peserta.length;
  const hadir = peserta.filter((p) => p.hadir).length;
  const belumHadir = total - hadir;
  const terlihat = filteredPeserta.length;

  return (
    <div className="container">
        <h1 className="main-title">Aplikasi Manajemen Peserta Praktikum</h1>

        <RingkasanPeserta
          total={total}
          hadir={hadir}
          belumHadir={belumHadir}
          terlihat={terlihat}
        />

        <FormPeserta
          form={form}
          setForm={setForm}
          isEdit={isEdit}
          errorMessage={errorMessage}
          handleSubmit={handleSubmit}
          handleCancelEdit={handleCancelEdit}
        />

        <FilterPeserta
          search={search}
          setSearch={setSearch}
          filterKelas={filterKelas}
          setFilterKelas={setFilterKelas}
        />

        <DaftarPeserta
          pesertaList={filteredPeserta}
          totalData={total}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleHadir={handleToggleHadir}
        />
    </div>
  );
}