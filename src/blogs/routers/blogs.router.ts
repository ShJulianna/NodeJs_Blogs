import { Router } from "express";
import {
    createBlogHandler,
    deleteBlogHandler,
    getBlogHandler,
    getBlogsListHandler,
    updateBlogHandler
} from "./handlers/get-blog-list";
import {idValidation} from "../../core/middlewares/id-validator.middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/input-validation.middleware";
import {blogDTOValidation} from "../validation/blog.validation";
import {superAdminGuardMiddleware} from "../../auth/middlewares/admin.middleware";

export const blogsRouter = Router({});

// blogsRouter.use(superAdminGuardMiddleware); //Если использовать router.use(), то применяется мидлвейр ко всем маршрутам в этом роутере.
blogsRouter.get("", getBlogsListHandler)
    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)
    .post('', superAdminGuardMiddleware, blogDTOValidation, blogDTOValidation, inputValidationResultMiddleware, createBlogHandler)
    .put('/:id', superAdminGuardMiddleware, idValidation, blogDTOValidation, inputValidationResultMiddleware, updateBlogHandler)
    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteBlogHandler);
