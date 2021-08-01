# Challenge

This is the challenge of the Fortress hiring process.

## Installation

Use npm to install required dependencies.

```bash
npm install
```

## Usage

Use npm to start the application (the reservations file that the server uses gets overwritten whenever it starts).

```bash
npm start
```

There are two available endpoints, the first one is for executing the desired process of adding the reservations form the requests file.

```bash
curl --location --request GET 'localhost:3000/reservations'
```

And the second is for adding individual reservations (since it's also useful for testing purposes).

```bash
curl --location --request POST 'localhost:3000/reservations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "4067b75d-c74e-4313-9fa9-ece076a03eed",
    "min_beds": 1,
    "is_smoker": true,
    "checkin_date": "2021-01-01",
    "checkout_date": "2021-01-05"
}'
```

You can see that the body used is the same as the first one from the reservations batch.

## Questions

1. How long did it take you to complete this assignment?  Did you get stuck anywhere?
   - It took me almost 8 hours (including breaks and dinner). I got stuck mainly in the process of validating the dates.
2. Please analyze the runtime complexity of your solution in terms of Big O. Is your algorithm fast enough for 1000 requests?
   - In Big O notation it's O(n²) since I have to iterate through existing reservations and rooms, best case scenario is O(n*log(n)). Although the code is fast (it takes only a couple of ms) for large scale implementations the code is fairly slow, on of the key things that can be improved on is the way we handle the data (for example a nosql database could potentially increase the execution time and reduce it to O(n)).
3. Imagine a system in which it adjusted prices depending on various factors such as number of remaining availability, weekends, or whether there was an event in town that weekend.  How might you accommodate this change through the schema?
   - The easy way to implement scalable prices is to have a flat rate per type of room, or the second and more easier way is to add a discount (more than one room per reservation or for elderly for example) and a growth rate (for special dates, weekends, etc).