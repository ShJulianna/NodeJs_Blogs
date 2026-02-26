import { Router } from "express";
import { idValidation } from "../../core/middlewares/id-validator.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/input-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/admin.middleware";
import {
  createPostHandler,
  deletePostHandler,
  getPostByIdHandler,
  getPostsListHandler,
  updatePostHandler,
} from "./handlers/post-handlers";
import {
  postCreateValidation,
  postUpdateValidation,
} from "../validation/post.validation";

export const postsRouter = Router({});

postsRouter
  .get("", getPostsListHandler)
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    getPostByIdHandler,
  )
  .post(
    "",
    superAdminGuardMiddleware,
    postCreateValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postUpdateValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
