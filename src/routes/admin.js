import express from 'express';
const router = express.Router();
import * as userController from "../controllers/user/user.controller";

//================================
// Admin routes
//================================
router.get("/allUsers", userController.allUsers);

module.exports = router;
