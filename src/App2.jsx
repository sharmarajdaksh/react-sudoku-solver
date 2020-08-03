import React, { useEffect, useState } from "react";
import { generateCompleteSolution, getPresetCells } from "./algorithm";
import "./App.css";

function App() {
  const initializeGrid = () => {
    let grid = [];

    let row = [];

    for (let i = 1; i <= 9; i++) {
      row = [];
      for (let j = 1; j <= 9; j++) {
        row.push(0);
      }
      grid.push(row);
    }

    return grid;
  };

  const [grid, setGrid] = useState(initializeGrid());
  const [currentCell, setCurrentCell] = useState([-1, -1]);
  const [isSolving, setIsSolving] = useState(false);
  const [forcer, forceUpdate] = useState(0);
  const [isSolved, setIsSolved] = useState(null);

  const allowedDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleFormValueChange = (e, row, col) => {
    console.log(e.target.value, row, col);

    setGrid((grid) => {
      console.log("?", e.target.value === "" ? "" : e.target.value);
      grid[row][col] = e.target.value === "" ? "" : parseInt(e.target.value);
      return grid;
    });

    forceUpdate();
  };

  const renderRow = (i) => {
    return (
      <div className="sudoku_row" key={i}>
        {grid[i].map((cell, index) => {
          console.log(i, index, grid[i][index]);
          return (
            <input
              className="sudoku_cell"
              style={{
                backgroundColor:
                  isSolved !== null
                    ? "transparent"
                    : JSON.stringify(currentCell) === JSON.stringify([i, index])
                    ? "rgb(186, 248, 243)"
                    : "white",
              }}
              value={grid[i][index]}
              key={`${i}-${index}`}
              onChange={(e) => {
                e.persist();
                handleFormValueChange(e, i, index);
                forceUpdate();
              }}
              maxLength={1}
            />
          );
        })}
      </div>
    );
  };

  const renderSudoku = () => {
    return (
      <div
        className="sudoku_container"
        style={{
          backgroundColor:
            isSolved === "ERRORED"
              ? "rgb(221, 134, 134)"
              : isSolved === "SOLVED"
              ? "rgb(136, 238, 141)"
              : "white",
        }}
      >
        <div>{grid.map((r, index) => renderRow(index))}</div>
      </div>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSolving) {
        forceUpdate((forcer) => forcer + 1);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  const gridIsInvalid = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (![...allowedDigits, 0].includes(grid[i][j])) {
          return true;
        }
      }
    }

    return false;
  };

  const solveSudoku = async () => {
    const presetCells = getPresetCells(grid);
    setIsSolving(true);
    let didGetSolved = await generateCompleteSolution(
      grid,
      presetCells,
      setGrid,
      setCurrentCell
    );

    if (didGetSolved) {
      setIsSolved("SOLVED");
    } else {
      setIsSolved("ERRORED");
    }

    setCurrentCell(-1, -1);

    setIsSolving(false);

    console.log(grid);

    forceUpdate();
  };

  return (
    <div className="App">
      <h1>Backtracking Sudoku Solver</h1>
      <p>
        If you value your time, you should probably input a valid configuration
        to start. Otherwise, you can trigger solving even with an invalid
        starting grid. Maybe you'll find it enjoyable to watch an algorithm fail
        despite trying all that it could, just sometimes happens with us in our
        lives :'(
      </p>
      {renderSudoku()}
      <button
        className="sudoku_button"
        onClick={solveSudoku}
        disabled={gridIsInvalid()}
      >
        Solve
      </button>
      <button onClick={() => console.log(grid)}>tst</button>
    </div>
  );
}

export default App;
