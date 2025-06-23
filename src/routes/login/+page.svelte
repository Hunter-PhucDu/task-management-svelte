<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Login from '$lib/components/auth/Login.svelte';
    import { authStore } from '$lib/stores/authStore';
    
    onMount(() => {
        if ($authStore.user) {
            goto('/');
        }
    });
    
    function handleLoginSuccess(event) {
        console.log('Login successful for:', event.detail.email);
    }
</script>

<div class="login-page">
    <div class="login-container">
        <div class="login-branding">
            <h1>Task Manager</h1>
        </div>
        
        <Login onsuccess={handleLoginSuccess} redirectTo="/" />
    </div>
</div>

<style>
    .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1rem;
    }
    
    .login-container {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        overflow: hidden;
        padding: 2rem;
    }
    
    .login-branding {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .login-branding h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2d3748;
        margin: 0;
    }
    
    @media (min-width: 768px) {
        .login-container {
            flex-direction: row;
            gap: 3rem;
            align-items: stretch;
            padding: 0;
        }
        
        .login-branding {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-bottom: 0;
            padding: 3rem;
            background-color: var(--primary-color);
            color: white;
        }
        
        .login-branding h1 {
            color: white;
        }
    }
</style>
