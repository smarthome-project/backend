#!/usr/bin/env python
import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
data = int(sys.argv[1])  #12
clock = int(sys.argv[2]) #16
latch = int(sys.argv[3]) #18





GPIO.setup(data,GPIO.OUT)
GPIO.setup(clock,GPIO.OUT)
GPIO.setup(latch,GPIO.OUT)


GPIO.output(data, GPIO.LOW)
GPIO.output(clock, GPIO.LOW)
GPIO.output(latch, GPIO.LOW)

register = []
for i in xrange(4,len(sys.argv)):
	register.append(int(sys.argv[i]))	


def clear():
	for i in range(0,16):
		GPIO.output(data, GPIO.HIGH)
		GPIO.output(clock, GPIO.HIGH)
		GPIO.output(clock, GPIO.LOW)
		GPIO.output(data, GPIO.LOW)
		time.sleep(5.0 / 1000.0)
	time.sleep(5.0 / 1000.0)
	GPIO.output(latch, GPIO.HIGH)
	time.sleep(5.0 / 1000.0)
	GPIO.output(latch, GPIO.LOW)

def output():
	global register
	for i in range(0,16):
		print register[i]
		if register[i] == 1:
			GPIO.output(data, GPIO.LOW)
			GPIO.output(clock, GPIO.HIGH)
			GPIO.output(clock, GPIO.LOW)
		else:
			GPIO.output(data, GPIO.HIGH)
			GPIO.output(clock, GPIO.HIGH)
			GPIO.output(clock, GPIO.LOW)
			GPIO.output(data, GPIO.LOW)
		time.sleep(5.0 / 1000.0)
	time.sleep(5.0 / 1000.0)
	GPIO.output(latch, GPIO.HIGH)
	time.sleep(5.0 / 1000.0)
	GPIO.output(latch, GPIO.LOW)
	
clear()
output()

GPIO.cleanup()