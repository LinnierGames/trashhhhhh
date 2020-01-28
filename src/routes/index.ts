import express from "express";
var router = express.Router();

/* GET home page. */
router.get('/', function (req: any, res: any, next: VoidFunction) {
  res.json({ title: 'Express' });
});

export default router;
