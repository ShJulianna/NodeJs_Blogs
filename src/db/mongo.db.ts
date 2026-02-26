import { Collection, Db, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { BlogType } from "../blogs/types/blogs";
import { PostType } from "../posts/types/posts";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogsCollection: Collection<BlogType>;
export let postsCollection: Collection<PostType>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
  if (client) {
    console.log("ldcfnmkelk");
    return;
  }
  try {
    console.log("1");
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);
    //Инициализация коллекций
    blogsCollection = db.collection<BlogType>(BLOGS_COLLECTION_NAME);
    postsCollection = db.collection<PostType>(POSTS_COLLECTION_NAME);
    await client.connect();
    console.log("2");
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    if (client) {
      await client.close().catch(() => undefined);
      client = undefined as unknown as MongoClient;
    }
    console.error("❌ Database not connected:", e);
    throw new Error("Database not connected");
  }
}

export async function closeDB(): Promise<void> {
  if (!client) {
    throw new Error("error");
  }
  await client.close();
  client = undefined as unknown as MongoClient;
  blogsCollection = undefined as unknown as Collection<BlogType>;
  postsCollection = undefined as unknown as Collection<PostType>;
}
