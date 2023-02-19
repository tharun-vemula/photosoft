// const path = `../uploads/school2/photos`;
const fs = require('fs');
// console.log(path);
// fs.access(path, (error) => {
//   if (error) {
//     fs.mkdir(path, { recursive: true }, (error) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('New Directory created successfully !!');
//       }
//     });
//   } else {
//     console.log('Given Directory already exists !!');
//   }
// });
let school = 'Gowtham Model School';
const archiver = require('archiver');
const output = fs.createWriteStream(`../uploads/${school}/${school}.zip`);

const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.pipe(output);
