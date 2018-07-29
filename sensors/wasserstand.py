#!/usr/bin/env python

#Libraries
import RPi.GPIO as GPIO
import argparse
import time
import datetime
from pymongo import MongoClient
import sys

 
#GPIO Mode (BOARD / BCM)
GPIO.setmode(GPIO.BCM)
 
#set GPIO Pins
GPIO_TRIGGER = 18
GPIO_ECHO = 24
 
#set GPIO direction (IN / OUT)
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)
 
def distance():
    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)
 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
 
    StartTime = time.time()
    StopTime = time.time()
 
    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
 
    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()
 
    # time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    return (TimeElapsed * 34300.) / 2.


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--mongo', help='Schreibe in Datenbank', action='store_true')
    parser.add_argument('--interval', help='Leseintervall', type=float, default=2.)
    parser.add_argument('--reference', help='Referenzwert', type=float, default=None)
    args = parser.parse_args()

    if args.mongo:
        client = MongoClient()
        db = client.muehle

    try:
        while True:
            dist = distance()
            if args.reference is not None:
                dist = args.reference - dist

            tnow = datetime.datetime.now() 
            if args.mongo:
                db.water_level.insert({
                    'time': tnow,
                    # 'time': tnow.isoformat(),
                    'count': dist})
            else:
                fn = '/home/pi/dists.txt'
                print ("Measured Distance = %.1f cm" % dist)
                with open(fn, 'a') as f:
                    f.write('%s %s\n'% (tnow, dist))

            time.sleep(args.interval)
 
        # Reset by pressing CTRL + C
    except KeyboardInterrupt:
        print("Measurement stopped by User")
        GPIO.cleanup()
