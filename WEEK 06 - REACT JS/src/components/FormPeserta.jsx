import React from 'react';

export default function FormPeserta({
  form,
  setForm,
  isEdit,
  errorMessage,
  handleSubmit,
  handleCancelEdit
}) {
  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>{isEdit ? 'Ubah Peserta' : 'Tambah Peserta'}</h3>
      {errorMessage && <div className="error-box">{errorMessage}</div>}
      
      <div className="form-group">
        <label>Nama Mahasiswa:</label>
        <input
          type="text"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          placeholder="Masukkan nama"
          className="input-control"
        />
      </div>

      <div className="form-group">
        <label>NIM (8 Digit):</label>
        <input
          type="text"
          value={form.nim}
          onChange={(e) => setForm({ ...form, nim: e.target.value })}
          placeholder="Contoh: 10121001"
          className="input-control"
        />
      </div>

      <div className="form-group">
        <label>Kelas:</label>
        <select
          value={form.kelas}
          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
          className="input-control"
        >
          <option value="">Pilih kelas</option>
          <option value="TI-2A">TI-2A</option>
          <option value="TI-2B">TI-2B</option>
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Simpan perubahan' : 'Tambah peserta'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
            Batal
          </button>
        )}
      </div>
    </form>
  );
}