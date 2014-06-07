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
*  - CreateTilesAtPosition(); - 
*  - TilesMultiplicationAtColision()
*  -  TilesPositionUpdate();
*  - TilesValueChange();
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
    var row, cow;
    var matrix = new Array(Rows);
    var arrayCol, arrayRow;
    for (row = 0; row < Rows; row++) {
        matrix[row] = new Array(Cols);
        for (cow = 0; cow < Cols ; cow++) {
            matrix[row][cow] = 0;
        }
    }
    var direction = "neutral";
    gameLoop();
    CreateRandomNumber();
    CreateRandomNumber();
    draw();
    function gameLoop() {
        window.setTimeout(gameLoop, 60);
        drawScreen();
    }
    function drawScreen() {
        document.onkeydown = checkKey;
        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode === 40) {
                direction = "down";
            }
            if (e.keyCode === 38) {
                direction = "up";
            }
            if (e.keyCode === 37) {
                direction = "left";
            }
            if (e.keyCode === 39) {
                direction = "right";
            }
        }
        switch (direction) {
            case "down":
                moveDown();
                break;
            case "up":
                moveUp();
                break;
            case "left":
                moveLeft();
                break;
            case "right":
                moveRight();
                break;
        }
        function moveLeft() {
            for (var row = 0; row < Rows; row++) {
                arrayCol = new Array(Cols);
                for (var col = 0; col < Cols; col++) {
                    arrayCol[col] = matrix[row][col];
                }
                matrix[row] = newArray(arrayCol);
            }
            CreateRandomNumber();
            direction = "neutral";
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
            CreateRandomNumber();
            direction = "neutral";
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
            CreateRandomNumber();
            direction = "neutral";
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
            CreateRandomNumber();
            direction = "neutral";
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
            width: 400,
            height: 400
        });
        var layer = new Kinetic.Layer();
        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Cols; j++) {
                (function () {
                    var box = new Kinetic.Rect({
                        x: j * 100,
                        y: i * 100,
                        width: 100,
                        height: 100,
                        cornerRadius: 5,
                        fill: '#EEE4DA',
                        stroke: '#BBADA0',
                        strokeWidth: 5
                    });
                    var text = new Kinetic.Text({
                        x: box.getX(),
                        y: box.getY(),
                        //text: matrix[i][j],
                        text: (matrix[i][j] !== 0) ? (matrix[i][j]) : "",
                        fontSize: 30,
                        fontFamily: 'Calibri',
                        width: box.getWidth(),
                        padding: 30,
                        align: 'center',
                        fill: 'white'
                    });
                    layer.add(box);
                    layer.add(text);
                })();
            }
        }

        return stage.add(layer);
    }
    function CreateRandomNumber() {
        while (true) {
            var currRow = Math.floor((Math.random() * Rows) + 0);
            var currCol = Math.floor((Math.random() * Cols) + 0);
            if (matrix[currRow][currCol] === 0) {
                matrix[currRow][currCol] = 2;
                break;
            }
        }
    }
}
