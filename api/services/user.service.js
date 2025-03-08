let User = require("../models/userModel");

const userService = () => {


    const getAllUsers = async (query) => {
        try {
            let page = query.pageNumber || 1
            let limit = query.pageLimit || 10
            const skip = (page - 1) * limit;
            const users = await User.find().skip(skip).limit(limit).sort({ createdAt: -1 }).select('first_name last_name email createdAt');
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users,
                totalUsers,
                totalPages,
                currentPage: page,
                pageSize: users.length,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    };


    return {
        getAllUsers,
    };
}
module.exports = userService;

