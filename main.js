const squares = document.querySelectorAll('.square');
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
        for (const prop in board)
        {
            if (board[prop] === null)
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
    return {getBoard, setSquare, checkSquare, checkCapacity, checkMark};
})();

// create player object factory
const personFactory = (mark) => {
    let _mark = mark;
    let _wins = 0;
    const getMark = () => _mark;
    const getWins = () => _wins;
    const addWin = () => wins++;
    return { getMark, getWins, addWin}
}


const gameEngine = (() =>{
    let round = 0;

    // initialize players
    let player1 = personFactory ('x');
    const mark1 = player1.getMark(); 
    let player2 = personFactory ('o');
    const mark2= player2.getMark();
    
    let currentMark = player1.getMark();

    // changes which mark can be placed
    const switchTurn = () => {
        if (currentMark === mark1) 
        {
            currentMark = mark2;
        }
        else 
        {
            currentMark = mark1;
        }
        console.log(currentMark);
    }

    const makeMove = (position) =>{
        // check if square at position is already filled in
        if (gameBoard.checkSquare(position))
        {
            return;
        }
        gameBoard.setSquare(position, currentMark);
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
            scoreMessage.textContent = `${mark} is the winner!`;
        }
        else
        {
            scoreMessage.textContent = 'It is a tie';
        }
        addRound();
        // then increment games played    
    }
    
    const getRound = () => round;
    

    // function that updates game stats
    const addRound = () => round++;
    return {getRound, makeMove}
    
})();




// controls the rendering of the board on the site
const displayController = (() => {
    const setDisplay = () => {
        boardState = gameBoard.getBoard();
        squares.forEach(square => {
            // log square's data-positon
            const position = square.getAttribute('data-position');
            // if boardState data-position is null, add active class to square
            let squareContent = boardState[position];
            if (squareContent === null)
            {
                square.classList.add('active');
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
    return {setDisplay}
})();


// event listeners for squares
squares.forEach(square => {
    square.classList.add('active-square');
    square.addEventListener('click', () =>
    {
        const position = square.getAttribute('data-position');
        gameEngine.makeMove(position);
        displayController.setDisplay();
    })
})