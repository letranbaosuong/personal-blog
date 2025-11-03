/**
 * ContactForm Component - Modal form for creating new contacts
 */

'use client';

import { useState } from 'react';
import { X, User, Mail, Phone, Briefcase, MapPin, Calendar, Users } from 'lucide-react';
import { Contact } from '../types';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ContactForm({ isOpen, onClose, onCreate }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    dateOfBirth: '',
    occupation: '',
    company: '',
    location: '',
    meetingDate: '',
    meetingOccasion: '',
    relationship: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    zalo: '',
    notes: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    const contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      occupation: formData.occupation.trim() || undefined,
      company: formData.company.trim() || undefined,
      location: formData.location.trim() || undefined,
      meetingDate: formData.meetingDate ? new Date(formData.meetingDate).toISOString() : undefined,
      meetingOccasion: formData.meetingOccasion.trim() || undefined,
      relationship: formData.relationship.trim() || undefined,
      socialMedia: {
        facebook: formData.facebook.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        zalo: formData.zalo.trim() || undefined,
      },
      notes: formData.notes.trim() || undefined,
      tags: formData.tags.trim()
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : undefined,
      isImportant: false,
      createdBy: 'demo_user',
    };

    onCreate(contact);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      dateOfBirth: '',
      occupation: '',
      company: '',
      location: '',
      meetingDate: '',
      meetingOccasion: '',
      relationship: '',
      facebook: '',
      linkedin: '',
      instagram: '',
      zalo: '',
      notes: '',
      tags: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 lg:p-4">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-xl dark:bg-slate-800 lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add New Contact
          </h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Basic Information
              </h4>

              {/* Name (Required) */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Age & Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    min="1"
                    max="150"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
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
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
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
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Meeting Information */}
            <div className="space-y-4">
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Hà Nội"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              {/* Meeting Date & Occasion */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="h-4 w-4" />
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.meetingOccasion}
                    onChange={(e) => setFormData({ ...formData, meetingOccasion: e.target.value })}
                    placeholder="Hội thảo công nghệ"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Relationship */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Users className="h-4 w-4" />
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Đồng nghiệp"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Social Media
              </h4>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Facebook */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
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
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
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
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
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
                    value={formData.zalo}
                    onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                    placeholder="Zalo ID"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tags (separated by commas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tech, frontend, hà nội"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about this contact..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-slate-200 p-4 dark:border-slate-700">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 lg:flex-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 lg:flex-none"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>
  );
}
