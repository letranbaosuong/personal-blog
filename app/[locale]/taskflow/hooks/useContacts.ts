/**
 * useContacts Hook - React hook for contact management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Contact } from '../types';
import { contactService } from '../lib/contactService';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

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
    (id: string, updates: Partial<Contact>) => {
      const updated = contactService.updateContact(id, updates);
      if (updated) loadContacts();
      return updated;
    },
    [loadContacts]
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
    (id: string) => {
      const updated = contactService.toggleImportant(id);
      if (updated) loadContacts();
      return updated;
    },
    [loadContacts]
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
