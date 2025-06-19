<script lang="ts">
import { taskStore } from '$lib/stores/taskStore';
import { socketService } from '$lib/services/socketService';
import { onMount } from 'svelte';

const props = $props();

let filter = $state < 'all' | 'todo' | 'in-progress' | 'done' > ('all');

$effect(() => {
    if (props.filter) {
        filter = props.filter as 'all' | 'todo' | 'in-progress' | 'done';
    }
});

let isLoading = $state(true);
let filteredTasks = $derived(filter === 'all' ?
    $taskStore.tasks :
    $taskStore.tasks.filter(t => t.status === filter));

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'done':
            return 'bg-green-100 text-green-800';
        case 'in-progress':
            return 'bg-blue-100 text-blue-800';
        case 'todo':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

onMount(async () => {
    isLoading = true;
    await taskStore.loadTasks();
    isLoading = false;
});

async function updateTaskStatus(taskId, newStatus) {
    const updates = {
        status: newStatus
    };
    socketService.updateTask(taskId, updates);

    await taskStore.updateTask(taskId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
    });
}

async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        socketService.deleteTask(taskId);

        await taskStore.deleteTask(taskId);
    }
}
</script>

<div class="task-list-container">
    {#if isLoading || $taskStore.isLoading}
    <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading tasks...</p>
    </div>
    {:else if $taskStore.error}
    <div class="error-message">
        <p>{$taskStore.error}</p>
        <button onclick={() => taskStore.clearError()} class="btn-text">Try again</button>
    </div>
    {:else if filteredTasks.length === 0}
    <div class="empty-state">
        <h3>No tasks found</h3>
        <p>
            {#if filter === 'all'}
            ...
            {:else}
            No tasks with status "{filter}" found.
            {/if}
        </p>
    </div>
    {:else}
    <div class="tasks-grid">
        {#each filteredTasks as task (task.id)}
        <div class="task-card">
            <div class="task-header">
                <h3 class="task-title">{task.title}</h3>
                <div class="task-actions">
                    <button class="btn-icon" title="Edit task"
                        onclick={() => {
                        if (props.onEdit) props.onEdit(task);}}
                        >✏️</button>
                    <button class="btn-icon" title="Delete task"
                        onclick={() => deleteTask(task.id)}
                        >🗑️</button>
                </div>
            </div>

            {#if task.description}
            <p class="task-description">{task.description}</p>
            {/if}
            <div class="task-metadata">
                <div class="task-badges">
                    <span class="badge {getStatusColor(task.status)}">
                        {task.status}
                    </span>

                    {#if task.priority}
                    <span class="badge {getPriorityColor(task.priority)}">
                        {task.priority}
                    </span>
                    {/if}

                </div>

                <div class="task-details">
                    {#if task.assignedTo}
                    <div class="assigned-to">
                        👤 Assigned to: {task.assignedTo}
                    </div>
                    {/if}

                    {#if task.createdAt}
                    <div class="task-date">
                        📅 {formatDate(task.createdAt)}
                    </div>
                    {/if}
                </div>
            </div>

            {#if task.tags && task.tags.length > 0}
            <div class="task-tags">
                {#each task.tags as tag}
                <span class="tag">{tag}</span>
                {/each}
            </div>
            {/if}

            <div class="task-status-actions">
                <select value={task.status}
                    onchange={(e) => updateTaskStatus(task.id, (e.target as HTMLSelectElement).value)}
                    >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>
        </div>
        {/each}
    </div>
    {/if}
</div>

<style>
.task-list-container {
    padding: 1rem 0;
}

.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    color: #718096;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top-color: #4c6ef5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-message {
    padding: 1.5rem;
    text-align: center;
    background-color: #fff5f5;
    color: #e53e3e;
    border-radius: 0.5rem;
    margin: 1rem 0;
}

.empty-state {
    padding: 3rem 1rem;
    text-align: center;
    color: #718096;
    background-color: #f7fafc;
    border-radius: 0.5rem;
}

.empty-state h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.task-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 1.25rem;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
}

.task-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.task-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.task-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-icon {
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
}

.btn-icon:hover {
    background-color: #f7fafc;
}

.task-description {
    margin: 0 0 1rem;
    color: #4a5568;
    font-size: 0.9rem;
    line-height: 1.5;
}

.task-metadata {
    margin-top: auto;
    padding-top: 1rem;
}

.task-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    text-transform: capitalize;
}

.task-details {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #718096;
}

.assigned-to {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.task-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.task-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.75rem 0;
}

.tag {
    font-size: 0.75rem;
    background-color: #edf2f7;
    color: #4a5568;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
}

.task-status-actions {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid #edf2f7;
}

.task-status-actions select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background-color: white;
}

.btn-text {
    background: none;
    border: none;
    color: #4c6ef5;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    margin-top: 0.5rem;
    font-size: inherit;
}

.btn-text:hover {
    text-decoration: underline;
}
</style>
