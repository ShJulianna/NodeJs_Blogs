import { Router } from "express";
import { HttpStatus } from "../../core/types/types";
import { blogsBD } from "../../db/blogs";

export const testRouter = Router();

testRouter.delete("/all-data", (req, res) => {
  blogsBD.blogs = [];
  res.sendStatus(HttpStatus.NoContent);
});
