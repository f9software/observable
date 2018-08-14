export abstract class Observable {
    listeners:{[key: string]: Function[]} = {};

    constructor() {
        this.initEvents()
            .forEach(eventName => this.listeners[eventName] = []);
    }

    protected abstract initEvents(): string[];

    addEventListener(eventName: string, handler: (...args: any[]) => void) {
        this.listeners[eventName].push(handler);
    }

    removeEventListener(eventName: string, handler: (...args: any[]) => void) {
        const index = this.listeners[eventName].findIndex(savedHandler => savedHandler === handler);

        if (index > -1) {
            this.listeners[eventName].splice(index, 1);
        }
    }

    fireEvent(eventName: string, ...args: any[]) {
        this.listeners[eventName]
            .forEach(handler => handler(this, ...args));
    }
}
