const { default: mongoose, mongo } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndRaview");

exports.createRatingAndReview = async function (req, res) {
  try {
    let { rating, review, courseId } = req.body;
    let userId = req.user.id;
    userId = new mongoose.Types.ObjectId(userId);
    courseId = new mongoose.Types.ObjectId(courseId);
    const checkStudentEnroll = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $in: [userId] },
    });

    if (!checkStudentEnroll) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized",
      });
    }

    const checkAlreadyReview = await RatingAndReview.findOne({
      course: courseId, 
      user: userId,
    });
    console.log("check", checkAlreadyReview);

    if (checkAlreadyReview) {
      return res.status(401).json({
        success: false,
        message: "User has already reviewed this course",
      });
    }

    const ratingAndReviews = await RatingAndReview.create({
      rating: rating,
      review: review,
      course: courseId,
      user: userId,
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingAndReviews._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourse);
    return res.status(200).json({
      success: true,
      message: "Rating and Review Created Successfully",
      ratingAndReview: ratingAndReviews,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `Something Went Wrong while creating a new Rating and Review`,
      error: e.message,
    });
  }
};

exports.getAvarageRating = async (req, res) => {
  try {
    const { courseId } = req.body;
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          avarageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Avarage Rating Fetched Successfully",
        avarageRating: result[0].avarageRating,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Avarage Rating Fetched Successfully",
        avarageRating: 0,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: `Something Went Wrong while fetching avarage rating`,
      error: e.message,
    });
  }
};

exports.getAllRatingAndReviews = async (req, res) => {
  try {
    const allRatingAndReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "User",
        select: "image email lastName firstName",
      })
      .populate({
        path: "Course",
        select: "courseName",
      })
      .exce();
    return res.status(200).json({
      success: true,
      message: "All Rating and Reviews Fetched Successfully",
      allRatingAndReviews: allRatingAndReviews,
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: `Something Went Wrong while fetching all Rating and Reviews`,
      error: e.message,
    });
  }
};

// find reating for any spcific course
