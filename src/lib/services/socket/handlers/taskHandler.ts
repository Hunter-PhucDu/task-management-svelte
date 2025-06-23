import type { TypedServer, TypedSocket } from '../events';
import type { Task } from '../../../models/task';

const tasks: Task[] = [];

export function registerTaskHandlers(io: TypedServer, socket: TypedSocket) {
  const handleGetAllTasks = () => {
    socket.emit('tasks_update', tasks);
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdBy: socket.data.userId || 'anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(taskData.assignedTo && { assignedTo: taskData.assignedTo }),
      ...(taskData.dueDate && { dueDate: taskData.dueDate }),
      ...(taskData.tags && { tags: taskData.tags })
    };

    tasks.push(newTask);

    io.emit('task_created', newTask);

    console.log(`Task created: ${newTask.title} (ID: ${newTask.id})`);
  };

  const handleUpdateTask = (data: { taskId: string; updates: Partial<Task> }) => {
    const { taskId, updates } = data;
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      tasks[taskIndex] = updatedTask;

      io.emit('task_updated', updatedTask);

      console.log(`Task updated: ${updatedTask.title} (ID: ${updatedTask.id})`);
    } else {
      console.log(`Task not found with ID: ${taskId}`);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      const deletedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);

      io.emit('task_deleted', taskId);

      console.log(`Task deleted: ${deletedTask.title} (ID: ${deletedTask.id})`);
    } else {
      console.log(`Task not found with ID: ${taskId}`);
    }
  };

  const handleGetTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      socket.emit('task_details', task);
    } else {
      console.log(`Task not found with ID: ${taskId}`);
    }
  };

  socket.on('get_all_tasks', handleGetAllTasks);
  socket.on('create_task', handleCreateTask);
  socket.on('update_task', handleUpdateTask);
  socket.on('delete_task', handleDeleteTask);
  socket.on('get_task', handleGetTask);
}
