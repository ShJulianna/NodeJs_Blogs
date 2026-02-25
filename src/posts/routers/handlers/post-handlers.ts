import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postRepository } from "../../repositories/post.repository";
import { createErrorMessages } from "../../../core/utils/errors";
import { PostType } from "../../types/posts";
import { blogRepository } from "../../../blogs/repositories/blog.repository";

export async function getPostsListHandler(req: Request, res: Response) {
  const posts = await postRepository.findAll();
  const result = posts.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    shortDescription: p.shortDescription,
    content: p.content,
    blogId: p.blogId,
    blogName:
      typeof (p as any).blogName === "string" && (p as any).blogName.length > 0
        ? (p as any).blogName
        : "",
    createdAt: p.createdAt,
  }));

  res.status(HttpStatus.Ok).send(result);
}

export async function getPostByIdHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;
  const post = await postRepository.findById(id);

  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "post not found" }]));
    return;
  }

  const postModel = {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: (post as any).blogName,
    createdAt: post.createdAt,
  };

  res.status(HttpStatus.Ok).send(postModel);
}

export async function createPostHandler(req: Request, res: Response) {
  try {
    const { title, shortDescription, content, blogId } = req.body;

    const blog = await blogRepository.findById(blogId);
    if (!blog) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: "blogId", message: "blog not found" }]),
        );
      return;
    }

    const newPost = {
      title,
      shortDescription,
      content,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await postRepository.create(newPost);

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
  } catch (error) {
    res.status(HttpStatus.BadRequest).send(error);
  }
}

export async function updatePostHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  const post = await postRepository.findById(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "post not found" }]));
    return;
  }

  await postRepository.update(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
}

export async function deletePostHandler(req: Request, res: Response) {
  const id = `${req.params.id}`;

  const post = await postRepository.findById(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "post not found" }]));
    return;
  }

  await postRepository.delete(id);
  res.sendStatus(HttpStatus.NoContent);
}
