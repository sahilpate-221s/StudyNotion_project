const Category = require("../Model/Category");
const cacheService = require("../Util/CacheService");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategorysDetails);
    
    // Invalidate category cache after creation
    await cacheService.invalidatePattern('category:*');
    
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await cacheService.cacheOrExecute(
      cacheService.generateKey('category', 'all'),
      async () => {
        return await Category.find().populate("courses");
      },
      3600 // 1 hour TTL
    );
    
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const result = await cacheService.cacheOrExecute(
      cacheService.generateKey('category', 'page', categoryId),
      async () => {
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
          })
          .exec();

        if (!selectedCategory) {
          return null;
        }

        if (selectedCategory.courses.length === 0) {
          return { noCourses: true };
        }

        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        });
        let differentCategory = await Category.findOne(
          categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
          .populate({
            path: "courses",
            match: { status: "Published" },
          })
          .exec();

        const allCategories = await Category.find()
          .populate({
            path: "courses",
            match: { status: "Published" },
          })
          .exec();
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 10);

        return {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        };
      },
      1800 // 30 minutes TTL
    );

    if (!result) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (result.noCourses) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
