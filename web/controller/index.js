const School = require('../model/school');
const Student = require('../model/student');
const { generate } = require('../utils/utils');

exports.login = async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const school = await School.findOne({ id: id, password: password });

    if (school) {
      req.session.isLoggedIn = true;
      res.json({ code: 200, payload: school });
    } else {
      res.json({ code: 404, message: 'Not Found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.signup = async (req, res) => {
  try {
    const id = generate();

    const school = new School({
      name: req.body.name,
      address: req.body.address,
      village: req.body.village,
      district: req.body.district,
      state: req.body.state,
      id: id,
      password: req.body.password,
    });

    const resp = await school.save();

    res.json({ code: 201, message: resp });
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.saveStudent = async (req, res) => {
  try {
    const id = generate();

    const student = new Student({
      name: req.body.id,
      id: id,
      class: req.body.id,
      section: req.body.section,
      fatherName: req.body.fatherName,
      school: req.body.school,
      address: req.body.address,
      photoUrl: req.body.photoUrl,
    });

    const resp = await student.save();
    res.json({ code: 201, payload: resp });
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};
