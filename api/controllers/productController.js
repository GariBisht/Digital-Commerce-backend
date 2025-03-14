
const resModel = require('../lib/resModel');
const productServices = require('../services/product.services');
let Category = require("../models/productCategory");
const Product = require("../models/product");
const Wishlist = require("../models/productWishlist");
const mongoose = require("mongoose");

/**
 * @api {post} /api/category/add Add Category section
 * @apiName Add Category
 * @apiGroup Category
 * @apiBody {String} name  Category Name.
 * @apiBody {String} description Category Description.
 * @apiDescription Category Service...
 * @apiSampleRequest http://localhost:2001/api/category/add
 */
module.exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let categoryName = name.toLowerCase()
        const categoryCheck = await Category.findOne({ name: categoryName });
        if (categoryCheck) {
            resModel.success = false;
            resModel.message = "Category  Already Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        } else {
            let categoryInfo = {
                name: categoryName,
                description: description,
                isActive: true,

            }
            const newCategory = new Category(categoryInfo);
            let categoryRes = await newCategory.save();
            if (categoryRes) {
                resModel.success = true;
                resModel.message = "Category Added Successfully";
                resModel.data = categoryRes
                res.status(201).json(resModel)

            } else {
                resModel.success = false;
                resModel.message = "Error while Adding category";
                resModel.data = null;
                res.status(400).json(resModel);
            }
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);

    }
}

/**
 * @api {put} /api/category/update/:id Update Category
 * @apiName Update Category
 * @apiGroup Category
 * @apiParam {String} id Category ID.
 * @apiBody {String} name Category Name.
 * @apiBody {String} description Category Description.
 * @apiDescription Update an existing category by ID.
 * @apiSampleRequest http://localhost:2001/api/category/update/:id
 */
module.exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id;
        const { name, description } = req.body;
        let category = await Category.findById(_id);
        if (!category) {
            resModel.success = false;
            resModel.message = "Category not found";
            resModel.data = null;
            res.status(400).json(resModel);
        }
        category.name = name ? name.toLowerCase() : category.name;
        category.description = description || category.description;
        let updatedCategory = await Category.findByIdAndUpdate(_id, { $set: category },
            { new: true, runValidators: true });
        if (updatedCategory) {
            resModel.success = true;
            resModel.message = "Category Updated Successfully";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = true;
            resModel.message = "Error While Category Updating";
            resModel.data = null;
            res.status(400).json(resModel);
        }

    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {get} /api/category/getAllCategory  Get All Category
 * @apiName Get All Category
 * @apiGroup Category
 * @apiDescription Category Service...
 * @apiSampleRequest http://localhost:2001/api/category/getAllCategory
 */
module.exports.getAllCategory = async (req, res) => {
    try {
        const categoryRes = await productServices().getAllCategory(req.query);
        if (categoryRes) {
            resModel.success = true;
            resModel.message = "Get All Category Successfully";
            resModel.data = categoryRes;
            res.status(200).json(resModel);
        }
        else {
            resModel.success = false;
            resModel.message = "Category  Not Found";
            resModel.data = [];
            res.status(200).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}
/**
 * @api {delete} /api/category/delete/:id  Delete Category
 * @apiName Delete Category
 * @apiGroup Category
 * @apiDescription Category Service...
 * @apiSampleRequest http://localhost:2001/api/category/delete/:id
 */
module.exports.deleteCategory = async (req, res) => {
    try {
        let id = req.params.id
        let _id = id
        let category = await Category.findById(_id);
        if (!category) {
            resModel.success = false;
            resModel.message = "Category not found";
            resModel.data = null;
            res.status(400).json(resModel);
        }
        const categoryRes = await Category.findByIdAndDelete(_id);
        if (categoryRes) {
            resModel.success = true;
            resModel.message = "Category Delete Successfully";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While Category Deleting";
            resModel.data = null;
            res.status(400).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}

/**
 * @api {get} /api/category/details/:id  Details Category
 * @apiName Details Category
 * @apiGroup Category
 * @apiDescription Category Service...
 * @apiSampleRequest http://localhost:2001/api/category/details/:id
 */
module.exports.detailsCategory = async (req, res) => {
    try {
        let id = req.params.id
        let _id = id
        const categoryRes = await Category.findById(_id);
        if (categoryRes) {
            resModel.success = true;
            resModel.message = "Category Deatils Found Successfully";
            resModel.data = categoryRes;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Category Not Found";
            resModel.data = null;
            res.status(400).json(resModel)
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
}




/**
 * @api {post} /api/product/add Add Product
 * @apiName AddProduct
 * @apiGroup Product
 *
 * @apiBody {String} category_id Category ID.
 * @apiBody {String} product_name Product Name.
 * @apiBody {Number} price Product Price.
 * @apiBody {Object[]} sizes Array of sizes and their quantities.
 * @apiBody {String} sizes.size Size (S, M, L, XL, XXL).
 * @apiBody {Number} sizes.quantity Quantity of the respective size.
 * @apiBody {String[]} images Array of product image URLs.
 * @apiBody {String} description Product Description.
 * 
 * @apiDescription This API is used to add a new product.
 * 
 * @apiSampleRequest http://localhost:2001/api/product/add
 */
module.exports.addProduct = async (req, res) => {
    try {
        const { product_name, price, sizes, images, description, category_id } = req.body;
        const productExists = await Product.findOne({ product_name: product_name.toLowerCase() });
        if (productExists) {
            resModel.success = false;
            resModel.message = "Product Already Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        } else {
            const newProduct = new Product({
                product_name: product_name.toLowerCase(),
                price,
                sizes,
                images,
                description: description.toLowerCase(),
                category_id
            });

            // Save product in database
            const savedProduct = await newProduct.save();
            if (savedProduct) {
                resModel.success = true;
                resModel.message = "Product Added successfully";
                resModel.data = savedProduct;
                res.status(201).json(resModel);
            } else {
                resModel.success = false;
                resModel.message = "Error While Product Adding";
                resModel.data = savedProduct;
                res.status(201).json(resModel);
            }
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};




/**
 * @api {put} /api/product/update/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Product

 * @apiParam {String} id Product ID.
 * @apiParam {String} category_id Category ID.
 * 
 * @apiBody {String} [product_name] Product Name.
 * @apiBody {Number} [price] Product Price.
 * @apiBody {Object[]} [sizes] Array of sizes and their quantities.
 * @apiBody {String} sizes.size Size (S, M, L, XL, XXL).
 * @apiBody {Number} sizes.quantity Quantity of the respective size.
 * @apiBody {String[]} [images] Array of product image URLs.
 * @apiBody {String} [description] Product Description.
 * 
 * @apiDescription This API updates an existing product.
 * 
 * @apiSampleRequest http://localhost:2001/api/product/update/:id
 */
module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        const { product_name, price, sizes, images, description, category_id } = req.body;
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
            resModel.success = false;
            resModel.message = "Product Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        product_name: product_name.toLowerCase() || existingProduct.product_name,
                        price: price || existingProduct.price,
                        sizes: sizes || existingProduct.sizes,
                        images: images || existingProduct.images,
                        description: description || existingProduct.description,
                        category_id: category_id
                    }
                },
                { new: true, runValidators: true } // Return updated product & validate input
            );
            if (updatedProduct) {
                resModel.success = true;
                resModel.message = "Product updated successfully";
                resModel.data = updatedProduct;
                res.status(200).json(resModel);
            } else {
                resModel.success = false;
                resModel.message = "Error While Product Updating";
                resModel.data = null;
                res.status(400).json(resModel)
            }
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};



/**
 * @api {get} /api/product/details/:id Get Product Details
 * @apiName GetProductDetails
 * @apiGroup Product
 * 
 * @apiParam {String} id Product ID.
 * 
 * @apiDescription This API fetches product details by ID.
 * 
 * @apiSampleRequest http://localhost:2001/api/product/details/:id
 */
module.exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Find product by ID
        const product = await Product.findById(_id);
        if (!product) {
            resModel.success = false;
            resModel.message = "Product Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel)
        } else {
            resModel.success = true;
            resModel.message = "Product Details Fetched Successfully";
            resModel.data = product;
            res.status(200).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel)
    }
};



/**
 * @api {delete} /api/product/delete/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Product
 * 
 * @apiParam {String} id Product ID.
 * 
 * @apiDescription This API deletes a product by ID.
 * 
 * @apiSampleRequest http://localhost:2001/api/product/delete/:id
 */
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let _id = id
        // Check if the product exists
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
            resModel.success = false;
            resModel.message = "Product Does't Exists";
            resModel.data = null;
            res.status(400).json(resModel);
        }
        let deleteRes = await Product.findByIdAndDelete(_id);
        if (deleteRes) {
            resModel.success = true;
            resModel.message = "Product Deleted Successfully";
            resModel.data = null;
            res.status(200).json(resModel);
        } else {
            resModel.success = false;
            resModel.message = "Error While Product Deleting";
            resModel.data = null;
            res.status(400).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};


/**
 * @api {get} /api/product/list Get All Products
 * @apiName GetAllProducts
 * @apiGroup Product
 * 
 * @apiQuery {Number} [page=1] Page number for pagination.
 * @apiQuery {Number} [limit=10] Number of products per page.
 * @apiQuery {String} [search] Search keyword (matches product_name and description).
 * @apiQuery {String} [sortField=createdAt] Field to sort by (e.g., price, product_name).
 * @apiQuery {String} [sortOrder=desc] Sorting order (asc or desc).
 * 
 * @apiDescription This API fetches all products with pagination, search, and sorting.
 * 
 * @apiSampleRequest http://localhost:2001/api/product/list
 */
module.exports.getAllProducts = async (req, res) => {
    try {
        let { pageNumber = 1, pageSize = 10, search = "", sortField = "createdAt", sortOrder = "desc" } = req.query;
        page = parseInt(pageNumber);
        limit = parseInt(pageSize);
        let searchFilter = {};
        if (search) {
            searchFilter = {
                $or: [
                    { product_name: { $regex: search, $options: "i" } }, // Search in product name
                    { description: { $regex: search, $options: "i" } } // Search in description
                ]
            };
        }

        // Sorting
        let sortOptions = {};
        sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

        // Fetch products with pagination, search & sorting
        const products = await Product.find(searchFilter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count for pagination metadata
        const totalProducts = await Product.countDocuments(searchFilter);
        if (products.length > 0) {
            resModel.success = true;
            resModel.message = "Products Fetched Successfully";
            resModel.data = {
                products,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalProducts / limit),
                    totalProducts,
                }
            };
            res.status(200).json(resModel);
        } else {
            resModel.success = true;
            resModel.message = "Products Not Found";
            resModel.data = []
            res.status(200).json(resModel);
        }

    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
* @api {get} /api/product/category-list Get Product by Categories
* @apiName Get Product by Categories
* @apiGroup Product
* 
* @apiQuery {Number} [page=1] Page number for pagination.
* @apiQuery {Number} [limit=10] Number of products per page.
* @apiQuery {String} [search] Search keyword (matches category_name and product_name).
* @apiQuery {String} [sortField=createdAt] Field to sort by (e.g., category_name, product_name).
* @apiQuery {String} [sortOrder=desc] Sorting order (asc or desc).
* @apiQuery {String} [categoryId] categoryId 
* 
* @apiDescription This API fetches categories with associated products using aggregation.
* 
* @apiSampleRequest http://localhost:2001/api/product/category-list
*/
module.exports.getCategoryByProduct = async (req, res) => {
    try {
        let {
            pageNumber = 1,
            pageSize = 10,
            productPage = 1,
            productLimit = 5,
            search = "",
            sortField = "createdAt",
            sortOrder = "desc",
            categoryId
        } = req.query;

        const page = parseInt(pageNumber);
        const limit = parseInt(pageSize);
        const productPageNum = parseInt(productPage);
        const productLimitNum = parseInt(productLimit);

        let searchFilter = {};
        if (search) {
            searchFilter = {
                $or: [
                    { "category_name": { $regex: search, $options: "i" } }
                ]
            };
        }

        let matchFilter = {};
        if (categoryId) {
            matchFilter._id = new mongoose.Types.ObjectId(categoryId);
        }

        // Sorting
        let sortOptions = {};
        sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

        // Aggregation pipeline for joining categories with paginated products
        const categories = await Category.aggregate([
            { $match: matchFilter },  // Filter by categoryId if provided
            {
                $lookup: {
                    from: "products", // Collection name in MongoDB
                    localField: "_id",
                    foreignField: "category_id",
                    as: "products"
                }
            },
            {
                $addFields: {
                    totalProducts: { $size: "$products" },
                    products: {
                        $slice: ["$products", (productPageNum - 1) * productLimitNum, productLimitNum]
                    } // Apply pagination on products
                }
            },
            { $match: searchFilter }, // Apply search filter
            { $sort: sortOptions },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        // Get total count for pagination metadata
        const totalCategories = await Category.countDocuments(matchFilter);

        if (categories.length > 0) {
            resModel.success = true;
            resModel.message = "Categories Fetched Successfully";
            resModel.data = {
                categories,
                productPagination: {
                    currentProductPage: productPageNum,
                    productsPerPage: productLimitNum,
                }
            };
            res.status(200).json(resModel);
        } else {
            resModel.success = true;
            resModel.message = "Categories Not Found";
            resModel.data = [];
            res.status(200).json(resModel);
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};

/**
 * @api {post} /api/product/wishlist Product Wishlist
 * @apiName Product Wishlist
 * @apiGroup Wishlist
 * 
 * @apiBody {String} user_id User ID of the person adding/removing the product from the wishlist.
 * @apiBody {String} product_id Product ID to be added/removed from the wishlist.
 * 
 * @apiDescription This API allows users to toggle a product in their wishlist. If the product is already in the wishlist, it will be removed; otherwise, it will be added.
 * @apiSampleRequest http://localhost:2001/api/product/wishlist
*/

module.exports.productWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        // Check if product exists
        const productExists = await Product.findById(product_id);
        if (!productExists) {
            resModel.success = false;
            resModel.message = "Product Does't Not Exists";
            resModel.data = null;
            res.status(404).json(resModel);
        }

        // Check if already in wishlist
        const existingWishlist = await Wishlist.findOne({ user_id, product_id });

        if (existingWishlist) {
            // Remove from wishlist if exists
            await Wishlist.findOneAndDelete({ user_id, product_id });
            resModel.success = true;
            resModel.message = "Product removed from wishlist";
            resModel.data = []
            res.status(200).json(resModel);
        } else {
            // Add to wishlist if not exists
            const wishlistItem = new Wishlist({ user_id, product_id });
            
            await wishlistItem.save();
            return res.status(201).json({
                success: true,
                message: "Product added to wishlist",
                // Indicating product is now added
                data: [wishlistItem]
            });
        }
    } catch (error) {
        resModel.success = false;
        resModel.message = "Internal Server Error";
        resModel.data = null;
        res.status(500).json(resModel);
    }
};



