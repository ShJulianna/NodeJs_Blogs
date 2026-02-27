import {
  BlogCreateInput,
  BlogListPaginatedOutput,
  BlogsQueryParams,
  BlogType,
  BlogUpdateInput,
} from "../types/blogs";
import { ObjectId, WithId } from "mongodb";
import { blogsCollection } from "../../db/mongo.db";

export const blogRepository = {
  async findAll(params: BlogsQueryParams): Promise<BlogListPaginatedOutput> {
    const {
      searchNameTerm = null,
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber = 1,
      pageSize = 3,
    } = params;

    // const page = Number(pageNumber) || 1;
    // const size = Number(pageSize) || 3;

    // 1. Фильтр по имени
    const filter: Record<string, unknown> = {};
    if (searchNameTerm && searchNameTerm.trim() !== "") {
      filter.name = { $regex: searchNameTerm, $options: "i" }; // содержит подстроку, регистр не важен
    }

    // 2. Сортировка
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortDirection === "asc" ? 1 : -1;

    // 3. Пагинация
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const totalCount = await blogsCollection.countDocuments(filter);

    const blogs = await blogsCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const items = blogs.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
      isMembership: b.isMembership,
    }));

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items,
    };
  },

  async findById(id: string): Promise<WithId<BlogType> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: BlogType): Promise<WithId<BlogType>> {
    const blogToInsert: BlogType = {
      ...newBlog,
      createdAt: new Date().toISOString(),
    };

    const insertResult = await blogsCollection.insertOne(blogToInsert);

    return { ...blogToInsert, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogUpdateInput): Promise<void> {
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
