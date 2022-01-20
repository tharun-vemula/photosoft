from tkinter import Tk, Label, Button, messagebox, filedialog
from tkinter import *
from tkinter import ttk
import sys,os
import openpyxl as xl
from openpyxl.styles import Font, Alignment
from util import fill

flag_create = 0

def visible(small):
    global flag_create
    if flag_create == 0:
        small.withdraw()
        flag_create = 1
    else:
        flag_create = 0
        small.deiconify()

def create_excel(name,path):
    try:
        os.chdir(path)
        print(os.getcwd())
        wb = xl.Workbook()
            

        ws = wb.active

        ws = fill(ws, name)
        wb.save(f"{name}.xlsx")
        print("Excel created")

    except:
        print("Excel went wrong")



    

def file_create(small, schoolEntry, filepath):

    try: 
        name = schoolEntry.get()
        path = os.path.join(filepath, name)
        print(path)
        
        if os.path.isdir(path):
            os.chdir(path)

            if os.path.isdir('photos'):
                messagebox.showinfo("Message", "Institute Folder already exists!")
            else:
                os.makedirs('photos')
                messagebox.showinfo("Message", "Institute Folder already exists! Photo folder is created")
             
            small.quit()
        else:
            os.makedirs(path)
            os.chdir(path)
            os.makedirs('photos')
            #visible(small)
            messagebox.showinfo("Message", "Institute Folder created successfully!")

        create_excel(name,path)
        
    except :
        print("Error in path thing dude")
        messagebox.showinfo("Message", "Unsuccessful attempt!")
    

class Create_Institute:

    def __init__(self, filepath, small=Tk()):

        print(filepath)

        self.small = small
        small.protocol("WM_DELETE_WINDOW",self.event_X)
        small.title("Enter Insitute - Photosoft 3.0")
        small.geometry("450x230")
        #win.geometry("450x230+450+170")

     #variables
        school = StringVar(small)
        

    #labels
    
        self.schoolLabel = Label(small,text="Institute Name:")
        self.schoolLabel.place(relx=0.200, rely=0.298, height=20, width=120)

    #entry

        self.schoolEntry = ttk.Entry(small, textvariable=school)
        self.schoolEntry.place(relx=0.440, rely=0.298, height=20, relwidth=0.35)


    #button
        self.schoolButton = Button(small, text="Create", command=lambda : file_create(small,self.schoolEntry, filepath))
        self.schoolButton.place(relx=0.440, rely=0.638, height=30, width=60)

        
    def event_X(self):
            sys.exit()

    def mainloop_window(self):
            self.small.mainloop()
   


