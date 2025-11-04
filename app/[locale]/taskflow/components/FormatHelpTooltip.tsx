/**
 * FormatHelpTooltip Component - Help tooltip for Notes formatting
 */

'use client';

import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FormatHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('taskflow.formatHelp');

  return (
    <>
      <div className="relative inline-block">
        <button
          type="button"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          aria-label="Formatting help"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Desktop tooltip */}
        {isOpen && (
          <div className="hidden sm:block absolute left-0 top-6 z-50 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            {/* Arrow */}
            <div className="absolute -top-2 left-4 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />

            {/* Content */}
            <div className="relative space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('title')}
              </h4>

              <div className="space-y-2 text-xs">
              {/* Checkboxes */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  {t('checkboxes')}
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>{t('checkboxUnchecked')}</div>
                  <div>{t('checkboxChecked')}</div>
                </div>
              </div>

              {/* Tree structure */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  {t('tree')}
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>{t('treeParent')}</div>
                  <div>{t('treeChild')}</div>
                  <div>{t('treeGrandchild')}</div>
                </div>
                <div className="ml-3 mt-1 text-slate-500 dark:text-slate-400">
                  {t('treeHint')}
                </div>
              </div>

              {/* Mentions */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  {t('mentions')}
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>{t('mentionTask')}</div>
                  <div>{t('mentionProject')}</div>
                  <div>{t('mentionContact')}</div>
                </div>
              </div>

              {/* Example */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  {t('example')}
                </div>
                <div className="ml-3 mt-1 rounded bg-slate-50 p-2 font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400 whitespace-pre-wrap">
                  {t('exampleText')}
                </div>
              </div>
              </div>

              {/* Tip */}
              <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                <p className="text-xs text-blue-900 dark:text-blue-300">
                  <strong>{t('tip')}</strong> {t('tipText')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile modal */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            {/* Content */}
            <div className="relative space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('title')}
              </h4>

              <div className="space-y-2 text-xs">
                {/* Checkboxes */}
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    {t('checkboxes')}
                  </div>
                  <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                    <div>{t('checkboxUnchecked')}</div>
                    <div>{t('checkboxChecked')}</div>
                  </div>
                </div>

                {/* Tree structure */}
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    {t('tree')}
                  </div>
                  <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                    <div>{t('treeParent')}</div>
                    <div>{t('treeChild')}</div>
                    <div>{t('treeGrandchild')}</div>
                  </div>
                  <div className="ml-3 mt-1 text-slate-500 dark:text-slate-400">
                    {t('treeHint')}
                  </div>
                </div>

                {/* Mentions */}
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    {t('mentions')}
                  </div>
                  <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                    <div>{t('mentionTask')}</div>
                    <div>{t('mentionProject')}</div>
                    <div>{t('mentionContact')}</div>
                  </div>
                </div>

                {/* Example */}
                <div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">
                    {t('example')}
                  </div>
                  <div className="ml-3 mt-1 rounded bg-slate-50 p-2 font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400 whitespace-pre-wrap">
                    {t('exampleText')}
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
                <p className="text-xs text-blue-900 dark:text-blue-300">
                  <strong>{t('tip')}</strong> {t('tipText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
