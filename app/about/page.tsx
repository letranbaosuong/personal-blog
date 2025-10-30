/**
 * About Page - CV/Portfolio Section
 */

import { Metadata } from 'next';
import { Briefcase, GraduationCap, Code2, Award } from 'lucide-react';
import Container from '@/components/common/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about my background, experience, and skills',
};

export default function AboutPage() {
  // Sample data - replace with actual data from Firebase or static content
  const experiences = [
    {
      id: '1',
      company: 'Tech Company',
      position: 'Full Stack Developer',
      period: '2022 - Present',
      description:
        'Developing and maintaining web applications using React, Next.js, and Node.js. Leading front-end architecture decisions and implementing best practices.',
      technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
    },
    {
      id: '2',
      company: 'Startup Inc',
      position: 'Frontend Developer',
      period: '2020 - 2022',
      description:
        'Built responsive user interfaces and improved application performance. Collaborated with designers and backend team to deliver high-quality features.',
      technologies: ['React', 'JavaScript', 'CSS', 'REST APIs'],
    },
  ];

  const education = [
    {
      id: '1',
      institution: 'University Name',
      degree: 'Bachelor of Computer Science',
      period: '2016 - 2020',
      description: 'Focused on software engineering and web development',
    },
  ];

  const skills = {
    Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML/CSS'],
    Backend: ['Node.js', 'Express', 'REST APIs', 'GraphQL'],
    Database: ['MongoDB', 'PostgreSQL', 'Firebase'],
    Tools: ['Git', 'Docker', 'VS Code', 'Figma'],
  };

  return (
    <div className="py-16">
      <Container>
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            About Me
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            I'm a passionate full-stack developer who loves creating beautiful and
            functional web applications. Here's my journey so far.
          </p>
        </div>

        {/* Professional Summary */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6 text-blue-600" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400">
                With over 3 years of experience in web development, I specialize in
                building modern, scalable web applications. I'm passionate about
                clean code, user experience, and continuous learning. Beyond coding,
                I'm interested in health, fitness (especially calisthenics), and
                playing guitar. I believe in maintaining a balanced lifestyle while
                pursuing excellence in my professional career.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Work Experience */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Briefcase className="h-6 w-6 text-blue-600" />
            Work Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {exp.company}
                      </p>
                    </div>
                    <Badge variant="secondary" className="mt-2 w-fit sm:mt-0">
                      {exp.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="default">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl">{edu.degree}</CardTitle>
                      <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {edu.institution}
                      </p>
                    </div>
                    <Badge variant="secondary" className="mt-2 w-fit sm:mt-0">
                      {edu.period}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {edu.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Award className="h-6 w-6 text-blue-600" />
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(skills).map(([category, techs]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
