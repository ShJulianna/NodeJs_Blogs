import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsService } from "../../application/blogs.service";
import { handleBlogError } from "../../errors/BlogErrorHandler";

export async function getBlogsListHandler(_req: Request, res: Response) {
  try {
    const blogs = await blogsService.findMany();
    res.status(HttpStatus.Ok).send(blogs);
  } catch (error: unknown) {
    handleBlogError(error, res, "getBlogsListHandler");
  }
}

export async function getBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  try {
    const blog = await blogsService.findByIdOrFail(id);
    res.status(HttpStatus.Ok).send(blog);
  } catch (error: unknown) {
    handleBlogError(error, res, "getBlogHandler");
  }
}

export async function createBlogHandler(req: Request, res: Response) {
  try {
    const createdBlog = await blogsService.create(req.body);
    res.status(HttpStatus.Created).send(createdBlog);
  } catch (error: unknown) {
    handleBlogError(error, res, "createBlogHandler");
  }
}

export async function updateBlogHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  try {
    await blogsService.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    handleBlogError(error, res, "updateBlogHandler");
  }
}

export async function deleteBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  try {
    await blogsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    handleBlogError(error, res, "deleteBlogHandler");
  }
}
