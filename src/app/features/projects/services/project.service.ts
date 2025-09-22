import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects = signal<Project[]>([
    { id: 1, name: 'Projet Perso', description: 'Tâches personnelles', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Projet Travail', description: 'Tâches liées au boulot', createdAt: new Date(), updatedAt: new Date() }
  ]);

  async getAllProjects(): Promise<Project[]> {
    return Promise.resolve(this.projects());
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const newProject: Project = {
      id: Date.now(),
      name: project.name!,
      description: project.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.projects.update(arr => [...arr, newProject]);
    return Promise.resolve(newProject);
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.update(arr => arr.filter(p => p.id !== id));
    return Promise.resolve();
  }
}

