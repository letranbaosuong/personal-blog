/**
 * ContactDetail Component - Display and edit contact details
 * Shows in right sidebar when a contact is selected
 */

'use client';

import { Contact, Task, Project } from '../types';
import { X, Star, Trash2, Mail, Phone, Briefcase, MapPin, Calendar, Users, Edit2 } from 'lucide-react';
import { useState } from 'react';
import MentionTextarea from './MentionTextarea';
import MentionText from './MentionText';

interface ContactDetailProps {
  contact: Contact;
  tasks?: Task[];
  projects?: Project[];
  contacts?: Contact[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onTaskClick?: (task: Task) => void;
  onProjectClick?: (projectId: string) => void;
  onContactClick?: (contact: Contact) => void;
}

export default function ContactDetail({
  contact,
  tasks = [],
  projects = [],
  contacts = [],
  onClose,
  onUpdate,
  onDelete,
  onToggleImportant,
  onTaskClick,
  onProjectClick,
  onContactClick,
}: ContactDetailProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(contact.name);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== contact.name) {
      onUpdate(contact.id, { name: editedName.trim() });
    } else {
      setEditedName(contact.name);
    }
    setIsEditingName(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = contact.tags || [];
      onUpdate(contact.id, { tags: [...currentTags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = contact.tags || [];
    onUpdate(contact.id, { tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="flex h-full flex-col border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Contact Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar & Name */}
        <div className="mb-6 flex items-center gap-4">
          {contact.avatar ? (
            <img
              src={contact.avatar}
              alt={contact.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-3xl font-semibold text-white">
              {contact.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                className="w-full rounded-lg border border-blue-500 bg-white px-3 py-2 text-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-600 dark:bg-slate-700 dark:text-slate-100"
              />
            ) : (
              <h2
                onClick={() => setIsEditingName(true)}
                className="cursor-text rounded-lg px-3 py-2 text-xl font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {contact.name}
              </h2>
            )}
          </div>
        </div>

        {/* Important Button */}
        <div className="mb-6">
          <button
            onClick={() => onToggleImportant(contact.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              contact.isImportant
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Star className={`h-4 w-4 ${contact.isImportant ? 'fill-yellow-400' : ''}`} />
            Important Contact
          </button>
        </div>

        {/* Basic Information */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Basic Information
          </h4>

          {/* Email */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => onUpdate(contact.id, { email: e.target.value })}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Phone className="h-4 w-4" />
              Phone
            </label>
            <input
              type="tel"
              value={contact.phone || ''}
              onChange={(e) => onUpdate(contact.id, { phone: e.target.value })}
              placeholder="0901234567"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Age
            </label>
            <input
              type="number"
              value={contact.age || ''}
              onChange={(e) => onUpdate(contact.id, { age: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="25"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date of Birth
            </label>
            <input
              type="date"
              value={contact.dateOfBirth ? new Date(contact.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={(e) => onUpdate(contact.id, { dateOfBirth: e.target.value || undefined })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Professional Information
          </h4>

          {/* Occupation */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Briefcase className="h-4 w-4" />
              Occupation
            </label>
            <input
              type="text"
              value={contact.occupation || ''}
              onChange={(e) => onUpdate(contact.id, { occupation: e.target.value })}
              placeholder="Software Engineer"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Company */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Company
            </label>
            <input
              type="text"
              value={contact.company || ''}
              onChange={(e) => onUpdate(contact.id, { company: e.target.value })}
              placeholder="Tech Corp"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Meeting Information */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Meeting Information
          </h4>

          {/* Location */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <input
              type="text"
              value={contact.location || ''}
              onChange={(e) => onUpdate(contact.id, { location: e.target.value })}
              placeholder="Hà Nội"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Meeting Date */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
              Meeting Date
            </label>
            <input
              type="date"
              value={contact.meetingDate ? new Date(contact.meetingDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onUpdate(contact.id, { meetingDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          {/* Meeting Occasion */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Meeting Occasion
            </label>
            <input
              type="text"
              value={contact.meetingOccasion || ''}
              onChange={(e) => onUpdate(contact.id, { meetingOccasion: e.target.value })}
              placeholder="Hội thảo công nghệ"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Relationship */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Users className="h-4 w-4" />
              Relationship
            </label>
            <input
              type="text"
              value={contact.relationship || ''}
              onChange={(e) => onUpdate(contact.id, { relationship: e.target.value })}
              placeholder="Đồng nghiệp"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Social Media
          </h4>

          {/* Facebook */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Facebook
            </label>
            <input
              type="text"
              value={contact.socialMedia?.facebook || ''}
              onChange={(e) => onUpdate(contact.id, {
                socialMedia: { ...contact.socialMedia, facebook: e.target.value }
              })}
              placeholder="facebook.com/username"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              LinkedIn
            </label>
            <input
              type="text"
              value={contact.socialMedia?.linkedin || ''}
              onChange={(e) => onUpdate(contact.id, {
                socialMedia: { ...contact.socialMedia, linkedin: e.target.value }
              })}
              placeholder="linkedin.com/in/username"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Instagram
            </label>
            <input
              type="text"
              value={contact.socialMedia?.instagram || ''}
              onChange={(e) => onUpdate(contact.id, {
                socialMedia: { ...contact.socialMedia, instagram: e.target.value }
              })}
              placeholder="instagram.com/username"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>

          {/* Zalo */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Zalo
            </label>
            <input
              type="text"
              value={contact.socialMedia?.zalo || ''}
              onChange={(e) => onUpdate(contact.id, {
                socialMedia: { ...contact.socialMedia, zalo: e.target.value }
              })}
              placeholder="Zalo ID"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tags
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            {contact.tags && contact.tags.length > 0 ? (
              contact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">No tags yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a tag..."
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
            <button
              onClick={handleAddTag}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Notes
              {isEditingNotes && (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  (Type @ to mention tasks, projects, or contacts)
                </span>
              )}
            </label>
            {!isEditingNotes && contact.notes && (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                title="Edit notes"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {isEditingNotes ? (
            <MentionTextarea
              value={contact.notes || ''}
              onChange={(value) => onUpdate(contact.id, { notes: value })}
              placeholder="Add notes about this contact... (Type @ to mention)"
              rows={4}
              tasks={tasks}
              projects={projects}
              contacts={contacts}
              onTaskClick={onTaskClick}
              onProjectClick={(project) => onProjectClick?.(project.id)}
              onContactClick={onContactClick}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
            />
          ) : contact.notes ? (
            <div
              onClick={() => setIsEditingNotes(true)}
              className="cursor-text rounded-lg border border-transparent p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <MentionText
                text={contact.notes}
                tasks={tasks}
                projects={projects}
                contacts={contacts}
                onTaskClick={onTaskClick}
                onProjectClick={(project) => onProjectClick?.(project.id)}
                onContactClick={onContactClick}
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingNotes(true)}
              className="cursor-text rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-500"
            >
              Add notes about this contact... (Type @ to mention)
            </div>
          )}
        </div>

        {/* Created date */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Created {new Date(contact.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Footer - Delete button */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-700">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this contact?')) {
              onDelete(contact.id);
              onClose();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete Contact
        </button>
      </div>
    </div>
  );
}
