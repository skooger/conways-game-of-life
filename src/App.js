import React, {useState, useCallback, useRef} from 'react';
import './App.css';
import produce from 'immer';


const operations = [
  [0,1],
  [0,-1],
  [1,-1],
  [1,1],
  [-1,1],
  [1,0],
  [-1,-1],
  [-1,0]
]

function App() {

  const [numRows, setNumRows] = useState(25);
  const [numCols, setNumCols] = useState(25);

  const [grid,setGrid] = useState(() => {
    const rows = [];

    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0))
      
    }
    return rows;
  })

  console.log(grid);
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;
  const [oneGen, setOneGen] = useState(false);
  const oneGenRef = useRef(oneGen);
  oneGenRef.current = oneGen;
  const [timer,setTimer] = useState(500);
  const timerRef = useRef(timer);
  timerRef.current = timer;
  const [generation,setGeneration] = useState(0);
  const generationRef = useRef(generation);
  generationRef.current = generation;

  const runSimulation = useCallback(() => {
      if (!runningRef.current && !oneGenRef.current) {
        return;
      }

      setGrid(g => {
        return produce(g, gridCopy => {
          for (let i = 0; i < numRows; i++) {
            for (let k = 0; k < numCols; k++) {
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const newI = i + x;
                const newK = k + y;
                if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                  neighbors += g[newI][newK];
                }
              });

              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1;
              }
            }
          }
        });
      });

     
      setGeneration(generation + 1)
      generationRef.current = generation + 1;

      if (runningRef.current)
      {
        setTimeout(runSimulation, timerRef.current);
      }
      setOneGen(false);
      oneGenRef.current = false
      
    }, []);

    const timeChangeHandler = (event) => {
        setTimer(event.target.value)
        timerRef.current = event.target.value
        //console.log(timer)
        console.log(timerRef.current)
    }
    
    const generateEmptyGrid = () => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
      }
      
      setGeneration(0);
      generationRef.current = 0;
      return rows;
    };

  return(
    <div style={{
      display: "flex",
      justifyConent: "center",
      alignContent: "center",
      flexDirection: "column",
      marginLeft: "300px"
    }}>
      <button onClick={() => {
        setRunning(!running)
        if(!running) {
          runningRef.current = true
          runSimulation();
        }
        
      }}
      style={{
        width: "200px",
        marginLeft: "30px",
        
      }}
    >{running ? 'stop' : 'start'}</button>
      <button onClick={() => {
        setOneGen(!oneGen);
        if(!oneGen){
          oneGenRef.current = true
          runSimulation();
        }
        
      }}
      style={{
        width: "200px",
        marginLeft: "30px"
      }}>Next Generation</button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
        style={{
        width: "200px",
        marginLeft: "30px"
      }}
      >
        random
      </button>
      <div style={{
        width: "200px",
        marginLeft: "40px",
        fontSize: ".8em"
      }}>Enter the generation speed (ms): </div>
      <input
        type='text'
        onChange={timeChangeHandler}
        style={{
        width: "200px",
        marginLeft: "29px"
      }}
      />
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
        style={{
        width: "200px",
        marginLeft: "30px",
        marginBottom: "10px"
      }}
      >
        clear
      </button>
      
      <div 
            style= {{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 10px)`
            }}>
            {grid.map( (rows, i) =>
              rows.map((col, k) => 
              <div 
                key={`${i}-${k}`}
                onClick={() =>{
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  })
                  setGrid(newGrid);
                }}
                style={{ width: 10,
                height: 10, 
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "solid 1px black"
              }}
              ></div>)
          )}
        </div>
        <div id='rules'>
            <h2 style= {{
              fontSize:".5em"
            }}>The Rules of Life</h2>
            <ol style= {{
              width: "200px",
              fontSize:".5em"
            }}>
                <li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
                <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
                <li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
                <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
            </ol>
        </div>
    </div>

  ) 
}
export default App;
