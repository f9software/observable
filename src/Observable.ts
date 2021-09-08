export interface ObservableInterface {}

export interface Listener<O extends Observable> {
	(observable: O, ...args: any[]): ListenerResult;
}

export type ListenerResult = false | void | Promise<false | void>;

export class Observable implements ObservableInterface {
    private listeners: Map<string, Set<Listener<this>>> = new Map();

	/**
	 * initEvents method is deprecated and will be removed in future versions.
	 * @deprecated
	 * @returns {string[]}
	 */
    protected initEvents(): string[] {
		return [];
	}

    addEventListener(eventName: string, listener: Listener<this>) {
    	this.getListeners(eventName).add(listener);
    }

    removeEventListener(eventName: string, listener: Listener<this>) {
    	this.getListeners(eventName).delete(listener);
    }

    fireEvent(eventName: string, ...args: any[]): ListenerResult {
		const promises: Promise<false | void>[] = [];
		const listeners = Array.from(this.getListeners(eventName));

		let rs: ListenerResult;
		for (let i = 0; i < listeners.length; i++) {
			rs = listeners[i](this, ...args);

			if (rs instanceof Promise) {
				// if the result is a promise, it means we're dealing with a async listener and we don't
				// have the response right way, so we push the push the response into a promises array
				// and will handle it later
				promises.push(rs);
			} else if (rs === false) {
				// in case a synchronuous listener returns false, then stop calling any other listeners
				// and directly return the response
				return false;
			}
		}

		if (promises.length > 0) {
			// if we have promises, then return a promise back
			// make sure to return as soon as any of the promises in the array is rejected
			// or if the result of any promise is false
			return Promise
				.all(promises)
				.then(
					(responses) => {
						for (let i = 0; i < responses.length; i++) {
							if (responses[i] === false) {
								return false;
							}
						}
					},
					// return false in case of rejection
					() => false
				);
		}
    }

	clear(eventName?: string) {
		eventName ? this.listeners.delete(eventName) : this.listeners.clear();
	}

	destroy() {
		this.clear();
	}

	private getListeners(eventName: string): Set<Listener<this>> {
		let set = this.listeners.get(eventName);
		if (!set) {
			set = new Set();
			this.listeners.set(eventName, set);
		}

		return set;
	}
}
