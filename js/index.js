'use strict';

var gBoard;
var gLevel = [
    {
        SIZE: 4,
        MINES: 2
    },
    {
        SIZE: 8,
        MINES: 12
    },
    {
        SIZE: 12,
        MINES: 30
    }
]

var WIN = '😎'
var START = '😀'
var DEAD = '😵'
var MINE = '💣'
var FLOOR = ''
var MARK = '🚩'
var isFirstClick;
var gMinesArray;
var gStartTimer
var gScore = 0;
var sec = 0;


function initGame(size = 4) {
    gScore = 0
    document.querySelector('.score span').innerText = gScore;
    document.querySelector('.smileyButton').src = "./img/smiling.png";
    clearInterval(gStartTimer);
    resetTimer();
    isFirstClick = false;
    gBoard = buildBoard(size);
    renderBoard(gBoard);
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                neighborsAround: []
            };
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var negs = countNegs(i, j)
        }
    }
}

function cellClicked(elCell) {
    if (checkGameOver()) return;
    // var currScore = parseInt(document.querySelector('.score span').innerText)
    switch (elCell.which) {
        case 1:
            var coords = getCellCoord(elCell.toElement.id)
            if (isFirstClick === false) {
                isFirstClick = true;
                placeRandMines(coords)
                setMinesNegsCount(gBoard)
                gStartTimer = setInterval(timer, 1000)
                // gScore += 1;
                // document.querySelector('.score span').innerText = gScore;
            }
            if (gBoard[coords.i][coords.j].isMarked === true) return;
            if (gBoard[coords.i][coords.j].isMine === true) {
                minesExplode()
            }
            else {
                if (gBoard[coords.i][coords.j].minesAroundCount === 0) {
                    gBoard[coords.i][coords.j].isShown = true;
                    gScore += 1;
                    document.querySelector('.score span').innerText = gScore;
                    renderCell({ i: coords.i, j: coords.j }, gBoard[coords.i][coords.j].minesAroundCount)
                    expandShown(gBoard, elCell, coords.i, coords.j)
                    checkGameOver()
                }
                else {
                    gBoard[coords.i][coords.j].isShown = true;
                    gScore += 1;
                    document.querySelector('.score span').innerText = gScore;
                    renderCell({ i: coords.i, j: coords.j }, gBoard[coords.i][coords.j].minesAroundCount)
                    checkGameOver()
                }
            }
            break;
        case 3:
            if (isFirstClick === false) {
                isFirstClick = true;
                placeRandMines()
                setMinesNegsCount(gBoard)
                gStartTimer = setInterval(timer, 1000)
            }
            cellMarked(elCell)
            break;
    }
}

function cellMarked(elCell) {
    var coords = getCellCoord(elCell.toElement.id)
    var flagsNum = parseInt(document.querySelector('.flagsCount span').innerText)
    if (gBoard[coords.i][coords.j].isMarked === true) {
        document.querySelector('.flagsCount span').innerText = flagsNum + 1
        gBoard[coords.i][coords.j].isMarked = false;
        renderCell(coords, FLOOR);
        checkGameOver()
    } else {
        if (flagsNum <= 0) return
        gBoard[coords.i][coords.j].isMarked = true;
        document.querySelector('.flagsCount span').innerText = flagsNum - 1
        renderCell(coords, MARK)
        checkGameOver()
    }
}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false) return false;
            if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false) return false;
        }
    }
    gScore += gMinesArray.length;
    clearInterval(gStartTimer)
    document.querySelector('.smileyButton').src = "./img/sunglass.png"
    // localStorage.setItem('HighScore', document.querySelector('.timer #seconds').innerHTML)
    // console.log('HighScore :', localStorage.getItem('HighScore'))
    scoreBoard(document.querySelector('.timer #seconds').innerHTML)
    return true
}

function expandShown(board, elCell, i, j) {
    for (var m = 0; m < board[i][j].neighborsAround.length; m++) {
        var negI = board[i][j].neighborsAround[m].i
        var negJ = board[i][j].neighborsAround[m].j
        board[negI][negJ].isShown = true;
        gScore += 1;
        renderCell({ i: negI, j: negJ }, board[negI][negJ].minesAroundCount)
    }
    document.querySelector('.score span').innerText = gScore
}

// function compressShown(board, i, j){ NOT FINISHED
//     for (var m = 0; m < board[i][j].neighborsAround.length; m++) {
//         var negI = board[i][j].neighborsAround[m].i
//         var negJ = board[i][j].neighborsAround[m].j
//         board[negI][negJ].isShown = false;
//         renderCell({ i: negI, j: negJ }, FLOOR)
//     }
//     gBoard[i][j].isShown = false;
//     renderCell({i, j}, FLOOR)
//     document.querySelector('#cell-' + i + '-' + j).classList.remove('mark');
//     // document.querySelector('.score span').innerText = gScore
// }

function placeRandMines(pos) {
    var minesAmout = 0;
    var minesArray = [];
    if (gBoard.length === 4) { var num = gLevel[0].MINES }
    if (gBoard.length === 8) { var num = gLevel[1].MINES }
    if (gBoard.length === 12) { var num = gLevel[2].MINES }
    while (minesAmout < num) {
        var posI = getRandomInt(0, gBoard.length)
        var posJ = getRandomInt(0, gBoard.length)
        if (posI === pos.i && posJ === pos.j) continue;
        if (gBoard[posI][posJ].isMine === false) {
            gBoard[posI][posJ].isMine = true;
            minesAmout++
            minesArray.push({ i: posI, j: posJ });
        }
    }
    gMinesArray = minesArray;
    document.querySelector('.flagsCount span').innerText = gMinesArray.length;
    console.log('Mines are :', gMinesArray)
}

function minesExplode() {
    for (var m = 0; m < gMinesArray.length; m++) {
        gBoard[gMinesArray[m].i][gMinesArray[m].j].isShown = true;
        renderCell(gMinesArray[m], MINE)
    }
    gameOver()
}

function gameOver() {
    clearInterval(gStartTimer);
    document.querySelector('.smileyButton').src = "./img/dead.png"
}

// function getHint() { NOT FINISHED
//     var posI = getRandomInt(0, gBoard.length);
//     var posJ = getRandomInt(0, gBoard.length);
//     var randCell = gBoard[posI][posJ];
//     console.log('randomCell :', posI, posJ)
//     if (randCell.isShown === false && randCell.isMine === false) {
//         console.log('Adding Mark to ', posI, posJ)
//         document.querySelector('#cell-' + posI + '-' + posJ).classList.add('mark');
//         randCell.isShown = true;
//         renderCell({i: posI, j: posJ}, randCell.minesAroundCount)
//         for (var i = 0; i < randCell.neighborsAround.length; i++) {
//             gBoard[randCell.neighborsAround[i].i][randCell.neighborsAround[i].j].isShown = true;
//             renderCell({i:[randCell.neighborsAround[i].i], j: [randCell.neighborsAround[i].j]}, gBoard[randCell.neighborsAround[i].i][randCell.neighborsAround[i].j].minesAroundCount)
//         }
//     }
//     setTimeout(compressShown, 6000, gBoard, posI, posJ)
// }


// Adding ScoreBoard need to complete
// document.querySelector('#Beginner').innerText = localStorage.getItem('HighScore_Beginner')
// document.querySelector('#Medium').innerText = localStorage.getItem('HighScore_Medium')
// document.querySelector('#Expert').innerText = localStorage.getItem('HighScore_Expert')