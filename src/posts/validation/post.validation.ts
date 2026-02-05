import { body } from "express-validator";

const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage("Title length is not correct");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Short description length is not correct");

const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Content should not be empty");

const blogIdValidation = body("blogId")
  .isString()
  .trim()
  .isLength({ min: 1 })
  .withMessage("blogId is required");

export const postDTOValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
