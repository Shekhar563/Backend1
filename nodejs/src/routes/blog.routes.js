import { Router } from "express";
import {jwtAuth} from "../middelware/auth.middelware.js"
import { upload } from "../middelware/multer.middelware.js";
import {createBlog, getAllBlogs, getBlogByID, updateBlog, deleteBlog} from "../controllers/blog.controller.js"
const router = Router()


router.post("/create-blog", jwtAuth,  upload.fields([{ name: "featureImage", maxCount: 1 }]), createBlog);
router.get("/get-all-blogs", jwtAuth, getAllBlogs);
// get-blog-by -id
router.get("/get-blog/:id", jwtAuth, getBlogByID);
// update blog
router.patch("/update-blog/:id", jwtAuth, upload.fields([{ name: "featureImage", maxCount: 1 }]), updateBlog)
// delete blogs
router.delete("/delete-blog/:id", jwtAuth, deleteBlog)



export default router