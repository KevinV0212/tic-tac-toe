const squares = document.querySelectorAll('.square');
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
    const setSquare = (square, mark) =>  board[square] = mark;
    
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
    return {getBoard, setSquare, checkCapacity, checkMark};
})();
// create player object factory
const personFactory = (mark) => {
    let wins = 0;
    const getWins = () => wins;
    const addWin = () => wins++;
    return { mark, getWins, addWin}
}


const gameEngine = (() =>{
    let round = 0;

    let player1 = personFactory ('x');
    const mark1 = player1.mark; 
    let player2 = personFactory ('o');
    const mark2= player2.mark;
    let currentMark = player1.mark;

    
    const switchTurn = () => {
        if (currentMark === mark1) 
            currentMark = mark2;
        else 
            currentMark = mark1;
    }

    // event listeners for squares
    squares.forEach(square => {
        const position = square.getAttribute('data-position');
        square.classList.toggle('active-square');
        square.addEventListener('click', makeMove(position))
    })

    const makeMove = (position) =>{
        // check for if square at position is already filled in
        if (!gameBoard.board[position])
        {
            return;
        }
        // check to see if the winning move was just made
        gameBoard.setSquare(position, currentMark);
        if (gameBoard.checkMark(currentMark) === true)
        {
            handleEnd(mark);
            return;
        }
        // check to see if board is now full (tie)
        else if (gameBoard.checkCapacity)
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
            console.log(`${mark} is the Winner`)
        }
        else
        {
            console.log('Tie');
        }
        incrementGames();
        // then increment games played    
    }
    const getRound = () => round;
    

    // function that updates game stats
    const incrementGames = () => gamesPlayed++;
    return (getRound, playRound)
    
})


// object to control flow of game module

// function to make move. takes data properties of boxes to plot moves in array