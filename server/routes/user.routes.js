import { Router } from "express";
import {allUsers, logout, login, register, profile, getUserById,  getReferralTree,updateUserPlanSub, updateUserPlan, getUserByUserCode, calculate, updateUser, updateUserByAdmin, deleteUser, forgotPassword } from '../controllers/user.controllers.js'
import {authRequired} from '../middlewares/validateToken.js'

const routerUser = Router();

routerUser.post("/login", login)
routerUser.post("/logout", logout)
routerUser.post("/register", register)
routerUser.get("/users", allUsers)
routerUser.get("/getUserById", authRequired,  getUserById)
routerUser.get("/profile", authRequired, profile)
routerUser.get("/referralTree", authRequired, getReferralTree)
routerUser.post("/updateUserPlan", authRequired, updateUserPlan)
routerUser.post("/updateUserPlanSub", authRequired, updateUserPlanSub)
routerUser.post("/getUserByUserCode", getUserByUserCode )
routerUser.post("/calculate", calculate )
routerUser.put("/update", authRequired, updateUser)
routerUser.put("/updateByAdmin", authRequired, updateUserByAdmin)
routerUser.post("/delete", authRequired, deleteUser)
routerUser.post("/forgotPassword", forgotPassword); // Agregar la ruta para el reinicio de contraseña


export default routerUser
