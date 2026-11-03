import React from 'react';

export default function ItemPeserta({ peserta, onEdit, onDelete, onToggleHadir }) {
  return (
    <tr className="table-row">
      <td className="td">{peserta.nama}</td>
      <td className="td">{peserta.nim}</td>
      <td className="td">{peserta.kelas}</td>
      <td className="td">
        <span className={peserta.hadir ? 'badge badge-hadir' : 'badge badge-belum'}>
          {peserta.hadir ? 'Hadir' : 'Belum hadir'}
        </span>
      </td>
      <td className="td">
        <button
          onClick={() => onToggleHadir(peserta.id)}
          className={peserta.hadir ? 'btn btn-warning' : 'btn btn-success'}
        >
          {peserta.hadir ? 'Batalkan hadir' : 'Tandai hadir'}
        </button>
        <button onClick={() => onEdit(peserta)} className="btn btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(peserta.id)} className="btn btn-danger">
          Hapus
        </button>
      </td>
    </tr>
  );
}