<script lang="ts">
import { taskStore } from '$lib/stores/taskStore';
import { authStore } from '$lib/stores/authStore';
import { socketClientService } from '$lib/services/socketClientService';

type TaskStatus = 'todo' | 'in-progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

const props = $props();

let taskData = $state({
    id: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    assignedTo: undefined,
    dueDate: undefined
});

let mode = $state('create');
let isLoading = $state(false);
let errorMessage = $state('');
let tagInput = $state('');
let onlineUsers = $state([]);

$effect(() => {
    if (props.mode) {
        mode = props.mode;
    }
    
    if (props.task) {
        console.log('Task data received:', props.task);
        taskData = {
            id: props.task.id || '',
            title: props.task.title || '',
            description: props.task.description || '',
            status: props.task.status || 'todo',
            priority: props.task.priority || 'medium',
            tags: props.task.tags ? [...props.task.tags] : [],
            assignedTo: props.task.assignedTo,
            dueDate: props.task.dueDate
        };
    } else {
        resetForm();
    }
});

function resetForm() {
    taskData = {
        id: '',
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        assignedTo: undefined,
        dueDate: undefined
    };
}

$effect(() => {
    const unsubscribe = socketClientService.subscribe(state => {
        onlineUsers = state.usersOnline;
    });
    return unsubscribe;
});

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!taskData.title.trim()) {
        errorMessage = 'Task title is required';
        return;
    }

    try {
        isLoading = true;
        errorMessage = '';

        if (mode === 'create') {
            const newTaskData = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status  as TaskStatus,
                priority: taskData.priority  as TaskPriority,
                tags: [...taskData.tags],
                assignedTo: taskData.assignedTo,
                dueDate: taskData.dueDate,
                createdBy: $authStore.user?.id || '1'
            };

            socketClientService.createTask(newTaskData);

            resetForm();
            if (props.onFormClosed) props.onFormClosed();
            
        } else if (mode === 'edit' && taskData.id) {
            const updates = {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status  as TaskStatus,
                priority: taskData.priority as TaskPriority,
                tags: [...taskData.tags],
                dueDate: taskData.dueDate
            };

            socketClientService.updateTask(taskData.id, updates);
            
            const result = await taskStore.updateTask(taskData.id, updates);
            
            if (result) {
                if (props.onUpdated) props.onUpdated(taskData.id);
                if (props.onFormClosed) props.onFormClosed();
            } else {
                errorMessage = 'Failed to update task';
            }
        }
    } catch (err) {
        errorMessage = err.message || 'An error occurred';
    } finally {
        isLoading = false;
    }
}

function addTag() {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !taskData.tags.includes(trimmedTag)) {
        taskData = {
            ...taskData,
            tags: [...taskData.tags, trimmedTag]
        };
        tagInput = '';
    }
}

function removeTag(index) {
    taskData = {
        ...taskData,
        tags: taskData.tags.filter((_, i) => i !== index)
    };
}

function handleTagKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTag();
    }
}

function handleCancel() {
    if (props.onCancel) {
        props.onCancel();
    } else if (props.onFormClosed) {
        props.onFormClosed();
    } else {
        resetForm();
    }
}
</script>

<div class="task-form">
    <h2>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>

    {#if errorMessage}
    <div class="error-message">
        {errorMessage}
    </div>
    {/if}
        
    <form onsubmit={handleSubmit}>
        <div class="form-group">
            <label for="title">Title*</label>
            <input
                id="title"
                type="text"
                bind:value={taskData.title}
                placeholder="Enter task title"
                disabled={isLoading}
                required
                />
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea
                id="description"
                bind:value={taskData.description}
                placeholder="Describe the task..."
                rows="3"
                disabled={isLoading}
                ></textarea>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="status">Status</label>
                <select
                    id="status"
                    bind:value={taskData.status}
                    disabled={isLoading}
                    >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div class="form-group">
                <label for="priority">Priority</label>
                <select
                    id="priority"
                    bind:value={taskData.priority}
                    disabled={isLoading}
                    >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label for="assignee">Assign To</label>
            <select
                id="assignee"
                bind:value={taskData.assignedTo}
                disabled={isLoading}
                >
                <option value="">Unassigned</option>
                {#each onlineUsers as user}
                <option value={user}>{user}</option>
                {/each}
            </select>
            {#if onlineUsers.length === 0}
            <small class="help-text">No other users online</small>
            {/if}
        </div>

        <div class="form-group">
            <label for="due-date">Due Date</label>
            <input
                id="due-date"
                type="date"
                bind:value={taskData.dueDate}
                disabled={isLoading}
                />
        </div>

        <div class="form-group">
            <label for="tag-input">Tags</label>
            <div class="tag-input-container">                <input
                id="tag-input"
                type="text"
                bind:value={tagInput}                
                placeholder="Add a tag and press Enter"
                disabled={isLoading}
                onkeypress={handleTagKeyPress}
                />            
                <button
                type="button"
                onclick={addTag}
                disabled={!tagInput.trim() || isLoading}
                class="btn-secondary"
                >
                Add
            </button>
            </div>

            {#if taskData.tags && taskData.tags.length > 0}
            <div class="tags-list">
                {#each taskData.tags as tag, index}
                <div class="tag">
                    <span>{tag}</span>
                    <button
                        type="button"                        
                        onclick={() => removeTag(index)}
                        class="tag-remove"
                        disabled={isLoading}
                        >
                        ×
                    </button>
                </div>
                {/each}
            </div>
            {/if}
        </div>

        <div class="form-actions">            
            <button
                type="button"
                onclick={handleCancel}
                disabled={isLoading}
                class="btn-text"
                >
                Cancel
            </button>

            <button
                type="submit"
                disabled={isLoading}
                class="btn-primary"
                >
                {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Task' : 'Save Changes')}
            </button>
        </div>
    </form>
</div>

<style>
.task-form {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
}

h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
}

.error-message {
    padding: 0.75rem;
    margin-bottom: 1rem;
    background-color: #ffebee;
    color: #d32f2f;
    border-radius: 4px;
}

.form-group {
    margin-bottom: 1rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-row .form-group {
    flex: 1;
    margin-bottom: 0;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

input,
select,
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
    border-color: #4c6ef5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 110, 245, 0.2);
}

textarea {
    resize: vertical;
    min-height: 80px;
}

.tag-input-container {
    display: flex;
    gap: 0.5rem;
}

.btn-secondary {
    padding: 0.75rem 1rem;
    background-color: #e9ecef;
    color: #495057;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
}

.btn-secondary:hover {
    background-color: #dee2e6;
}

.tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.tag {
    display: flex;
    align-items: center;
    background-color: #e9ecef;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.875rem;
}

.tag-remove {
    background: none;
    border: none;
    margin-left: 0.25rem;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 0.75;
    padding: 0.25rem;
    border-radius: 50%;
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
}

.tag-remove:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #edf2f7;
}

.btn-primary {
    padding: 0.75rem 1.5rem;
    background-color: #4c6ef5;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #3b5bdb;
}

.btn-text {
    padding: 0.75rem 1.5rem;
    background: none;
    color: #4c6ef5;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

.btn-text:hover {
    background-color: #f8f9fa;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>
