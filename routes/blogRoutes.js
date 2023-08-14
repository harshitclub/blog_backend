const express = require("express");
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getUserBlogs,
} = require("../controllers/blogController");
const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getUserBlogs);

module.exports = { blogRouter };
