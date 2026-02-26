import { Response } from "express";
import { PostDomainError, PostErrorCode } from "./PostDomainError";
import { HttpStatus } from "../../core/types/types";
import { createErrorMessages } from "../../core/utils/errors";

export function handlePostError(
  error: unknown,
  res: Response,
  context: string,
) {
  if (error instanceof PostDomainError) {
    // Пост не найден
    if (error.code === PostErrorCode.PostNotFound) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: "id", message: "post not found" }]),
        );
      return;
    }

    // Блог для поста не найден
    if (error.code === PostErrorCode.BlogNotFound) {
      res
        .status(HttpStatus.BadRequest)
        .send(
          createErrorMessages([{ field: "blogId", message: "blog not found" }]),
        );
      return;
    }

    // Другие доменные ошибки (если появятся новые коды)
    res
      .status(HttpStatus.BadRequest)
      .send(
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
