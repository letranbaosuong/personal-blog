/**
 * Projects Showcase Page
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import Container from '@/components/common/Container';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import type { Project } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web development projects',
};

// Sample projects - replace with actual data from Firebase
const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce platform built with Next.js, featuring product catalog, shopping cart, checkout, and admin panel.',
    shortDescription: 'Modern e-commerce solution with Next.js',
    technologies: ['Next.js', 'React', 'TypeScript', 'Stripe', 'MongoDB'],
    imageUrl: '/images/projects/ecommerce.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    featured: true,
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-12-01'),
    status: 'completed',
  },
  {
    id: '2',
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates, team collaboration features, and project tracking.',
    shortDescription: 'Real-time task management solution',
    technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    imageUrl: '/images/projects/taskapp.jpg',
    demoUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/yourusername/taskapp',
    featured: true,
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-05-01'),
    status: 'completed',
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with forecast data, interactive maps, and location-based weather alerts.',
    shortDescription: 'Interactive weather forecast app',
    technologies: ['React', 'TypeScript', 'Weather API', 'Tailwind CSS'],
    imageUrl: '/images/projects/weather.jpg',
    demoUrl: 'https://weather.example.com',
    githubUrl: 'https://github.com/yourusername/weather',
    featured: false,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-02-01'),
    status: 'completed',
  },
  {
    id: '4',
    title: 'Personal Blog Platform',
    description:
      'A modern personal blog platform with markdown support, syntax highlighting, and admin panel for content management.',
    shortDescription: 'Blog platform with Next.js and Firebase',
    technologies: ['Next.js', 'Firebase', 'Markdown', 'Tailwind CSS'],
    imageUrl: '/images/projects/blog.jpg',
    githubUrl: 'https://github.com/yourusername/blog',
    featured: false,
    startDate: new Date('2024-01-01'),
    endDate: null,
    status: 'in-progress',
  },
];

export default function ProjectsPage() {
  const statusColors: Record<Project['status'], string> = {
    completed: 'success',
    'in-progress': 'warning',
    planned: 'secondary',
  };

  return (
    <div className="py-16">
      <Container>
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Here are some of the projects I've worked on. Each one represents a
            unique challenge and learning experience.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              {/* Project Image */}
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-800">
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  Project Image
                </div>
              </div>

              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <Badge
                    variant={
                      statusColors[project.status] as
                        | 'default'
                        | 'secondary'
                        | 'success'
                        | 'warning'
                        | 'danger'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                {project.demoUrl && (
                  <Link
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
