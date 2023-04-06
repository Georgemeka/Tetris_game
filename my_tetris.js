const canvas = document.getElementById('game_canvas');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSeq = [];
var score = 0;

function updateScore() {
    score += 10;
}

const tet_color = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

const tetrominos = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]

    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ]
};
const playfield = [];

//function to generate random integer btwn min and max
function genRandomNum(min, max) {
    const range = max - min + 1;
    res = Math.floor(Math.random() * range) + min;
    return res;
}
//generate new tetromino seq
function genSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    for (let i = 0; i < sequence.length; i++) {
        const random = genRandomNum(i, sequence.length - 1);
        [sequence[i], sequence[random]] = [sequence[random], sequence[i]];
        tetrominoSeq.push(sequence[i]);
    }

    return tetrominoSeq;
}

//to generate and show next sequence of tetrominoes
function showNextTetronimo() {
    if (tetrominoSeq.length === 0) {
        genSequence();
    }

    const name = tetrominoSeq.pop();
    const matrix = tetrominos[name];

    //Arrangement: I and O start centered. All others start in left-middle
    const playfieldWidth = playfield[0].length;
    const matrixWidth = matrix[0].length;
    const col = Math.floor((playfieldWidth - matrixWidth) / 2);


    const row = name === 'I' ? -1 : -2;
    return {
        name,
        matrix,
        row,
        col,
    };



}
//NxN matrix is rotated by 90 degrees
function rotate(matrix) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const rotatedMatrix = [];

    for (let i = 0; i < numCols; i++) {
        const newRow = [];

        for (let j = numRows - 1; j >= 0; j--) {
            newRow.push(matrix[j][i]);
        }

        rotatedMatrix.push(newRow);
    }

    return rotatedMatrix;
}

//Verify if matrix is valid
function isValidMove(matrix, rowIndex, columnIndex) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // outside the game bounds
                columnIndex + col < 0 ||
                columnIndex + col >= playfield[0].length ||
                rowIndex + row >= playfield.length ||
                // collides with another piece
                playfield[rowIndex + row][columnIndex + col])
            ) {
                return false;
            }
        }
    }

    return true;
}

function placeTetro() {

    tetro.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const playfieldRow = tetro.row + rowIndex;
                const playfieldCol = tetro.col + colIndex;

                if (playfieldRow < 0) {
                    return showGameOver();
                }

                playfield[playfieldRow][playfieldCol] = tetro.name;
            }
        })
    })


    // Check for line clears starting from the bottom and working our way up

    for (let row = playfield.length - 1; row >= 0; row--) {
        const isRowFilled = playfield[row].every(cell => !!cell);
        if (isRowFilled) {

            for (let aboveRow = row; aboveRow >= 0; aboveRow--) {
                playfield[aboveRow] = playfield[aboveRow - 1].slice();
            }
            updateScore();
        }

    }
    tetro = showNextTetronimo();
}


function showGameOver() {
    cancelAnimationFrame(anFrame);


    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillText(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '40px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    gameEnd = true;
}

function pause() {

    if (!pauseStatus) {
        cancelAnimationFrame(anFrame);
        context.fillStyle = 'black';
        context.globalAlpha = 0.75;
        context.globalAlpha = 1;
        context.fillStyle = 'white';
        context.font = '38px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
    pauseStatus = true;
}


function play() {
    if (!pauseStatus)
        return;


    anFrame = requestAnimationFrame(runtime);
    if (gameEnd) {
        gameEnd = false;
        anFrame = null;
        runtime();
    }
    pauseStatus = false;

}

//populate empty state
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}



let pauseStatus = true;
let gameEnd = false;
let count = 0;
let tetro = showNextTetronimo();
let anFrame = null;



function runtime() {
    anFrame = requestAnimationFrame(runtime);
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('score_count').innerHTML = score;
    if (gameEnd) return;
    if (pauseStatus) return;
    //draw the arena
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = tet_color[name];

                context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
            }
        }
    }

    if (tetro) {
        if (++count > 35) {
            tetro.row++;
            count = 0;

            if (!isValidMove(tetro.matrix, tetro.row, tetro.col)) {
                tetro.row--;
                placeTetro();
            }

        }

        context.fillStyle = tet_color[tetro.name];

        for (let row = 0; row < tetro.matrix.length; row++) {
            for (let col = 0; col < tetro.matrix[row].length; col++) {
                if (tetro.matrix[row][col]) {
                    context.fillRect((tetro.col + col) * grid, (tetro.row + row) * grid, grid - 1, grid - 1);
                }
            }
        }
    }
}

function hardDrop() {
    let row = tetro.row + 1;
    while (isValidMove(tetro.matrix, row, tetro.col)) {
        row++;
    }
    if (!isValidMove(tetro.matrix, row, tetro.col)) {
        tetro.row = row - 1;

        placeTetro();
        return;
    }

    tetro.row = row;


}

//listen to keyboard
document.addEventListener('keydown', function (e) {
    const { key } = e;

    //left and right 
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const column = key === 'ArrowLeft' ? tetro.col - 1 : tetro.col + 1;

        if (isValidMove(tetro.matrix, tetro.row, column)) {
            tetro.col = column;
        }
    }

    //up arrow
    if (key === 'ArrowUp') {
        const matrix = rotate(tetro.matrix);
        if (isValidMove(matrix, tetro.row, tetro.col)) {
            tetro.matrix = matrix;
        }
    }

    //down arrow
    if (key === 'ArrowDown') {
        const row = tetro.row + 1;
        if (!isValidMove(tetro.matrix, row, tetro.col)) {
            tetro.row = row - 1;

            placeTetro();
            return;
        }

        tetro.row = row;
    }

    if (key === ' ') {
        if (!gameEnd && !pauseStatus) hardDrop();
    }

    if (key === 'p') {
        if (!gameEnd && !pauseStatus) pause();
    }

    if (key === 'Escape') {
        showGameOver();
    }
});


function moveTetromino(deltaX, deltaY) {
    const newCol = tetro.col + deltaX;
    const newRow = tetro.row + deltaY;
    if (isValidMove(tetro.matrix, newRow, newCol)) {
        tetro.col = newCol;
        tetro.row = newRow;
    }
}

function rotateTetromino() {
    const rotated = rotate(tetro.matrix);
    if (isValidMove(rotated, tetro.row, tetro.col)) {
        tetro.matrix = rotated;
    }
}

function hardDropTetromino() {
    let row = tetro.row;
    while (isValidMove(tetro.matrix, row + 1, tetro.col)) {
        row++;
    }
    tetro.row = row;
    placeTetromino();
}

function pauseGame() {
    pauseStatus = !pauseStatus;
    updatePauseScreen();
}
