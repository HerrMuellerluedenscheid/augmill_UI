#include <stdio.h>
#include <time.h>
#include <mongoc.h>
#include <bson.h>
#include <math.h>
#include <stdlib.h>



int current_time_with_ms (void)
{
    int            ms; // Milliseconds
    time_t          s;  // Seconds
    struct timespec spec;

    clock_gettime(CLOCK_REALTIME, &spec);

    s  = spec.tv_sec;
    ms = round(spec.tv_nsec / 1.0e6); // Convert nanoseconds to milliseconds
    // printf("Current time: %"PRIdMAX".%03ld seconds since the Epoch\n",
           //(intmax_t)s, ms);
    return ms;

}


int dump_counts_to_mongo(int count, int ms, char db[], char table[])
{
    mongoc_client_t *client;
    mongoc_collection_t *collection;
    bson_error_t error;
    bson_oid_t oid;
    bson_t *doc;
    uint64_t t = time(NULL);

    struct timeval time_now;
    gettimeofday(&time_now, NULL);

    struct tm tm = *localtime(&t);

    mongoc_init ();

    client = mongoc_client_new ("mongodb://localhost:27017/");
    collection = mongoc_client_get_collection (client, db, table);

    doc = bson_new ();

    bson_oid_init (&oid, NULL);

    // append object identifier
    BSON_APPEND_OID (doc, "_id", &oid);

    // append a date and time
    //printf("%1.3f", t);
    // BSON_APPEND_DATE_TIME(doc, "time", mktime(&tm) * 1000.);
    BSON_APPEND_DATE_TIME(doc, "time", mktime(&tm) * 1000. + ms);

    // append values
    BSON_APPEND_INT32(doc, "count", count);

    // insert collection into database
    if (!mongoc_collection_insert (collection, MONGOC_INSERT_NONE, doc, NULL, &error)) {
        fprintf (stderr, "%s\n", error.message);
    }

    bson_destroy (doc);
    mongoc_collection_destroy (collection);
    mongoc_client_destroy (client);
    mongoc_cleanup ();

    return 0;
}

