## Project Overview

The application uses Socket.IO for real-time bidirectional communication:

- Tasks are synchronized across all connected clients
- User presence is tracked and displayed
- Changes are broadcast to all relevant clients instantly

## Features

- Real-time task updates using Socket.IO
- User authentication and presence awareness
- Task creation, editing, and deletion
- Task assignment and prioritization
- Responsive user interface

## Project Architecture

The application follows a client-server architecture:

- **Client**: SvelteKit frontend with Socket.IO client
- **Server**: Socket.IO server integrated with Vite dev server
- **State Management**: Svelte stores for client-side state

## System Requirements

- Node.js 22.x or higher
- npm 10.x or higher

## Install dependencies:

```bash
npm install
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
