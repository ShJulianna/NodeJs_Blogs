import { Response } from "express";
import { HttpStatus } from "../../core/types/types";
import { createErrorMessages } from "../../core/utils/errors";
import { BlogDomainError, BlogErrorCode } from "./BlogDomainError";

export function handleBlogError(error: unknown, res: Response, context: string) {
  if (error instanceof BlogDomainError) {
    // Блог не найден
    if (error.code === BlogErrorCode.NotFound) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "blog not found" }]),
        );
      return;
    }

    // Блог с таким именем уже существует
    if (error.code === BlogErrorCode.AlreadyExists) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([
            { field: "name", message: "blog with this name already exists" },
          ]),
        );
      return;
    }

    // На будущее: любые другие доменные ошибки
    res.status(HttpStatus.BadRequest).send(
      createErrorMessages([
        { field: "unknown", message: error.message || "domain error" },
      ]),
    );
    return;
  }

  // Недоменные / системные ошибки → 500
  console.error(`${context} error:`, error);
  res.status(HttpStatus.InternalServerError).send({
    errorsMessages: [{ field: "unknown", message: "Internal server error" }],
  });
}
