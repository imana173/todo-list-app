import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {
  projectService = inject(ProjectService);
  addingProject = signal(false);

  newProject = { name: '', description: '' };
  projects: Project[] = [];

  editingProjectId: number | null = null;
  editData = { name: '', description: '' };

  async ngOnInit() {
    this.projects = await this.projectService.getAllProjects();
  }

  async addProject() {
    if (!this.newProject.name.trim()) return;
    try {
      this.addingProject.set(true);
      const project = await this.projectService.createProject({ ...this.newProject });
      this.projects.push(project);
      this.newProject = { name: '', description: '' };
    } finally {
      this.addingProject.set(false);
    }
  }

  startEditing(project: Project) {
    this.editingProjectId = project.id;
    this.editData = { name: project.name, description: project.description || '' };
  }

  cancelEditing() {
    this.editingProjectId = null;
  }

  async updateProject(id: number) {
    const updated = await this.projectService.updateProject(id, this.editData);
    if (updated) {
      const index = this.projects.findIndex(p => p.id === id);
      if (index !== -1) this.projects[index] = updated;
    }
    this.editingProjectId = null;
  }

  async deleteProject(id: number) {
    await this.projectService.deleteProject(id);
    this.projects = this.projects.filter(p => p.id !== id);
  }
}

