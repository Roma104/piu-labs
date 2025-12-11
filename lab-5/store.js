import { generateUniqueId } from './helpers.js';

const LOCAL_STORAGE_KEY = 'shapesAppState';

class Store {
    #state;
    #subscribers = [];

    constructor() {
        this.#state = this.#loadState();
    }

    #loadState() {
        try {
            const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
            const parsed = serializedState
                ? JSON.parse(serializedState)
                : { shapes: [] };
            return parsed.shapes && Array.isArray(parsed.shapes)
                ? { shapes: parsed.shapes }
                : { shapes: [] };
        } catch (err) {
            console.error('Błąd ładowania stanu z localStorage:', err);
            return { shapes: [] };
        }
    }

    #saveState() {
        try {
            const serializedState = JSON.stringify(this.#state);
            localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
        } catch (err) {
            console.error('Błąd zapisu stanu do localStorage:', err);
        }
    }

    #notify() {
        this.#saveState();
        const currentState = this.getState();
        this.#subscribers.forEach((callback) => callback(currentState));
    }

    //Publiczny Interfejs

    getState() {
        const squareCount = this.#state.shapes.filter(
            (s) => s.type === 'square'
        ).length;
        const circleCount = this.#state.shapes.filter(
            (s) => s.type === 'circle'
        ).length;

        return {
            shapes: [...this.#state.shapes], // Zwracamy kopię tablicy
            squareCount,
            circleCount,
        };
    }

    subscribe(callback) {
        this.#subscribers.push(callback);
        callback(this.getState());
    }

    addShape(type, color) {
        const newShape = {
            id: generateUniqueId(),
            type: type,
            color: color,
        };
        this.#state.shapes.push(newShape);
        this.#notify();
    }

    removeShape(id) {
        const initialLength = this.#state.shapes.length;
        this.#state.shapes = this.#state.shapes.filter(
            (shape) => shape.id !== id
        );
        if (this.#state.shapes.length !== initialLength) {
            this.#notify();
        }
    }

    colorShapes(type, newColor) {
        let changed = false;
        this.#state.shapes = this.#state.shapes.map((shape) => {
            if (shape.type === type) {
                changed = true;
                return { ...shape, color: newColor };
            }
            return shape;
        });

        if (changed) {
            this.#notify();
        }
    }
}

export const store = new Store();
