const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const homeworkSchema = mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    answerType: {
      type: String,
      enum: ['Very Short Answer', 'Long Answer', 'Short Answer'],
    },
    boardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'board',
      required: true,
    },
    mediumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'medium',
      required: true,
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'class',
      required: true,
    },
    bookId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book',
      required: true,
    },
    subjectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'subject',
      required: true,
    },
    chapterId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'chapter',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
homeworkSchema.plugin(toJSON);
homeworkSchema.plugin(paginate);

const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;
