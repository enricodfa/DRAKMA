type DrakmaLogoProps = {
  size?: number
}

export default function DrakmaLogo({ size = 40 }: DrakmaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Dark circle background */}
      <circle cx="20" cy="20" r="20" fill="#1B1B1F" />

      {/* Gold outer ring arc */}
      <circle cx="20" cy="20" r="17" stroke="#C9A86A" strokeWidth="1.5" strokeDasharray="80 27" strokeLinecap="round" />

      {/* Owl body */}
      <ellipse cx="17" cy="24" rx="5" ry="6" fill="#C9A86A" />

      {/* Owl head */}
      <circle cx="17" cy="17" r="4.5" fill="#C9A86A" />

      {/* Owl eyes */}
      <circle cx="15.2" cy="17" r="1.4" fill="#1B1B1F" />
      <circle cx="18.8" cy="17" r="1.4" fill="#1B1B1F" />
      <circle cx="17" cy="17.5" r="0.7" fill="#1B1B1F" />

      {/* Owl wings */}
      <path d="M12 21 Q9 24 10 28 Q13 26 14 23Z" fill="#C9A86A" />

      {/* Trend arrow up */}
      <path d="M22 27 L29 14" stroke="#C9A86A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25 14 L29 14 L29 18" stroke="#C9A86A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Triangle (delta) */}
      <path d="M24 25 L27 25 L25.5 22.5Z" stroke="#C9A86A" strokeWidth="1.2" fill="none" strokeLinejoin="round" />

      {/* Owl feet */}
      <path d="M14 30 L14 28 M17 30 L17 28 M20 30 L20 28" stroke="#C9A86A" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
