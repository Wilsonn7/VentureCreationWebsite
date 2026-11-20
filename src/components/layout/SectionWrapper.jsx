export default function SectionWrapper({ id, labelledBy, className = '', children }) {
  return (
    <section id={id} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
