/**
 * useProjects Hook - React hook for project management
 * Supports collaborative editing via Firebase when in shared mode
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projectService } from '../lib/projectService';
import { updateSharedData, type ShareType } from '../lib/shareService';

interface ShareMode {
  code: string;
  type: ShareType;
}

interface UseProjectsOptions {
  shareMode?: ShareMode | null;
}

export function useProjects(options?: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { shareMode } = options || {};

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

  // Sync to Firebase when in shared mode
  const syncToFirebase = useCallback(
    async (project: Project) => {
      if (shareMode && shareMode.type === 'project') {
        try {
          await updateSharedData(shareMode.code, 'project', project);
        } catch (error) {
          console.error('Error syncing project to Firebase:', error);
        }
      }
    },
    [shareMode]
  );

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
    async (id: string, updates: Partial<Project>) => {
      const updated = projectService.updateProject(id, updates);
      if (updated) {
        loadProjects();
        await syncToFirebase(updated);
      }
      return updated;
    },
    [loadProjects, syncToFirebase]
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
