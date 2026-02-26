import { WithId } from "mongodb";
import {
  PostDTO,
  PostType,
  PostCreateInput,
  PostUpdateInput,
} from "../types/posts";
import { postRepository } from "../repositories/post.repository";
import { blogRepository } from "../../blogs/repositories/blog.repository";
import { PostDomainError, PostErrorCode } from "../errors/PostDomainError";
import { blogsService } from "../../blogs/application/blogs.service";

export const postsService = {
  // Получить список всех постов
  async findMany(): Promise<WithId<PostType>[]> {
    return postRepository.findAll();
  },

  // Получить пост или кинуть доменную ошибку
  async findByIdOrFail(id: string): Promise<WithId<PostType>> {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new PostDomainError(PostErrorCode.PostNotFound, "Post not found");
    }
    return post as WithId<PostType>;
  },

  // Создание поста
  async create(dto: PostCreateInput): Promise<WithId<PostType>> {
    // Проверяем, что блог существует
    const blog = await blogRepository.findById(dto.blogId);
    if (!blog) {
      throw new PostDomainError(
        PostErrorCode.BlogNotFound,
        "Blog for post not found",
      );
    }

    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name, // Заполнить из блога
      createdAt: new Date().toISOString(),
    };

    return postRepository.create(newPost);
  },

  async createForBlog(
    blogId: string,
    dto: Omit<PostCreateInput, "blogId">,
  ): Promise<WithId<PostType>> {
    // Проверяем блог и берём blogName
    const blog = await blogsService.findByIdOrFail(blogId).catch(() => {
      throw new PostDomainError(PostErrorCode.BlogNotFound, "Blog not found");
    });

    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return postRepository.create(newPost);
  },

  // Обновление поста
  async update(id: string, dto: PostUpdateInput): Promise<void> {
    // Проверяем, существует ли пост
    const existing = await postRepository.findById(id);
    if (!existing) {
      throw new PostDomainError(PostErrorCode.PostNotFound, "Post not found");
    }

    // Если есть blogId в dto — проверяем, что блог существует
    if (dto.blogId) {
      const blog = await blogRepository.findById(dto.blogId);
      if (!blog) {
        throw new PostDomainError(
          PostErrorCode.BlogNotFound,
          "Blog for post not found",
        );
      }
    }

    // DTO, который понимает репозиторий (без blogId/blogName, если репозиторий их не обновляет)
    const updateDto: PostDTO = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
    };

    await postRepository.update(id, updateDto);
  },

  // Удаление поста
  async delete(id: string): Promise<void> {
    const existing = await postRepository.findById(id);
    if (!existing) {
      throw new PostDomainError(PostErrorCode.PostNotFound, "Post not found");
    }

    await postRepository.delete(id);
  },
};
