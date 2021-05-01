const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  animalname: {
    type: String,
    required: true
  },
  requestee: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }

});

const request = mongoose.model('request', requestSchema, 'requests');

module.exports = request;
