/**
 * i18n Navigation Utilities
 * Type-safe navigation helpers with internationalization support
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
