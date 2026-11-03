import React from 'react';

export default function RingkasanPeserta({ total, hadir, belumHadir, terlihat }) {
  return (
    <div className="summary-container">
      <div className="summary-card"><strong>Total Peserta:</strong> {total}</div>
      <div className="summary-card"><strong>Hadir:</strong> {hadir}</div>
      <div className="summary-card"><strong>Belum Hadir:</strong> {belumHadir}</div>
      <div className="summary-card"><strong>Hasil Ditampilkan:</strong> {terlihat}</div>
    </div>
  );
}