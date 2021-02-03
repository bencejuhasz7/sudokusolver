import tkinter as tk
import tkinter.font as FONT
import numpy as np
import sudokusolver

root = tk.Tk()
root.title('Sudoku Solver')
root.resizable(False, False)

canvas = tk.Canvas(root, height=600, width=540, bg='#F0F0F0')
canvas.pack()

class InputBox():
    '''EVERY BOX INTO WHICH YOU CAN WRITE'''
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.font = FONT.Font(size=20)
        self.entry = tk.Entry(bg='#F0F0F0', bd=0, width=1, font=self.font, justify='center')

    def draw_inputbox(self, canvas):
        canvas.create_window(self.x, self.y, window=self.entry, height=50, width=50)

class Button():
    '''LOWER 3 BUTTONS'''
    def __init__(self, left, top, fontsize, ab, text, padx, pady, command):
        self.left = left
        self.top = top
        self.fontsize = fontsize
        self.ab = ab #activebackground
        self.text = text
        self.padx = padx
        self.pady = pady
        self.command = command

    def draw_button(self, canvas):
        font = FONT.Font(size=self.fontsize)
        button = tk.Button(activebackground=self.ab, text=self.text,
                           padx=self.padx, pady=self.pady, fg='#700303',
                           bg='#00B400', command=self.command)
        button['font'] = font
        button_window = canvas.create_window(self.left, self.top, window=button)
        return button_window


def draw_maingrid(canvas):
    '''DRAWS THE THICK GRID'''
    pos = 0
    for i in range(2):
        pos += 180
        canvas.create_line(0, pos, 540, pos, width=5)
        canvas.create_line(pos, 0, pos, 540, width=5)

def draw_subgrid(canvas):
    '''DRAWS THE THIN GRID'''
    pos = 0
    for i in range(8):
        pos += 60
        canvas.create_line(0, pos, 540, pos, width=1)
        canvas.create_line(pos, 0, pos, 540, width=1)

def draw_lower_rect(canvas):
    '''LOWER BLACK RECTANGLE ON THE SCREEN'''
    canvas.create_rectangle(0, 540, 540, 600,fill='black')

def set_default():
    '''FUNCTION FOR 'DEFAULT' BUTTON'''
    global board
    board = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
             [6, 0, 0, 1, 9, 5, 0, 0, 0],
             [0, 9, 8, 0, 0, 0, 0, 6, 0],
             [8, 0, 0, 0, 6, 0, 0, 0, 3],
             [4, 0, 0, 8, 0, 3, 0, 0, 1],
             [7, 0, 0, 0, 2, 0, 0, 0, 6],
             [0, 6, 0, 0, 0, 0, 2, 8, 0],
             [0, 0, 0, 4, 1, 9, 0, 0, 5],
             [0, 0, 0, 0, 8, 0, 0, 7, 9]]
    board = np.array(board)
    for i in range(9):
        for j in range(9):
            if (board[i][j] != 0):
                inputboxes[i][j].entry.insert(0, int(board[i][j]))
def set_zero():
    '''FUNCTION FOR 'BLANK' BUTTON'''
    global board
    board = np.zeros((9, 9))
    for x in range(100):
        for i in range(9):
            for j in range(9):
                inputboxes[i][j].entry.delete(0)

def create_inputboxes():
    '''PUTS EVERY INPUTBOX CLASS INTO A LIST'''
    inputboxes = []
    x = 30
    y = 30
    for i in range(9):

        for j in range(9):
            inputboxes.append((InputBox(x, y)))
            x += 60
        y += 60
        x = 30

    i = 0
    inputboxes2 = []
    while i<len(inputboxes):
        inputboxes2.append(inputboxes[i:i+9])
        i+=9
    return inputboxes2

def draw_inputboxes(canvas, inputboxes):
    '''DRAWS THE INPUTBOXES ON THE SCREEN'''
    for i in range(len(inputboxes)):
        for j in range(len(inputboxes[0])):
            inputboxes[i][j].draw_inputbox(canvas)

def get_inputboxdata(inputboxes):
    '''SETS THE CURRENT VALUE IN THE EMPTY BOXES INTO THE BOARD'''
    inputboxdata = []

    for i in range(len(inputboxes)):
        for j in range(len(inputboxes[0])):
            try:
                inputboxdata.append(int(inputboxes[i][j].entry.get()))
            except:
                inputboxdata.append(0)
    global board
    i = 0
    board = []
    while i < len(inputboxdata):
        board.append(inputboxdata[i:i + 9])
        i += 9
    board = np.array(board)

if __name__ == '__main__':

    inputboxes = create_inputboxes()
    draw_inputboxes(canvas, inputboxes)

    draw_maingrid(canvas)
    draw_subgrid(canvas)
    draw_lower_rect(canvas)
    Button(270, 570, 15, '#005000', 'SOLVE', 30, 5, lambda: [f() for f in [get_inputboxdata(inputboxes), sudokusolver.sudoku_solver(board, inputboxes)]]).draw_button(canvas)
    Button(450, 570, 10, '#013500', 'DEFAULT', 20, 4, set_default).draw_button(canvas)
    Button(90, 570, 10,  '#013500', 'BLANK', 20, 4, set_zero).draw_button(canvas)

    root.mainloop()
