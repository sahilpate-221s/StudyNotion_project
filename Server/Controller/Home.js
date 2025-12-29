const Category = require("../Model/Category");
const RatingAndReview = require("../Model/RatingAndReview");

exports.getHomeData = async (req, res) => {
  try {
    const [categories, reviews] = await Promise.all([
      Category.find().populate("courses"),
      RatingAndReview.find()
        .sort({ rating: -1 })
        .populate("user", "firstName lastName image")
        .populate("course", "courseName"),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        categories,
        reviews,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load homepage data",
    });
  }
};
