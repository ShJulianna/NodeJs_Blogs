import { Request, Response } from "express";
import { blogRepository } from "../../repositories/blog.repository";
import { HttpStatus } from "../../../core/types/types";
import { createErrorMessages } from "../../../core/utils/errors";
import { BlogType } from "../../types/blogs";
import { blogsBD } from "../../../db/blogs";

export async function getBlogsListHandler(req: Request, res: Response) {
  const blogs = await blogRepository.findAll();
  res.send(blogs);
}

export async function getBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  const blog = await blogRepository.findById(id);
  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "blog not found" }]));
    return;
  }

  const blogModel = {
    ...blog,
    id: blog._id.toString(),
  };
  res.send(blogModel);
}

export async function createBlogHandler(req: Request, res: Response) {
  try {
    const newBlog: BlogType = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    const createdBlog = await blogRepository.create(newBlog);
    const blogModel = {
      ...createdBlog,
      id: createdBlog._id.toString(),
    };
    res.status(HttpStatus.Created).send(blogModel);
  } catch (error) {
    res.status(HttpStatus.BadRequest).send(error);
  }
}

export async function updateBlogHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const blog = await blogRepository.findById(id);
  if (!blog) {
    return res.sendStatus(HttpStatus.NotFound).send({
      errorsMessages: [
        {
          message: "blog not found",
          field: "id",
        },
      ],
    });
  }

  await blogRepository.update(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
}

export async function deleteBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  const blog = await blogRepository.findById(id);
  if (!blog) {
    return res
      .sendStatus(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "blog not found" }]));
  }
  await blogRepository.delete(id);
  res.sendStatus(HttpStatus.NoContent);
}
