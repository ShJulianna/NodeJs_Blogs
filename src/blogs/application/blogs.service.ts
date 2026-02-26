import { WithId } from "mongodb";
import { BlogType, BlogCreateInput, BlogUpdateInput } from "../types/blogs";
import { blogRepository } from "../repositories/blog.repository";
import { BlogDomainError, BlogErrorCode } from "../errors/BlogDomainError";

export const blogsService = {
  async findMany(): Promise<WithId<BlogType>[]> {
    return blogRepository.findAll();
  },

  async findByIdOrFail(id: string): Promise<WithId<BlogType>> {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new BlogDomainError(BlogErrorCode.NotFound, "Blog not found");
    }
    return blog as WithId<BlogType>;
  },

  async create(dto: BlogCreateInput): Promise<WithId<BlogType>> {
    const newBlog: BlogType = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogRepository.create(newBlog);
  },

  async update(id: string, dto: BlogUpdateInput): Promise<void> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new BlogDomainError(BlogErrorCode.NotFound, "Blog not found");
    }

    await blogRepository.update(id, dto);
  },

  async delete(id: string): Promise<void> {
    const existing = await blogRepository.findById(id);
    if (!existing) {
      throw new BlogDomainError(BlogErrorCode.NotFound, "Blog not found");
    }

    await blogRepository.delete(id);
  },
};
