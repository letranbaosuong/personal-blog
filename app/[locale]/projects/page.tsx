/**
 * Projects Page - Internationalized
 */

import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/common/Container';
import { LocalePageProps } from '@/types/i18n';

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProjectsPage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('projects');

  // Import projects data
  const { projects, projectsContent } = await import('@/data/projects');
  const allProjects = projects;
  const content = projectsContent[locale] || projectsContent.en;

  return (
    <div className="py-16">
      <Container>
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('featured')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {allProjects
              .filter((project) => project.featured)
              .map((project) => {
                const projectContent = content[project.slug];
                if (!projectContent) return null;

                return (
                  <article
                    key={project.id}
                    className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <img
                        src={project.image}
                        alt={projectContent.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                        Featured
                      </div>
                      <div
                        className={`absolute left-2 top-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          project.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {project.status === 'completed' ? t('completed') : t('inProgress')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
                        {projectContent.title}
                      </h3>
                      <p className="mb-4 text-slate-600 dark:text-slate-300">
                        {projectContent.description}
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
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                          >
                            {t('viewCode')}
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            {t('liveDemo')}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>

        {/* All Projects */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t('allProjects')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project) => {
              const projectContent = content[project.slug];
              if (!projectContent) return null;

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={project.image}
                      alt={projectContent.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                      {projectContent.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {projectContent.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
