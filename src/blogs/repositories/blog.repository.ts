import { BlogDTO, BlogType } from "../types/blogs";
import { blogsBD } from "../../db/blogs";
import { ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../../db/mongo.db";

export const blogRepository = {
  async findAll(): Promise<WithId<BlogType>[]> {
    return blogsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<BlogDTO> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: BlogType): Promise<WithId<BlogType>> {
    const insertResult = await blogsCollection.insertOne(newBlog);

    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogDTO): Promise<void> {
    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          isMembership: false,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error("Blog not exist");
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error("Blog not exist");
    }
    return;
  },
};

// export const blogRepository = {
//   // Найти всех
//   findAll(): BlogType[] {
//     return blogsBD.blogs;
//   },
//
//   // Найти  по ID
//   findById(id: string): BlogType | null {
//     return blogsBD.blogs.find((d) => d.id === id) ?? null;
//   },
//
//   // Создать нового
//   create(newBlog: BlogType): BlogType {
//     blogsBD.blogs.push(newBlog);
//     return newBlog;
//   },
//
//   // Обновить данные
//   update(id: string, dto: BlogDTO): void {
//     const blog = blogsBD.blogs.find((d) => d.id === id);
//
//     if (!blog) {
//       throw new Error("blog not exist");
//     }
//
//     blog.name = dto.name || blog.name;
//     blog.description = dto.description || dto.description;
//     blog.websiteUrl = dto.websiteUrl || dto.websiteUrl;
//
//     return;
//   },
//
//   // Удалить
//   delete(id: string): void {
//     const index = blogsBD.blogs.findIndex((v) => v.id === id);
//
//     if (index === -1) {
//       throw new Error("Driver not exist");
//     }
//
//     blogsBD.blogs.splice(index, 1);
//     return;
//   },
// };
