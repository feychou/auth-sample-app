const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URI, options);

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`))

// import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch(err) {
    console.error(err)
  }
}

// delete from DB

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch(err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  return importData()
} else if (process.argv[2] === '-d') {
  deleteData()  
} else {
  console.log('Please provide a valid flag'.blue.inverse)
}

