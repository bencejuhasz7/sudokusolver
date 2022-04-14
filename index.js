window.onload = function () {
	handler();
};

let board = [];
let flatBoard = [];
let executionTime = 0;
let timeBegin = 0;

function handler() {
	// Creating the 9x9 tile grid and adding extra borders where needed
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			let tile = document.createElement("input");
			if (i == 0) {
				tile.classList.add("tile-top");
			}

			if (i == 8) {
				tile.classList.add("tile-bottom");
			}

			if (j == 0) {
				tile.classList.add("tile-left");
			}

			if (j == 8) {
				tile.classList.add("tile-right");
			}

			if (i == 2 || i == 5) {
				tile.classList.add("big-tile-bottom");
			}

			if (j == 2 || j == 5) {
				tile.classList.add("big-tile-right");
			}

			tile.id = i.toString() + "-" + j.toString();
			tile.classList.add("tile");
			tile.pattern = '[1-9""]';
			tile.maxLength = "1";
			document.getElementById("board").append(tile);
		}
	}
	// Getting the board values after first loading the screen
	getBoard();
	// Handling the event of clicking on the solve button
	document.querySelector(".solve-board").addEventListener("click", () => {
		getBoard();

		// Solving the board
		let solvable = true;

		// Checking if there is a NaN value in the board
		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 9; j++) {
				if (isNaN(board[i][j])) {
					// If there is a NaN value, the solve button won't work
					solvable = false;
					document.querySelector(".valid-board").style.visibility = "visible";
				}
			}
		}
		// Checking if the starting board is solvable
		if (!isBoardValid(board)) {
			solvable = false;
			document.querySelector(".valid-board").style.visibility = "visible";
		}

		if (solvable) {
			document.querySelector(".valid-board").style.visibility = "hidden"; // Hiding the text which shows when the board is invalid
			timeBegin = Date.now(); // Measuring the execution time
			solveBoard(board); // Calling the solver function
			executionTime = Date.now() - timeBegin;
			document.querySelector(
				".time"
			).innerHTML = `<i>Solving the board took ${executionTime} ms. You can clear the board with the Delete button.</i>`; // Showing the execution time
			flatBoard = board.flat(); // Flattening allows to get the indexes of the inputs (0-80)

			for (let i = 0; i < 81; i++) {
				document.querySelectorAll("input")[i].value = flatBoard[i]; // Clearing the sudoku board
			}
		}
	});

	// Handling the event of clicking on the delete button
	document.querySelector(".delete-board").addEventListener("click", () => {
		// Resetting every tile value to ""
		board = board.map(function (subarray) {
			return subarray.map(function (number) {
				return "";
			});
		});

		// Resetting the arguments
		for (let i = 0; i < 81; i++) {
			document.querySelectorAll("input")[i].value = ""; // Assigning the cleared board values to the tiles on the GUI
			document.querySelectorAll("input")[i].classList.remove("tile-background"); // Remove highlihted background if the is any
			document.querySelector(".valid-board").style.visibility = "hidden";
			document.querySelector(".time").innerHTML =
				"<i>Type the starting digits into the boxes for which you want to solve the sudoku board.</i>";
		}
	});

	let allowedChars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]; // Allowed digits in the tiles
	// Handling tile highlighting on deleting and setting value
	for (let i = 0; i < 81; i++) {
		document
			.querySelectorAll("input")
			[i].addEventListener("keydown", (event) => {
				if (event.key === "Backspace" || event.key === "Delete") {
					// Handling the event of deleting value from a tile
					document
						.querySelectorAll("input")
						[i].classList.remove("tile-background");
					console.log(event);
				}
				if (allowedChars.includes(event.key)) {
					// Handling the event of setting a value to a tiile
					document
						.querySelectorAll("input")
						[i].classList.add("tile-background");
					console.log(event);
				}
			});
	}
}

// Get the board from the GUI
function getBoard() {
	// Getting a 9x9 nested array from a flat 81x1 array
	function arrayToNested(list, elementsPerSubArray) {
		var matrix = [],
			i,
			k;

		for (i = 0, k = -1; i < list.length; i++) {
			if (i % elementsPerSubArray === 0) {
				k++;
				matrix[k] = [];
			}

			matrix[k].push(list[i]);
		}

		return matrix;
	}
	// startingBoard is holding the saved values from the GUI
	let startingBoard = [];
	for (let i = 0; i < 81; i++) {
		startingBoard.push(document.querySelectorAll("input")[i].value);
	}
	startingBoard = arrayToNested(startingBoard, 9); // Getting a 9x9 from a 81x1 array

	board = startingBoard.map(function (subarray) {
		return subarray.map(function (number) {
			console.log(Number(number));
			return number == "" ? 0 : Number(number); // If the value on the GUI is an empty cell, set it to "", otherwise set it to the number
		});
	});
	return board;
}
// Recursive function solving the sudoku board
function solveBoard(board, row, col) {
	if (!findEmptyCell(board)) {
		// If there are no more empty cells, the board is solved
		return true;
	}
	[row, col] = findEmptyCell(board); // Getting the row and column index of the found empty cell

	for (let i = 1; i < 10; i++) {
		// Trying digits 1 to 10 into the cell
		if (isValid(board, i, [row, col])) {
			// Check if the digit is valid
			board[row][col] = i; // If it is valid, set the cell to the found digit

			if (solveBoard(board, row, col)) {
				// The function calls itself recursively, when every solution is found, it returns with true
				return true;
			}
			board[row][col] = 0; // If the function couldn't find a valid digit, it sets the cell value as 0, and backtracks
		}
	}

	return false; // If the function couldn't find a valid digit, it backtracks to the previous function
}
// Function responsible for finding the next empty cell
function findEmptyCell(board) {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			if (board[i][j] == 0) {
				return [i, j]; // If it found an empty cell, it returns with its position indexes
			}
		}
	}
	return false; // If it couldn't find an empty cell, it returns with false
}

// Checking if a digit (1-10) is valid in a cell
function isValid(board, num, pos) {
	// Checking the row
	for (let i = 0; i < board[0].length; i++) {
		if (board[pos[0]][i] === num && pos[1] != i) {
			return false; // If the digit is not valid, the function returns with false
		}
	}
	// Checking the column
	for (let i = 0; i < board[0].length; i++) {
		if (board[i][pos[1]] === num && pos[0] != i) {
			return false; // If the digit is not valid, the function returns with false
		}
	}

	// Checking 3x3 box
	xCoord = Math.floor(pos[1] / 3); // Getting the 3x3 box indexes by integer division
	yCoord = Math.floor(pos[0] / 3);

	// Looping starts with the index of the block number (0-2) and ends with index of the block + 3 (3-5)
	for (let i = yCoord * 3; i < yCoord * 3 + 3; i++) {
		for (let j = xCoord * 3; j < xCoord * 3 + 3; j++) {
			if (
				board[i][j] === num &&
				[i, j].every((val, index) => val !== pos[index])
			) {
				return false; // If the digit is not valid, the function returns with false
			}
		}
	}
	return true; // If every test is passed, the digit is valid, and the function returns with true
}

// Helper function to check if the starting board is valid
function isBoardValid(board) {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] !== 0 && !isBoardCellValid(board, board[i][j], [i, j])) {
				return false;
			}
		}
	}
	return true;
}

// Helper function to check if the cells of the starting board are valid
function isBoardCellValid(board, num, pos) {
	// Checking the row
	for (let i = 0; i < board[0].length; i++) {
		if (board[pos[0]][i] === num && pos[1] != i) {
			return false; // If the digit is not valid, the function returns with false
		}
	}
	// Checking the column
	for (let i = 0; i < board[0].length; i++) {
		if (board[i][pos[1]] === num && pos[0] != i) {
			return false; // If the digit is not valid, the function returns with false
		}
	}
	// Checking 3x3 box
	xCoord = Math.floor(pos[1] / 3); // Getting the 3x3 box indexes by integer division
	yCoord = Math.floor(pos[0] / 3);

	// Looping starts with the index of the block number (0-2) and ends with index of the block + 3 (3-5)
	for (let i = yCoord * 3; i < yCoord * 3 + 3; i++) {
		for (let j = xCoord * 3; j < xCoord * 3 + 3; j++) {
			if (
				board[i][j] === num &&
				[i, j].every((val, index) => val !== pos[index])
			) {
				return false; // If the digit is not valid, the function returns with false
			}
		}
	}
	return true; // If every test is passed, the digit is valid, and the function returns with true
}
