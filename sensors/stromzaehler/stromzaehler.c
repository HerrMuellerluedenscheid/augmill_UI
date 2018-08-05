/*
 * isr.c:
 *	Wait for Interrupt test program - ISR method
 *
 *	How to test:
 *	  Use the SoC's pull-up and pull down resistors that are avalable
 *	on input pins. So compile & run this program (via sudo), then
 *	in another terminal:
 *		gpio mode 0 up
 *		gpio mode 0 down
 *	at which point it should trigger an interrupt. Toggle the pin
 *	up/down to generate more interrupts to test.
 *
 * Copyright (c) 2013 Gordon Henderson.
 ***********************************************************************
 * This file is part of wiringPi:
 *	https://projects.drogon.net/raspberry-pi/wiringpi/
 *
 *    wiringPi is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Lesser General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    wiringPi is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Lesser General Public License for more details.
 *
 *    You should have received a copy of the GNU Lesser General Public License
 *    along with wiringPi.  If not, see <http://www.gnu.org/licenses/>.
 ***********************************************************************
 */

#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>
#include <wiringPi.h>
#include <time.h>
#include <stdint.h>
#include "dump_mongo.h"

// What GPIO input are we using?
//	This is a wiringPi pin number

// #define	POWER_MAIN	7
#define	POWER_MAIN	7
#define POWER_TURBINE   40

// globalCounter:
//	Global variable to count interrupts
//	Should be declared volatile to make sure the compiler doesn't cache it.

static volatile int globalCounter = 0 ;
static double t_dead = 300000; // 0.3 seconds!
static float power = 0.;
static int n_skipped = 0;
struct timespec start, end;
double delta_us ;
/*
 * myInterrupt:
 *********************************************************************************
 */

void myInterrupt (void)
{

  clock_gettime(CLOCK_MONOTONIC_RAW, &end);
  delta_us = (float)(end.tv_sec - start.tv_sec) * 1000000 + (double)(end.tv_nsec - start.tv_nsec) / 1000;
  if (delta_us>= t_dead) {
	 ++globalCounter ;
	 power = 4500000. / delta_us;
	 n_skipped = 0;
         clock_gettime(CLOCK_MONOTONIC_RAW, &start);
  } else { 
	 ++n_skipped;
  }
}


/*
 *********************************************************************************
 * main
 *********************************************************************************
 */
int main (int argc, char *argv[])
{
  char table[32] = "power";
  char *xx;
  int myCounter = 0 ;
  int gpio_pin;
  time_t now;
  time_t start, end, time_measure;
  int want_dump_to_mongo = 0;
  FILE *datei;
  
  for (int i=0; i<argc; i++){
  	if (strcmp(argv[i], "--mongo") == 0){
		want_dump_to_mongo = 1;
		printf("log: dump results to mongodb\n");
	} else if (strcmp(argv[i], "--table") == 0){
		strcpy(table, argv[i+1]);
		printf("log: setting mongo table: \n", table);
	} else if (strcmp(argv[i], "--gpio") == 0){
		gpio_pin = (int)strtol(argv[i+1], &xx, 10);
		printf("log: using gpio pin %d\n", gpio_pin);
	}
  }

  if (wiringPiSetup () < 0)
  {
    fprintf (stderr, "Unable to setup wiringPi: %s\n", strerror (errno)) ;
    return 1 ;
  }
 
  if (wiringPiISR (gpio_pin, INT_EDGE_FALLING, &myInterrupt) < 0)
  {
    fprintf (stderr, "Unable to setup ISR: %s\n", strerror (errno)) ;
    return 1 ;
  }
  
  // init clocks:
  clock_gettime(CLOCK_MONOTONIC_RAW, &end);
  clock_gettime(CLOCK_MONOTONIC_RAW, &start);
  
  for (;;)
  {
 
    while (myCounter == globalCounter)
      delay (200) ;
   
    if (want_dump_to_mongo == 1){
	    dump_counts_to_mongo(
		(int)(power*1000.),
		current_time_with_ms(),
		"muehle",
		table);
    } else {
            printf("skipped: %i\n", n_skipped);
            printf("Leistung: %1.2f\n", power);
            datei = fopen ("/var/strom/stromcounter", "w");
            fprintf (datei, "%d\n", globalCounter);
	    printf (" Done. counter: %5d\n", globalCounter) ;
    	    fclose (datei);
    }
    myCounter = globalCounter ;
    now = time(NULL);
  }
 
  return 0 ;
}
