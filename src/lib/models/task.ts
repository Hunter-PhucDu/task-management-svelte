export interface Task {
  id: string;            
  title: string;              
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  createdBy: string;
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}