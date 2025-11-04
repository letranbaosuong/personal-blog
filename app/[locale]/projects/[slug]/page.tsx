/**
 * Project Detail Page - Dynamic route for individual projects
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Container from '@/components/common/Container';
import ProjectLink from '@/components/projects/ProjectLink';
import { LocalePageProps } from '@/types/i18n';
import { ArrowLeft, Github, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface ProjectDetailPageProps extends LocalePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { projects, projectsContent } = await import('@/data/projects');

  const project = projects.find((p) => p.slug === slug);
  const content = projectsContent[locale] || projectsContent.en;
  const projectContent = content[slug];

  if (!project || !projectContent) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: projectContent.title,
    description: projectContent.description,
  };
}

export async function generateStaticParams() {
  const { projects } = await import('@/data/projects');
  const locales = ['en', 'vi', 'ja', 'zh', 'ko', 'th'];

  const params = [];
  for (const project of projects) {
    for (const locale of locales) {
      params.push({
        locale,
        slug: project.slug,
      });
    }
  }

  return params;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  // Import projects data
  const { projects, projectsContent } = await import('@/data/projects');
  const project = projects.find((p) => p.slug === slug);
  const content = projectsContent[locale] || projectsContent.en;
  const projectContent = content[slug];

  if (!project || !projectContent) {
    notFound();
  }

  return (
    <div className="py-16">
      <Container>
        {/* Back Button */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Projects</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {projectContent.title}
            </h1>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}
            >
              {project.status === 'completed' ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  {t('completed')}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {t('inProgress')}
                </span>
              )}
            </span>
          </div>

          <p className="text-lg text-slate-600 dark:text-slate-300">
            {projectContent.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <ProjectLink
                href={project.github}
                variant="github"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Github className="h-5 w-5" />
                {project.github.startsWith('/') ? t('viewProject') : t('viewCode')}
              </ProjectLink>
            )}
            {project.demo && (
              <ProjectLink
                href={project.demo}
                variant="demo"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <ExternalLink className="h-5 w-5" />
                {t('liveDemo')}
              </ProjectLink>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              <img
                src={project.image}
                alt={projectContent.title}
                className="h-auto w-full object-cover"
              />
            </div>

            {/* Features Section */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Key Features
              </h2>
              <ul className="space-y-3">
                {projectContent.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                {t('technologies')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                Project Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Status</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {project.status === 'completed' ? t('completed') : t('inProgress')}
                  </span>
                </div>
                {project.github && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Repository</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {project.github.startsWith('/') ? 'Internal' : 'GitHub'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Stack</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    Full Stack
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
