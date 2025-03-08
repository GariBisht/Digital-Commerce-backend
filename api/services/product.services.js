let Category = require("../models/productCategory");

const productService = () => {


    const getAllCategory = async (query) => {
        try {
            let page = query.pageNumber || 1
            let limit = query.pageLimit || 10
            const skip = (page - 1) * limit;
            const category = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 })
            const totalcategory = await Category.countDocuments();
            const totalPages = Math.ceil(totalcategory / limit);

            return {
                category,
                totalcategory,
                totalPages,
                currentPage: page,
                pageSize: category.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };


    return {
        getAllCategory,
    };
}
module.exports = productService;

