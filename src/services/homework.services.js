const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Homework } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Homework
 * @param {Object} HomeworkBody
 * @returns {Promise<Homework>}
 */
const createHomework = async (HomeworkBody) => {
  return Homework.create(HomeworkBody);
};

/**
 * Homework for board
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHomework = async (filter, options) => {
  const getallHomework = await Homework.paginate(filter, options);
  return getallHomework;
};

/**
 * Get homework by id
 * @param {ObjectId} id
 * @returns {Promise<Homework>}
 */
const getHomeworkById = async (id) => {
  return Homework.findById(id);
};

/**
 * Get homework by filter
 * @param {ObjectId} boardId
 * @param {ObjectId} mediumId
 * @param {ObjectId} bookId
 * @param {ObjectId} chapterId
 * @param {ObjectId} subjectId
 * @param {ObjectId} classId
 * @returns {Promise<Homework>}
 */
const getHomeworkByFilterId = async (boardId, mediumId, classId, subjectId, bookId, chapterId, search, options) => {
  const filter = {};

  // If boardId, mediumId, and classId are provided, filter by them
  if (boardId) filter.boardId = boardId;
  if (mediumId) filter.mediumId = mediumId;
  if (classId) filter.classId = classId;
  if (subjectId) filter.subjectId = subjectId;
  if (bookId) filter.bookId = bookId;
  if (chapterId) filter.chapterId = chapterId;
  // If search is provided, apply global search on `name`
  if (search) {
    filter.Question = { $regex: search, $options: 'i' };
  }

  // Fetch data with pagination
  return Homework.paginate(filter, options);
  //return Homework.find({ boardId, mediumId, classId, bookId, subjectId, chapterId });
};

const answerTypeWiseByChapterId = async (chapterId) => {
  // Use the $group operator to group the documents by answerType and create an array of objects
  const data = await Homework.aggregate([
    {
      $match: { chapterId: mongoose.Types.ObjectId(chapterId) },
    },
    {
      $group: {
        _id: '$answerType',
        data: { $push: '$$ROOT' },
      },
    },
  ]);
  // Organize the result into an object with answerType as keys
  const result = {};
  data.forEach((item) => {
    result[item._id] = item.data;
  });
  return result;
};

/**
 * Update homework by id
 * @param {ObjectId} homeworkId
 * @param {Object} updateBody
 * @returns {Promise<Homework>}
 */
const updateHomeworkById = async (homeworkId, updateBody) => {
  const updateHomework = await getHomeworkById(homeworkId);
  if (!updateHomework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  Object.assign(updateHomework, updateBody);
  await updateHomework.save();
  return updateHomework;
};

/**
 * Delete Homework by id
 * @param {ObjectId} HomeworkId
 * @returns {Promise<Homework>}
 */
const deleteHomeworkById = async (HomeworkId) => {
  const deleteHomework = await getHomeworkById(HomeworkId);
  if (!deleteHomework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  await deleteHomework.remove();
  return deleteHomework;
};

module.exports = {
  createHomework,
  queryHomework,
  getHomeworkByFilterId,
  getHomeworkById,
  answerTypeWiseByChapterId,
  updateHomeworkById,
  deleteHomeworkById,
};
