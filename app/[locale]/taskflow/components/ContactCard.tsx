/**
 * ContactCard Component - Display a single contact card
 */

'use client';

import { useState } from 'react';
import { Contact } from '../types';
import { Star, Mail, Phone, Briefcase, MapPin, Share2 } from 'lucide-react';
import { ShareDialog } from './ShareDialog';

interface ContactCardProps {
  contact: Contact;
  onToggleImportant: (id: string) => void;
  onClick?: () => void;
}

export default function ContactCard({
  contact,
  onToggleImportant,
  onClick,
}: ContactCardProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  return (
    <div
      className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-4 transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-semibold text-white">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Name & Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {contact.name}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShareDialogOpen(true);
                }}
                className="flex-shrink-0 rounded p-0.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Share contact"
              >
                <Share2
                  className="h-4 w-4 text-slate-400 transition-colors hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleImportant(contact.id);
                }}
                className="flex-shrink-0"
              >
                <Star
                  className={`h-4 w-4 transition-colors ${
                    contact.isImportant
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 hover:text-yellow-400 dark:text-slate-600'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Info snippets */}
          <div className="mt-2 space-y-1">
            {contact.occupation && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Briefcase className="h-3.5 w-3.5" />
                <span className="truncate">
                  {contact.occupation}
                  {contact.company && ` @ ${contact.company}`}
                </span>
              </div>
            )}
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{contact.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {contact.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
              {contact.tags.length > 3 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  +{contact.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Relationship */}
          {contact.relationship && (
            <div className="mt-2">
              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                {contact.relationship}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        data={contact}
        type="contact"
        title="Share Contact"
      />
    </div>
  );
}
