<script lang="ts">
import { taskStore } from '$lib/stores/taskStore';
import { createEventDispatcher } from 'svelte';
import { onMount} from 'svelte';

const props = $props();
let taskId = $state('');

$effect(() => {
    if (props.taskId) {
        taskId = props.taskId;
    }
});

let task = $state(null);
let isLoading = $state(true);
let isEditing = $state(false);
let errorMessage = $state('');

const dispatch = createEventDispatcher();

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

onMount(() => {
    loadTask();
});

async function loadTask() {
    isLoading = true;
    errorMessage = '';

    try {
        const foundTask = $taskStore.tasks.find(t => t.id === taskId);

        if (foundTask) {
            task = foundTask;
        } else {
            errorMessage = 'Task not found';
        }
    } catch (err) {
        errorMessage = 'Failed to load task details';
        console.error(err);
    } finally {
        isLoading = false;
    }
}

function closeTaskDetails() {
    dispatch('close');
}

function toggleEditMode() {
    isEditing = !isEditing;
}

async function deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
        await taskStore.deleteTask(taskId);
        dispatch('deleted', {
            taskId
        });
        closeTaskDetails();
    }
}
</script>

<div class="task-detail-overlay">
    <div class="task-detail-container">
        <div class="task-detail-header">
            <h2>Task Details</h2>
            <button class="btn-close" onclick={closeTaskDetails} title="Close">
                ×
            </button>
        </div>

        {#if isLoading}
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Loading task details...</p>
        </div>
        {:else if errorMessage}
        <div class="error-message">
            <p>{errorMessage}</p>
            <button onclick={() => loadTask()} class="btn-text">Try again</button>
        </div>
        {:else if task}
        <div class="task-detail-content">
            <div class="task-header">
                <h3 class="task-title">{task.title}</h3>

                <div class="task-badges">
                    <span class="badge">
                        {task.status}
                    </span>

                    {#if task.priority}
                    <span class="badge">
                        {task.priority}
                    </span>
                    {/if}
                </div>
            </div>

            {#if task.description}
            <div class="task-description">
                <h4>Description</h4>
                <p>{task.description}</p>
            </div>
            {/if}

            {#if task.tags && task.tags.length > 0}
            <div class="task-tags">
                <h4>Tags</h4>
                <div class="tags-container">
                    {#each task.tags as tag}
                    <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>
            {/if}

            <div class="task-meta">
                <h4>Details</h4>
                <div class="meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">Created</span>
                        <span class="meta-value">{formatDate(task.createdAt)}</span>
                    </div>

                    <div class="meta-item">
                        <span class="meta-label">Last Updated</span>
                        <span class="meta-value">{formatDate(task.updatedAt)}</span>
                    </div>

                    {#if task.dueDate}
                    <div class="meta-item">
                        <span class="meta-label">Due Date</span>
                        <span class="meta-value">{formatDate(task.dueDate)}</span>
                    </div>
                    {/if}

                    {#if task.assignedTo}
                    <div class="meta-item">
                        <span class="meta-label">Assigned To</span>
                        <span class="meta-value">{task.assignedTo}</span>
                    </div>
                    {/if}
                </div>
            </div>

            <div class="task-actions">
                <button
                    class="btn-secondary"
                    onclick={toggleEditMode}
                    >
                    Edit Task
                </button>

                <button
                    class="btn-delete"
                    onclick={deleteTask}
                    >
                    Delete Task
                </button>
            </div>
        </div>
        {/if}
    </div>
</div>

<style>
.task-detail-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.task-detail-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-detail-header {
    padding: 1.25rem;
    border-bottom: 1px solid #edf2f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
}

.task-detail-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    padding: 0.25rem;
    cursor: pointer;
    color: #718096;
    border-radius: 0.25rem;
}

.btn-close:hover {
    background-color: #f7fafc;
    color: #2d3748;
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
    color: #e53e3e;
}

.task-detail-content {
    padding: 1.5rem;
}

.task-header {
    margin-bottom: 1.5rem;
}

.task-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2d3748;
}

.task-badges {
    display: flex;
    gap: 0.5rem;
}

.badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    text-transform: capitalize;
}

.task-description h4,
.task-tags h4,
.task-meta h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
}

.task-description {
    margin-bottom: 1.5rem;
}

.task-description p {
    margin: 0;
    line-height: 1.6;
    color: #4a5568;
}

.task-tags {
    margin-bottom: 1.5rem;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag {
    font-size: 0.75rem;
    background-color: #edf2f7;
    color: #4a5568;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
}

.task-meta {
    margin-bottom: 1.5rem;
}

.meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.meta-item {
    display: flex;
    flex-direction: column;
}

.meta-label {
    font-size: 0.75rem;
    color: #718096;
    margin-bottom: 0.25rem;
}

.meta-value {
    font-weight: 500;
    color: #4a5568;
}

.task-actions {
    padding-top: 1.5rem;
    border-top: 1px solid #edf2f7;
    display: flex;
    justify-content: space-between;
}

.btn-secondary {
    padding: 0.5rem 1rem;
    background-color: #e9ecef;
    color: #495057;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}

.btn-secondary:hover {
    background-color: #dee2e6;
}

.btn-delete {
    padding: 0.5rem 1rem;
    background-color: #fff5f5;
    color: #e53e3e;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
}

.btn-delete:hover {
    background-color: #fed7d7;
}

.btn-text:hover {
    color: #2563eb;
    text-decoration: underline;
}
</style>
