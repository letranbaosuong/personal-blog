/**
 * ProjectLink Component - Smart link for project buttons
 * Handles both internal and external links appropriately
 */

import { Link } from '@/lib/i18n/navigation';

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
  // Check if it's an external URL (starts with http:// or https://)
  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  if (isExternal) {
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

  // Internal link - use i18n Link (will automatically add locale prefix)
  return (
    <Link
      href={`/${href}`}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}
