const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/tags");
const { cloudinaryImageUploader } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    let {
      course,
      courseDescription,
      // whatYouWillLearn,
      price,
      tag,
      category,
      instructions,
      benefitOfCourse
    } = req.body;
    const thumbnail = req.files.thumbnailImage;
    if (
      !course ||
      !courseDescription ||
      !price ||
      !tag ||
      !category || 
      !thumbnail ||
      !instructions ||
      !benefitOfCourse
    ) {
      return res.status(404).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    const instructorId = req.user.id;
    if(typeof category === "string") category = JSON.parse(category)
    if(typeof instructions === "string") instructions = JSON.parse(instructions)
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: `Tag Not Found`,
      });
    }

    const cloudinaryImage = await cloudinaryImageUploader(
      thumbnail,
      process.env.FOLDER_NAME
    );
    const newCourse = await Course.create({
      courseName: course,
      courseDescription,
      price,
      benefitOfCourse , 
      thumbnail: cloudinaryImage.secure_url,
      instructor: instructorId,
      instructions: instructions,
      tag: tagDetails._id,
      category: category,
    });

    // add the new course to the list of instructor courses

    const updatedUser = await User.findByIdAndUpdate(
      { _id: instructorId },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // update tag with updated course
    const updatedTag = await Tag.findByIdAndUpdate(
      { _id: tagDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: `Course Created Successfully`,
      course: newCourse,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Something Went Wrong while creating a new Course`,
      error: e.message,
    });
  }
};



// so much imporvement is needed in this controller i will do that later
exports.updateCourseDetails = async (req , res) => {
    try{
      let {
        _id , 
        course,
        courseDescription,
        // whatYouWillLearn,
        price,
        tag,
        category,
        instructions,
        benefitOfCourse
      } = req.body;
      const thumbnail = req.files?.thumbnailImage;
      console.log(thumbnail);
      if (
        !_id ||
        !course ||
        !courseDescription ||
        !price ||
        !tag ||
        !category || 
        !instructions ||
        !benefitOfCourse
      ) {
        return res.status(404).json({
          success: false,
          message: `Please Fill up All the Required Fields`,
        });
      }
      const instructorId = req.user.id;
      if(typeof category === "string") category = JSON.parse(category)
      if(typeof instructions === "string") instructions = JSON.parse(instructions)
      
  
      let cloudinaryImage;
      if(thumbnail !== undefined){
        cloudinaryImage = await cloudinaryImageUploader(
        thumbnail,
        process.env.FOLDER_NAME
      );
      cloudinaryImage = cloudinaryImage.secure_url;
      }else{
        console.log(req.body.thumbnailImage)
        
        if(req.body.thumbnailImage === undefined){
          return res.json(401).status({
            message : "Thumbnail is required" , 
            success : false ,
          })
        }
        cloudinaryImage = req.body.thumbnailImage;
      }
      console.log(cloudinaryImage);
      const tagDetails = await Tag.findById(tag);
      if (!tagDetails) {
        return res.status(404).json({
          success: false,
          message: `Tag Not Found`,
        });
      }
      const courseDetails = await Course.findById(_id).populate({
        path : "courseContent" , 
        populate : {
          path : "subSection" , 
          model : "SubSection"
        }
      });
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }
      if(String(courseDetails.tag) !== String(tag)){
         await Tag.findByIdAndUpdate(courseDetails.tag , {
          $pull :{
            courses : courseDetails._id , 
          }
         })
         await Tag.findByIdAndUpdate( tag , {
          $push :{
            courses : courseDetails._id , 
          }
         })
      }
    courseDetails.course = course;
    courseDetails.courseDescription = courseDescription;
    courseDetails.price = price;
    courseDetails.category = category;
    courseDetails.instructions = instructions;
    courseDetails.benefitOfCourse = benefitOfCourse;
    courseDetails.thumbnail = cloudinaryImage;
    courseDetails.tag = tagDetails._id; 
    await courseDetails.save();
    const updatedCourseDetails = await Course.findById(_id).populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .populate("ratingAndReviews")
    .populate("tag")
    .exec();
    
    console.log("courseDetails is : " , courseDetails.thumbnail)
    return res.status(200).json({
      success : true , 
      message : "Course is Successfully Updated 😍😍", 
      upDatedcourse : updatedCourseDetails , 
    })
    }catch(e){
      return res.status(505).json({
        success : false , 
        error : e.message , 
        message : "error occure while Course Details Updateing🤦‍♂️"
      })
    }
}

exports.showAllCourse = async function (req, res) {
  try {
    const courses = await Course.find(
      {},
      {
        course: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Something Went Wrong while fetching all courses`,
      error: e.message,
    });
  }
};

exports.getCreatedCourseDetails = async(req , res) => {
  try{
      const { courseId } = req.body;
      if(!courseId) {
        return res.status(501).json({
          success : false , 
          message : "Course Id is Required"
        })
      }
      const createCourseDetails = await Course.findOne(
      {_id : courseId} , 
      {
        course : 1 ,
        courseDescription : 1,
        // whatYouWillLearn : 1,
        price : 1,
        tag : 1,
        category : 1,
        instructions : 1,
        benefitOfCourse : 1
      }).populate("tag").exec();
      
      if(!createCourseDetails){
        return res.status(401).json({
          success: false,
          message: `Course is not Found`,
        });
      }
      
      return res.status(201).json({
        success : true , 
        message : "Course Details is successfully fetched" , 
        data : createCourseDetails
      })
      
  }catch(e){
    return res.status(404).json({
      success: false,
      message: `Something Went Wrong while fetching all courses`,
      error: e.message,
    });
  }
}

exports.getAllCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .populate("ratingAndReviews")
      .populate("tag")
      .exec();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course Not Found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: `Something Went Wrong while fetching all courses`,
      error: e.message,
    });
  }
};
exports.changeMode = async (req, res) => {
  try {
    const { courseId , mode } = req.body;
    if(!courseId || !mode) {
      return res.status(401).json({
        success : false , 
        message : "All Fields are Required"
      })
    }
    const course = await Course.findById(courseId)
    //   .populate({
    //     path: "instructor",
    //     populate: {
    //       path: "additionalDetails",
    //     },
    //   })
    //   .populate({
    //     path: "courseContent",
    //     populate: {
    //       path: "subSection",
    //     },
    //   })
    //   .populate("ratingAndReviews")
    //   .populate("tag")
    //   .exec();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course Not Found`,
      });
    }
    const updatedCourse = await Course.findByIdAndUpdate(courseId , { status : mode});
    console.log(updatedCourse)
    return res.status(200).json({
      success: true,
      message: "Course Mode is successfully Updated",
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: `Something Went Wrong while Change the mode of the courses`,
      error: e.message,
    });
  }
};
