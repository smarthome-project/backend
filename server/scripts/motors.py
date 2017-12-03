#!/usr/bin/env python
import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
moto_l = int(sys.argv[1]) #23
moto_r = int(sys.argv[2]) #24
direction = sys.argv[3] # l / r

GPIO.setup(moto_l,GPIO.OUT)
GPIO.setup(moto_r,GPIO.OUT)

GPIO.output(moto_l, GPIO.LOW)
GPIO.output(moto_r, GPIO.LOW)


def move5sec():
	if direction == 'l':
		GPIO.output(moto_l, GPIO.HIGH)
		time.sleep(5)
		GPIO.output(moto_l, GPIO.HIGH)
	else:
		GPIO.output(moto_r, GPIO.HIGH)
		time.sleep(5)
		GPIO.output(moto_r, GPIO.HIGH)

move5sec()

GPIO.cleanup()