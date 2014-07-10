window.onload = function () {
	// variables and constants
    var youLose = false;
    var youWin = false;
    var Tile = 256;
    var Rows = 4;
    var Cols = 4;
    var row, col;
    var score = 0;
    var matrix = new Array(Rows);
    var arrayCol, arrayRow;
    var tileBackgroundColor = ["#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f",
"#f65e3b", "#ecdf72", "#edcc61", "#edc850", "#edc53f", "#edc22e"];
    var DEFAULT_TILE_BG_COLOR = "#EEE4DA";
    var DIGIT_TWO = 2;
    var WINNER_TILE = 2048;
    var TEXT_OFFSET_Y = 30;
    var BORDER_OFFSET = 5;
	var IMAGE_PATH = "images/";
    var KEY = {
        DOWN: 40,
        UP: 38,
        LEFT: 37,
        RIGHT: 39
    };

    // initialization starting board
    initializeBoard();

    // main entry point
    (function gameLoop() {
        window.setTimeout(gameLoop, 60);
        drawScreen();
    }());
	
	// logic for New Game button
	var newGameButton = document.querySelector("#newGame a");
	
	newGameButton.addEventListener('click', function(){
		youLose = false;
		youWin = false;
		score = 0;
		
		showScore();
		initializeBoard();		
	});
	
    function drawScreen() {
        // get user input
        document.onkeydown = function (e) {
            e = e || window.event;

            switch (e.keyCode) {
                case KEY.DOWN:
                    moveDown();
                    break;
                case KEY.UP:
                    moveUp();
                    break;
                case KEY.LEFT:
                    moveLeft();
                    break;
                case KEY.RIGHT:
                    moveRight();
                    break;
            }
        }
    }
	
    function draw() {
        // if win or lose state detected, don't draw anything on screen
        if (youWin || youLose) {
            return;
        }

        var stage = new Kinetic.Stage({
            container: 'container',
            width: 400 + BORDER_OFFSET,
            height: 400 + BORDER_OFFSET
        });
        var layer = new Kinetic.Layer();
		
        var panel = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: 400 + BORDER_OFFSET,
            height: 400 + BORDER_OFFSET,
            cornerRadius: 5,
            fill: '#BBADA0'
        });
        layer.add(panel);

        var hasEmptyTiles = checkForEmptyTiles();

        if (hasEmptyTiles) {
            // generate random position only if board has empty tiles
            var digitPosition = generateRandomPosition();
            updateBoard(DIGIT_TWO, digitPosition[0], digitPosition[1]);
        } else {
            youLose = true;
        }
        var tileContent; // get tile number or empty string

        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Cols; j++) {
                (function () {
                    var box = new Kinetic.Rect({
                        x: j * 100 + BORDER_OFFSET / 2,
                        y: i * 100 + BORDER_OFFSET / 2,
                        width: 100,
                        height: 100,
                        cornerRadius: 5,
                        fill: getBackgroundColor(i, j),
                        stroke: '#BBADA0',
                        strokeWidth: 5
                    });

                    tileContent = (matrix[i][j] !== 0) ? (matrix[i][j]) : "";

                    // check for winner number -> 2048
                    if (tileContent === WINNER_TILE) {
                        youWin = true;
                    }

                    var text = new Kinetic.Text({
                        x: box.getX(),
                        y: box.getY() + TEXT_OFFSET_Y,
                        text: tileContent,
                        fontSize: 40,
                        fontFamily: 'Calibri',
                        width: box.getWidth(),
                        align: 'center',
                        fill: 'white'
                    });

                    layer.add(box);
                    layer.add(text);
                })();
            }
        }

        stage.add(layer);
        showScore(score);
		
        // evaluate game state - lose
        if (youLose) {
            showEndImage(layer, 'loser');
        }

        // evaluate game state - win
        if (youWin) {
            showEndImage(layer, 'winner');
        }
    }
	
	// initialization logic
	function initializeBoard() {
		// set all tiles to 0
		for (var row = 0; row < Rows; row++) {
			matrix[row] = new Array(Cols);
			for (var col = 0; col < Cols ; col++) {
				matrix[row][col] = 0;
			}
		}

		// generate random position and set it to 2
		var digitPosition = generateRandomPosition();
		updateBoard(DIGIT_TWO, digitPosition[0], digitPosition[1]);

		draw();
	};
	
	// handle left arrow press and merge cells if necessary
	function moveLeft() {
		for (var row = 0; row < Rows; row++) {
			arrayCol = new Array(Cols);
			for (var col = 0; col < Cols; col++) {
				arrayCol[col] = matrix[row][col];
			}
			matrix[row] = newArray(arrayCol);
		}

		draw();
	}
	
	// handle right arrow press and merge cells if necessary
	function moveRight() {
		for (var row = 0; row < Rows; row++) {
			arrayCol = new Array(Cols);
			for (var col = 0; col < Cols; col++) {
				arrayCol[col] = matrix[row][Cols - 1 - col];
			}
			matrix[row] = newArray(arrayCol).reverse();
		}

		draw();
	}
	
	// handle up arrow press and merge cells if necessary
	function moveUp() {
		for (var col = 0; col < Cols; col++) {
			arrayRow = new Array(Cols);
			for (var row = 0; row < Rows; row++) {
				arrayRow[row] = matrix[row][col];
			}
			for (var i = 0; i < Rows; i++) {
				matrix[i][col] = newArray(arrayRow)[i];
			}
		}

		draw();
	}
	
	// handle down arrow press and merge cells if necessary
	function moveDown() {
		for (col = 0; col < Cols; col++) {
			arrayRow = new Array(Cols);
			for (row = 0; row < Rows; row++) {
				arrayRow[row] = matrix[Rows - 1 - row][col];
			}
			var temp = newArray(arrayRow).reverse();
			for (var i = 0; i < Rows; i++) {
				matrix[i][col] = temp[i];
			}
		}

		draw();
	}
	
	// update matrix after keypress
	function newArray(array) {
		var list = [];
		var newList = [];
		var newArray = [];
		for (row = 0; row < Rows; row++) {
			newArray[row] = 0;
		}
		for (row = 0; row < Rows; row++) {
			if (array[row] !== 0) {
				list.push(array[row]);
			}
		}

		if (list.length === 0) {
			return newArray;
		}
		else if (list.length === 1) {
			newArray[0] = list[0];
			return newArray;
		}
		else {
			var index = 0;
			while (index < list.length - 1) {
				if (list[index] === list[index + 1]) {
					newList.push(2 * list[index]);
					score += 2 * list[index];
					index += 2;
				}
				else if (list[index] !== list[index + 1]) {
					newList.push(list[index]);
					index++;
				}
				if (index === list.length - 1) {
					newList.push(list[list.length - 1]);
				}
			}
			for (var i = 0; i < newList.length; i++) {
				newArray[i] = newList[i];
			}
		}
		return newArray;
	}
	
	// generates random position for new number added to board 
    function generateRandomPosition() {
        var digitPosition = []; // coordinates of new digit

        while (true) {
            var currRow = Math.floor((Math.random() * Rows) + 0);
            var currCol = Math.floor((Math.random() * Cols) + 0);

            if (matrix[currRow][currCol] === 0) {
                digitPosition[0] = currRow;
                digitPosition[1] = currCol;
                break;
            }
        }

        return digitPosition;
    }
	
	// update board with the new number generated 
    function updateBoard(number, row, col) {
        matrix[row][col] = number;
    }
	
	// helper function to get background color by index
    function getBaseLog(base, number) {
        return Math.log(number) / Math.log(base);
    }
	
	// gets background color for tile at position i, j
    function getBackgroundColor(i, j) {
        var number = matrix[i][j];

        if (number === 0) {
            return DEFAULT_TILE_BG_COLOR;
        } else {
            var index = getBaseLog(DIGIT_TWO, number) - 1;
            return tileBackgroundColor[index];
        }
    }
	
	// Shows the final animated image
	// param endResult accepts "winner" or "loser" and shows corresponding image
    function showEndImage(layer, endResult) {
        var img = new Image();
        img.src = IMAGE_PATH + endResult + ".jpg";

        var player;
        img.onload = function () {
            player = new Kinetic.Image({
                x: 0,
                y: 0,
                width: 410,
                height: 0,
                image: img
            });

            layer.add(player);
            layer.draw();

            var increment = 1;

            var anim = new Kinetic.Animation(function (frame) {
                player.height(increment);
                if (increment <= 405) {
                    increment += 5;
                }
            }, layer);

            anim.start();
        };
    }

	// helper function for generateRandomPosition()
	// - generates random position only if there is an empty tile
    function checkForEmptyTiles() {
        var foundEmptyTiles = false;

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] == 0) {
                    foundEmptyTiles = true;
                    break;
                }
            }
        }

        return foundEmptyTiles;
    }
	
	// shows score on screen
    function showScore() {
        var scoreDiv = document.getElementById("scoreOutput");
        var span = '<span id="score">' + score + '</score>';
        scoreDiv.innerHTML = "Score: " + span;
    }
}