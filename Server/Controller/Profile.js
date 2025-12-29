// const Profile = require("../Model/Profile");
// const CourseProgress = require("../Model/CourseProgress");

// const Course = require("../Model/Course");
// const User = require("../Model/User");
// const { uploadImageToCloudinary } = require("../Util/ImageUploader");
// const mongoose = require("mongoose");
// const { convertSecondsToDuration } = require("../Util/SecToDuration");
// const cacheService = require("../Util/CacheService");

// exports.updateProfile = async (req, res) => {
//   try {
//     const {
//       firstName = "",
//       lastName = "",
//       dateOfBirth = "",
//       about = "",
//       contactNumber = "",
//       gender = "",
//     } = req.body;
//     const id = req.user.id;

//     const userDetails = await User.findById(id);
//     const profile = await Profile.findById(userDetails.additionalDetails);

//     const user = await User.findByIdAndUpdate(id, {
//       firstName,
//       lastName,
//     });
//     await user.save();

//     profile.dateOfBirth = dateOfBirth;
//     profile.about = about;
//     profile.contactNumber = contactNumber;
//     profile.gender = gender;

//     await profile.save();

//     const updatedUserDetails = await User.findById(id)
//       .populate("additionalDetails")
//       .exec();

//     // Invalidate user cache after profile update
//     await cacheService.invalidateUserCache(id);

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       updatedUserDetails,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// exports.deleteAccount = async (req, res) => {
//   try {
//     const id = req.user.id;
//     console.log(id);
//     const user = await User.findById({ _id: id });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     await Profile.findByIdAndDelete({
//       _id: new mongoose.Types.ObjectId(user.additionalDetails),
//     });
//     for (const courseId of user.courses) {
//       await Course.findByIdAndUpdate(
//         courseId,
//         { $pull: { studentsEnroled: id } },
//         { new: true }
//       );
//     }

//     await User.findByIdAndDelete({ _id: id });
//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//     await CourseProgress.deleteMany({ userId: id });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, message: "User Cannot be deleted successfully" });
//   }
// };

// exports.getAllUserDetails = async (req, res) => {
//   try {
//     const id = req.user.id;
    
//     const userDetails = await cacheService.cacheOrExecute(
//       cacheService.generateKey('user', 'profile', id),
//       async () => {
//         return await User.findById(id)
//           .populate("additionalDetails")
//           .exec();
//       },
//       600 // 10 minutes TTL
//     );
    
//     console.log(userDetails);
//     res.status(200).json({
//       success: true,
//       message: "User Data fetched successfully",
//       data: userDetails,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updateDisplayPicture = async (req, res) => {
//   try {
//     const displayPicture = req.files.displayPicture;
//     const userId = req.user.id;
//     const image = await uploadImageToCloudinary(
//       displayPicture,
//       process.env.FOLDER_NAME,
//       1000,
//       1000
//     );
//     console.log(image);
//     const updatedProfile = await User.findByIdAndUpdate(
//       { _id: userId },
//       { image: image.secure_url },
//       { new: true }
//     );
    
//     // Invalidate user cache after image update
//     await cacheService.invalidateUserCache(userId);
    
//     res.send({
//       success: true,
//       message: `Image Updated successfully`,
//       data: updatedProfile,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     const result = await cacheService.cacheOrExecute(
//       cacheService.generateKey('user', 'enrolled', userId),
//       async () => {
//         let userDetails = await User.findOne({
//           _id: userId,
//         })
//           .populate({
//             path: "courses",
//             populate: {
//               path: "courseContent",
//               populate: {
//                 path: "subSection",
//               },
//             },
//           })
//           .exec();
        
//         if (!userDetails) {
//           return null;
//         }
        
//         userDetails = userDetails.toObject();
//         var SubsectionLength = 0;
//         for (var i = 0; i < userDetails.courses.length; i++) {
//           let totalDurationInSeconds = 0;
//           SubsectionLength = 0;
//           for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
//             totalDurationInSeconds += userDetails.courses[i].courseContent[
//               j
//             ].subSection.reduce(
//               (acc, curr) => acc + parseInt(curr.timeDuration),
//               0
//             );
//             userDetails.courses[i].totalDuration = convertSecondsToDuration(
//               totalDurationInSeconds
//             );
//             SubsectionLength +=
//               userDetails.courses[i].courseContent[j].subSection.length;
//           }
//           let courseProgressCount = await CourseProgress.findOne({
//             courseID: userDetails.courses[i]._id,
//             userId: userId,
//           });
//           courseProgressCount = courseProgressCount?.completedVideos.length;
//           if (SubsectionLength === 0) {
//             userDetails.courses[i].progressPercentage = 100;
//           } else {
//             const multiplier = Math.pow(10, 2);
//             userDetails.courses[i].progressPercentage =
//               Math.round(
//                 (courseProgressCount / SubsectionLength) * 100 * multiplier
//               ) / multiplier;
//           }
//         }
        
//         return userDetails.courses;
//       },
//       300 // 5 minutes TTL (shorter because progress changes frequently)
//     );

//     if (!result) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find user with id: ${userId}`,
//       });
//     }
    
//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.instructorDashboard = async (req, res) => {
//   try {
//     const courseData = await cacheService.cacheOrExecute(
//       cacheService.generateKey('instructor', 'dashboard', req.user.id),
//       async () => {
//         const courseDetails = await Course.find({ instructor: req.user.id });

//         return courseDetails.map((course) => {
//           const totalStudentsEnrolled = course.studentsEnroled.length;
//           const totalAmountGenerated = totalStudentsEnrolled * course.price;

//           const courseDataWithStats = {
//             _id: course._id,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             totalStudentsEnrolled,
//             totalAmountGenerated,
//           };

//           return courseDataWithStats;
//         });
//       },
//       600 // 10 minutes TTL
//     );

//     res.status(200).json({ courses: courseData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };




const Profile = require("../Model/Profile");
const CourseProgress = require("../Model/CourseProgress");
const Course = require("../Model/Course");
const User = require("../Model/User");
const { uploadImageToCloudinary } = require("../Util/ImageUploader");
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../Util/SecToDuration");
const cacheService = require("../Util/CacheService");

/* ========================= UPDATE PROFILE ========================= */
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await Profile.findById(user.additionalDetails);

    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();

    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;
    await profile.save();

    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    // ✅ invalidate cached profile
    await cacheService.invalidateUserCache(userId);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

/* ========================= DELETE ACCOUNT ========================= */
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(user.additionalDetails);

    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnroled: id },
      });
    }

    await CourseProgress.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);

    // invalidate cache
    await cacheService.invalidateUserCache(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("deleteAccount error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted",
    });
  }
};

/* ========================= GET USER DETAILS ========================= */
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await cacheService.cacheOrExecute(
      cacheService.generateKey("user", "profile", userId),
      async () => {
        return await User.findById(userId)
          .populate("additionalDetails")
          .exec();
      },
      600
    );

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("getAllUserDetails error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};

/* ========================= UPDATE PROFILE IMAGE ========================= */
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const displayPicture = req.files?.displayPicture;

    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    // invalidate cache
    await cacheService.invalidateUserCache(userId);

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("updateDisplayPicture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
    });
  }
};

/* ========================= GET ENROLLED COURSES ========================= */
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await cacheService.cacheOrExecute(
      cacheService.generateKey("user", "enrolled", userId),
      async () => {
        let userDetails = await User.findById(userId)
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: { path: "subSection" },
            },
          })
          .exec();

        if (!userDetails) return null;

        userDetails = userDetails.toObject();

        for (let course of userDetails.courses) {
          let totalDuration = 0;
          let totalLectures = 0;

          for (const section of course.courseContent) {
            totalDuration += section.subSection.reduce(
              (acc, curr) => acc + Number(curr.timeDuration || 0),
              0
            );
            totalLectures += section.subSection.length;
          }

          course.totalDuration = convertSecondsToDuration(totalDuration);

          const progress = await CourseProgress.findOne({
            courseID: course._id,
            userId,
          });

          const completed = progress?.completedVideos?.length || 0;

          course.progressPercentage =
            totalLectures === 0
              ? 100
              : Math.round((completed / totalLectures) * 100);
        }

        return userDetails.courses;
      },
      300
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getEnrolledCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};

/* ========================= INSTRUCTOR DASHBOARD ========================= */
exports.instructorDashboard = async (req, res) => {
  try {
    const data = await cacheService.cacheOrExecute(
      cacheService.generateKey("instructor", "dashboard", req.user.id),
      async () => {
        const courses = await Course.find({ instructor: req.user.id });

        return courses.map((course) => ({
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          totalStudentsEnrolled: course.studentsEnroled.length,
          totalAmountGenerated:
            course.studentsEnroled.length * course.price,
        }));
      },
      600
    );

    return res.status(200).json({ courses: data });
  } catch (error) {
    console.error("instructorDashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load instructor dashboard",
    });
  }
};
