export class BlogDomainError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const BlogErrorCode = {
  NotFound: "BLOG_NOT_FOUND",
  AlreadyExists: "BLOG_ALREADY_EXISTS",
} as const;
