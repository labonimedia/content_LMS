const express = require('express');
const validate = require('../../middlewares/validate');
const { lectureVideoController } = require('../../controllers');
const { lectureVideoValidation } = require('../../validations');
// const { upload } = require('../../utils/cdn');

const router = express.Router();

router
  .route('/')
  .post(validate(lectureVideoValidation.createLession), lectureVideoController.createLectureVideo)
  .get(validate(lectureVideoValidation.getLessions), lectureVideoController.queryLectureVideos);

router
  .route('/:lectureId')
  .get(validate(lectureVideoValidation.getLession), lectureVideoController.getLectureVideo)
  .patch(validate(lectureVideoValidation.updateLession), lectureVideoController.updateLectureVideo)
  .delete(validate(lectureVideoValidation.deleteLession), lectureVideoController.deleteLectureVideo);

router
  .route('/getallLession/:chapterId')
  .get(validate(lectureVideoValidation.getLessionbychapterId), lectureVideoController.getLectureVideobychapId);

router
  .route('/filter/:boardId/:mediumId/:classId/:subjectId/:bookId/:chapterId')
  .get(validate(lectureVideoValidation.getLessionByFilter), lectureVideoController.getLectureVideoByFilter);

module.exports = router;
