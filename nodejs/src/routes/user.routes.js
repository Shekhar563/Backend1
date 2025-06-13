import { Router } from "express";
import { userRegister, loginUser ,getCurrentUser, logoutUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {jwtAuth} from "../middleware/auth.middleware.js"







const router = Router()



router.post('/register', upload.single("avatar"), userRegister)
 router.post('/login', loginUser)


// protected route
// get current user
 router.get("/current-user", jwtAuth, getCurrentUser )

// logout
router.post("/logout", jwtAuth, logoutUser)



export default router