<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { taskStore } from "$lib/stores/taskStore";
  import TaskList from "$lib/components/tasks/TaskList.svelte";
  import TaskForm from "$lib/components/tasks/TaskForm.svelte";
  import { socketClientService } from "$lib/services/socketClientService";

  let selectedFilter = $state("all");
  let isAddingTask = $state(false);
  let isConnected = $state(false);
  let socket = $state(null);
  let usersOnline = $state([]);
  let editingTask = $state(null);

  function changeFilter(filter) {
    selectedFilter = filter;
  }

  function toggleAddTaskForm() {
    isAddingTask = !isAddingTask;
    if (isAddingTask) {
      editingTask = null;
    }
  }

  function logout() {
    socketClientService.disconnect();
    authStore.logout();
    goto("/login");
  }

  function startEditingTask(task) {
    editingTask = task;
    isAddingTask = true;
  }

  function handleFormClosed() {
    isAddingTask = false;
    editingTask = null;
  }

  function handleCancelEdit() {
    isAddingTask = false;
    editingTask = null;
  }

function handleTaskUpdated(updatedTask) {
  if (updatedTask && updatedTask.id) {
    taskStore.addOrUpdateTask(updatedTask);
  }
}

  function handleTasksUpdate(tasks) {
    if (tasks && Array.isArray(tasks)) {
      taskStore.setTasks(tasks);
    }
  }

  function handleTaskCreated(task) {
    if (!task || typeof task !== "object" || !task.id) {
      return;
    }

    taskStore.addOrUpdateTask(task);

    setTimeout(() => {}, 100);

    isAddingTask = false;
  }

  function handleTaskDeleted(taskId) {
    taskStore.removeTask(taskId);
  }

  function initSocket() {
    const username = $authStore.user ? $authStore.user.username : "anonymous";
    socket = socketClientService.connect(username);

    unsubscribe = socketClientService.subscribe((state) => {
      isConnected = state.connected;
      usersOnline = state.usersOnline;
    });

    socket.on("connect", () => {
      socketClientService.getTasks();
    });

    socket.on("disconnect", () => {});

    socket.on("users_online", (users) => {
      usersOnline = users;
    });

    socket.on("task_created", (task) => {});

    unsubscribeTasks = socketClientService.subscribeToTasks(
      handleTasksUpdate,
      handleTaskCreated,
      handleTaskUpdated,
      handleTaskDeleted
    );
  }

  let unsubscribe;
  let unsubscribeTasks;

  onMount(() => {
    if (!$authStore.user) {
      goto("/login");
      return;
    }

    initSocket();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (unsubscribeTasks) {
        unsubscribeTasks();
      }
    };
  });
</script>

<div class="dashboard-container">
  <header class="dashboard-header">
    <div class="header-left">
      <h1>Task Manager</h1>
    </div>

    <div class="connection-status {isConnected ? 'connected' : 'disconnected'}">
      {isConnected
        ? `🟢 Connected (${usersOnline.length} users)`
        : "🔴 Disconnected"}
    </div>

    <div class="user-controls">
      {#if $authStore.user}
        <span class="user-welcome">Welcome, {$authStore.user.username}</span>
        <button class="btn-logout" onclick={logout}>Logout</button>
      {/if}
    </div>
  </header>

  <div class="dashboard-content">
    <aside class="sidebar">
      <div class="sidebar-section">
        <h3>Filters</h3>
        <nav class="filter-nav">
          <button
            class="filter-button {selectedFilter === 'all' ? 'active' : ''}"
            onclick={() => changeFilter("all")}
          >
            All Tasks
          </button>

          <button
            class="filter-button {selectedFilter === 'todo' ? 'active' : ''}"
            onclick={() => changeFilter("todo")}
          >
            To Do
          </button>

          <button
            class="filter-button {selectedFilter === 'in-progress'
              ? 'active'
              : ''}"
            onclick={() => changeFilter("in-progress")}
          >
            In Progress
          </button>

          <button
            class="filter-button {selectedFilter === 'done' ? 'active' : ''}"
            onclick={() => changeFilter("done")}
          >
            Done
          </button>
        </nav>
      </div>

      <div class="sidebar-section">
        <h3>Online Users ({usersOnline.length})</h3>
        <div class="online-users">
          {#if usersOnline.length > 0}
            <ul class="users-list">
              {#each usersOnline as username}
                <li class="user-item">
                  <div class="user-wrapper">
                    <span class="user-avatar">👤</span>
                    <span class="user-name">{username}</span>
                  </div>
                  <div class="user-badge" title="Online">🟢</div>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="no-users">No other users online</p>
          {/if}
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="content-header">
        <h2>
          {#if selectedFilter === "all"}
            All Tasks
          {:else if selectedFilter === "todo"}
            To Do
          {:else if selectedFilter === "in-progress"}
            In Progress
          {:else if selectedFilter === "done"}
            Completed Tasks
          {/if}
        </h2>
        <button class="btn-primary" onclick={toggleAddTaskForm}>
          {isAddingTask ? "Cancel" : "Add Task"}
        </button>
      </div>
      {#if isAddingTask}
        <div class="task-form-container">
          <TaskForm
            task={editingTask}
            mode={editingTask ? "edit" : "create"}
            onFormClosed={() => {
              isAddingTask = false;
              editingTask = null;
            }}
            onCancel={() => {
              isAddingTask = false;
              editingTask = null;
            }}
            onUpdated={(taskId) => {
            }}
          />
        </div>
      {:else}
        <TaskList filter={selectedFilter} onEdit={startEditingTask} />
      {/if}
    </main>
  </div>
</div>


<style>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f9fa;
  }

  .dashboard-header {
    background-color: #ffffff;
    border-bottom: 1px solid #e9ecef;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .header-left h1 {
    margin: 0;
    font-size: 1.75rem;
    color: #343a40;
  }

  .connection-status {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .connection-status.connected {
    background-color: #d4edda;
    color: #155724;
  }

  .connection-status.disconnected {
    background-color: #f8d7da;
    color: #721c24;
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-welcome {
    font-weight: 500;
    color: #495057;
  }

  .btn-logout {
    background-color: transparent;
    color: #6c757d;
    border: 1px solid #6c757d;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .btn-logout:hover {
    background-color: #6c757d;
    color: white;
  }

  .dashboard-content {
    display: flex;
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .sidebar {
    width: 250px;
    background-color: white;
    border-right: 1px solid #e9ecef;
    padding: 1.5rem;
  }

  .sidebar-section {
    margin-bottom: 2rem;
  }

  .sidebar-section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #343a40;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e9ecef;
  }

  .filter-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-button {
    background: none;
    border: none;
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .filter-button:hover {
    background-color: #f1f3f5;
  }

  .filter-button.active {
    background-color: #e9ecef;
    font-weight: 500;
  }

  .online-users {
    margin-top: 1rem;
  }

  .users-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    background-color: #f9fafb;
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .user-avatar {
    font-size: 1.25rem;
  }

  .user-name {
    font-size: 0.875rem;
    color: #374151;
  }

  .user-badge {
    font-size: 0.75rem;
  }

  .no-users {
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
    padding: 1rem;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .content-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #343a40;
  }

  .btn-primary {
    background-color: #4c6ef5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background-color: #3b5bdb;
  }

  .task-form-container {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .dashboard-content {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e9ecef;
    }
  }
</style>
