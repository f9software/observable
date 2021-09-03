export interface ObservableInterface {}

export interface Listener<O extends Observable> {
	(observable: O, ...args: any[]): false | void;
}

export abstract class Observable implements ObservableInterface {
    private listeners: Map<string, Set<Listener<this>>> = new Map();

    constructor() {
    	this.initEvents()
    		.forEach(eventName => this.listeners.set(eventName, new Set()));
    }

    protected abstract initEvents(): string[];

    addEventListener(eventName: string, listener: Listener<this>) {
    	this.listeners.get(eventName)?.add(listener);
    }

    removeEventListener(eventName: string, listener: Listener<this>) {
    	this.listeners.get(eventName)?.delete(listener);
    }

    fireEvent(eventName: string, ...args: any[]): false | void {
    	const listeners = Array.from(this.listeners.get(eventName) || []);

    	for (let i = 0; i < listeners.length; i++) {
    		if (listeners[i](this, ...args) === false) {
    			return false;
    		}
    	}
    }
}
