import { Router } from "express";
import { idValidation } from "../../core/middlewares/id-validator.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/input-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/admin.middleware";
import {
    createPostHandler,
    deletePostHandler,
    getPostByIdHandler,
    getPostsListHandler,
    updatePostHandler
} from "./handlers/post-handlers";
import {postDTOValidation} from "../validation/post.validation";

export const postsRouter = Router({});

postsRouter.get("", getPostsListHandler)
    .get("/:id", idValidation, inputValidationResultMiddleware, getPostByIdHandler)
    .post("", superAdminGuardMiddleware, postDTOValidation, inputValidationResultMiddleware, createPostHandler)
    .put("/:id", superAdminGuardMiddleware, idValidation, postDTOValidation, inputValidationResultMiddleware, updatePostHandler)
    .delete("/:id", superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostHandler);