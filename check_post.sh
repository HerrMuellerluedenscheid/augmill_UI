# A script to test posting data using curl
curl -v -H "Content-Type: application/JSON" -XPOST --data "{\"username\":\"marius\", \"body\":\"some body\"}" localhost:3000/api/posts
