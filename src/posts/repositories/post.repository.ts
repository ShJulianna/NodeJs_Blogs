import {
  PostDTO,
  PostsListPaginatedOutput,
  PostsQueryParams,
  PostType,
} from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(params: PostsQueryParams): Promise<PostsListPaginatedOutput> {
    const {
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber: page = 1,
      pageSize: size = 10,
    } = params;

    // Сортировка
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortDirection === "asc" ? 1 : -1;

    const skip: number = (page - 1) * size;
    const limit: number = size;

    // Всего документов
    const totalCount = await postsCollection.countDocuments({});

    // Получаем нужную "порцию"
    const posts = await postsCollection
      .find({})
      .sort(sort)
      .skip(Number.isFinite(skip) ? skip : 0)
      .limit(Number.isFinite(limit) ? limit : 0)
      .toArray();

    const items = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
    }));

    const pagesCount = Math.ceil(totalCount / size);

    return {
      pagesCount,
      page,
      pageSize: size,
      totalCount,
      items,
    };
  },

  async findById(id: string): Promise<WithId<PostType> | null> {
    if (!ObjectId.isValid(id)) return null;
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: PostType): Promise<WithId<PostType>> {
    const insertResult = await postsCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async update(id: string, dto: PostDTO): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Post not exist");
    }

    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error("Post not exist");
    }
  },

  async delete(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Post not exist");
    }

    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
  },
};

// export const postsRepository = {
//   findAll(): PostType[] {
//     return postsDB.posts;
//   },
//
//   findById(id: string): PostType | null {
//     return postsDB.posts.find((post) => post.id === id) ?? null;
//   },
//
//   create(newPost: PostType): PostType {
//     postsDB.posts.push(newPost);
//     return newPost;
//   },
//
//   update(id: string, dto: PostDTO): void {
//     const post = postsDB.posts.find((p) => p.id === id);
//     if (!post) {
//       throw new Error("Post does not exist");
//     }
//     post.title = dto.title || post.title;
//     post.shortDescription = dto.shortDescription || post.shortDescription;
//     post.content = dto.content || post.content;
//     post.blogId = dto.blogId || post.blogId;
//     post.blogName = dto.blogName || post.blogName;
//     post.createdAt = new Date().toISOString();
//   },
//
//   delete(id: string): void {
//     const index = postsDB.posts.findIndex((p) => p.id === id);
//     if (index === -1) {
//       throw new Error("Post does not exist");
//     }
//     postsDB.posts.splice(index, 1);
//   },
// };
