const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    phoneNumber: {
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
    bloodGroup: {
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

module.exports = mongoose.model('Teacher', teacherSchema);
