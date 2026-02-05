import { Request, Response } from "express";
import { blogRepository } from "../../repositories/blog.repository";
import { HttpStatus } from "../../../core/types/types";
import { createErrorMessages } from "../../../core/utils/errors";
import { BlogType } from "../../types/blogs";
import { blogsBD } from "../../../db/blogs";

export function getBlogsListHandler(req: Request, res: Response) {
  const blogs = blogRepository.findAll();
  res.send(blogs);
}

export function getBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  const blog = blogRepository.findById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "blog not found" }]));
    return;
  }

  res.send(blog);
}

export function createBlogHandler(req: Request, res: Response) {
  const newBlog: BlogType = {
    id: blogsBD.blogs.length
      ? (blogsBD.blogs[blogsBD.blogs.length - 1].id + 1).toString()
      : "1",
    ...req.body,
  };
  blogRepository.create(newBlog);
  res.status(HttpStatus.Created).send(newBlog);
}

export function updateBlogHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const blog = blogRepository.findById(id);
  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound).send({
      errorsMessages: [
        {
          message: "video not found",
          field: "id",
        },
      ],
    });
  }

  blogRepository.update(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
}

export function deleteBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  const video = blogRepository.findById(id);
  if (!video) {
    return res.sendStatus(HttpStatus.NotFound);
  }
  blogRepository.delete(id);
  res.sendStatus(HttpStatus.NoContent);
}
