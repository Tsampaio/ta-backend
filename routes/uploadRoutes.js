const express = require('express');
const {
  getS3images,
  getS3CoursesImages,
  getS3UserImage,
  getS3UserImageById,
} = require('../controllers/digitalOceanSpaces');

const { protect } = require('./../controllers/authController');

// const { protect } = require('../controllers/authController');

// const { upload } = require('../utils/imageUpload');

const router = express.Router();

router.get('/s3images', getS3images);
router.get('/s3CoursesImages', getS3CoursesImages);
router.get('/s3UserImage', protect, getS3UserImage);
router.get('/s3UserImageById/:id', protect, getS3UserImageById);

// router.post('/getLessonsWatched', protect, uploadFileToSpaces);

module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const router = express.Router();
// const fs = require('fs');

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     console.log('THE FILE NAME IS ' + file.fieldname);
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/;
//   const extname = filetypes.test(
//     path.extname(file.originalname).toLocaleLowerCase()
//   );
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb('Images only!');
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     console.log('CHECKING FYLE TYPE');
//     checkFileType(file, cb);
//   },
// });

// router.post('/', upload.single('course'), (req, res) => {
// router.post('/', (req, res) => {
// console.log('THIS IS ROUTER POST');
// console.log(req.files);

// const file = req.files.image

// const path = `${__dirname}/../client/public/${file.name}`;

//   if (fs.existsSync(path)) {
//     //file exists
//     fs.unlinkSync(path)
//   }

//   file.mv(`${__dirname}/../client/src/images/${file.name}`, err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }

//     res.json({ status: "success" });
//   });
// res.send(`/${req.file.path}`);
// res.send('Hello');
// });

// module.exports = router;
