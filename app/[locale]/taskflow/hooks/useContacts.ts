/**
 * useContacts Hook - React hook for contact management
 * Supports collaborative editing via Firebase when in shared mode
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../types';
import { contactService } from '../lib/contactService';
import { updateSharedData, type ShareType } from '../lib/shareService';

interface ShareMode {
  code: string;
  type: ShareType;
}

interface UseContactsOptions {
  shareMode?: ShareMode | null;
}

export function useContacts(options?: UseContactsOptions) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { shareMode } = options || {};

  // Load contacts
  const loadContacts = useCallback(() => {
    setLoading(true);
    try {
      const allContacts = contactService.getContacts();
      setContacts(allContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync to Firebase when in shared mode
  const syncToFirebase = useCallback(
    async (contact: Contact) => {
      if (shareMode && shareMode.type === 'contact') {
        try {
          await updateSharedData(shareMode.code, 'contact', contact);
        } catch (error) {
          console.error('Error syncing contact to Firebase:', error);
        }
      }
    },
    [shareMode]
  );

  // Initialize
  useEffect(() => {
    contactService.initializeSampleData();
    loadContacts();
  }, [loadContacts]);

  // Create contact
  const createContact = useCallback(
    (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newContact = contactService.createContact(contact);
      loadContacts();
      return newContact;
    },
    [loadContacts]
  );

  // Update contact
  const updateContact = useCallback(
    async (id: string, updates: Partial<Contact>) => {
      const updated = contactService.updateContact(id, updates);
      if (updated) {
        loadContacts();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadContacts, syncToFirebase]
  );

  // Delete contact
  const deleteContact = useCallback(
    (id: string) => {
      const success = contactService.deleteContact(id);
      if (success) loadContacts();
      return success;
    },
    [loadContacts]
  );

  // Toggle important
  const toggleImportant = useCallback(
    async (id: string) => {
      const updated = contactService.toggleImportant(id);
      if (updated) {
        loadContacts();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadContacts, syncToFirebase]
  );

  // Search contacts
  const searchContacts = useCallback((query: string) => {
    return contactService.searchContacts(query);
  }, []);

  return {
    contacts,
    loading,
    createContact,
    updateContact,
    deleteContact,
    toggleImportant,
    searchContacts,
    refresh: loadContacts,
  };
}
