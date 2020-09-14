const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  

  res.status(200);
  res.json({
    ...res.advancedResults,
    msg: "show all bootcamps"
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${id} not found`, 404));
  }
  res.status(200);
  res.json({success: true, msg: `display bootcamp ${id}`, data: bootcamp});
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201);
  res.json({success: true, data: bootcamp, msg: "create new bootcamp"});
})

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${id} not found`, 404));
  }    
  res.status(200);
  res.json({success: true, msg: `update bootcamp ${id}`, data: bootcamp});
})

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${id} not found`, 404));
  }
  bootcamp.remove();
  
  res.status(200);
  res.json({success: true, msg: `delete bootcamp ${req.params.id}`});
})

// @desc    Get bootcamp in radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  // earth radius is 3963 miles
  const radius = distance / 3963;

  const bootcampsInRadius = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcampsInRadius.length,
    data: bootcampsInRadius,
    message: `Successfully retrieved bootcamps within ${distance} miles of ${zipcode}`
  });
})

// @desc    Upload photos for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found: ${id}`, 404));
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  const { MAX_FILE_UPLOAD, FILE_UPLOAD_PATH } = process.env;
  if (!file.size > MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image smaller than ${MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });
  });
  res.status(200).json({
    success: true,
    data: file.name,
  });
});