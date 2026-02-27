import { Router } from "express";
import {
  createBlogHandler,
  deleteBlogHandler,
  getBlogHandler,
  getBlogsListHandler,
  getPostsForBlogHandler,
  updateBlogHandler,
} from "./handlers/get-blog-list";
import {
  blogIdValidation,
  idValidation,
} from "../../core/middlewares/id-validator.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/input-validation.middleware";
import { blogDTOValidation } from "../validation/blog.validation";
import { superAdminGuardMiddleware } from "../../auth/middlewares/admin.middleware";
import { postDTOValidation } from "../../posts/validation/post.validation";
import { createPostForBlogHandler } from "../../posts/routers/handlers/post-handlers";

export const blogsRouter = Router({});

// blogsRouter.use(superAdminGuardMiddleware); //Если использовать router.use(), то применяется мидлвейр ко всем маршрутам в этом роутере.
blogsRouter
  .get("", getBlogsListHandler)
  .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)
  .get(
    "/:blogId/posts",
    blogIdValidation, // при необходимости можешь завести отдельную валидацию для blogId
    inputValidationResultMiddleware,
    getPostsForBlogHandler,
  )
  .post(
    "",
    superAdminGuardMiddleware,
    blogDTOValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    postDTOValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogDTOValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  );
