import React from 'react';

export const TransitHeart: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => (
  <svg
    className={`transit-heart ${compact ? 'transit-heart--compact' : ''} ${className}`}
    viewBox="0 0 320 220"
    role="img"
    aria-label="换乘线路图形"
  >
    <path className="transit-heart__ghost" d="M18 183 C64 165 83 133 115 120 C171 97 225 122 302 83" />
    <path className="transit-heart__ghost" d="M24 44 C88 31 108 77 151 84 C207 93 238 57 298 52" />
    <path className="transit-heart__line transit-heart__line--ink" d="M160 202 C139 182 54 123 54 72 C54 38 79 18 111 18 C136 18 151 35 160 53 C169 35 184 18 209 18 C241 18 266 38 266 72 C266 123 181 182 160 202" />
    <path className="transit-heart__line transit-heart__line--blue" d="M22 158 C76 158 105 121 150 104 C199 85 252 94 299 50" />
    <path className="transit-heart__line transit-heart__line--pink" d="M26 50 C93 50 104 175 160 175 C216 175 230 53 296 53" />
    {[[54,72],[76,124],[118,167],[160,202],[202,167],[245,121],[266,72],[111,18],[160,53],[209,18],[22,158],[96,140],[150,104],[224,92],[299,50],[26,50],[93,76],[128,143],[160,175],[196,139],[230,91],[296,53]].map(([cx, cy], index) => (
      <circle key={index} cx={cx} cy={cy} r={index % 5 === 0 ? 5.5 : 3.8} />
    ))}
  </svg>
);
