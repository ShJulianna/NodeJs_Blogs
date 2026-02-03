import { Request, Response } from "express";
import { blogRepository } from "../../repositories/blog.repository";
import { HttpStatus } from "../../../core/types/types";
import { createErrorMessages } from "../../../core/utils/errors";

export function getBlogsListHandler(req: Request, res: Response) {
  const blogs = blogRepository.findAll();
  res.send(blogs);
}

export function getBlogHandler(req: Request, res: Response) {
  const blog = blogRepository.findById(req.params.id as string);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "blog not found" }]));
    return;
  }

  res.send(blog);
}
