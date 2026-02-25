import { Request, Response } from "express";
import { blogRepository } from "../../repositories/blog.repository";
import { HttpStatus } from "../../../core/types/types";
import { createErrorMessages } from "../../../core/utils/errors";
import { BlogType } from "../../types/blogs";
import { blogsBD } from "../../../db/blogs";

export async function getBlogsListHandler(req: Request, res: Response) {
  const blogs = await blogRepository.findAll();
  const result = blogs.map((b) => ({
    id: b._id.toString(),
    name: b.name,
    description: b.description,
    websiteUrl: b.websiteUrl,
    createdAt: b.createdAt,
    isMembership:
      typeof (b as any).isMembership === "boolean"
        ? (b as any).isMembership
        : false,
  }));

  res.status(HttpStatus.Ok).send(result);
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
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership:
      typeof (blog as any).isMembership === "boolean"
        ? (blog as any).isMembership
        : false,
  };

  res.status(HttpStatus.Ok).send(blogModel);
}

export async function createBlogHandler(req: Request, res: Response) {
  try {
    const newBlog: any = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      isMembership:
        typeof req.body.isMembership === "boolean"
          ? req.body.isMembership
          : false,
    };
    const createdBlog = await blogRepository.create(newBlog);
    const blogModel = {
      id: createdBlog._id.toString(),
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership:
        typeof (createdBlog as any).isMembership === "boolean"
          ? (createdBlog as any).isMembership
          : false,
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
