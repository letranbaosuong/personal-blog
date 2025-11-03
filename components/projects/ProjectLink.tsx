/**
 * ProjectLink Component - Smart link for project buttons
 * Handles both internal and external links appropriately
 */

import Link from 'next/link';

interface ProjectLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'github' | 'demo';
}

export default function ProjectLink({
  href,
  children,
  className = '',
  variant = 'demo',
}: ProjectLinkProps) {
  const isInternal = href.startsWith('/');

  if (isInternal) {
    // Internal link - use Next.js Link
    return (
      <Link
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </Link>
    );
  }

  // External link - use regular anchor
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
