import { PostDTO, PostType } from "../types/posts";
import { postsDB } from "../../db/posts";
import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongo.db";

export const postRepository = {
  async findAll(): Promise<WithId<PostType>[]> {
    return postsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<PostType> | null> {
    if (!ObjectId.isValid(id)) return null;
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: any): Promise<WithId<PostType>> {
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
