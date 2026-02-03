import { PostDTO, PostType } from "../types/posts";
import { postsDB } from "../../db/posts";

export const postsRepository = {
    findAll(): PostType[] {
        return postsDB.posts;
    },

    findById(id: string): PostType | null {
        return postsDB.posts.find(post => post.id === id) ?? null;
    },

    create(newPost: PostType): PostType {
        postsDB.posts.push(newPost);
        return newPost;
    },

    update(id: string, dto: PostDTO): void {
        const post = postsDB.posts.find(p => p.id === id);
        if (!post) {
            throw new Error("Post does not exist");
        }
        post.title = dto.title || post.title;
        post.shortDescription = dto.shortDescription || post.shortDescription;
        post.content = dto.content || post.content;
        post.blogId = dto.blogId || post.blogId;
    },

    delete(id: string): void {
        const index = postsDB.posts.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error("Post does not exist");
        }
        postsDB.posts.splice(index, 1);
    },
};