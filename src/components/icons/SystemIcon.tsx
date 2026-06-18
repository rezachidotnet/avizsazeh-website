import { cn } from '@/lib/utils';

export type IconKey =
  | 'linear'
  | 'grid'
  | 'tile'
  | 'baffle'
  | 'architecture'
  | 'engineering'
  | 'system'
  | 'execution'
  | 'office'
  | 'team'
  | 'control'
  | 'quality';

/**
 * Monoline engineering icons. Geometry restricted to straight lines and
 * 90/45° angles, snapped to the grid. Single consistent stroke weight.
 * `currentColor` for stroke; the gold transformation node is opt-in.
 */
const paths: Record<IconKey, React.ReactNode> = {
  linear: (
    <>
      <path d="M3 6h18M3 10h18M3 14h18M3 18h18" />
    </>
  ),
  grid: (
    <>
      <path d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18" />
    </>
  ),
  tile: (
    <>
      <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
    </>
  ),
  baffle: (
    <>
      <path d="M5 3v18M9 3v18M13 3v18M17 3v18M19 3v18M3 3h18" />
    </>
  ),
  architecture: (
    <>
      <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
    </>
  ),
  engineering: (
    <>
      <path d="M5 5h6v6H5zM13 13h6v6h-6zM11 8h2M16 11v2" />
    </>
  ),
  system: (
    <>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </>
  ),
  execution: (
    <>
      <path d="M3 12h13M11 7l5 5-5 5" />
    </>
  ),
  office: (
    <>
      <path d="M4 21V5h10v16M14 21V9h6v12M3 21h18M7 9h4M7 13h4M17 13h0M17 17h0" />
    </>
  ),
  team: (
    <>
      <path d="M3 20v-2l4-2 4 2v2M7 8v4M13 20v-2l4-2 4 2v2M17 8v4M4 5h6M14 5h6" />
    </>
  ),
  control: (
    <>
      <path d="M4 4v16h16M8 16l3-5 3 3 5-7" />
    </>
  ),
  quality: (
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4" />
    </>
  ),
};

export function SystemIcon({
  name,
  className,
  node = false,
}: {
  name: IconKey;
  className?: string;
  /** show the gold transformation node (use sparingly, on key system points) */
  node?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {paths[name]}
      {node ? <circle cx="20" cy="4" r="1.6" fill="#B89A63" stroke="none" /> : null}
    </svg>
  );
}
