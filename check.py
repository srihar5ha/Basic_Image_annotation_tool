import os
upload_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
print(upload_folder)

f = open("myfile.txt", "x")
f.write("hello motot")
f.close()
