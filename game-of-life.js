// Initial game board parameters
let unitLength = 20;
let backgroundColor;
let boxColor;
let strokeColor;
// const stableColor = color(255, 204, 0);
let columns;
let rows;
let currentBoard;
let nextBoard;
let fr;
let drawUnitLength = unitLength;
let moveMode = false;
let tempX = 0;
let tempY = 0;
let offsetX = 0;
let offsetY = 0;
let overpopulationTh;

function setup(){
    pixelDensity(0.9);
    backgroundColor = color(45, 35, 39);
    strokeColor = color(69, 54, 75);
    boxColor = color(140, 147, 168);
	/* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas(displayWidth - 20, displayHeight - 300);
	canvas.parent(document.querySelector('#canvas'));
	/*Calculate the number of columns and rows */

	columns = floor(width  / unitLength) * 20;
	rows    = floor(height / unitLength) * 5;

	/*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
	currentBoard = [];
	nextBoard = [];

	for (let i = 0; i < columns; i++) {
		currentBoard[i] = [];
		nextBoard[i] = []
    }
	init();  // Set the initial values of the currentBoard and nextBoard
}
 
function draw() {

    fr = parseInt(document.getElementById("framerate").value)
    document.getElementById("framerate-label").innerHTML = `Frame rate: ${fr}`;
    frameRate(fr);

    // overpopulationTh = parseInt(document.getElementById("overpopulation").value)
    // document.getElementById("overpopulation-label").innerHTML = `Overpopulation rule: ${overpopulationTh}`;

    background(backgroundColor);
    generate();
    for (let i = 0; i < floor(width  / drawUnitLength); i++) {
        for (let j = 0; j < floor(height / drawUnitLength); j++) {
            if (currentBoard[i][j] == 1){
                fill(boxColor);
            } else if (currentBoard[i][j] > 1) {
                fill(boxColor - currentBoard[i][j])
            } else if (currentBoard[i][j] == 0) {
                fill(backgroundColor);
            }
            // if (currentBoard[i][j] > 1 && currentBoard[i+1][j] > 1 && currentBoard[i][j+1] > 1 && currentBoard[i+1][j+1] > 1) {
            //     fill(stableColor);
            // }
            stroke(strokeColor);
            //rect((Math.floor(offsetX / drawUnitLength) + i) * drawUnitLength, (Math.floor(offsetY / drawUnitLength) + j) * drawUnitLength, drawUnitLength, drawUnitLength);
            rect((i * drawUnitLength) + offsetX, (j * drawUnitLength) + offsetY, drawUnitLength, drawUnitLength);
        }
    }
}

function init(start) {

    if (start == "random") {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = random() > 0.8 ? 1 : 0;
                nextBoard[i][j] = 0;
            }
        }
    } else {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = 0;
                nextBoard[i][j] = 0;
            }
        }
    }
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if( i == 0 && j == 0 ){
	                    // the cell itself is not its own neighbor
	                    continue;
	                }
                    // The modulo operator is crucial for wrapping on the edge
                    if (currentBoard[(x + i + columns) % columns][(y + j + rows) % rows] > 0) {
                        neighbors += 1
                    }
                }
            }

            // Rules of Life
            if (currentBoard[x][y] >= 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] >= 1 && neighbors > overpopulationTh) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }

            if (currentBoard[x][y] >= 1 && nextBoard [x][y] >= 1) {
                nextBoard [x][y] += 1;
            }
        }
    }
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() {
    if (moveMode == false) {
        noLoop()
        if (mouseX > drawUnitLength * columns || mouseY > drawUnitLength * rows) {
            return;
        }
            const x = Math.floor(mouseX / drawUnitLength);
            const y = Math.floor(mouseY / drawUnitLength);
            currentBoard[x][y] = 1;
            fill(boxColor);
            stroke(strokeColor);
            rect(x * drawUnitLength , y * drawUnitLength, drawUnitLength, drawUnitLength);
    }

}

function mousePressed() {
    mouseDragged;
    if (moveMode == true) {
        if (mouseX > drawUnitLength * columns || mouseY > drawUnitLength * rows) {
            return;
        }
    tempX = mouseX
    tempY = mouseY        
    }
}

function mouseReleased() {
    let diffX = tempX - mouseX
    let diffY = tempY - mouseY
    if (diffX == 0 && diffY ==0) {
        return
    }
    if (moveMode == true) {
        offsetX = (diffX) * -0.5
        offsetY = (diffY) * -0.5
    }
    console.log("mouse", mouseX, mouseY, "temp", tempX-mouseX, tempY-mouseY, "offset", offsetX, offsetY);
}

document.querySelector('#reset-game').addEventListener('click', function() {
    init();
    loop();
})

document.querySelector('#pause-game').addEventListener('click', function() {
    noLoop();
})

document.querySelector('#play-game').addEventListener('click', function() {
    loop();
})

document.querySelector('#random-game').addEventListener('click', function() {
    init("random");
    loop();
})

document.querySelector('#zoom-out').addEventListener('click', function() {
    drawUnitLength -= 1;
    loop();
})

document.querySelector('#zoom-in').addEventListener('click', function() {
    drawUnitLength += 1;
    loop();
})

document.querySelector('#overpopulation').addEventListener('change', (event)=>{
    overpopulationTh =  parseInt(event.target.value)
    document.getElementById("overpopulation-label").innerHTML = `Overpopulation rule: ${overpopulationTh}`;
    loop();
})


function windowResized() {
    resizeCanvas(windowWidth, windowHeight - 100, true)
}

document.querySelector('#move').addEventListener('click', function() {
    if (moveMode == false) {
        moveMode = true;
        document.getElementById('move').innerHTML = 'Sprinkle lives';
        loop()
    } else {
        moveMode = false;
        document.getElementById('move').innerHTML = 'Move around';
    }
})