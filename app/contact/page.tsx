/**
 * Contact Page
 */

import { Metadata } from 'next';
import { Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import Container from '@/components/common/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me for collaborations, opportunities, or just to say hello',
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'City, Country',
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: SITE_CONFIG.social.github,
      color: 'text-gray-900 dark:text-gray-100',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: SITE_CONFIG.social.linkedin,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: SITE_CONFIG.social.twitter,
      color: 'text-sky-500 dark:text-sky-400',
    },
  ];

  return (
    <div className="py-16">
      <Container size="md">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Get In Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision. Feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </h3>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Connect With Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 transition-all hover:scale-110 hover:shadow-md dark:border-gray-800"
                        aria-label={social.label}
                      >
                        <Icon className={`h-6 w-6 ${social.color}`} />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>About This Website</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    This personal blog and portfolio website was built with modern
                    web technologies including Next.js 15, TypeScript, and
                    Tailwind CSS.
                  </p>
                  <p>
                    The site showcases my professional experience, technical
                    skills, and personal interests in technology, health, fitness,
                    and music.
                  </p>
                  <p>
                    I regularly share articles about web development, calisthenics
                    training, healthy living, and my guitar learning journey.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  I'm currently{' '}
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    open to opportunities
                  </span>{' '}
                  for full-time positions, freelance projects, and
                  collaborations. If you think I'd be a good fit for your team or
                  project, please don't hesitate to reach out!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
