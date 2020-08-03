import React from "react";
import { generateCompleteSolution, getPresetCells } from "./algorithm";
import "./App.css";

class App extends React.Component {
  initializeGrid = () => {
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

  constructor() {
    super();
    this.state = {
      grid: this.initializeGrid(),
      currentCell: [-1, -1],
      isSolving: false,
      isSolved: null,
    };
  }

  // const [grid, setGrid] = useState(initializeGrid());
  // const [currentCell, setCurrentCell] = useState([-1, -1]);
  // const [isSolving, setIsSolving] = useState(false);
  // const [forcer, forceUpdate] = useState(0);
  // const [isSolved, setIsSolved] = useState(null);

  handleFormValueChange = (e, row, col) => {
    console.log(e.target.value, row, col);

    let tempGrid = this.state.grid;
    tempGrid[row][col] = e.target.value;
    this.setState({ grid: tempGrid });
  };

  renderRow = (i) => {
    return (
      <div className="sudoku_row" key={i}>
        {this.state.grid[i].map((cell, index) => {
          return (
            <input
              className="sudoku_cell"
              style={{
                backgroundColor:
                  this.state.isSolved !== null
                    ? "transparent"
                    : JSON.stringify(this.state.currentCell) ===
                      JSON.stringify([i, index])
                    ? "rgb(186, 248, 243)"
                    : "white",
              }}
              value={this.state.grid[i][index]}
              key={`${i}-${index}`}
              onChange={(e) => {
                e.persist();
                this.handleFormValueChange(e, i, index);
              }}
              maxLength={1}
            />
          );
        })}
      </div>
    );
  };

  renderSudoku = () => {
    return (
      <div
        className="sudoku_container"
        style={{
          backgroundColor:
            this.state.isSolved === "ERRORED"
              ? "rgb(221, 134, 134)"
              : this.state.isSolved === "SOLVED"
              ? "rgb(136, 238, 141)"
              : "white",
        }}
      >
        <div>{this.state.grid.map((r, index) => this.renderRow(index))}</div>
      </div>
    );
  };

  gridIsInvalid = () => {
    let allowedDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!allowedDigits.includes(parseInt(this.state.grid[i][j]))) {
          return true;
        }
      }
    }

    return false;
  };

  solveSudoku = async () => {
    const presetCells = getPresetCells(this.state.grid);
    this.setState({ isSolving: true });
    let didGetSolved = await generateCompleteSolution(
      this.state.grid,
      presetCells,
      (g) => {
        this.setState({ grid: g });
      },
      (rc) => {
        this.setState({ currentCell: rc });
      }
    );

    if (didGetSolved) {
      this.setState({ isSolved: "SOLVED" });
    } else {
      this.setState({ isSolved: "ERRORED" });
    }

    this.setState({ currentCell: [-1, -1] });

    this.setState({ isSolving: false });
  };

  render() {
    return (
      <div className="App">
        <h1>Backtracking Sudoku Solver</h1>
        <p>
          If you value your time, you should probably input a valid
          configuration to start. Otherwise, you can trigger solving even with
          an invalid starting grid. Maybe you'll find it enjoyable to watch an
          algorithm fail despite trying all that it could, like sometimes
          happens with us in our lives :'(
        </p>
        {this.renderSudoku()}
        <div className="buttons">
          <button
            className="sudoku_button"
            onClick={this.solveSudoku}
            disabled={this.gridIsInvalid()}
          >
            Solve
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default App;
