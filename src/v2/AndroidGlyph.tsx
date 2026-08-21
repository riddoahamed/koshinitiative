// The Android robot, drawn inline so it inherits `currentColor` and stays crisp
// at any size. Monochrome on purpose: Android's green next to Kosh's mint reads
// as two brands arguing, and the silhouette is what carries the recognition.
//
// Android is a trademark of Google LLC; the robot is used per the Creative
// Commons Attribution 3.0 licence Google publishes it under.

export const AndroidGlyph = ({ size = 16 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7.1 3.1 8.9 5.9M16.9 3.1 15.1 5.9"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      fill="none"
    />
    <path
      fillRule="evenodd"
      d="M4.6 10.5a7.4 7.4 0 0 1 14.8 0zM9.2 8.1a.82.82 0 1 0 0-1.64.82.82 0 0 0 0 1.64m5.6 0a.82.82 0 1 0 0-1.64.82.82 0 0 0 0 1.64"
    />
    <rect x="4.6" y="11.7" width="14.8" height="7.5" rx="1.25" />
    <rect x="1.3" y="11.7" width="2.5" height="7.1" rx="1.25" />
    <rect x="20.2" y="11.7" width="2.5" height="7.1" rx="1.25" />
    <rect x="7.5" y="19.4" width="2.6" height="3.5" rx="1.3" />
    <rect x="13.9" y="19.4" width="2.6" height="3.5" rx="1.3" />
  </svg>
);
