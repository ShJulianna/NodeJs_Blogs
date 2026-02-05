import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsRepository } from "../../repositories/post.repository";

export const getPostsListHandler = (req: Request, res: Response) => {
  const posts = postsRepository.findAll();
  res.send(posts);
};

export const getPostByIdHandler = (req: Request, res: Response) => {
  const id = req.params.id as string;
  const post = postsRepository.findById(id);
  if (!post) {
    res.status(HttpStatus.NotFound).send({ message: "Post not found" });
    return;
  }
  res.send(post);
};

export const createPostHandler = (req: Request, res: Response) => {
  const newPost = {
    id: `post-${Date.now()}`, // или другой генератор уникальных id
    ...req.body,
  };
  postsRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
};

export const updatePostHandler = (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    postsRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.status(HttpStatus.NotFound).send({ message: "Post not found" });
  }
};

export const deletePostHandler = (req: Request, res: Response) => {
  const id = req.params.id as string;
  try {
    postsRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch {
    res.status(HttpStatus.NotFound).send({ message: "Post not found" });
  }
};
