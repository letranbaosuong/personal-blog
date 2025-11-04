/**
 * ProjectLink Component - Smart link for project buttons
 * Handles both internal and external links appropriately
 */

'use client';

import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  // Extract locale from pathname (e.g., /en/projects/... -> en)
  const locale = pathname.split('/')[1];

  // Check if it's an external URL (starts with http:// or https://)
  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  // For all links (both external and internal), use regular anchor tag
  // This ensures target="_blank" works correctly and opens in new tab
  const finalHref = isExternal ? href : `/${locale}/${href}`;

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
