import React from 'react';

export const TransitHeart: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => (
  <svg
    className={`transit-heart ${compact ? 'transit-heart--compact' : ''} ${className}`}
    viewBox="0 0 360 180"
    role="img"
    aria-label="换乘线路图形"
  >
    <path className="transit-heart__ghost" d="M12 20 H348 M12 164 H348" />
    <path className="transit-heart__line transit-heart__line--blue" d="M8 142 H55 C93 142 92 38 138 38 H174 C207 38 206 98 239 98 H350" />
    <path className="transit-heart__line transit-heart__line--pink" d="M10 57 H78 C111 57 114 147 155 147 H193 C231 147 236 34 282 34 H350" />
    <path className="transit-heart__line transit-heart__line--ink" d="M17 104 H103 C135 104 145 78 178 78 C211 78 220 119 254 119 H343" />
    {[[8,142],[55,142],[104,85],[138,38],[174,38],[207,78],[239,98],[350,98],[10,57],[78,57],[119,105],[155,147],[193,147],[225,91],[282,34],[350,34],[17,104],[103,104],[145,87],[178,78],[220,106],[254,119],[343,119]].map(([cx, cy], index) => (
      <circle key={index} cx={cx} cy={cy} r={index % 4 === 0 ? 4.8 : 3.4} />
    ))}
  </svg>
);
