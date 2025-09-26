import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private storageKey = 'projects';

  private projects = signal<Project[]>(this.loadFromStorage());

  private loadFromStorage(): Project[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return [
        { id: 1, name: 'Projet Perso', description: 'Tâches personnelles', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Projet Travail', description: 'Tâches liées au boulot', createdAt: new Date(), updatedAt: new Date() }
      ];
    }
    return JSON.parse(data).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.projects()));
  }

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
    this.projects.update(arr => {
      const updated = [...arr, newProject];
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
    return Promise.resolve(newProject);
  }

  async updateProject(id: number, changes: Partial<Project>): Promise<Project | null> {
    let updated: Project | null = null;
    this.projects.update(arr => {
      const index = arr.findIndex(p => p.id === id);
      if (index !== -1) {
        updated = {
          ...arr[index],
          ...changes,
          updatedAt: new Date(),
        };
        const newArr = [...arr];
        newArr[index] = updated;
        localStorage.setItem(this.storageKey, JSON.stringify(newArr));
        return newArr;
      }
      return arr;
    });
    return Promise.resolve(updated);
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.update(arr => {
      const updated = arr.filter(p => p.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
    return Promise.resolve();
  }
}




