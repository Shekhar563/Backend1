import Blog from "../models/blogs.models.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;

    if (!title || !content || isPublished === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    const author = req.user?._id;
    if (!author) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    const featureImageLocalPath =  req.files?.featureImage[0]?.path;
    if (!featureImageLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Feature image is required",
      });
    }

    const uploadedImage = await UploadOnCloudinary(featureImageLocalPath);
    if (!uploadedImage || !uploadedImage.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      isPublished,
      author,
      featureImage: uploadedImage.url,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error while creating blog",
      error: error.message,
    });
  }
};



// get -all blogs
const getAllBlogs = async( req, res)=>{
        try {
               const blogs = await Blog.find().populate("author", "name , avatar").sort({createdAt: -1}) 
               return res.status(200).json({
                success: true,
                message: "All blogs fetched successfully",
                blogs
               })
        } catch (error) {
              res.status(400).json({
                success: false,
                message: "Server Error while getting all blogs",
                error: error.message    
              })  
        }
}


// get-blog-by-id
const getBlogByID = async (req, res) => {
        try {
          const blogId = req.params.id;
      
          if (!blogId) {
            return res.status(400).json({
              success: false,
              message: "Blog ID is required",
            });
          }
      
          const blog = await Blog.findById(blogId).populate("author", "name avatar");
      
          if (!blog) {
            return res.status(404).json({
              success: false,
              message: "Blog not found",
            });
          }
      
          return res.status(200).json({
            success: true,
            message: `${blog.title} fetched successfully`,
            blog,
          });
      
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Server Error while getting blog by ID",
            error: error.message,
          });
        }
      };
// update-blog
const updateBlog = async(req, res)=>{
        try {
                const blogId= req.params.id
                const {title, content, isPublished} = req.body
                const userId = req.user._id
                if(!blogId){
                        return res.status(400).json({
                                success: false,
                                message: "Blog not found"
                        })
                }

                 const blog = await Blog.findById(blogId)
                 if(!blog){
                        return res.status(400).json({
                                success: false,
                                message: "Blog not found"
                        })
                 }      
                 if(blog.author.toString() === ! userId.toString()){
                        return res.status(401).json({
                                success: false,
                                message: "Unauthorized! not allow to update"
                        })      
                 }
                 if(title){
                        blog.title = title
                 }
                 if(content){
                        blog.content = content
                 }
                 if(isPublished !== undefined){
                        blog.isPublished = isPublished
                 }
                 const featureImageLocalPath = req.files?.featureImage?.[0]?.path;
                 if (featureImageLocalPath) {
                   const uploadedImage = await UploadOnCloudinary(featureImageLocalPath);
                   if (!uploadedImage || !uploadedImage.url) {
                     return res.status(500).json({
                       success: false,
                       message: "Failed to upload new feature image to Cloudinary",
                     });
                   }
                   blog.featureImage = uploadedImage.url;
                 }
                 await blog.save()      
                 return res.status(200).json({
                        success: true,
                        message: "Blog updated successfully",
                        blog
                 })
        } catch (error) {
                res.status(400).json({
                        success: false,
                        message: "Server Error while updating blog",
                        error: error.message
                })
        }
}


// delete
const deleteBlog = async(req, res)=>{
        try {
                const blogId = req.params.id
                const userId = req.user._id
                if(!blogId){
                        return res.status(400).json({
                                success: false,
                                message: "Blog not found"
                        })
                }
                const blog = await Blog.findById(blogId)
                if(!blog){
                        return res.status(400).json({
                                success: false,
                                message: "Blog not found"
                        })
                }
                if(blog.author.toString() === ! userId.toString()){
                        return res.status(401).json({
                                success: false,
                                message: "Unauthorized! not allow to update"
                        })
                }
                await blog.deleteOne()
                return res.status(200).json({
                        success: true,
                        message: "Blog deleted successfully"
                })
        } catch (error) {
                res.status(400).json({
                        success: false,
                        message: "Server Error while deleting blog",
                        error: error.message
                })
        }
}





export {
        createBlog
        , getAllBlogs,
        getBlogByID,
        updateBlog,
        deleteBlog
}