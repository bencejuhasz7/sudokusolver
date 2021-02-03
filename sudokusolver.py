def is_valid(board, rowpos, colpos, num):
    '''CHECKS IF A NUMBER IS VALID WITHIN A SQUARE'''
    #CHECK ROWS
    if num in board[rowpos,:]:
        return False

    #CHECK COLUMNS
    if num in board[:,colpos]:
        return False

    #CHECK BOX
    boxrow = rowpos // 3
    boxcol = colpos // 3
    startrow = boxrow*3
    startcol = boxcol*3

    if num in board[startrow:startrow+3, startcol:startcol+3]:
        return False

    return True

def find_blank(board):
    '''FINDS THE NEXT EMPTY SQUARE ON THE BOARD'''
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i, j] == 0:
                return i, j
    return False

def sudoku_solver(board, inputboxes):
    '''SOLVING THE SUDOKU BOARD WITH RECURSION'''
    if not find_blank(board): # if there are no more empty squares
        return True
    i, j = find_blank(board) # if there is an empty square, get the coordinates

    for num in range(1,10): # try 1-10 into the board
        if is_valid(board, i, j, num):
            board[i,j] = num # if the value (num) is valid, print it into the board

            inputboxes[i][j].entry.insert(0, num) # inserts the value into the GUI as well

            if sudoku_solver(board, inputboxes): # calls itself again, but now there are 1 less empty squares
                return True # current function returns True, if the next function is True

            board[i, j] = 0 # if next function is False (there are no valid squares), set value to 0

            inputboxes[i][j].entry.delete(0) # delete current number from GUI

    else:
        return False # if there is no valid value between 1-10, the function returns false->backtrack













