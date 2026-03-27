# -*- coding: utf-8 -*-
################################################################################
##Author:        Carlos Asmat
##Creation Date: 12/07/09
##Title:         Pololu Module Usage Example
##Description:   Set of functions allowing the communication with
##               Pololu devices using the Pololu protocol.
##
##Copyright: Carlos Asmat, 2009
##License:
##      This program is free software: you can redistribute it and/or modify
##      it under the terms of the GNU General Public License as published by
##      the Free Software Foundation, either version 3 of the License, or
##      (at your option) any later version.
##
##      This program is distributed in the hope that it will be useful,
##      but WITHOUT ANY WARRANTY; without even the implied warranty of
##      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
##      GNU General Public License for more details.
##
##      You should have received a copy of the GNU General Public License
##      along with this program.  If not, see <http://www.gnu.org/licenses/>.
##
##Description:
##      This is a short script that used the lib_Pololu library.
##
################################################################################

# Adding the path to the lib_pololu.py file to your modules path.
# Assuming that the file is at your/path/to/the/library/lib_pololu.py
import sys
sys.path.append('/your/path/to/the/library')

#Import the lib_pololu module
import lib_pololu

#Import the serial communication module that should already be installed
import serial

#Open serial port
port = serial.Serial('/dev/ttyUSB0')
port.baudrate=2400 #set an appropriate baudrate

#Create a motor assuming that the motor is connected to the connector
#number 0 on the controller. The two numbers (1150 and 4650) are
#the calibration values corresponding to the 0 ans 180 deg positions
#respectively.
motor = lib_pololu.Servo(port, 0, 1150, 4650)

#Playing around with the motor
motor.set_pos(45) #sets the posotion of the motors in degerees.
motor.set_speed(100) #sets the speed at a value between 0 and 127
