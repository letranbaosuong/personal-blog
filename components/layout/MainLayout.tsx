/**
 * Main Layout Component
 * Uses LayoutWrapper to conditionally show Header/Footer
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import LayoutWrapper from './LayoutWrapper';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <LayoutWrapper header={<Header />} footer={<Footer />}>
      {children}
    </LayoutWrapper>
  );
}
