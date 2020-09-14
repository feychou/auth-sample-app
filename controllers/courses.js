const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const bootcamp = req.params.bootcampId;

  if (bootcamp) {
    const courses = await Course.find({ bootcamp });

    return res.status(200).json({
      success: true,
      message: 'show courses',
      count: courses.length,
      data: courses
    });
  }

  res.status(200).json(res.advancedResults)
});

// @desc    Get single course
// @route   GET /api/v1/course/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${id}`),
      404
    )
  }

  return res.status(200).json({
    success: true,
    message: `display bootcamp ${id}`,
    data: course
  });
});

// @desc    Create new course
// @route   POST /api/v1/bootcamps/:id/courses
// @access  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${id}`),
      404
    )
  }

  const course = await Course.create(req.body);

  res.status(201);
  res.json({success: true, data: bootcamp, msg: "create new bootcamp"});
})

// @desc    Update course
// @route   POST /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${id}`),
      404
    )
  }

  const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true,
  });


  res.status(201);
  res.json({success: true, data: updatedCourse, msg: `course with id ${courseId} updated`});
})

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`course with id ${id} not found`, 404));
  }

  await course.remove();
  
  res.status(200);
  res.json({success: true, msg: `deleted course ${id}`});
})