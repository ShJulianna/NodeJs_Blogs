export class PostDomainError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const PostErrorCode = {
  BlogNotFound: "BLOG_NOT_FOUND",
  PostNotFound: "POST_NOT_FOUND",
} as const;
