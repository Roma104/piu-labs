function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
} //zmiana kolorków

function updateCount(column) {
    const count = column.querySelectorAll('.card').length;
    column.querySelector('.count').innerText = count;
} //liczenie karteczek

function saveData() {
    const data = {};
    document.querySelectorAll('.column').forEach((col) => {
        const colName = col.dataset.column;
        data[colName] = [];
        col.querySelectorAll('.card').forEach((card) => {
            data[colName].push({
                id: card.dataset.id,
                text: card.querySelector('span').innerText,
                color: card.style.backgroundColor,
            });
        });
    });
    localStorage.setItem('kanban', JSON.stringify(data));
} //zapisywanie danych

function createCard(id, text = '', color = '') {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;
    card.style.backgroundColor = color || randomColor();

    const span = document.createElement('span');
    span.contentEditable = true;
    span.innerText = text;
    span.addEventListener('input', saveData);

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'x';
    removeBtn.addEventListener('click', (e) => {
        card.remove();
        updateCount(card.parentElement.parentElement);
        saveData();
        e.stopPropagation();
    });

    const moveLeft = document.createElement('button');
    moveLeft.innerText = '←';
    moveLeft.addEventListener('click', () => moveCard(card, -1));

    const moveRight = document.createElement('button');
    moveRight.innerText = '→';
    moveRight.addEventListener('click', () => moveCard(card, 1));

    const moveUp = document.createElement('button');
    moveUp.innerText = '↑';
    moveUp.addEventListener('click', (e) => {
        moveCardVertical(card, -1);
        e.stopPropagation();
    });

    const moveDown = document.createElement('button');
    moveDown.innerText = '↓';
    moveDown.addEventListener('click', (e) => {
        moveCardVertical(card, 1);
        e.stopPropagation();
    });

    const colorBtn = document.createElement('button');
    colorBtn.innerText = '🎨';
    colorBtn.addEventListener('click', () => {
        card.style.backgroundColor = randomColor();
        saveData();
    });

    card.appendChild(span);
    card.appendChild(removeBtn);
    card.appendChild(moveLeft);
    card.appendChild(moveRight);
    card.appendChild(moveUp);
    card.appendChild(moveDown);
    card.appendChild(colorBtn);

    return card;
} //tworzenie karteczek + wszystkie przyciski

function moveCard(card, direction) {
    const columns = Array.from(document.querySelectorAll('.column'));
    const parentCol = card.parentElement.parentElement;
    const idx = columns.indexOf(parentCol);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= columns.length) return;
    columns[newIdx].querySelector('.cards').appendChild(card);
    updateCount(parentCol);
    updateCount(columns[newIdx]);
    saveData();
} //przerzucanie kart między kolumnami

function moveCardVertical(card, direction) {
    const parent = card.parentElement; // .cards
    const cards = Array.from(parent.children);
    const idx = cards.indexOf(card);
    const newIdx = idx + direction;

    if (newIdx < 0 || newIdx >= cards.length) return;

    // Zamiana pozycji
    if (direction === -1) {
        parent.insertBefore(card, cards[idx - 1]);
    } else {
        parent.insertBefore(cards[idx + 1], card);
    }

    saveData();
} //przesówanie kart między sobą gór/dół

document.querySelectorAll('.column').forEach((col) => {
    const addBtn = col.querySelector('.add-card');
    const colorColBtn = col.querySelector('.color-column');

    addBtn.addEventListener('click', () => {
        const id = 'card-' + Date.now();
        const card = createCard(id, 'Nowa karta');
        col.querySelector('.cards').appendChild(card);
        updateCount(col);
        saveData();
    });

    colorColBtn.addEventListener('click', () => {
        col.querySelectorAll('.card').forEach((c) => {
            c.style.backgroundColor = randomColor();
        });
        saveData();
    });
}); //obsłóga kolumn

const saved = JSON.parse(localStorage.getItem('kanban'));
if (saved) {
    Object.entries(saved).forEach(([colName, cards]) => {
        const col = document.querySelector(
            `.column[data-column="${colName}"] .cards`
        );
        cards.forEach((c) => {
            const card = createCard(c.id, c.text, c.color);
            col.appendChild(card);
        });
        updateCount(col.parentElement);
    });
} //local storage
