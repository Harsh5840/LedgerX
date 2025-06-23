import { RequestHandler, Router } from "express";
import { handleNLPQuery } from "../controllers/nlpController";

const router: Router = Router();

router.post("/query", (req, res, next) => {
  Promise.resolve(handleNLPQuery(req, res)).catch(next);
});  //
  
export default router;
