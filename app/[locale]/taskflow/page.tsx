/**
 * TaskFlow - Main Page
 * A modern task management application
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LocalePageProps } from '@/types/i18n';
import TaskFlowClient from './TaskFlowClient';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: 'TaskFlow - Smart Task Management',
    vi: 'TaskFlow - Quản lý Công việc Thông minh',
    ja: 'TaskFlow - スマートタスク管理',
    zh: 'TaskFlow - 智能任务管理',
    ko: 'TaskFlow - 스마트 작업 관리',
    th: 'TaskFlow - การจัดการงานอัจฉริยะ',
  };

  return {
    title: titles[locale] || titles.en,
    description: 'Modern task management with projects, sub-tasks, and smart scheduling',
  };
}

export default async function TaskFlowPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TaskFlowClient />;
}
