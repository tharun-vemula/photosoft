const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },

    class: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    fatherName: {
      type: String,
      required: true,
    },

    school: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    photoUrl: {
      type: String,
      required: true,
    },

    id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Student', studentSchema);
