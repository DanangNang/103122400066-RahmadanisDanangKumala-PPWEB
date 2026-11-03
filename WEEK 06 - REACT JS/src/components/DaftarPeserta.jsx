import React from 'react';
import ItemPeserta from './ItemPeserta';

export default function DaftarPeserta({ pesertaList, totalData, onEdit, onDelete, onToggleHadir }) {
  if (totalData === 0) {
    return <div className="empty-state">Belum ada peserta</div>;
  }

  if (pesertaList.length === 0) {
    return <div className="empty-state">Peserta tidak ditemukan</div>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="th">Nama</th>
          <th className="th">NIM</th>
          <th className="th">Kelas</th>
          <th className="th">Status Kehadiran</th>
          <th className="th">Tindakan</th>
        </tr>
      </thead>
      <tbody>
        {pesertaList.map((p) => (
          <ItemPeserta
            key={p.id}
            peserta={p}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleHadir={onToggleHadir}
          />
        ))}
      </tbody>
    </table>
  );
}