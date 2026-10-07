interface HeronProps {
  className?: string;
}

export function Heron({ className }: HeronProps) {
  return (
    <svg
      className={className}
      viewBox="3.5 1 62 62"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M40 10c-6 0-9 3-7.5 8 1.5 5 7.5 7 7.5 13" />
      <path
        fill="currentColor"
        stroke="none"
        d="M40 7.5 61 10 40 12.5ZM37.5 27.5C27 28 15 37 8 48c11 2 25 .5 31-6 3.5-4 3.7-8 3.5-12Z"
      />
      <path strokeWidth="4.5" d="M29 47v10" />
    </svg>
  );
}
