import React from 'react';

export default function FilterPeserta({ search, setSearch, filterKelas, setFilterKelas }) {
  return (
    <div className="card">
      <h3>Pencarian & Filter</h3>
      <div className="filter-grid">
        <div>
          <label>Cari (Nama / NIM):</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari..."
            className="input-control"
          />
        </div>
        <div>
          <label>Filter Kelas:</label>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="input-control"
          >
            <option value="Semua kelas">Semua kelas</option>
            <option value="TI-2A">TI-2A</option>
            <option value="TI-2B">TI-2B</option>
          </select>
        </div>
      </div>
    </div>
  );
}