import { BadgeCheck, TriangleAlert } from 'lucide-react';
import styles from './UpdatedBadge.module.css';

function formatCheckedDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  if (!year || !month || !day) return '';
  return `${day} ${months[month - 1]} ${year}`;
}

export default function UpdatedBadge({ dicekTanggal, status, sumber = [] }) {
  const hasSource = Array.isArray(sumber) && sumber.length > 0 && sumber.some((item) => item?.url);
  const checkedDate = formatCheckedDate(dicekTanggal);

  let label;
  let tone;
  if (status === 'terverifikasi-sebagian') {
    label = checkedDate ? `Syarat dicek: ${checkedDate}` : 'Perlu diverifikasi';
    tone = styles.pending;
  } else if (status === 'terverifikasi' && checkedDate && hasSource) {
    label = `Terverifikasi: ${checkedDate}`;
    tone = styles.verified;
  } else {
    label = 'Perlu diverifikasi';
    tone = styles.pending;
  }

  const verified = status === 'terverifikasi' && checkedDate && hasSource;

  return (
    <span className={`${styles.badge} ${tone}`}>
      {verified ? <BadgeCheck size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
      {label}
    </span>
  );
}
