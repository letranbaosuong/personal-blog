/**
 * TaskFlowSettings Component
 * Compact settings bar with language switcher and theme toggle for TaskFlow
 */

'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function TaskFlowSettings() {
  return (
    <div className="flex items-center gap-2 p-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
