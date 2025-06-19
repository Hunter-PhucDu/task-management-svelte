<script lang="ts">
import {
    createEventDispatcher
} from 'svelte';
import {
    goto
} from '$app/navigation';
const props = $props();

let redirectTo = $state('/');

$effect(() => {
    if (props.redirectTo) {
        redirectTo = props.redirectTo;
    }
});
let username = $state('');
let isLoading = $state(false);
let errorMessage = $state('');

const dispatch = createEventDispatcher();

async function handleLogin() {
    if (!username.trim()) {
        errorMessage = 'Please enter both email and username';
        return;
    }

    try {
        isLoading = true;
        errorMessage = '';
        const {
            authStore
        } = await import('$lib/stores/authStore');

        const success = await authStore.login(username);

        if (success) {
            dispatch('success', {
                username
            });
            goto(redirectTo);
        } else {
            errorMessage = 'Login failed. Please check your email and username.';
        }
    } catch (err) {
        errorMessage = err.message || 'Login failed. Please try again.';
    } finally {
        isLoading = false;
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        handleLogin();
    }
}
</script>

<div class="login-form">
    <h2>Login</h2>

    {#if errorMessage}
    <div class="error-message">
        {errorMessage}
    </div>
    {/if}
    <div class="form-group">
        <label for="username">Username</label>
        <input
            id="username"
            type="text"
            bind:value={username}
            placeholder="Enter your username"
            onkeypress={handleKeyPress}
            disabled={isLoading}
            />
    </div>

    <div class="form-actions">
        <button
            type="button"
            onclick={handleLogin}
            disabled={isLoading}
            class="btn-primary"
            >
            {isLoading ? 'Logging in...' : 'Login'}
        </button>
    </div>
</div>

<style>
.login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
}

h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
}

.error-message {
    padding: 0.5rem;
    margin-bottom: 1rem;
    background-color: #ffebee;
    color: #d32f2f;
    border-radius: 4px;
    text-align: center;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

input:focus {
    border-color: #4c6ef5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 110, 245, 0.2);
}

.form-actions {
    margin-top: 1.5rem;
}

.btn-primary {
    width: 100%;
    padding: 0.75rem;
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

.btn-primary:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
}
</style>
