/*
Moduł UI - manipulacja DOM, obsługa zdarzeń i subskrypcja store'a.
 */
import { store } from './store.js';
import { randomColor } from './helpers.js';

const shapesContainer = document.getElementById('shapes-container');
const squareCountElement = document.getElementById('square-count');
const circleCountElement = document.getElementById('circle-count');

/*
Tworzy element DOM dla pojedynczego kształtu.
 */
function createShapeElement(shape) {
    const element = document.createElement('div');
    element.className = `shape ${shape.type}`;
    element.style.backgroundColor = shape.color;
    element.dataset.id = shape.id;
    element.dataset.type = shape.type;
    return element;
}

/**
 Aktualizuje listę kształtów w DOM, porównując ją ze stanem (minimalizacja renderowania).
 @param {Object} state Aktualny stan aplikacji.
 */
function updateShapes(state) {
    const stateShapes = state.shapes;
    const domElements = Array.from(shapesContainer.children);

    // Mapowanie ID istniejących elementów DOM
    const domIds = new Set(domElements.map((el) => el.dataset.id));
    const stateIds = new Set(stateShapes.map((s) => s.id));

    //Usuń elementy, których nie ma już na stanie
    domElements.forEach((element) => {
        if (!stateIds.has(element.dataset.id)) {
            element.remove();
        }
    });

    //Dodaj / zaktualizuj elementy na podstawie stanu
    stateShapes.forEach((shape) => {
        let element = shapesContainer.querySelector(`[data-id="${shape.id}"]`);

        if (element) {
            // Aktualizuj kolor istniejącego elementu (jeśli jest różny)
            if (element.style.backgroundColor !== shape.color) {
                element.style.backgroundColor = shape.color;
            }
        } else {
            // Dodaj nowy element na koniec
            element = createShapeElement(shape);
            shapesContainer.appendChild(element);
        }
    });
}

/*
 Aktualizuje liczniki
 */
function updateCounters(state) {
    squareCountElement.textContent = state.squareCount;
    circleCountElement.textContent = state.circleCount;
}

/*
 'Obserwator', wywoływany przy każdej zmianie stanu
 */
function render(state) {
    updateCounters(state);
    updateShapes(state);
}

export function initUI() {
    console.log('---  UI: Inicjalizacja UI rozpoczęta. ---');

    // Subskrypcja store'a
    store.subscribe(render);
    console.log("--- UI: Subskrypcja store'a zakończona. ---");

    // Obsługa przycisków (wyłącznie zmiany stanu)
    document.getElementById('add-square').addEventListener('click', () => {
        console.log('KLIK: Dodaj kwadrat.');
        store.addShape('square', randomColor());
    });

    //Obsługa przycisków

    document.getElementById('add-square').addEventListener('click', () => {
        store.addShape('square', randomColor());
    });

    document.getElementById('add-circle').addEventListener('click', () => {
        store.addShape('circle', randomColor());
    });

    document.getElementById('color-squares').addEventListener('click', () => {
        store.colorShapes('square', randomColor());
    });

    document.getElementById('color-circles').addEventListener('click', () => {
        store.colorShapes('circle', randomColor());
    });

    //usuwanie kształtów
    shapesContainer.addEventListener('click', (e) => {
        const shapeElement = e.target.closest('.shape');
        if (shapeElement) {
            const shapeId = shapeElement.dataset.id;

            store.removeShape(shapeId);
        }
    });
}
