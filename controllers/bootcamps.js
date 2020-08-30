const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200);
    res.json({success: true, msg: "show all bootcamps", data: bootcamps});
  } catch (err) {
    res.status(500).json({ success: false });
  }
}

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
      return res.status(404).json({ success: false })
    }
    res.status(200);
    res.json({success: true, msg: `display bootcamp ${id}`, data: bootcamp});
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201);
    res.json({success: true, data: bootcamp, msg: "create new bootcamp"});
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
    if (!bootcamp) {
      return res.status(404).json({ success: false })
    }    
    res.status(200);
    res.json({success: true, msg: `update bootcamp ${id}`, data: bootcamp});
  } catch (err) {
    res.status(400).json({ success: false });
  }
}

// @desc    Delete bootcamp
// @route   DELECT /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const id = req.params.id;
    const bootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!bootcamp) {
      return res.status(404).json({ success: false })
    }
    res.status(200);
    res.json({success: true, msg: `delete bootcamp ${req.params.id}`});
  } catch (err) {
    res.status(400).json({ success: false });
  }
}