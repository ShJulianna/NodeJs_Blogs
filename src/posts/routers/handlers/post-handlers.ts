import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/types";
import { postsRepository } from "../../repositories/post.repository";
import {blogsBD} from "../../../db/blogs";

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
    const blogId = req.body.blogId as string;
    const blog = blogsBD.blogs.find((b) => b.id === blogId);

    const newPost = {
      id: blogsBD.blogs.length
          ? (blogsBD.blogs[blogsBD.blogs.length - 1].id + 1).toString()
          : "1",
    ...req.body,
        blogName: blog?.name ?? "",
  };
  postsRepository.create(newPost);
  res.status(HttpStatus.Created).send(newPost);
};

export const updatePostHandler = (req: Request, res: Response) => {
  const id = req.params.id as string;
    const blogId = req.body.blogId as string | undefined;
    const blog = blogId ? blogsBD.blogs.find((b) => b.id === blogId) : undefined;

    try {
        postsRepository.update(id, {
            ...req.body,
            ...(blog ? { blogName: blog.name } : {}),
        });
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
