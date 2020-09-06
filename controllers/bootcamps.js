const { omit } = require('ramda');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = req.query; 
  const fieldsToRemove = ['select', 'sort', 'limit', 'page'];

  const qs = JSON.stringify(omit(fieldsToRemove, reqQuery));
  const formattedQs = qs.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  const selectFields = reqQuery.select ? reqQuery.select.split(',').join(' ') : '' 
  const sortFields = reqQuery.sort ? reqQuery.sort.split(',').join(' ') : '-createdAt'

  // pagination
  const limit = reqQuery.limit ? parseInt(reqQuery.limit) : 20;
  const page = reqQuery.page ? parseInt(reqQuery.page) : 1;
  const skip = (page - 1) * limit;

  const bootcamps = await Bootcamp
                            .find(JSON.parse(formattedQs))
                            .select(selectFields)
                            .sort(sortFields)
                            .skip(skip)
                            .limit(limit);

  // add count and pagination to results
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  const nextPage = endIndex < total && { page: page + 1, limit };
  const prev = skip > 0 && { page: page - 1, limit };

  const pagination = {
    ...(nextPage && { next: nextPage }),
    ...(prev && {prev})
  }


  res.status(200);
  res.json({
    success: true,
    msg: "show all bootcamps",
    data: bootcamps,
    totalCount: total,
    pagination
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
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${id} not found`, 404));
  }
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