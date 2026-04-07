#File to be read
filename="Sample8.pdf"
#Write your tesseract.exe path here (or set TESSERACT_PATH env var)
import os as _os
tesseract_path= _os.getenv("TESSERACT_PATH", r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe')
#Enable manual detection for tables
manual_field_enable=False   #Will be True only if it is set to True
manual_table_enable=False    #It will set automatically to True if tables are not detected
#Stores cordinates of tables when labelled manually
cords=[]

