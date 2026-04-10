type EventMap = Record<string, unknown>;

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

export interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}

export class TypedEmitter<T extends EventMap> implements Emitter<T> {
  private listeners = new Map<string, Set<EventReceiver<unknown>>>();

  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    const listeners =
      this.listeners.get(eventName) ?? new Set<EventReceiver<unknown>>();
    listeners.add(fn as EventReceiver<unknown>);
    this.listeners.set(eventName, listeners);
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    const listeners = this.listeners.get(eventName);
    if (!listeners) {
      return;
    }

    listeners.delete(fn as EventReceiver<unknown>);
    if (listeners.size === 0) {
      this.listeners.delete(eventName);
    }
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    const listeners = this.listeners.get(eventName);
    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(params);
    }
  }

  removeAllListeners() {
    this.listeners.clear();
  }
}
