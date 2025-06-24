# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.



# Folder Structure

```
task-management-svelte/
├── src/                    # Source code directory
│   ├── app.d.ts            # TypeScript declaration file for the app
│   ├── app.html            # Main HTML template
│   ├── lib/                # Library code
│   │   ├── components/     # Svelte components
│   │   │   ├── auth/       # Authentication components
│   │   │   │   └── Login.svelte
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   │   └── Dashboard.svelte
│   │   │   └── tasks/      # Task components
│   │   │       ├── TaskDetail.svelte
│   │   │       ├── TaskForm.svelte
│   │   │       └── TaskList.svelte
│   │   ├── models/         # Data models/interfaces
│   │   │   ├── task.ts     # Task model definition
│   │   │   └── user.ts     # User model definition
│   │   ├── services/       # Services for external communication
│   │   │   ├── socketClientService.ts  # Client-side socket service
│   │   │   └── socket/     # Socket.io code
│   │   │       ├── events.ts           # Socket event definitions
│   │   │       ├── index.ts            # Socket server setup
│   │   │       └── handlers/           # Socket event handlers
│   │   │           ├── taskHandler.ts  # Task socket handlers
│   │   │           └── userHandler.ts  # User socket handlers
│   │   ├── stores/         # Svelte stores for state management
│   │   │   ├── authStore.ts   # Authentication state management
│   │   │   ├── taskStore.ts   # Task state management
│   │   │   └── userStore.ts   # User state management
│   │   └── index.ts        # Library exports
│   └── routes/             # SvelteKit routes
│       ├── +layout.svelte  # Layout for all pages
│       ├── +page.svelte    # Default page (Dashboard)
│       └── login/          # Login route
│           └── +page.svelte
├── static/                 # Static assets
│   └── favicon.png         # Favicon
├── .gitignore              # Git ignore file
├── .npmrc                  # NPM configuration
├── package.json            # Project dependencies and scripts
├── svelte.config.js        # Svelte configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration with Socket.io plugin
```
