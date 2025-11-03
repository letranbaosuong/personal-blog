/**
 * Layout Wrapper - Client component to conditionally render Header/Footer
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface LayoutWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}

export default function LayoutWrapper({ children, header, footer }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if current route is taskflow (any locale)
  const isTaskFlowPage = pathname?.includes('/taskflow');

  // For TaskFlow, render full screen without header/footer
  if (isTaskFlowPage) {
    return <div className="h-screen overflow-hidden">{children}</div>;
  }

  // For other pages, render with header and footer
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
