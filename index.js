let cellSize = 10;
const area = document.querySelector('.game');
const canvas = document.querySelector('.game__area');
canvas.width = area.offsetHeight;
canvas.height = area.offsetHeight;
let cols = Math.round(area.offsetHeight / cellSize);
let rows = Math.round(area.offsetHeight / cellSize);
let gridChanged = false;


// определение поля по умолчанию для игры
let grid = [];
for (let y = 0; y < cols; y++) {
  grid[y] = [];
  for (let x = 0; x < rows; x++) {
    grid[y][x] = false;
  }
};

// определение нового масштаба
function handleSubmit() {
  grid=[];
  const sizeOfFiled = document.querySelector('input').value;
    let prevCols = cols;
    cols = sizeOfFiled;
    rows = sizeOfFiled;
  if (cols > prevCols || cols < prevCols) {
    cellSize = Math.round(area.offsetHeight / cols);
  } 

  for (let y = 0; y < cols; y++) {
    grid[y] = [];
    for (let x = 0; x < rows; x++) {
      grid[y][x] = false;
    }
  };
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff1fd'; 
  context.fillRect(0, 0, canvas.width, canvas.height);
  nextGrid = grid;
  drawField(grid);
  
};

let playing = false;

// определение соседей и создание тора
const getNeighbors = (x, y, grid) => {
  let prevX = x - 1;
  if (prevX < 0) {
    prevX = grid[0].length - 1;
  }

  let nextX = x + 1;
  if (nextX === grid[0].length) {
    nextX = 0;
  }

  let prevY = y - 1;
  if (prevY < 0) {
    prevY = grid.length - 1;
  }

  let nextY = y + 1
  if (nextY === grid.length) {
    nextY = 0;
  }
  
  return [
    grid[prevY][prevX],
    grid[prevY][x],
    grid[prevY][nextX],
    grid[y][prevX],
    grid[y][nextX],
    grid[nextY][prevX],
    grid[nextY][x],
    grid[nextY][nextX],
  ]
};

// правила игры
const getDeadOrAlive = (x, y, grid) => {
  const neighbors = getNeighbors(x, y, grid);
  const numberOfAliveNeighbors = neighbors.filter(Boolean).length;

  if (grid[y][x]) {
    if (numberOfAliveNeighbors < 2 || numberOfAliveNeighbors > 3) {
      return false;
    }
    return true;
  }

  if (numberOfAliveNeighbors === 3) {
    return true;
  }
  return false;
};

const drawField = grid => {
  const context = canvas.getContext('2d');
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid.length !== 0 && grid[y][x]) {
        context.beginPath();
        context.roundRect(x * cellSize, y * cellSize, cellSize, cellSize, cellSize/2);
        context.fillStyle = 'red';
        context.stroke()
        context.fill();
      } else {
        context.beginPath();
        context.roundRect(x * cellSize, y * cellSize, cellSize, cellSize, cellSize/2);
        context.fillStyle = '#ffffff';
        context.stroke()
        context.fill(); 
      }
    }
  }
};

let nextGrid = grid;
drawField(grid);

// шаг
const step = () => {
  nextGrid = nextGrid.map((row, y) => row.map((_, x) => {
    currentState = grid[y][x];
    let nextState = getDeadOrAlive(x, y, nextGrid);
    if (nextState !== currentState){
      gridChanged = true;
    }
    return nextState;
  }))

  if (gridChanged){
    drawField(nextGrid);
    gridChanged = false;
  } else {
    clearInterval(interval);
    clearInterval(timerInterval);
    playing=false;
    document.querySelector('.messages').innerHTML = "Игра закончена!";
    document.getElementById("timer").innerHTML = '';
  }
  grid = nextGrid;
};

let interval = null;
let timerInterval = null;

// кнопка, чтобы показать следующий шаг
document.getElementById('step').addEventListener('click', step);

// кнопка для запуска игры
document.getElementById('play').addEventListener('click', () => {
  document.querySelector('.messages').innerHTML = "";
  if (!playing) {
    interval = setInterval(step, 80);
    playing = true;
  }
});

// кнопка паузы в игре
document.getElementById('pause').addEventListener('click', () => {
  playing = false;
  clearInterval(interval);
});

// кнопка очистки поля
document.getElementById('clear').addEventListener('click', () => {  
  document.querySelector('.messages').innerHTML = "";
  playing = false;
  clearInterval(interval);
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = '';
    
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = false;
    }
  }
  nextGrid = grid;
  drawField(grid);
});

document.querySelector('#glider').addEventListener('click', () => {
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = '';
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[y][x] = false;
    }
  }
  if (cols > 22) {
    grid[20][20] = true;
    grid[20][21] = true;
    grid[20][22] = true;
    grid[19][22] = true;
    grid[18][21] = true;
    document.querySelector('.messages').innerHTML = "";
  } else if (cols <=22 && cols > 2 ) {
    grid[0][1] = true;
    grid[1][2] = true;
    grid[2][2] = true;
    grid[2][1] = true;
    grid[2][0] = true;
    document.querySelector('.messages').innerHTML = "";
  } else {
    document.querySelector('.messages').innerHTML = "";
  }
  
  nextGrid = grid;

  drawField(grid);
});

// кнопка для создания случайного поля
document.getElementById('random').addEventListener('click', () => {
  document.querySelector('.messages').innerHTML = "";
  const todayInMilliseconds = Date.now();
  function timerRun () {
    const seconds = 'таймер: ' + Math.floor((Date.now() - todayInMilliseconds) / 1000);
    document.getElementById("timer").innerHTML = seconds;
  };
    clearInterval(timerInterval);
    timerInterval = setInterval(timerRun, 1000);
     
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[y][x] = Math.random() * 100 > 65;
    }
  }
  
  nextGrid = grid;
  drawField(grid);
})

// кнопка, чтобы нарисовать ячейку мышью
document.querySelector('.game__area').addEventListener('click', (event) => {
  const x = Math.floor(event.offsetX / cellSize);
  const y = Math.floor(event.offsetY / cellSize);
  grid[y][x] = !grid[y][x];
   
  drawField(grid);
  nextGrid = grid;
});

