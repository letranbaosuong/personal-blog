/**
 * TaskFlowSettings Component
 * Compact settings bar with user profile, language switcher and theme toggle for TaskFlow
 */

'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { UserProfile } from './UserProfile';

export default function TaskFlowSettings() {
  return (
    <div className="flex items-center justify-between gap-2 p-2">
      {/* User Profile */}
      <UserProfile compact />

      {/* Settings Controls */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
