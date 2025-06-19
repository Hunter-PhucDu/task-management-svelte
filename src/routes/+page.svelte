<script lang="ts">
    import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
    import { authStore } from '$lib/stores/authStore';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    onMount(() => {
        if (!$authStore.user) {
            goto('/login');
        }
    });
</script>

<Dashboard />