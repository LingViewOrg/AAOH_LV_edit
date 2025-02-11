import tkinter as tk
import subprocess
import sys
import os

def run_script():

    user_input = entry.get()
    # Path to the script you want to run
    script_path = "aaoh_tierAdd.py"  # Replace with your Python script's path

    # Run the Python script
    subprocess.run([sys.executable, script_path, user_input])  # sys.executable ensures the same Python interpreter is used


# Create the GUI
root = tk.Tk()
root.title("Add Interview")

root.geometry("600x400")  # Change to desired dimensions

entry = tk.Entry(root, width=40)
entry.pack(pady=10)

btn = tk.Button(root, text="Run Script", command=run_script)
btn.pack(pady=20, padx=20)


root.config(bg="lightblue")

root.mainloop()