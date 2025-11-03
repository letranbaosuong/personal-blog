/**
 * useProjects Hook - React hook for project management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projectService } from '../lib/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects
  const loadProjects = useCallback(() => {
    setLoading(true);
    try {
      const allProjects = projectService.getProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    projectService.initializeSampleData();
    loadProjects();
  }, [loadProjects]);

  // Create project
  const createProject = useCallback(
    (project: Omit<Project, 'id' | 'createdAt' | 'taskIds'>) => {
      const newProject = projectService.createProject(project);
      loadProjects();
      return newProject;
    },
    [loadProjects]
  );

  // Update project
  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      const updated = projectService.updateProject(id, updates);
      if (updated) loadProjects();
      return updated;
    },
    [loadProjects]
  );

  // Delete project
  const deleteProject = useCallback(
    (id: string) => {
      const success = projectService.deleteProject(id);
      if (success) loadProjects();
      return success;
    },
    [loadProjects]
  );

  // Get task count for a project
  const getProjectTaskCount = useCallback((projectId: string): number => {
    return projectService.getProjectTaskCount(projectId);
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProjectTaskCount,
    refresh: loadProjects,
  };
}
