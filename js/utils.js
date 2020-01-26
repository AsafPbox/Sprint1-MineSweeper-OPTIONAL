'use strict';

function renderBoard(board) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = FLOOR;
            var className = 'cell-' + i + '-' + j;
            strHTML += '<td id="' + className + '" onmousedown="cellClicked(event)" class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    return coord;
}

function countNegs(posI, posJ) {
    var neighborsArray = []
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;
            gBoard[posI][posJ].neighborsAround.push({ i: i, j: j })
            if (gBoard[i][j].isMine === true) {
                gBoard[posI][posJ].minesAroundCount++
            }
        }
    }
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

//Timer function
function pad(val) { return val > 9 ? val : "0" + val; }
function timer() {
    document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
}

function resetTimer() {
    document.querySelector('.timer #minutes').innerHTML = '00';
    document.querySelector('.timer #seconds').innerHTML = '00';
    sec = 0
}


function scoreBoard(score) { // need to shorten the function
    if (gBoard.length === 4) {
        var currentHighScore = localStorage.getItem('HighScore_Beginner');
        if (currentHighScore === null) {
            localStorage.setItem('HighScore_Beginner', score);
            document.querySelector('.scoreBoard #Beginner').innerHTML = score
        } else { if (score < currentHighScore) { 
            localStorage.setItem('HighScore_Beginner', score); 
            document.querySelector('.scoreBoard #Beginner').innerHTML = score
        } }
    }
    else if (gBoard.length === 8) {
        var currentHighScore = localStorage.getItem('HighScore_Medium');
        if (currentHighScore === null) {
            localStorage.setItem('HighScore_Medium', score);
            document.querySelector('.scoreBoard #Medium').innerHTML = score;
        } else { if (score < currentHighScore) { 
            localStorage.setItem('HighScore_Medium', score); 
            document.querySelector('.scoreBoard #Medium').innerHTML = score;
        } }
    }
    else if (gBoard.length === 12) {
        var currentHighScore = localStorage.getItem('HighScore_Expert');
        if (currentHighScore === null) {
            localStorage.setItem('HighScore_Expert', score);
            document.querySelector('.scoreBoard #Expert').innerHTML = score;
        } else { if (score < currentHighScore) { 
            localStorage.setItem('HighScore_Expert', score); 
            document.querySelector('.scoreBoard #Expert').innerHTML = score;
        } }
    }
}