export function Logo({ className = "w-16 h-16" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="#2F79A0" />
      
      {/* Inner ring */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="1" />
      
      {/* Cooking pot/pan icon */}
      <g transform="translate(50, 42)">
        {/* Pot body */}
        <path
          d="M-12 0 L-10 12 Q-8 18 0 18 Q8 18 10 12 L12 0 Z"
          fill="white"
        />
        {/* Pot rim */}
        <ellipse cx="0" cy="0" rx="14" ry="4" fill="white" />
        <ellipse cx="0" cy="0" rx="12" ry="3" fill="#2F79A0" />
        {/* Handle */}
        <path d="M-12 2 L-16 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 2 L16 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        {/* Steam lines */}
        <path d="M-5 -10 Q-7 -14 -5 -18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M0 -10 Q2 -16 0 -20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M5 -10 Q3 -14 5 -18" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      
      {/* DFOOD text */}
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fill="white"
        fontFamily="serif"
        fontSize="9"
        fontWeight="600"
        letterSpacing="1"
      >
        DFOOD
      </text>
      
      {/* FRESHLY COOKED text */}
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fill="white"
        fontFamily="sans-serif"
        fontSize="4.5"
        fontWeight="500"
        letterSpacing="1.5"
      >
        FRESHLY COOKED
      </text>
    </svg>
  );
}

export function LogoSmall({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#2F79A0" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="2" />
      <g transform="translate(50, 50)">
        <path
          d="M-15 -5 L-12 10 Q-10 18 0 18 Q10 18 12 10 L15 -5 Z"
          fill="white"
        />
        <ellipse cx="0" cy="-5" rx="18" ry="5" fill="white" />
        <ellipse cx="0" cy="-5" rx="15" ry="4" fill="#2F79A0" />
        <path d="M-15 -3 L-20 -3" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 -3 L20 -3" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M-6 -16 Q-9 -22 -6 -26" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M0 -16 Q3 -24 0 -30" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M6 -16 Q3 -22 6 -26" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
