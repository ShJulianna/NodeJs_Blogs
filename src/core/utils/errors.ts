import { ValidationErrorType } from "../types/types";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorMessages: ValidationErrorType[] } => {
  return { errorMessages: errors };
};
