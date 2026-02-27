import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import {
  PostCreateInput,
  PostDTO,
  PostsQueryParams,
  PostUpdateInput,
} from "../../types/posts";
import { postsService } from "../../application/postsService";
import { handlePostError } from "../../errors/PostErrorHandler";
import { BlogsQueryParams } from "../../../blogs/types/blogs";

// Типизированные запросы
type CreatePostRequest = Request<{}, {}, PostCreateInput>;
type UpdatePostRequest = Request<{ id: string }, {}, PostUpdateInput>;
type IdRequest = Request<{ id: string }>;

export async function getPostsListHandler(req: Request, res: Response) {
  try {
    const queryInput = req.query;
    const {
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber = "1",
      pageSize = "10",
    } = queryInput;

    const normalizedQuery: PostsQueryParams = {
      sortBy: String(sortBy) as any,
      sortDirection: sortDirection === "asc" ? "asc" : "desc",
      pageNumber: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
    };
    const posts = await postsService.findMany(normalizedQuery);

    res.status(HttpStatus.Ok).send(posts);
  } catch (error: unknown) {
    handlePostError(error, res, "getPostsListHandler");
  }
}

export async function getPostByIdHandler(req: IdRequest, res: Response) {
  const id = req.params.id;

  try {
    const post = await postsService.findByIdOrFail(id);

    const postModel = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };

    res.status(HttpStatus.Ok).send(postModel);
  } catch (error: unknown) {
    handlePostError(error, res, "getPostByIdHandler");
  }
}

export async function createPostHandler(req: CreatePostRequest, res: Response) {
  try {
    const createdPost = await postsService.create(req.body);

    const postModel = {
      id: createdPost._id.toString(),
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
    };

    res.status(HttpStatus.Created).send(postModel);
  } catch (error: unknown) {
    handlePostError(error, res, "createPostHandler");
  }
}

type CreateBlogPostRequest = Request<{ id: string }, {}, PostDTO>;

export async function createPostForBlogHandler(
  req: CreateBlogPostRequest,
  res: Response,
) {
  const blogId = req.params.id;

  try {
    const createdPost = await postsService.createForBlog(blogId, req.body);

    const postModel = {
      id: createdPost._id.toString(),
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: createdPost.createdAt,
    };

    res.status(HttpStatus.Created).send(postModel);
  } catch (error: unknown) {
    handlePostError(error, res, "createPostForBlogHandler");
  }
}

export async function updatePostHandler(req: UpdatePostRequest, res: Response) {
  const id = req.params.id;

  try {
    await postsService.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    handlePostError(error, res, "updatePostHandler");
  }
}

export async function deletePostHandler(req: IdRequest, res: Response) {
  const id = req.params.id;

  try {
    await postsService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    handlePostError(error, res, "deletePostHandler");
  }
}
