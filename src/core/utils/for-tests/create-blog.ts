import { Express } from "express";
import request from "supertest";
import { getBlogDto } from "./get-blog-DTO";
import {
  BlogCreateInput,
  BlogType,
  BlogUpdateInput,
} from "../../../blogs/types/blogs";
import { BLOGS_PATH } from "../../paths/paths";
import { generateBasicAuthToken } from "../../../tests/utils/generate-token";
import { HttpStatus } from "../../types/types";

export async function createBlog(
  app: Express,
  blogDto?: BlogCreateInput,
): Promise<BlogType> {
  const defaultBlogData: BlogCreateInput = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
}

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<BlogType> {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: BlogUpdateInput,
): Promise<void> {
  const defaultBlogData: BlogUpdateInput = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return updatedBlogResponse.body;
}
