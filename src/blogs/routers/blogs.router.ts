import { Router } from "express";
import { getBlogsListHandler } from "./handlers/get-blog-list";

export const blogsRouter = Router({});

blogsRouter.get("", getBlogsListHandler);
// .get('/:id', getDriverHandler)
// .post('', createDriverHandler)
// .put('/:id', updateDriverHandler)
// .delete('/:id', deleteDriverHandler);
