const School = require('../model/school');
const Student = require('../model/student');
const { generate } = require('../utils/utils');
const Teacher = require('../model/teacher');
const Admin = require('../model/admin');
const fastcsv = require('fast-csv');
const fs = require('fs');
const zip = require('express-easy-zip');
const json2csv = require('json2csv').parse;

exports.login = async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const school = await School.findOne({ id: id, password: password });

    if (school) {
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
    const school = new School({
      name: req.body.name,
      address: req.body.address,
      village: req.body.village,
      mandal: req.body.mandal,
      phoneNumber: req.body.phoneNumber,
      district: req.body.district,
      state: req.body.state,
      id: req.body.phoneNumber,
      password: req.body.password,
    });

    const resp = await school.save();

    const path = `../uploads/${req.body.name}/photos`;
    console.log(path);
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
      name: req.body.name,
      id: id,
      class: req.body.class,
      section: req.body.section,
      fatherName: req.body.fatherName,
      school: req.body.school,
      address: req.body.address,
      aadhaar: req.body.aadhaar,
    });

    const resp = await student.save();
    const photoBuffer = Buffer.from(req.body.photoUrl, 'base64');
    const fileName = `../uploads/${req.body.school}/photos/students/${id}.jpeg`;
    console.log(photoBuffer);
    console.log(fileName);
    fs.writeFileSync(fileName, photoBuffer);

    res.json({ code: 201, payload: resp });
  } catch (error) {
    console.log(error);
    res.json({ code: 500, error: error });
  }
};

exports.saveTeacher = async (req, res) => {
  try {
    const id = generate();

    const teacher = new Teacher({
      name: req.body.name,
      id: id,
      designation: req.body.designation,
      employeeId: req.body.employeeId,
      phoneNumber: req.body.phoneNumber,
      school: req.body.school,
      address: req.body.address,
      aadhaar: req.body.aadhaar,
      bloodGroup: req.body.bloodGroup,
    });

    const resp = await teacher.save();
    const photoBuffer = Buffer.from(req.body.photoUrl, 'base64');
    const fileName = `../uploads/${req.body.school}/photos/teachers/${id}.jpeg`;
    console.log(photoBuffer);
    console.log(fileName);
    fs.writeFileSync(fileName, photoBuffer);
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
    const id = req.params.id;
    let school = await School.findOne({ id });

    const dateTime = new Date()
      .toISOString()
      .slice(-24)
      .replace(/\D/g, '')
      .slice(0, 14);

    let filePath1 = `../uploads/${school.name}/${school.name}-students-${dateTime}.csv`;
    let csv1, csv2;

    const students = await Student.find({ school: id });

    let fields = [
      'id',
      'name',
      'class',
      'section',
      'fatherName',
      'school',
      'address',
      'aadhaar',
    ];

    try {
      csv1 = json2csv(students, { fields });
    } catch (err) {
      return res.status(500).json({ err });
    }

    fs.writeFile(filePath1, csv1, function (err) {
      if (err) {
        return res.json(err).status(500);
      } else {
        console.log('200');
      }
    });

    let filePath2 = `../uploads/${school.name}/${school.name}-teachers-${dateTime}.csv`;

    const teachers = await Teacher.find({ school: id });

    fields = [
      'id',
      'name',
      'designation',
      'employeeId',
      'fatherName',
      'school',
      'address',
      'phoneNumber',
      'bloodGroup',
    ];

    try {
      csv2 = json2csv(teachers, { fields });
    } catch (err) {
      return res.status(500).json({ err });
    }

    fs.writeFile(filePath2, csv2, function (err) {
      if (err) {
        return res.json(err).status(500);
      } else {
        console.log('200');
      }
    });

    const dirPath = `../uploads/${school.name}`;
    await res.zip({
      files: [
        {
          path: dirPath,
          name: `${school.name}`,
        },
      ],
      filename: `${school.name}.zip`,
    });

    fs.unlink(filePath1, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('File has been Deleted');
    });

    fs.unlink(filePath2, function (err) {
      if (err) {
        console.error(err);
      }
      console.log('File has been Deleted');
    });
  } catch (error) {
    console.log(error);
  }
};
