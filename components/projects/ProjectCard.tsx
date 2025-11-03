/**
 * Project Card Component
 * Displays a project preview card
 */

import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  title: string;
  description: string;
  viewProjectLabel: string;
  viewCodeLabel: string;
}

export default function ProjectCard({
  project,
  title,
  description,
  viewProjectLabel,
  viewCodeLabel,
}: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {project.featured && (
          <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </div>
        )}
        <div
          className={`absolute left-2 top-2 rounded-full px-3 py-1 text-xs font-semibold ${
            project.status === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-yellow-600 text-white'
          }`}
        >
          {project.status === 'completed' ? 'Completed' : 'In Progress'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-slate-600 dark:text-slate-300">
          {description}
        </p>

        {/* Technologies */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <Github className="h-4 w-4" />
              {viewCodeLabel}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              {viewProjectLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
