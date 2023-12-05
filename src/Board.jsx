import { useState } from "react";
import './App.css'

function Square({ value, onSquareClick }) {
    // clicking on any button will call onSquareClick method and then from there it will call handleClick(i) method
    return (
        <button className="square" onClick={onSquareClick}>{value}</button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    // handling click event
    function handleClick(i) {
        // checking if the winner is already declared or the square is already fill
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // Making a copy of squares array and both are not refering to same array 
        const nextSquares = squares.slice();
        // updating the squares array
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }

    // calculation of Winner after each change state change
    const winner = calculateWinner(squares);
    let status;
    // giving value to status depending upon the condition
    if (winner) {
        status = "Winner: " + winner;
    } else {
        // handles the case when all the boxes are occupied but winner is not obtained ie., match draw
        let flag = 0;
        for (let i = 0; i < squares.length; i++) {
            if(squares[i] === null) {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            status = "Game Draw";
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    return (
        <div className="board">

            <h2 className="status"> **  {status}  **</h2>
            <div className="row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </div>
    );
}

function Game() {
    // history is an array of arrays and each array element in it is the square array at some time 
    const [history, setHistory] = useState([Array(9).fill(null)]);
    // updates the number of move we are on
    const [currentMove, setCurrentMove] = useState(0);
    // keeping track of whether the next turn is of 'X' or 'O'
    const xIsNext = currentMove % 2 === 0;
    // currentSquare contains the square value at the moment and is at the currentMove index in history array
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        // adds the nextSquare (or, square) array to history as element which results in incrementing the length of history
        const nextHistory = [...history, nextSquares];
        setHistory(nextHistory);
        // currentMove depends on current history length because even our history array will keep on growing by taking the updated nextSquare array and hence the currentMove value also increases
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        // if we click on any list button to go to some history state, then the move value will also be changed to the move of the state
        setCurrentMove(nextMove);
    }

    // updates the list of button after any state change
    // here element refers to the elements of history array and move refers the index of that element
    const moves = history.map((element, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div>
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    // lines is the array of lists that makes the winning pattern
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // checking if we get same value at all the three positions of any winning pattern
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// Game component is exported to App.jsx
export default Game;