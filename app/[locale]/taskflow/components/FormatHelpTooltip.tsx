/**
 * FormatHelpTooltip Component - Help tooltip for Notes formatting
 */

'use client';

import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function FormatHelpTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
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

      {isOpen && (
        <div className="absolute left-0 top-6 z-50 w-[calc(100vw-2rem)] max-w-xs sm:w-80 sm:max-w-none rounded-lg border border-slate-200 bg-white p-3 sm:p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {/* Arrow */}
          <div className="absolute -top-2 left-2 sm:left-4 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />

          {/* Content */}
          <div className="relative space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
              Notes Formatting Guide
            </h4>

            <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
              {/* Checkboxes */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  ✓ Checkboxes:
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>- [ ] Unchecked item</div>
                  <div>- [x] Checked item</div>
                </div>
              </div>

              {/* Tree structure */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  🌳 Tree Structure (auto-detect):
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>Parent line</div>
                  <div>··Child (2 spaces)</div>
                  <div>····Grand-child (4 spaces)</div>
                </div>
                <div className="ml-3 mt-1 text-slate-500 dark:text-slate-400">
                  Parent lines auto-collapse!
                </div>
              </div>

              {/* Mentions */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  @ Mentions:
                </div>
                <div className="ml-3 space-y-1 font-mono text-slate-600 dark:text-slate-400">
                  <div>@[Task name]</div>
                  <div>@[Project name]</div>
                  <div>@[Contact name]</div>
                </div>
              </div>

              {/* Example */}
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">
                  📝 Example:
                </div>
                <div className="ml-3 mt-1 rounded bg-slate-50 p-1.5 sm:p-2 font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  <div>Meeting notes</div>
                  <div>··- [ ] Call @[John]</div>
                  <div>····- [x] Prepare slides</div>
                  <div>····- [ ] Send email</div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="rounded-md bg-blue-50 p-1.5 sm:p-2 dark:bg-blue-900/20">
              <p className="text-[10px] sm:text-xs text-blue-900 dark:text-blue-300">
                💡 <strong>Tip:</strong> Just use spaces to indent - tree structure auto-detects!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
