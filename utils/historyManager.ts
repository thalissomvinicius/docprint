export class HistoryManager<T> {
    private past: T[] = [];
    private future: T[] = [];
    private present: T;

    constructor(initialState: T) {
        this.present = initialState;
    }

    public push(newState: T): void {
        // If new state is same as current, ignore (optional optimization)
        if (JSON.stringify(this.present) === JSON.stringify(newState)) return;

        this.past.push(this.present);
        this.present = newState;
        this.future = []; // Clear redo stack on new action

        // Limit history size to prevent memory issues
        if (this.past.length > 20) {
            this.past.shift();
        }
    }

    public undo(): T | null {
        if (this.past.length === 0) return null;

        this.future.unshift(this.present);
        const previous = this.past.pop();
        if (previous) {
            this.present = previous;
            return this.present;
        }
        return null;
    }

    public redo(): T | null {
        if (this.future.length === 0) return null;

        this.past.push(this.present);
        const next = this.future.shift();
        if (next) {
            this.present = next;
            return this.present;
        }
        return null;
    }

    public getCurrent(): T {
        return this.present;
    }

    public canUndo(): boolean {
        return this.past.length > 0;
    }

    public canRedo(): boolean {
        return this.future.length > 0;
    }
}
