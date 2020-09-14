const { omit } = require('ramda');

const advancedResults = (model, populate) => async (req, res, next) => {
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

  const results = await model
                          .find(JSON.parse(formattedQs))
                          .populate(populate)
                          .select(selectFields)
                          .sort(sortFields)
                          .skip(skip)
                          .limit(limit);

  // add count and pagination to results
  const endIndex = page * limit;
  const total = await model.countDocuments();
  const nextPage = endIndex < total && { page: page + 1, limit };
  const prev = skip > 0 && { page: page - 1, limit };

  const pagination = {
    ...(nextPage && { next: nextPage }),
    ...(prev && {prev})
  }


  res.status(200);
  res.advancedResults = {
    success: true,
    data: results,
    totalCount: total,
    pagination
  };

  next();
}

module.exports = advancedResults;