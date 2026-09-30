export function Icon({
  name = "arrow",
  className = "",
}: {
  name?: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M19 12H5m6-6-6 6 6 6" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M8 8V6a4 4 0 0 1 8 0v2" />
      </>
    ),
    heart: (
      <path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 2 10 8 15 6-5 12-11 8-15Z" />
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    gift: (
      <>
        <rect x="4" y="9" width="16" height="12" rx="2" />
        <path d="M3 9h18M12 5v16" />
        <path d="M12 8C2 8 6 0 10 4l2 4c10 0 6-8 2-4l-2 4Z" />
      </>
    ),
    bottle: (
      <>
        <rect x="6" y="7" width="12" height="14" rx="3" />
        <path d="M9 3h6v4H9zM9 12h6" />
      </>
    ),
    spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" />,
    top: <path d="M12 20V4m-6 6 6-6 6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r=".5" />
      </>
    ),
    facebook: (
      <path d="M14 22V12h4l1-4h-5V6c0-2 1-3 5-2V1c-6-1-9 1-9 5v2H7v4h3v10" />
    ),
    x: <path d="M4 3h4l12 18h-4L4 3Zm0 18L20 3" />,
    youtube: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="m10 9 6 3-6 3Z" />
      </>
    ),
    tiktok: <path d="M14 3v13a5 5 0 1 1-4-5m4-8c0 4 4 6 7 6" />,
    snapchat: (
      <path d="M7 10V8a5 5 0 0 1 10 0v2l3 1-3 2c0 4 4 4 4 5l-5 1-4 2-4-2-5-1c0-1 4-1 4-5l-3-2 3-1Z" />
    ),
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7m0-11v1m5 10v-7m0 3c0-4 5-4 5 0v4" />
      </>
    ),
  };
  return (
    <svg
      className={`${name === "arrow" ? "directional " : ""}${className}`}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
