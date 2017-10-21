export abstract class Observable {
    listeners:{[key: string]: Function[]} = {};

    constructor() {
        this.initEvents()
            .forEach(eventName => this.listeners[eventName] = []);
    }

    protected abstract initEvents();

    addEventListener(eventName, handler) {
        this.listeners[eventName].push(handler);
    }

    removeEventListener(eventName, handler) {
        const index = this.listeners[eventName].findIndex(savedHandler => savedHandler === handler);

        if (index > -1) {
            this.listeners[eventName].splice(index, 1);
        }
    }

    fireEvent(eventName, ...args) {
        this.listeners[eventName]
            .forEach(handler => handler(this, ...args));
    }
}
