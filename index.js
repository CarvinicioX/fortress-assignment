const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');
const port = 3000;
const rooms = require('./files/rooms.json');
const requests = require('./files/requests.json');

app.use(express.json());

app.listen(port, () => {
  fs.writeFileSync('./files/reservations.json', fs.readFileSync('./original/reservations.json'));
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post('/reservations', (req, res) => {
  let {
    id,
    min_beds,
    is_smoker,
    checkin_date,
    checkout_date
  } = req.body;

  var new_reservation = null;
  var reservations = JSON.parse(fs.readFileSync('./files/reservations.json'));

  let i = 0;
  while (i < rooms.length) {
    let j = 0,
      room = rooms[i],
      valid = true,
      price = (calculateDays(checkin_date, checkout_date) * room.daily_rate) + room.cleaning_fee;
    if (is_smoker == room.allow_smoking && min_beds <= room.num_beds) {
      while (j < reservations.length) {
        let reservation = reservations[j];
        if (reservation.room_id == room.id) {
          if (reservation.checkin_date <= checkin_date && checkin_date <= reservation.checkout_date || reservation.checkin_date <= checkout_date && checkout_date <= reservation.checkout_date) {
            valid = false;
          }
        }
        j++;
      }
      if (valid && ((new_reservation && new_reservation.total_charge > price) || !new_reservation)) {
        new_reservation = {
          room_id: room.id,
          checkin_date: checkin_date,
          checkout_date: checkout_date,
          total_charge: price
        }
      }
    }
    i++;
  }
  if (new_reservation) {
    reservations.push(new_reservation);
    fs.writeFileSync('./files/reservations.json', JSON.stringify(reservations));
    res.send(new_reservation);
  } else {
    res.send('We’re all booked up!');
  }
});

app.get('/reservations', async (req, res) => {
  let i = 0;
  while (i < requests.length) {
    var value = await axios.post('http://127.0.0.1:3000/reservations', requests[i])
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log("Error encountered");
      });
    i++;
  }
  res.send(JSON.parse(fs.readFileSync('./files/reservations.json')));
});

function calculateDays(checkin_date, checkout_date) {
  var date1 = new Date(checkin_date);
  var date2 = new Date(checkout_date);
  return ((date2.getTime() - date1.getTime()) / 86400000);
}