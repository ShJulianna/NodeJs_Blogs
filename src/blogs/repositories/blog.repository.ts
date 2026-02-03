import { BlogDTO, BlogType } from "../types/blogs";
import { blogsBD } from "../../db/blogs";

export const blogRepository = {
  // Найти всех
  findAll(): BlogType[] {
    return blogsBD.blogs;
  },

  // Найти  по ID
  findById(id: string): BlogType | null {
    return blogsBD.blogs.find((d) => d.id === id) ?? null;
  },

  // Создать нового
  create(newBlog: BlogType): BlogType {
    blogsBD.blogs.push(newBlog);
    return newBlog;
  },

  // Обновить данные
  update(id: string, dto: BlogDTO): void {
    const blog = blogsBD.blogs.find((d) => d.id === id);

    if (!blog) {
      throw new Error("blog not exist");
    }

    blog.name = dto.name || blog.name;
    blog.description = dto.description || dto.description;
    blog.websiteUrl = dto.websiteUrl || dto.websiteUrl;

    return;
  },

  // Удалить
  delete(id: string): void {
    const index = blogsBD.blogs.findIndex((v) => v.id === id);

    if (index === -1) {
      throw new Error("Driver not exist");
    }

    blogsBD.blogs.splice(index, 1);
    return;
  },
};
