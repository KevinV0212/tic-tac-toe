const boardElement = document.querySelector('.game-board');
const squares = document.querySelectorAll('.square');

const startButton = document.querySelector('.start-button');
const roundInfo = document.querySelector('.round-info');

const playerElement1 = document.querySelector('#player-1');
const name1 = document.querySelector('#player-1 > .name');
const result1 = document.querySelector('#player-1 > .result');

const playerElement2 = document.querySelector('#player-2');
const name2 = document.querySelector('#player-2 > .name');
const result2 = document.querySelector('#player-2 > .result');

const scoreMessage = document.querySelector('.score-message');


// gameboard module and members that interact with board
const gameBoard = (() => {
    // 3x3 board is represented by 'board' properties
    let board = {     
        a1: null, a2:null, a3:null,
        b1: null, b2:null, b3:null,
        c1: null, c2:null, c3:null
    };
    
    const getBoard = () => board;

    // changes the the box at (row, col) to mark
    // not change square to inactive after
    const setSquare = (position, mark) =>  board[position] = mark;
    
    // returns content of square at 'position'
    const checkSquare = (position) => board[position];

    // returns true if all square on board are filled
    const checkCapacity = () => {
        for (const position in board)
        {
            if (board[position] === null)
            {
                return false;
            }
        }
        return true;
    }

    // checks combinations of rows, columns, or diagonals to find if 'mark' wins
    const checkMark = (mark) => {
        // check diagonal starting from top-left to bottom-right
        
        // check rows
        if ((board.a1 == mark && board.a2 == mark && board.a3 == mark) ||
            (board.b1 == mark && board.b2 == mark && board.b3 == mark) ||
            (board.c1 == mark && board.c2 == mark && board.c3 == mark))
        {
            return true;
        }
        // check columns
        else if ((board.a1 == mark && board.b1 == mark && board.c1 == mark) ||
                 (board.a2 == mark && board.b2 == mark && board.c2 == mark) ||
                 (board.a3 == mark && board.b3 == mark && board.c3 == mark))
        {
            return true;
        }
        // check diagonal paths
        else if ((board.a1 == mark && board.b2 == mark && board.c3 == mark) || 
                 (board.c1 == mark && board.b2 == mark && board.a3 == mark))
        {
            return true;
        }
        return false
    }
    const resetBoard = () => {
        Object.keys(board).forEach(position => board[position] = null);
    }

    return {getBoard, setSquare, checkSquare, 
            checkCapacity, checkMark, resetBoard};
})();

// create player object factory
const personFactory = (mark) => {
    let _mark = mark;
    let _wins = 0;
    let _name = "PLAYER";
    const getMark = () => _mark;
    const setName = (prompt) => _name = window.prompt(prompt); 
    const getName = () => _name;
    const getWins = () => _wins;
    const addWin = () => _wins++;
    return { getMark, setName, getName, getWins, addWin}
}







// controls the rendering of the board on the site
const displayController = (() => {
    const setDisplay = () => {
        roundInfo.textContent = `Round ${gameEngine.getRound()}`;
        boardState = gameBoard.getBoard();
        squares.forEach(square => {
            // log square's data-positon
            const position = square.getAttribute('data-position');
            // if boardState data-position is null, add active class to square
            let squareContent = boardState[position];
            if (squareContent === null)
            {
                square.classList.add('active');
                square.textContent = '';
            }
            // if square at position is not empty, render that square 
            else
            {
                square.textContent = squareContent;
                // then remove active class from that square.
                square.classList.remove('active');
            }
        })
    }
    const clearDisplay = () => {
        gameBoard.resetBoard();
        clearResults();
        setDisplay();   
    }
    const clearResults = () => {
        playerElement1.classList.remove('winner');
        playerElement1.classList.remove('loser');
        playerElement1.classList.remove('tie');
        playerElement2.classList.remove('winner');
        playerElement2.classList.remove('loser');
        playerElement2.classList.remove('tie');
        playerElement1.classList.remove('has-turn');
        playerElement2.classList.remove('has-turn');


        result1.textContent = '';
        result2.textContent = '';
        scoreMessage.textContent = '';
    }
    return {setDisplay, clearDisplay}
})();

// controls the operation of the game
const gameEngine = (() =>{
    let round = 1;

    // initialize players
    let player1 = personFactory ('x');
    name1.textContent = player1.setName('Enter Player 1');
    const mark1 = player1.getMark();
     

    let player2 = personFactory ('o');
    name2.textContent = player2.setName('Enter Player 2');
    const mark2 = player2.getMark();

    
    let currentMark = player1.getMark();
    let playing = false;

    const startRound = () => {
        displayController.clearDisplay();
        boardElement.classList.add('playable');
        playing = true;
        setPlayOrder();
    }
    // changes which mark can be placed
    const switchTurn = () => {
        if (currentMark === mark1) 
        {
            currentMark = mark2;
            playerElement2.classList.add('has-turn');
            playerElement1.classList.remove('has-turn');

        }
        else 
        {
            currentMark = mark1;
            playerElement1.classList.add('has-turn');
            playerElement2.classList.remove('has-turn');
        }
    }

    // sets the order of who gets the first move
    const setPlayOrder = () => {
        if (round % 2 === 0)
        {
            currentMark = mark2;
            playerElement2.classList.add('has-turn');
        }
        else 
        {
            currentMark = mark1;
            playerElement1.classList.add('has-turn');
        }
    }
    const makeMove = (position) =>{
        // check if square at position is already filled in
        if (!playing || gameBoard.checkSquare(position))
        {
            return;
        }
        gameBoard.setSquare(position, currentMark);
        displayController.setDisplay();

        // check to see if the winning move was just made
        if (gameBoard.checkMark(currentMark) === true)
        {
            handleEnd(currentMark);
            return;
        }
        // check to see if board is now full (tie)
        else if (gameBoard.checkCapacity())
        {
            handleEnd(null);
            return
        }
        switchTurn();
    }

    const handleEnd = (mark) => {
        // if winner exists, increment their wins
        if (mark)
        {
            if (mark === mark1){
                player1.addWin();
                indicateResults(player1);
                
            }
            else
            {
                player2.addWin();
                indicateResults(player2);
            }
        }
        else
        {
            indicateResults(null);
        }
        playing = false;
        boardElement.classList.remove('playable');
        playerElement1.classList.remove('has-turn');
        playerElement2.classList.remove('has-turn');
        addRound();
       
    }

    // changes page elements to indicate result of game
    const indicateResults = (winner) => {
        const p1_score = document.querySelector('#player-1 .score')
        const p2_score = document.querySelector('#player-2 .score')

        if (winner === player1)
        {
            playerElement1.classList.add('winner');
            result1.textContent= "😎";
            playerElement2.classList.add('loser');
            result2.textContent = "😡";
            scoreMessage.textContent = `${player1.getName()} is the winner!`;
            result1
        }
        else if (winner === player2)
        {
            playerElement2.classList.add('winner');
            result2.textContent = "😎";
            playerElement1.classList.add('loser');
            result1.textContent = "😡";
            scoreMessage.textContent = `${player2.getName()} is the winner!`;
        }
        else
        {
            playerElement1.classList.add('tie');
            result1.textContent= "🫤";
            playerElement2.classList.add('tie');
            result2.textContent = "🫤";
            scoreMessage.textContent = `It is a tie`;
        }
        p1_score.textContent = player1.getWins();
        p2_score.textContent = player2.getWins();
    }

    const getRound = () => round;
    
    // function that changes styling of a player to show that they won.

    // function that updates game stats
    const addRound = () => round++;
    return {getRound, startRound, makeMove}
    
})();

// event listener for start button
startButton.addEventListener('click', gameEngine.startRound);

// event listeners for squares
squares.forEach(square => {
    square.classList.add('active-square');
    square.addEventListener('click', () =>
    {
        const position = square.getAttribute('data-position');
        gameEngine.makeMove(position);
    })
})