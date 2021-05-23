var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const ACTION_MOVE = "move";
const ACTION_ATTACK = "attack";

function auto_grow(element) {
  element.style.height = "100px";
  element.style.height = element.scrollHeight + "px";
}

class Cell {
  constructor(positionX, positionY, identifier, behaviour, color) {
    // paramcode
    this.positionX = positionX;
    this.positionY = positionY;
    this.identifier = identifier;
    this.behaviour = behaviour;
    this.color = color;
  }
}

cells = [];

var surroundings = [];
var matrixSize = canvas.width;
for (var i = 0; i < matrixSize; i++) {
  surroundings[i] = new Array(matrixSize);
}

// Initialize in empty
for (var i = 0; i < matrixSize; i++) {
  for (var j = 0; j < matrixSize; j++) {
    surroundings[i][j] = { x: i, y: j, contains: "nothing" };
  }
}
// Initialize cells
cells.forEach((cell) => {
  surroundings[cell.positionX][cell.positionY].contains = cell.identifier;
});

const getSafelyFromSurrounding = (x, y) => {
  if (x > 0 && x < matrixSize && y > 0 && x < matrixSize) {
    return surroundings[x][y];
  } else {
    null;
  }
};

// Add listeners
let cellDefinitionContainer = document.getElementsByName("definition")[0];
let cellBehaviourInput = document.getElementById("behaviour");
let cellIdentifierInput = document.getElementById("identifier");
let cellQuantityInput = document.getElementById("quantity");
let cellColorInput = document.getElementById("color");
let feedbackElement = document.getElementById("feedback");

const cellsDefinitions = [
  {
    identifier: "cell",
    behaviour: (cell, surroundings) => {
      let toDo = surroundings[Math.floor(Math.random() * surroundings.length)];
      toDo.action = ACTION_MOVE;
      return toDo;
    },
    color: "white",
  },
];

const changeAllCells = (defid, identifier, attribute) => {
  const hasSameIdentifier = (cell) => cell.identifier == identifier;
  cells.filter(hasSameIdentifier).forEach((cell) => {
    cell[attribute] = cellsDefinitions[defid][attribute];
  });
};

const changeIdentifier = (event) => {
  const defId = event.target.parentElement.parentElement.parentElement.id;
  let oldIdentifier = cellsDefinitions[defId].identifier;
  cellsDefinitions[defId].identifier = event.target.value;
  changeAllCells(defId, oldIdentifier, "identifier");
};

const changeBehaviour = (event) => {
  const defId = event.target.parentElement.parentElement.id;
  try {
    let newBehaviour = eval(event.target.value);
    event.target.parentElement.parentElement.getElementsByClassName(
      "feedback"
    )[0].value = "// everything is cool :)";
    cellsDefinitions[defId].behaviour = newBehaviour;
    cellsDefinitions[defId].failed = false;
    changeAllCells(defId, cellsDefinitions[defId].identifier, "behaviour");
  } catch (e) {
    event.target.parentElement.parentElement.getElementsByClassName(
      "feedback"
    )[0] = `// ${e.toString()} :(`;
    console.log(e);
  }
};

changeQuantity = (event) => {
  const defId = event.target.parentElement.parentElement.parentElement.id;
  const hasSameIdentifier = (c) =>
    c.identifier == cellsDefinitions[defId].identifier;
  const cellsCount = cells.filter(hasSameIdentifier).length;
  const desiredSize = event.target.value;
  if (cellsCount > desiredSize) {
    for (let i = 0; i < cellsCount - desiredSize; i++) {
      const toRemoveIndex = cells.indexOf(cells.find(hasSameIdentifier));
      cells.splice(toRemoveIndex, 1);
    }
  } else {
    for (let i = 0; i < desiredSize - cellsCount; i++) {
      cells.push(
        new Cell(
          Math.floor(Math.random() * canvas.width),
          Math.floor(Math.random() * canvas.height),
          cellsDefinitions[defId].identifier,
          cellsDefinitions[defId].behaviour,
          cellsDefinitions[defId].color
        )
      );
    }
  }
};

const changeColor = (event) => {
  const defId = event.target.parentElement.parentElement.parentElement.id;
  cellsDefinitions[defId].color = event.target.value;
  changeAllCells(defId, cellsDefinitions[defId].identifier, "color");
};

cellIdentifierInput.addEventListener("change", changeIdentifier);
cellBehaviourInput.addEventListener("change", changeBehaviour);
cellQuantityInput.addEventListener("change", changeQuantity);
cellColorInput.addEventListener("change", changeColor);
cellQuantityInput.dispatchEvent(new Event("change"));

const createNewCellDefinition = (event) => {
  const newIndex = cellsDefinitions.length;
  //Clone
  cellsDefinitions.push({
    identifier: `cell ${newIndex}`,
    behaviour: cellsDefinitions[0].behaviour,
    color: cellsDefinitions[0].color,
  });

  // Clone definition
  let newDefinition = cellDefinitionContainer.cloneNode(true);
  newDefinition.id = newIndex;
  document.getElementById("definitions").appendChild(newDefinition);
  cellBehaviourInput = newDefinition.getElementsByClassName("behaviour")[0];
  cellIdentifierInput = newDefinition.getElementsByClassName("identifier")[0];
  cellIdentifierInput.value = "cell " + newIndex;
  cellQuantityInput = newDefinition.getElementsByClassName("quantity")[0];
  cellColorInput = newDefinition.getElementsByClassName("color")[0];
  feedbackElement = newDefinition.getElementsByClassName("feedback")[0];

  cellIdentifierInput.addEventListener("change", changeIdentifier);
  cellBehaviourInput.addEventListener("change", changeBehaviour);
  cellQuantityInput.addEventListener("change", changeQuantity);
  cellColorInput.addEventListener("change", changeColor);
  cellQuantityInput.dispatchEvent(new Event("change"));
};
document
  .getElementById("newDefinition")
  .addEventListener("click", createNewCellDefinition);

setInterval(function () {
  // Blur effect
  ctx.fillStyle = "rgb(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  randomly = () => Math.random() - 0.5;
  cells.sort(randomly).forEach((cell) => {
    const cellDefinition = cellsDefinitions.find(
      (def) => def.identifier == cell.identifier
    );

    // If definition is failing ignore until fixed
    if (cellDefinition.failed) return;

    let positionX = cell.positionX;
    let positionY = cell.positionY;
    let surroundingCell = [];
    // Get elements
    surroundingCell.push(
      getSafelyFromSurrounding(positionX - 1, positionY - 1)
    );
    surroundingCell.push(getSafelyFromSurrounding(positionX - 1, positionY));
    surroundingCell.push(
      getSafelyFromSurrounding(positionX - 1, positionY + 1)
    );
    surroundingCell.push(
      getSafelyFromSurrounding(positionX + 1, positionY - 1)
    );
    surroundingCell.push(getSafelyFromSurrounding(positionX + 1, positionY));
    surroundingCell.push(
      getSafelyFromSurrounding(positionX + 1, positionY + 1)
    );
    surroundingCell.push(getSafelyFromSurrounding(positionX, positionY + 1));
    surroundingCell.push(getSafelyFromSurrounding(positionX, positionY - 1));

    // Remove nulls
    surroundingCell = surroundingCell.filter((e) => e);

    try {
      let toDo = cell.behaviour(cell, surroundingCell);
      if (toDo.action == ACTION_MOVE || toDo.action == ACTION_ATTACK) {
        surroundings[cell.positionX][cell.positionY].contains = "nothing";

        if (toDo.action == ACTION_ATTACK) {
          cells = cells.filter(
            (c) => c.positionX != toDo.x || c.positionY != toDo.y
          );
        }
        cell.positionX = toDo.x;
        surroundings[toDo.x][toDo.y].contains = cell.identifier;

        ctx.fillStyle = cell.color;
        ctx.fillRect(toDo.x, toDo.y, 1, 1);
      }
    } catch (e) {
      cellDefinition.failed = true;
      let failedFeedbackElement = document
        .getElementById(cellsDefinitions.indexOf(cellDefinition))
        .getElementsByClassName("feedback")[0];
      failedFeedbackElement.textContent = `// ${e.toString()} :(`;
      console.log(e);
    }
  });
}, 100);
