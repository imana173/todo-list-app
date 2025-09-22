export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number;   // ⏱️ en minutes
  assignedTo?: number;
  projectId?: number;       // 🔥 identifiant du projet lié
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number;   // ⏱️ en minutes
  assignedTo?: number;
  projectId?: number;       // 🔥 choix du projet à la création
}


