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



# Strategy Pattern
Strategy định nghĩa một tập các thuật toán liên quan cho một chức năng cụ thể, tách rời phần xử lý đó ra khỏi đối tượng chính. Sau đó, tại thời điểm chạy, ta có thể lựa chọn thuật toán phù hợp nhất trong tập hợp này để thực thi. Pattern này thay thế cho việc dùng kế thừa nhiều lớp con khi ta không muốn theo dõi và chỉnh sửa chức năng qua từng lớp.

# Factory Pattern: 
Factory: Định nghĩa một interface để khởi tạo một object, nhưng quyền quyết định lớp cụ thể nào sẽ được khởi tạo được giao cho các subclass.