import type { UserStore } from '../services/socket/events';

export class SocketUserStore implements UserStore {
  private users = new Map<string, string>();

  constructor() {}

  get(socketId: string): string | undefined {
    return this.users.get(socketId);
  }

  set(socketId: string, username: string): void {
    this.users.set(socketId, username);
  }

  delete(socketId: string): boolean {
    return this.users.delete(socketId);
  }

  values(): IterableIterator<string> {
    return this.users.values();
  }

  get size(): number {
    return this.users.size;
  }

  getAllUsers(): string[] {
    return Array.from(this.users.values());
  }
}
