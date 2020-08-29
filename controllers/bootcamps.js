// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200);
  res.json({success: true, msg: "show all bootcamps"});
}

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200);
  res.json({success: true, msg: `display bootcamp ${req.params.id}`});
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = (req, res, next) => {
  res.status(200);
  res.json({success: true, msg: "create new bootcamp"});
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200);
  res.json({success: true, msg: `update bootcamp ${req.params.id}`});
}

// @desc    Delete bootcamp
// @route   DELECT /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200);
  res.json({success: true, msg: `delete bootcamp ${req.params.id}`});
}