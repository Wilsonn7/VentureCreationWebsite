import { useEffect, useState } from 'react';
import { getPromosi } from '../../services/api';
import links from '../../data/links.json';
import styles from './Promosi.module.css';

export default function Promosi() {
  const [packs, setPacks] = useState([]);
  const [posts, setPosts] = useState(1);
  const [stories, setStories] = useState(1);
  const [design, setDesign] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [form, setForm] = useState({ nama: '', kebutuhan: '', kontak: '' });

  useEffect(() => { getPromosi().then(setPacks); }, []);

  const message = `Halo Publicles, aku mau promosi.\nPilihan: ${posts} post, ${stories} story${design ? ', desain konten' : ''}${urgent ? ', urgensi tinggi' : ''}.\nNama: ${form.nama || '-'}.\nKebutuhan: ${form.kebutuhan || '-'}.\nKontak: ${form.kontak || '-'}.`;
  const href = `https://wa.me/${links.WA_NUMBER}?text=${encodeURIComponent(message)}`;

  const submit = (event) => {
    event.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="promosi" className={styles.section} aria-labelledby="promosi-title">
      <div className={styles.inner}>
        <h2 id="promosi-title" className={styles.title}>Punya produk, event, atau kampanye? Biar Publicles bantu kabarkan.</h2>
        <div className={styles.grid}>
          {packs.map((pack) => (
            <article className={styles.card} key={pack.id}>
              <h3>{pack.nama}</h3><p>{pack.deskripsi}</p><p className={styles.price}>{pack.harga}</p>
              <ul>{pack.fitur.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className={styles.calculator}>
          <div className={styles.field}>
            <label htmlFor="posts">Jumlah Post Feed: {posts}</label>
            <input id="posts" type="range" min="0" max="10" value={posts} onChange={(event) => setPosts(Number(event.target.value))} />
            <label htmlFor="stories">Jumlah Story: {stories}</label>
            <input id="stories" type="range" min="0" max="20" value={stories} onChange={(event) => setStories(Number(event.target.value))} />
            <div className={styles.toggles}>
              <label className={styles.toggle}><input type="checkbox" checked={design} onChange={(event) => setDesign(event.target.checked)} /> Tambahan desain konten</label>
              <label className={styles.toggle}><input type="checkbox" checked={urgent} onChange={(event) => setUrgent(event.target.checked)} /> Urgensi tinggi</label>
            </div>
          </div>
          <div className={styles.summary}>
            <h3>Ringkasan pesanan</h3>
            <p>{posts} post · {stories} story<br />{design ? 'Termasuk desain konten' : 'Tanpa desain konten'} · {urgent ? 'Urgensi tinggi' : 'Urutan biasa'}</p>
            <a href={href} target="_blank" rel="noopener noreferrer">Pesan lewat WhatsApp</a>
          </div>
        </div>

        <div className={styles.calculator}>
          <div>
            <h3>Kerja sama lain</h3>
            <p>Kami terbuka untuk kerja sama lain. Ceritakan kebutuhanmu dan pesannya akan disusun untuk dikirim lewat WhatsApp.</p>
          </div>
          <form className={styles.form} onSubmit={submit}>
            <label htmlFor="nama">Nama<input id="nama" value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} /></label>
            <label htmlFor="kebutuhan">Kebutuhan<textarea id="kebutuhan" value={form.kebutuhan} onChange={(event) => setForm({ ...form, kebutuhan: event.target.value })} /></label>
            <label htmlFor="kontak">Kontak<input id="kontak" value={form.kontak} onChange={(event) => setForm({ ...form, kontak: event.target.value })} /></label>
            <button type="submit">Susun & kirim lewat WhatsApp</button>
          </form>
        </div>
      </div>
    </section>
  );
}
