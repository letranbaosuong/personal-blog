/**
 * TaskFlow Layout
 * Full-screen layout without header/footer for immersive task management
 */

import { ReactNode } from 'react';

interface TaskFlowLayoutProps {
  children: ReactNode;
}

export default function TaskFlowLayout({ children }: TaskFlowLayoutProps) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
