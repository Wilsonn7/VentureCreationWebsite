const accessoryKeys = ['topi', 'kacamata', 'bando', 'dasi', 'mahkota'];

export function getSavedAccessories() {
  try {
    const value = JSON.parse(localStorage.getItem('publicles-titik-accessories') || '[]');
    return Array.isArray(value) ? value.filter((item) => accessoryKeys.includes(item)) : [];
  } catch {
    return [];
  }
}

export { accessoryKeys };

export default function TitikAccessories({ items = [], eyeGeometry = null }) {
  return (
    <svg
      className="titikAccessories"
      viewBox="0 0 220 220"
      overflow="visible"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
    >
      {items.includes('bando') && (
        <g>
          <path d="M46 68 Q110 28 174 68" fill="none" stroke="#E5484D" strokeWidth="8" strokeLinecap="round" />
          <circle cx="46" cy="68" r="11" fill="#FFE680" stroke="#14102B" strokeWidth="4" />
          <circle cx="174" cy="68" r="11" fill="#FFE680" stroke="#14102B" strokeWidth="4" />
        </g>
      )}
      {items.includes('topi') && (
        <g>
          <path d="M68 62 Q110 25 152 62Z" fill="#4425D8" stroke="#14102B" strokeWidth="5" strokeLinejoin="round" />
          <rect x="50" y="58" width="120" height="19" rx="9" fill="#4425D8" stroke="#14102B" strokeWidth="5" />
        </g>
      )}
      {items.includes('mahkota') && (
        <path d="M48 34 L64 -16 L84 16 L110 -42 L136 16 L156 -16 L172 34Z" fill="#FFD43B" stroke="#14102B" strokeWidth="5" strokeLinejoin="round" />
      )}
      {items.includes('kacamata') && eyeGeometry && (() => {
        const distance = eyeGeometry.cxR - eyeGeometry.cxL;
        const eyeMaxRadius = Math.max(eyeGeometry.rx, eyeGeometry.ry);
        const radius = Math.max(1, Math.min(
          eyeMaxRadius * 1.25,
          (distance - 6) / 2,
          eyeGeometry.cxL - 8,
          220 - eyeGeometry.cxR - 8,
          eyeGeometry.cy - 8,
          220 - eyeGeometry.cy - 8,
        ));
        const leftInner = eyeGeometry.cxL + radius;
        const rightInner = eyeGeometry.cxR - radius;
        const leftOuter = eyeGeometry.cxL - radius;
        const rightOuter = eyeGeometry.cxR + radius;
        const leftTemple = Math.max(leftOuter - 8, 8);
        const rightTemple = Math.min(rightOuter + 8, 212);
        return (
          <g>
            <circle cx={eyeGeometry.cxL} cy={eyeGeometry.cy} r={radius} fill="#FFFFFF" fillOpacity=".12" stroke="#14102B" strokeWidth="3" />
            <circle cx={eyeGeometry.cxR} cy={eyeGeometry.cy} r={radius} fill="#FFFFFF" fillOpacity=".12" stroke="#14102B" strokeWidth="3" />
            {rightInner > leftInner && <path d={`M${leftInner} ${eyeGeometry.cy} H${rightInner}`} fill="none" stroke="#14102B" strokeWidth="3" strokeLinecap="round" />}
            <path d={`M${leftOuter} ${eyeGeometry.cy} H${leftTemple}`} fill="none" stroke="#14102B" strokeWidth="3" strokeLinecap="round" />
            <path d={`M${rightOuter} ${eyeGeometry.cy} H${rightTemple}`} fill="none" stroke="#14102B" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      })()}
      {items.includes('dasi') && (
        <g>
          <path d="M110 184 C96 184 90 194 78 198 C90 205 98 210 110 205Z" fill="#4425D8" stroke="#14102B" strokeWidth="5" strokeLinejoin="round" />
          <path d="M110 184 C124 184 130 194 142 198 C130 205 122 210 110 205Z" fill="#4425D8" stroke="#14102B" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="110" cy="195" r="8" fill="#FFD43B" stroke="#14102B" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}
