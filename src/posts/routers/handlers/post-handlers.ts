import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postRepository } from "../../repositories/post.repository";
import { createErrorMessages } from "../../../core/utils/errors";
import { PostType } from "../../types/posts";

export async function getPostsListHandler(req: Request, res: Response) {
  const posts = await postRepository.findAll();

  const result = posts.map((p) => ({
    ...p,
    id: p._id.toString(),
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
    ...post,
    id: post._id.toString(),
  };

  res.status(HttpStatus.Ok).send(postModel);
}

export async function createPostHandler(req: Request, res: Response) {
  try {
    const newPost: PostType = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await postRepository.create(newPost);

    const postModel = {
      ...createdPost,
      id: createdPost._id.toString(),
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
