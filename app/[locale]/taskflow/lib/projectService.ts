/**
 * Project Service - Business logic for project management
 */

import { Project } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { taskService } from './taskService';

export const projectService = {
  // Get all projects
  getProjects: (): Project[] => {
    return storage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
  },

  // Get project by ID
  getProjectById: (id: string): Project | null => {
    const projects = projectService.getProjects();
    return projects.find((project) => project.id === id) || null;
  },

  // Create new project
  createProject: (
    project: Omit<Project, 'id' | 'createdAt' | 'taskIds'>
  ): Project => {
    const projects = projectService.getProjects();
    const newProject: Project = {
      ...project,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      taskIds: [],
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    storage.set(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },

  // Update project
  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = projectService.getProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) return null;

    const updatedProject = {
      ...projects[index],
      ...updates,
      id: projects[index].id, // Preserve ID
      createdAt: projects[index].createdAt, // Preserve creation date
    };

    projects[index] = updatedProject;
    storage.set(STORAGE_KEYS.PROJECTS, projects);
    return updatedProject;
  },

  // Delete project
  deleteProject: (id: string): boolean => {
    const projects = projectService.getProjects();
    const filteredProjects = projects.filter((project) => project.id !== id);
    if (filteredProjects.length === projects.length) return false;

    // Delete all tasks in this project
    const tasks = taskService.getTasks();
    const filteredTasks = tasks.filter((task) => task.projectId !== id);
    storage.set(STORAGE_KEYS.TASKS, filteredTasks);

    storage.set(STORAGE_KEYS.PROJECTS, filteredProjects);
    return true;
  },

  // Get tasks for a project
  getProjectTasks: (projectId: string) => {
    return taskService.getFilteredTasks({ projectId });
  },

  // Get project task count
  getProjectTaskCount: (projectId: string): number => {
    const tasks = taskService.getTasks();
    return tasks.filter((task) => task.projectId === projectId).length;
  },

  // Initialize with sample data
  initializeSampleData: (): void => {
    const existingProjects = projectService.getProjects();
    if (existingProjects.length > 0) return;

    const sampleProjects: Project[] = [
      {
        id: 'project_hamaco',
        name: 'Hamaco Project',
        description: 'Hamaco business development and operations',
        color: '#3b82f6',
        icon: '🏢',
        taskIds: [],
        members: ['demo_user'],
        isShared: false,
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'project_herbalife',
        name: 'Herbalife',
        description: 'Herbalife nutrition and wellness program',
        color: '#22c55e',
        icon: '🌿',
        taskIds: [],
        members: ['demo_user'],
        isShared: false,
        createdBy: 'demo_user',
        createdAt: new Date().toISOString(),
      },
    ];

    storage.set(STORAGE_KEYS.PROJECTS, sampleProjects);
  },
};
