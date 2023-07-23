// gameboard module and members that interact with board
const gameBoard = (() => {
    // 3 x 3 game board
    const boardLength = 3;
    // 3x3 board is represented by object properties
    let board = {     
        t1: null, t2:null, t3:null,
        m1: null, m2:null, m3:null,
        b1: null, b2:null, b3:null
    };
    
    const getBoard = () => board;

    // changes the the box at (row, col) to mark
    // not change square to inactive after
    const setSquare = (square, mark) => board[square] = mark;
    
    // function that checks if board is filled
    const checkCapacity = () => {
        for (let prop in board)
        {
            if (!prop)
                return false;
        }
        return true;
    }

    // checks combinations of rows, columns, or diagonals to find if 'mark' wins
    const checkMark = (mark) => {
        // check diagonal starting from top-left to bottom-right
        
        // check rows
        if ((board.t1 == mark && board.t2 == mark && board.t3 == mark) ||
            (board.m1 == mark && board.m2 == mark && board.m3 == mark) ||
            (board.b1 == mark && board.b2 == mark && board.b3 == mark))
        {
            return true;
        }
        // check columns
        else if ((board.t1 == mark && board.m1 == mark && board.b1 == mark) ||
                 (board.t2 == mark && board.m2 == mark && board.b2 == mark) ||
                 (board.t3 == mark && board.m3 == mark && board.b3 == mark))
        {
            return true;
        }
        // check diagonal paths
        else if ((board.t1 == mark && board.m2 == mark && board.b3 == mark) || 
                 (board.b1 == mark && board.m2 == mark && board.t3 == mark))
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
    // if square is active, changes square to currently played mark
    // called by square event listeners
    const makeMove = (square) =>{
        // if square is inactive, return
        // if not, then fill in square with currentMark
        // then check gameBoard to see if that mark has won
            // if so, then handle win
        // then check if game board is filled
        if (gameBoard.isFilled)
        {
        handleEnd(null);
        }
        // if so, handle, the tie (where you clear board);
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