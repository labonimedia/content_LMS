
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const quizeSchema = mongoose.Schema(
  {
    quizName: {
      type: String,
      index: true,
    },
    displayFormat: {
      type: Number,
      enum: [1, 2, 3]
    },
    questionLevel: {
      type: Number,
      enum: [1, 2, 3]
    },
    questionType: {
      type: Number,
      enum: [1, 2, 3]
    },
    files: {
      type: String,
    },
    options: [{
      A: String,
      B: String,
      C: String,
      D: String
    }],
    correctOptions: [String],
    explain: {
      type: String,
    },
    hint: {
      type: String,
    },
    types: {
      type: String,
      enum: [1, 2, 3],
    },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // marks: {
    //   type: Number,
    // },
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
    // lectureVideoId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'lecturevideo',
    //   required: true,
    // },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
quizeSchema.plugin(toJSON);
quizeSchema.plugin(paginate);

const Quize = mongoose.model('quize', quizeSchema);

module.exports = Quize;