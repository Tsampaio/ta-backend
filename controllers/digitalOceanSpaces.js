// const User = require('../models/userModel');
// const Courses = require('../models/courseModel');
// const Transactions = require('../models/transactionModel');
// const Coupon = require('../models/couponModel');
// const Membership = require('../models/membershipModel');
// const fs = require('fs');
// const braintree = require('braintree');
const aws = require('aws-sdk');
const fs = require('fs');

const s3 = new aws.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const fetchImages = async (files) => {
  // console.log('files are: ');
  // console.log(files);
  const requests = files.map(async (image, i) => {
    return new Promise(async (resolve, reject) => {
      s3.getObject(
        {
          Bucket: 'telmo-files',
          Key: image.key,
        },
        (err, data) => {
          // console.log(data);
          let buf = Buffer.from(data.Body);
          let base64 = buf.toString('base64');
          resolve({
            tag: image.tag,
            imageBase64: 'data:' + data.ContentType + ';base64,' + base64,
          });
        }
      );

      // resolve(myFile);
    });
  });
  return Promise.all(requests); // Waiting for all the requests to get resolved.
};

const userImage = (res, userId) => {
  console.log('THE USER ID IS ++++++++++');
  console.log(userId);
  const getParams = {
    Bucket: 'telmo-files', // your bucket name,
    Key: `telmo-academy/users/${userId}.jpg`, // path to the object you're looking for
  };

  console.log(`telmo-academy/users/${userId}.jpg`);

  s3.getObject(getParams, (err, data) => {
    //console.log(res, err, data);
    if (!err) {
      console.log('my data');
      console.log(data);

      let buf = Buffer.from(data.Body);
      let base64 = buf.toString('base64');
      // console.log(base64);
      res.json({
        image: 'data:' + data.ContentType + ';base64,' + base64,
      });
    } else {
      console.log('No image found');
      res.json({
        image: null,
      });
    }
  });
};

exports.getS3images = async (req, res) => {
  console.log('Inside GET USERS');

  // res.json({
  //   image: 'ok',
  // });

  // const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');

  const getParams = {
    Bucket: 'telmo-files', // your bucket name,
    Key: 'telmo-academy/users/default.png', // path to the object you're looking for
  };

  // s3.getObject(getParams, function (err, data) {
  //   // Handle any error and exit
  //   if (err) {
  //     console.log(err);
  //   }

  //   // No error happened
  //   // Convert Body from a Buffer to a String
  //   let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
  // });
  // const myFunc = () => {
  //   return new Promise((resolve, reject) => {
  //     s3.getObject(getParams, (err, data) => {
  //       //console.log(res, err, data);
  //       if (!err) {
  //         console.log('my data');
  //         console.log(data);
  //         return resolve(data.body);
  //       } else {
  //         return reject(err, res);
  //       }
  //     });
  //   }).catch((err) => {
  //     console.log('Error:', err.statusCode);
  //   });
  // };

  s3.getObject(getParams, (err, data) => {
    //console.log(res, err, data);
    if (!err) {
      // console.log('my data');
      // console.log(data);
      // return resolve(data.body);
      // const img = fs.readFileSync(`./images/${req.params.image}`);
      // const img = fs.readFileSync(`${__dirname}/../uploads/users/telmo.jpg`);
      // res.set({ 'Content-Type': 'image/jpeg' });

      let buf = Buffer.from(data.Body);
      let base64 = buf.toString('base64');
      // return base64;

      // res.json({
      //   // image: "<img src='data:image/jpeg;base64," + base64 + "'" + '/>',
      //   base64: "<img src='data:image/jpeg;base64," + base64 + "'" + '/>',
      // });
      // res.send("<img src='data:image/jpeg;base64," + base64 + "'" + '/>');

      //this one WORKS!!!!
      // res.send('data:image/jpeg;base64,' + base64);
      // res.json({
      //   image: 'data:image/jpeg;base64,' + base64,
      // });
    }
  });

  // const callBack = (err, data) => {
  //   let buf = Buffer.from(data.Body);
  //   let base64 = buf.toString('base64');
  //   return 'data:image/jpeg;base64,' + base64;
  // };

  const encodeData = (data) => {
    let buf = Buffer.from(data.Body);
    return buf.toString('base64');
  };

  const imageKeys = [
    'telmo-academy/users/default.png', // path to the object you're looking for
    'telmo-academy/users/telmo.jpg', // path to the object you're looking for
  ];

  // Promise.all(
  //   imageKeys.map((key) => {
  //     // console.log( await Course.findById( course ));
  //     return s3.getObject(
  //       {
  //         Bucket: 'telmo-files',
  //         Key: key,
  //       },
  //       (err, data) => {
  //         // console.log(data);
  //         let buf = Buffer.from(data.Body);
  //         let base64 = buf.toString('base64');
  //         return 'data:image/jpeg;base64,' + base64;
  //       }
  //     );
  //   })
  // ).then((values) => {
  //   console.log('My Values');
  //   console.log(values.Body);
  // });

  // var bucketInstance = new AWS.S3();
  // var imageKeys = [awsImgUrl1, awsImgUrl2, awsImgUrl3];

  // const promisesOfS3Objects = imageKeys.map(async function (key) {
  //   const data = await s3.getObject({
  //     Bucket: 'telmo-files',
  //     Key: key,
  //   });
  //   console.log(data.Body);
  //   // .then(function (file) {
  //   //   return 'data:' + file.ContentType + ';base64,' + encodeData(file.Body);
  //   // });
  // });
  // // console.log(promisesOfS3Objects);
  // Promise.all(promisesOfS3Objects)
  //   .then(() => {
  //     // res.json({
  //     //   images: fetchUsers(promisesOfS3Objects),
  //     // });
  //     console.log(promisesOfS3Objects);
  //   }) // callbackSuccess is called with an array of string
  //   .catch(function (error) {
  //     // res.json({
  //     //   error: 'this is an error',
  //     // });
  //     console.log(error);
  //   });

  // res.send('OK');
};

exports.getS3CoursesImages = async (req, res) => {
  const param = {
    Bucket: 'telmo-files', // your bucket name,
    Prefix: 'telmo-academy/courses/',
  };

  s3.listObjectsV2(param, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    // else console.log(data);
    // let buf = Buffer.from(data.Contents[0]);
    // let base64 = buf.toString('base64');
    // return base64;
    // this one WORKS!!!!
    // res.send(buf);

    const allCourseImages = data.Contents.map((image) => {
      console.log('Image Key is');
      console.log(image.Key);
      const myImageNameTag = image.Key.split('courses/')[1].split('.')[0];
      console.log('myImageNameTag is');
      // console.log(myImageNameTag);
      return {
        tag: myImageNameTag,
        key: image.Key,
      };
    });

    fetchImages(allCourseImages)
      .then(async (values) => {
        console.log('My values are');
        // console.log(values.length);
        // console.log(values);
        values.shift();
        res.json({
          images: values,
        });
      })
      .catch((error) => {
        console.log('There was an error find the membership history');
        console.log(error);
      });

    // res.send('OK');
  });
};

exports.getS3UserImage = (req, res) => {
  try {
    if (req.user) {
      // const getParams = {
      //   Bucket: 'telmo-files', // your bucket name,
      //   Key: `telmo-academy/users/${req.user.id}.jpg`, // path to the object you're looking for
      // };

      // s3.getObject(getParams, (err, data) => {
      //   //console.log(res, err, data);
      //   if (!err) {
      //     // console.log('my data');
      //     // console.log(data);

      //     let buf = Buffer.from(data.Body);
      //     let base64 = buf.toString('base64');

      //     res.json({
      //       image: 'data:' + data.ContentType + ';base64,' + base64,
      //     });
      //   }
      // });

      userImage(res, req.user.id);
    } else {
      throw new Error('You are not logged in');
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

exports.getS3UserImageById = (req, res) => {
  try {
    if (req.user.role === 'admin') {
      console.log('Trying to get User image');
      userImage(res, req.params.id);
    } else {
      throw new Error('You are not an Admin');
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

// exports.userImage = userImage;
