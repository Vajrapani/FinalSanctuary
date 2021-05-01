const mongoose = require('mongoose');
//making animal schema
const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  },
  Owner: {
    type: String,
    required: false
  }
});

const animal = mongoose.model('animal', animalSchema);

module.exports = animal;
