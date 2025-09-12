import { Router } from "express";
import { signin,  } from "../Controllers/UserControllers";

const router = Router();

router.post("/users", signin);   


export default router;
