CC=gcc
CFLAGS=-g -Wall -Wextra -lm
MONGO_PATH=/usr/include/libmongoc-1.0
BSON_PATH=/usr/include/libbson-1.0
MONGO_FLAGS = -I$(BSON_PATH) -I$(MONGO_PATH) -lbson-1.0 -lmongoc-1.0 

all: stromzaehler

dump_mongo.o: dump_mongo.c
	$(CC) -c dump_mongo.c -L/usr/local/lib $(MONGO_FLAGS) -lm

stromzaehler : stromzaehler.o dump_mongo.o
	$(CC) stromzaehler.c -o stromzaehler dump_mongo.o $(MONGO_FLAGS) -L$(HOME)/src -lwiringPi -lm
clean:
	rm *.o stromzaehler
