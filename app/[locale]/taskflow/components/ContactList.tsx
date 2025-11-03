/**
 * ContactList Component - Display list of contacts
 */

'use client';

import { Contact } from '../types';
import ContactCard from './ContactCard';

interface ContactListProps {
  contacts: Contact[];
  onToggleImportant: (id: string) => void;
  onContactClick?: (contact: Contact) => void;
  emptyMessage?: string;
}

export default function ContactList({
  contacts,
  onToggleImportant,
  onContactClick,
  emptyMessage = 'No contacts yet. Add your first contact!',
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-6xl">👥</div>
        <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onToggleImportant={onToggleImportant}
          onClick={() => onContactClick?.(contact)}
        />
      ))}
    </div>
  );
}
