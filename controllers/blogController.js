const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");

const getAllBlogs = async (req, res, next) => {
  let allBlogs;
  try {
    allBlogs = await Blog.find();
    if (!allBlogs) {
      return res.status(404).json({ message: "No Blogs Found!" });
    }
  } catch (error) {
    return console.log(error);
  }

  return res.status(200).json({ allBlogs });
};

const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (error) {
    return console.log(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find user by this id" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
  return res.status(201).json({ blog });
};

const updateBlog = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, description } = req.body;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
    if (!blog) {
      return res.status(500).json({ message: "Unable to update the blog" });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    return console.log(error);
  }
};

const getBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findById({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog Not Found!" });
    }
    return res.status(200).json({ blog });
  } catch (error) {
    return console.log(error);
  }
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndDelete({ _id: blogId }).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    if (!blog) {
      return res.status(400).json({ message: "Somthing Went! Wrong" });
    }
  } catch (error) {
    return console.log(error);
  }
  return res.status(200).json({ message: "Blog Deleted" });
};

const getUserBlogs = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
    if (!userBlogs) {
      return res.status(404).json({ message: "No Blogs Found!" });
    }
    return res.status(200).json({ blogs: userBlogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getUserBlogs,
};
