const School = require('../model/school');
const Student = require('../model/student');
const { generate } = require('../utils/utils');
const Teacher = require('../model/teacher');
const Admin = require('../model/admin');
const fastcsv = require('fast-csv');
const fs = require('fs');
const archiver = require('archiver');

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

    const path = `../uploads/${req.body.name}/photos`;

    fs.access(path, (error) => {
      if (error) {
        fs.mkdir(path, { recursive: true }, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log('New Directory created successfully !!');
          }
        });
      } else {
        console.log('Given Directory already exists !!');
      }
    });

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
      aadhaar: req.body.aadhaar,
    });

    const resp = await student.save();
    const photoBuffer = Buffer.from(req.body.photoUrl, 'base64');
    const fileName = `../uploads/${req.body.school}/photos/${req.body.id}`;
    fs.writeFileSync(fileName, photoBuffer);

    res.json({ code: 201, payload: resp });
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.saveStudent = async (req, res) => {
  try {
    const id = generate();

    const teacher = new Teacher({
      name: req.body.id,
      id: id,
      designation: req.body.designation,
      employeeId: req.body.employeeId,
      phoneNumber: req.body.phoneNumber,
      school: req.body.school,
      address: req.body.address,
      photoUrl: req.body.photoUrl,
      aadhaar: req.body.aadhaar,
      bloodGroup: req.body.bloodGroup,
    });

    const resp = await teacher.save();
    res.json({ code: 201, payload: resp });
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const admin = await Admin.findOne({ id: id, password: password });

    if (admin) {
      req.session.isLoggedIn = true;
      res.json({ code: 200, payload: admin });
    } else {
      res.json({ code: 404, message: 'Not Found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.getPeople = async (req, res) => {
  try {
    const id = req.body.id;
    let students, teachers;
    [students, teachers] = await Promise.all([
      await Student.find({ id }),
      await Teacher.find({ id }),
    ]);
    res.json({
      code: 200,
      message: { teachers: teachers, students: students },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const id = req.body.id;
    let students, teachers;
    [students, teachers] = await Promise.all([
      await Student.find({ id }),
      await Teacher.find({ id }),
    ]);
    let school = await School.find({ id });
    let data = { teachers: teachers, students: students };
    let fileName = `../uploads/${school}/${school}-${new Date()}.csv`;
    const ws = fs.createWriteStream(fileName);

    fastcsv
      .write(data, { headers: true })
      .on('finish', function () {
        console.log(fileName + 'Written Successfully');
      })
      .pipe(ws);

    const output = fs.createWriteStream(`../uploads/${school}/${school}.zip`);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(output);

    res.download(output);
  } catch (error) {
    console.log(error);
  }
};
