import { ValidationErrorType } from "../types/types";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorsMessages: ValidationErrorType[] } => {
  return { errorsMessages: errors };
};
