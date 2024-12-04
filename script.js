const words = ["GERMAN", "ROSALIA", "BESITO", "ABRAZO", "TEQUIERO", "MUA"];
const gridSize = 15;
const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
const foundWords = new Set();

const wordsearch = document.getElementById("wordsearch");
const wordsList = document.getElementById("words-list");
const message = document.getElementById("message");

function placeWords() {
    const directions = [
        { x: 1, y: 0 }, // Horizontal
        { x: 0, y: 1 }, // Vertical
        { x: 1, y: 1 }, // Diagonal
    ];

    for (let word of words) {
        let placed = false;
        while (!placed) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const startX = Math.floor(Math.random() * gridSize);
            const startY = Math.floor(Math.random() * gridSize);

            if (canPlaceWord(word, startX, startY, dir)) {
                for (let i = 0; i < word.length; i++) {
                    grid[startY + i * dir.y][startX + i * dir.x] = word[i];
                }
                placed = true;
            }
        }
    }

    // Rellenar espacios vacíos con letras aleatorias
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (!grid[y][x]) {
                grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }
}

function canPlaceWord(word, x, y, dir) {
    if (x + dir.x * word.length > gridSize || y + dir.y * word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
        if (grid[y + i * dir.y][x + i * dir.x]) return false;
    }
    return true;
}

function renderGrid() {
    wordsearch.innerHTML = "";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.textContent = grid[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            wordsearch.appendChild(cell);
        }
    }
}

let selection = [];
wordsearch.addEventListener("mousedown", (e) => {
    if (e.target.dataset.x !== undefined) {
        selection = [{ x: +e.target.dataset.x, y: +e.target.dataset.y }];
        e.target.classList.add("selected");
    }
});

wordsearch.addEventListener("mouseover", (e) => {
    if (selection.length > 0 && e.target.dataset.x !== undefined) {
        const x = +e.target.dataset.x;
        const y = +e.target.dataset.y;
        if (!selection.find(pos => pos.x === x && pos.y === y)) {
            selection.push({ x, y });
            e.target.classList.add("selected");
        }
    }
});

wordsearch.addEventListener("mouseup", () => {
    const word = selection.map(pos => grid[pos.y][pos.x]).join("");
    const reverseWord = word.split("").reverse().join("");

    // Verificar si la palabra seleccionada es correcta
    if (words.includes(word) || words.includes(reverseWord)) {
        selection.forEach(pos => {
            document.querySelector(`[data-x="${pos.x}"][data-y="${pos.y}"]`).classList.add("found");
        });

        // Agregar la palabra encontrada a la lista y al Set
        if (!foundWords.has(word)) {
            foundWords.add(word);
            const li = document.createElement("li");
            li.textContent = word;
            wordsList.appendChild(li);
        }

        // Mostrar mensaje si todas las palabras han sido encontradas
        if (foundWords.size === words.length) {
            message.textContent = "¡Felicidades! Has encontrado todas las palabras.";
        }
    }

    // Limpiar la selección actual
    document.querySelectorAll(".selected").forEach(cell => cell.classList.remove("selected"));
    selection = [];
});

// Inicializar el juego
placeWords();
renderGrid();
