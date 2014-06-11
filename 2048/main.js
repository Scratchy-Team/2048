// JavaScript source code


/*TODO: 1
* InitializeBoard.js to be created. It should include The board with the tiles (4 rows by 4 columns of tiles);
*TODO: 2
* Tiles.js to be created. Consists the tile's size and coordinates. Default value of new tile should be equal to '2'
*TODO: 3
* MoveTiles.js to be created. /The moving of the tiles to specific coords according to the buttons pressed/
*TODO: 4
* Main.js must include functions the following functions:
* ClearBoard() - clear the board's old results;
* InitializeBoard(); - initializes the board with the new tile's positions and value inside of them. Includes the following methods:
* - CreateTilesAtPosition(); -
* - TilesMultiplicationAtColision()
* - TilesPositionUpdate();
* - TilesValueChange();
*TODO 5;
* Create Start Game() and GameOver() conditions;
*TODO 6:
* Create HighScore;
*/

window.onload = function () {
    var endGame = false;
    var youWin = false;
    var score = 0;
    var Tile = 256;
    var Rows = 4;
    var Cols = 4;
    var row, col;
    var matrix = new Array(Rows);
    var arrayCol, arrayRow;
    var tileBackgroundColor = ["#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c5f",
		"#f65e3b", "#ecdf72", "#edcc61", "#edc850", "#edc53f", "#edc22e"];
    var DEFAULT_TILE_BG_COLOR = "#EEE4DA";
    var DIGIT_TWO = 2;
    var TEXT_OFFSET_Y = 30;
    var BORDER_OFFSET = 5;
    var KEY = {
        DOWN: 40,
        UP: 38,
        LEFT: 37,
        RIGHT: 39
    };

    // initialization logic
    (function initializeBoard() {
        for (row = 0; row < Rows; row++) {
            matrix[row] = new Array(Cols);
            for (col = 0; col < Cols ; col++) {
                matrix[row][col] = 0;
            }
        }

        var digitPosition = generateRandomPosition();
        updateBoard(DIGIT_TWO, digitPosition[0], digitPosition[1]);

        draw();
    }());

    var direction = "neutral";  // delete if not needed

    // main entry point 
    (function gameLoop() {
        window.setTimeout(gameLoop, 60);
        drawScreen();
    }());

    function drawScreen() {
        // get user input
        document.onkeydown = function (e) {
            e = e || window.event;

            switch (e.keyCode) {
                case KEY.DOWN:
                    moveDown();
                    direction = "down"; // delete if not needed
                    break;
                case KEY.UP:
                    moveUp();
                    direction = "up"; // delete if not needed
                    break;
                case KEY.LEFT:
                    moveLeft();
                    direction = "left"; // delete if not needed
                    break;
                case KEY.RIGHT:
                    moveRight();
                    direction = "right"; // delete if not needed
                    break;
            }
        }

        function moveLeft() {
            for (var row = 0; row < Rows; row++) {
                arrayCol = new Array(Cols);
                for (var col = 0; col < Cols; col++) {
                    arrayCol[col] = matrix[row][col];
                }
                matrix[row] = newArray(arrayCol);
            }

            direction = "neutral"; // delete if not needed
            draw();
        }

        function moveRight() {
            for (var row = 0; row < Rows; row++) {
                arrayCol = new Array(Cols);
                for (var col = 0; col < Cols; col++) {
                    arrayCol[col] = matrix[row][Cols - 1 - col];
                }
                matrix[row] = newArray(arrayCol).reverse();
            }

            direction = "neutral"; // delete if not needed
            draw();
        }

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

            direction = "neutral"; // delete if not needed
            draw();
        }

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

            direction = "neutral"; // delete if not needed
            draw();
        }
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
    }
    function draw() {

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

        var digitPosition = generateRandomPosition();
        updateBoard(DIGIT_TWO, digitPosition[0], digitPosition[1]);


        // for test purposes
        // console.log(digitPosition[0] + " " + digitPosition[1]);

        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Cols; j++) {
                (function () {
                    var box = new Kinetic.Rect({
                        x: j * 100 + BORDER_OFFSET / 2,
                        y: i * 100 + BORDER_OFFSET / 2,
                        width: 100,
                        height: 100,
                        cornerRadius: 5,
                        // fill: '#EEE4DA',
                        fill: getBackgroundColor(i, j),
                        stroke: '#BBADA0',
                        strokeWidth: 5
                    });
                    var text = new Kinetic.Text({
                        x: box.getX(),
                        y: box.getY() + TEXT_OFFSET_Y,
                        // text: matrix[i][j],
                        text: (matrix[i][j] !== 0) ? (matrix[i][j]) : "",
                        fontSize: 40,
                        fontFamily: 'Calibri',
                        width: box.getWidth(),
                        //padding: 30,
                        align: 'center',
                        fill: 'white'
                    });
                    // console.log(getBackgroundColor(i,j);
                    layer.add(box);
                    layer.add(text);
                })();
            }
        }

        return stage.add(layer);
    }
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
    function updateBoard(number, row, col) {
        matrix[row][col] = number;
    }
    function getBaseLog(base, number) {
        return Math.log(number) / Math.log(base);
    }
    function getBackgroundColor(i, j) {
        var number = matrix[i][j];

        if (number === 0) {
            return DEFAULT_TILE_BG_COLOR;
        } else {
            var index = getBaseLog(DIGIT_TWO, number) - 1;
            return tileBackgroundColor[index];
        }
    }
}