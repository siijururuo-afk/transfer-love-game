import React from 'react';

export const TransitHeart: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => (
  <svg
    className={`transit-heart ${compact ? 'transit-heart--compact' : ''} ${className}`}
    viewBox="0 0 320 270"
    role="img"
    aria-label="由地铁线路组成的爱心"
  >
    <path className="transit-heart__ghost" d="M24 155 C65 113 69 55 119 49 C146 46 159 65 160 87 C161 62 180 43 208 48 C264 58 269 121 299 156" />
    <path className="transit-heart__line transit-heart__line--ink" d="M29 150 L74 107 L91 66 L130 54 L160 86 L191 54 L232 69 L251 110 L294 151 L249 191 L209 226 L160 252 L111 226 L70 191 Z" />
    <path className="transit-heart__line transit-heart__line--pink" d="M45 174 L92 158 L125 177 L160 159 L195 177 L229 158 L277 174" />
    <path className="transit-heart__line transit-heart__line--blue" d="M72 109 L110 128 L160 86 L210 128 L251 110" />
    <path className="transit-heart__line transit-heart__line--yellow" d="M91 66 L111 226 M232 69 L209 226" />
    {[
      [29,150],[74,107],[91,66],[130,54],[160,86],[191,54],[232,69],[251,110],[294,151],
      [249,191],[209,226],[160,252],[111,226],[70,191],[92,158],[125,177],[160,159],[195,177],[229,158],
      [110,128],[210,128],
    ].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r={index % 4 === 0 ? 6 : 4.5} />)}
    {!compact && <text x="160" y="142" textAnchor="middle">TRANSIT LOVE</text>}
  </svg>
);
