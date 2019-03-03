import serial
import time

# Open grbl serial port
s = serial.Serial('/dev/tty.usbserial-1410',115200)

# Open g-code file
f = open('assets/blob.gcode','r');

# Wake up grbl
s.write("\r\n\r\n")
time.sleep(2)   # Wait for grbl to initialize 
s.flushInput()  # Flush startup text in serial input

# Stream g-code to grbl
for line in f:
    l = line.strip() 
    print 'Sending: ' + l,
    s.write(l + '\n') # Send g-code block to grbl
    grbl_out = s.readline() # Wait for grbl response with carriage return
    print ' : ' + grbl_out.strip()

# Wait here until grbl is finished to close serial port and file.

s.write("S0 M5\n") # pen up
s.readline()
s.write("G01 X0 Y0\n")
s.readline()

raw_input("Press <Enter> to exit and disable grbl.") 

# Close file and serial port
f.close()
s.close()    