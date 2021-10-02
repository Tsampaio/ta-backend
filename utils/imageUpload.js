const express = require('express');
const multer = require('multer');
const path = require('path');

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'course') {
      cb(null, 'uploads/courses/');
    } else {
      cb(null, 'uploads/users/');
    }
  },
  filename(req, file, cb) {
    console.log('THE FILE NAME IS ' + file.fieldname);

    cb(
      null,
      // file.originalname
      `${file.name}${path.extname(file.originalname)}`
      // `${file.name}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);
  console.log('Before mime');
  console.log(file);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

exports.upload = multer({
  // storage,
  storage: multerS3({
    s3: s3,
    bucket: 'telmo-files', // your bucket name,,
    acl: 'private', //public-read
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (request, file, cb) {
      console.log('MY FILES IS ++++++++++++++++++++++');
      console.log(file);
      cb(null, `telmo-academy/users/${file.originalname}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    console.log('CHECKING FYLE TYPE');
    console.log(file);
    try {
      if (file.fieldname === 'course' && req.user.role === 'admin') {
        file.name = req.params.courseTag;
      } else if (file.fieldname === 'file' && req.user) {
        file.name = req.user._id;
      }

      checkFileType(file, cb);
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
    }
  },
  limits: { fileSize: 2000000 },
});
