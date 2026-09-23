import React from 'react';

interface InteliLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  showSignature?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Símbolo oficial do Inteli: Domo / Esfera de pontos em perspectiva (Brandbook 2025 - pág. 56)
 */
export const InteliSymbol: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-8',
  color = '#ff4545',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Símbolo Inteli"
    >
      {/* Dynamic Dot Sphere Matrix (Isometric dome curve as per Inteli Brandbook) */}
      {/* Top curve */}
      <circle cx="76" cy="18" r="3.2" fill={color} />
      <circle cx="84" cy="20" r="2.8" fill={color} />
      <circle cx="91" cy="24" r="2.2" fill={color} />

      {/* Row 2 */}
      <circle cx="68" cy="24" r="4.2" fill={color} />
      <circle cx="77" cy="27" r="4.0" fill={color} />
      <circle cx="86" cy="32" r="3.4" fill={color} />
      <circle cx="93" cy="38" r="2.6" fill={color} />

      {/* Row 3 */}
      <circle cx="61" cy="33" r="5.2" fill={color} />
      <circle cx="71" cy="37" r="5.0" fill={color} />
      <circle cx="81" cy="43" r="4.4" fill={color} />
      <circle cx="90" cy="51" r="3.6" fill={color} />

      {/* Row 4 (Equator/Main bulge) */}
      <circle cx="56" cy="45" r="6.0" fill={color} />
      <circle cx="67" cy="50" r="5.8" fill={color} />
      <circle cx="78" cy="58" r="5.0" fill={color} />
      <circle cx="87" cy="67" r="4.0" fill={color} />

      {/* Row 5 */}
      <circle cx="53" cy="59" r="6.2" fill={color} />
      <circle cx="65" cy="66" r="5.8" fill={color} />
      <circle cx="76" cy="75" r="4.8" fill={color} />

      {/* Row 6 */}
      <circle cx="52" cy="74" r="5.6" fill={color} />
      <circle cx="64" cy="82" r="5.0" fill={color} />

      {/* Bottom anchor */}
      <circle cx="52" cy="88" r="4.4" fill={color} />
    </svg>
  );
};

/**
 * Logo Oficial Inteli: Wordmark 'inteli' + pingo coral no primeiro 'i' + símbolo no canto superior direito (Brandbook 2025)
 */
export const InteliLogo: React.FC<InteliLogoProps> = ({
  className = '',
  theme = 'dark',
  showSignature = false,
  size = 'md',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#2e2640';
  const coralColor = '#ff4545';
  const signatureColor = isDark ? '#b2b6bf' : '#3c3253';

  const heights = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 280 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto`}
        aria-label="Logo Inteli"
      >
        {/* Wordmark 'inteli' */}
        {/* First 'i' */}
        {/* Stem */}
        <rect x="22" y="38" width="7.2" height="34" rx="1.5" fill={textColor} />
        {/* Coral dot on first 'i' (Brandbook requirement) */}
        <circle cx="25.6" cy="27" r="4.2" fill={coralColor} />

        {/* 'n' */}
        <path
          d="M43 38V72H50.2V51.8C50.2 46.5 53.6 43.8 58.4 43.8C63.2 43.8 66.5 46.5 66.5 51.8V72H73.7V50.8C73.7 42.5 68.6 37.4 60.6 37.4C55.4 37.4 51.3 39.8 49.6 43.2H49.2V38H43Z"
          fill={textColor}
        />

        {/* 't' */}
        <path
          d="M87 27V38H79V44H87V63.5C87 69 89.8 72 95.8 72C98.4 72 100.8 71.4 102 70.4V64.6C101 65.2 99.6 65.6 98.2 65.6C95.5 65.6 94.2 64.2 94.2 61.2V44H102V38H94.2V27H87Z"
          fill={textColor}
        />

        {/* 'e' */}
        <path
          d="M130 54.8H113.8C114.5 49.5 118.2 43.8 124.6 43.8C129.5 43.8 132.8 46.8 133.5 50.8H140.7C139.7 43.4 133.4 37.4 124.6 37.4C114.2 37.4 106.5 45.4 106.5 55.4C106.5 65.6 114.5 73 124.8 73C134.2 73 140.5 66.4 140.8 56.6C140.8 55.8 140.8 55.2 140.7 54.8H130ZM113.8 59.8C114.8 64.6 119 67.2 124.5 67.2C129.4 67.2 133.2 64.5 133.7 59.8H113.8Z"
          fill={textColor}
        />

        {/* 'l' */}
        <rect x="149" y="22" width="7.2" height="50" rx="1.5" fill={textColor} />

        {/* Second 'i' */}
        <rect x="165" y="38" width="7.2" height="34" rx="1.5" fill={textColor} />
        <circle cx="168.6" cy="27" r="4.2" fill={textColor} />

        {/* Símbolo Inteli (Sphere Dot Matrix) located at upper right above the wordmark */}
        <g transform="translate(162, -2) scale(0.65)">
          {/* Row 1 */}
          <circle cx="68" cy="12" r="3.0" fill={coralColor} />
          <circle cx="77" cy="14" r="2.6" fill={coralColor} />
          <circle cx="85" cy="18" r="2.0" fill={coralColor} />

          {/* Row 2 */}
          <circle cx="58" cy="17" r="3.8" fill={coralColor} />
          <circle cx="68" cy="20" r="3.6" fill={coralColor} />
          <circle cx="78" cy="25" r="3.0" fill={coralColor} />
          <circle cx="86" cy="31" r="2.4" fill={coralColor} />

          {/* Row 3 */}
          <circle cx="49" cy="25" r="4.6" fill={coralColor} />
          <circle cx="60" cy="29" r="4.4" fill={coralColor} />
          <circle cx="71" cy="35" r="3.8" fill={coralColor} />
          <circle cx="81" cy="43" r="3.0" fill={coralColor} />

          {/* Row 4 */}
          <circle cx="43" cy="36" r="5.2" fill={coralColor} />
          <circle cx="55" cy="41" r="5.0" fill={coralColor} />
          <circle cx="67" cy="49" r="4.2" fill={coralColor} />
          <circle cx="77" cy="58" r="3.4" fill={coralColor} />

          {/* Row 5 */}
          <circle cx="39" cy="49" r="5.2" fill={coralColor} />
          <circle cx="52" cy="56" r="4.8" fill={coralColor} />
          <circle cx="64" cy="65" r="4.0" fill={coralColor} />

          {/* Row 6 */}
          <circle cx="38" cy="63" r="4.6" fill={coralColor} />
          <circle cx="50" cy="71" r="4.0" fill={coralColor} />

          {/* Row 7 */}
          <circle cx="38" cy="76" r="3.6" fill={coralColor} />
        </g>
      </svg>

      {/* Assinatura Institucional (Brandbook pág. 50 e 54) */}
      {showSignature && (
        <div className="hidden sm:flex flex-col border-l border-slate-700/60 pl-3 leading-none select-none">
          <span
            className="text-[9px] font-bold tracking-[0.16em] uppercase"
            style={{ color: signatureColor, fontFamily: 'var(--font-sans)' }}
          >
            INSTITUTO DE
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.16em] uppercase mt-0.5"
            style={{ color: signatureColor, fontFamily: 'var(--font-sans)' }}
          >
            TECNOLOGIA
          </span>
          <span
            className="text-[9px] font-bold tracking-[0.16em] uppercase mt-0.5"
            style={{ color: coralColor, fontFamily: 'var(--font-sans)' }}
          >
            E LIDERANÇA
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Grafismo dos 3 Pilares (Brandbook pág. 75-78)
 * O encontro de 3 planos a 120° representando:
 * Liderança (Plano Superior), Tecnologia (Plano Esquerdo), Negócios (Plano Direito)
 */
export const InteliPillarsGraphic: React.FC<{ className?: string }> = ({
  className = 'w-48 h-48',
}) => {
  return (
    <svg
      viewBox="0 0 300 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 3 Planes meeting at center (150, 130) with 120-degree angles */}
      {/* Left/Bottom-Left Face: Roxo Institucional (#2e2640) */}
      <polygon
        points="0,40 150,130 150,260 0,260"
        fill="#2e2640"
        opacity="0.95"
      />

      {/* Right/Bottom-Right Face: Coral Inteli (#ff4545) */}
      <polygon
        points="300,40 300,260 150,260 150,130"
        fill="#ff4545"
        opacity="0.9"
      />

      {/* Top Face: Lilás / Cinza Claro (#90a5e5 / #e6eaeb) */}
      <polygon
        points="150,0 300,40 150,130 0,40"
        fill="#90a5e5"
        opacity="0.85"
      />

      {/* Inner subtle connecting line */}
      <line x1="150" y1="130" x2="150" y2="260" stroke="#1f192c" strokeWidth="2" opacity="0.6" />
      <line x1="150" y1="130" x2="0" y2="40" stroke="#1f192c" strokeWidth="2" opacity="0.4" />
      <line x1="150" y1="130" x2="300" y2="40" stroke="#1f192c" strokeWidth="2" opacity="0.4" />
    </svg>
  );
};
