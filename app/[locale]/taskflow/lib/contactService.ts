/**
 * Contact Service - Business logic for contact management
 */

import { Contact } from '../types';
import { storage, STORAGE_KEYS } from './storage';

export const contactService = {
  // Get all contacts
  getContacts: (): Contact[] => {
    return storage.get<Contact[]>(STORAGE_KEYS.CONTACTS) || [];
  },

  // Get contact by ID
  getContactById: (id: string): Contact | null => {
    const contacts = contactService.getContacts();
    return contacts.find((contact) => contact.id === id) || null;
  },

  // Create new contact
  createContact: (
    contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
  ): Contact => {
    const contacts = contactService.getContacts();
    const newContact: Contact = {
      ...contact,
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    contacts.unshift(newContact); // Add to beginning
    storage.set(STORAGE_KEYS.CONTACTS, contacts);
    return newContact;
  },

  // Update contact
  updateContact: (id: string, updates: Partial<Contact>): Contact | null => {
    const contacts = contactService.getContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) return null;

    const updatedContact: Contact = {
      ...contacts[index],
      ...updates,
      id: contacts[index].id, // Preserve ID
      createdAt: contacts[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    contacts[index] = updatedContact;
    storage.set(STORAGE_KEYS.CONTACTS, contacts);
    return updatedContact;
  },

  // Delete contact
  deleteContact: (id: string): boolean => {
    const contacts = contactService.getContacts();
    const filteredContacts = contacts.filter((contact) => contact.id !== id);
    if (filteredContacts.length === contacts.length) return false;

    storage.set(STORAGE_KEYS.CONTACTS, filteredContacts);
    return true;
  },

  // Toggle important
  toggleImportant: (id: string): Contact | null => {
    const contact = contactService.getContactById(id);
    if (!contact) return null;

    return contactService.updateContact(id, {
      isImportant: !contact.isImportant,
    });
  },

  // Search contacts
  searchContacts: (query: string): Contact[] => {
    const contacts = contactService.getContacts();
    if (!query.trim()) return contacts;

    const lowerQuery = query.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.email?.toLowerCase().includes(lowerQuery) ||
        contact.phone?.includes(query) ||
        contact.company?.toLowerCase().includes(lowerQuery) ||
        contact.occupation?.toLowerCase().includes(lowerQuery) ||
        contact.notes?.toLowerCase().includes(lowerQuery)
    );
  },

  // Initialize with sample data
  initializeSampleData: (): void => {
    const existingContacts = contactService.getContacts();
    if (existingContacts.length > 0) return;

    const sampleContacts: Contact[] = [
      {
        id: 'contact_1',
        name: 'Nguyễn Văn A',
        age: 28,
        dateOfBirth: '1995-05-15',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        occupation: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Hà Nội',
        meetingDate: new Date('2024-01-15').toISOString(),
        meetingOccasion: 'Hội thảo công nghệ',
        relationship: 'Đồng nghiệp',
        socialMedia: {
          facebook: 'facebook.com/nguyenvana',
          linkedin: 'linkedin.com/in/nguyenvana',
        },
        notes: 'Chuyên về React và Next.js. Rất nhiệt tình và sẵn sàng giúp đỡ.',
        tags: ['tech', 'frontend', 'hà nội'],
        isImportant: true,
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'contact_2',
        name: 'Trần Thị B',
        age: 32,
        email: 'tranthib@example.com',
        phone: '0987654321',
        occupation: 'Marketing Manager',
        company: 'ABC Company',
        location: 'TP.HCM',
        meetingDate: new Date('2024-02-20').toISOString(),
        meetingOccasion: 'Sự kiện networking',
        relationship: 'Khách hàng',
        notes: 'Quan tâm đến các giải pháp marketing digital.',
        tags: ['marketing', 'sài gòn'],
        isImportant: false,
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    storage.set(STORAGE_KEYS.CONTACTS, sampleContacts);
  },
};
