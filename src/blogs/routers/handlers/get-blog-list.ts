import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { blogsService } from "../../application/blogs.service";
import { handleBlogError } from "../../errors/BlogErrorHandler";
import { BlogPostsQueryParams, BlogsQueryParams } from "../../types/blogs";
import { postsService } from "../../../posts/application/postsService";
import { PostsQueryParams } from "../../../posts/types/posts";

export async function getBlogsListHandler(req: Request, res: Response) {
  try {
    const queryInput = req.query;
    const {
      searchNameTerm = null,
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber = "1",
      pageSize = "10",
    } = queryInput;

    const normalizedQuery: BlogsQueryParams = {
      searchNameTerm: searchNameTerm ? String(searchNameTerm) : null,
      sortBy: String(sortBy) as any,
      sortDirection: sortDirection === "asc" ? "asc" : "desc",
      pageNumber: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
    };

    const blogList = await blogsService.findMany(normalizedQuery);
    res.status(HttpStatus.Ok).send(blogList);
  } catch (error: unknown) {
    handleBlogError(error, res, "getBlogsListHandler");
  }
}

export async function getBlogHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  try {
    const createdBlog = await blogsService.findByIdOrFail(id);
    const blog = {
      id: createdBlog._id.toString(),
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    };
    res.status(HttpStatus.Ok).send(blog);
  } catch (error: unknown) {
    handleBlogError(error, res, "getBlogHandler");
  }
}

export async function getPostsForBlogHandler(req: Request, res: Response) {
  try {
    const blogId = req.params.blogId as string;

    const queryInput = req.query;
    const {
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber = "1",
      pageSize = "10",
    } = queryInput;

    const normalizedQuery: PostsQueryParams = {
      sortBy,
      sortDirection: sortDirection === "asc" ? "asc" : "desc",
      pageNumber: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
    } as PostsQueryParams;

    const postsPage = await postsService.findManyByBlogId(
      blogId,
      normalizedQuery,
    );

    // Если блог не найден, сервис может вернуть null
    if (!postsPage) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.status(HttpStatus.Ok).send(postsPage);
  } catch (e) {
    console.error("[getPostsForBlogHandler] error:", e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
export async function createBlogHandler(req: Request, res: Response) {
  try {
    const createdBlog = await blogsService.create(req.body);

    const blog = {
      id: createdBlog._id.toString(),
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.isMembership,
    };
    res.status(HttpStatus.Created).send(blog);
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
