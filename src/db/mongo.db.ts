import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../core/settings/settings';
import {BlogType} from "../blogs/types/blogs";

const BLOGS_COLLECTION_NAME = 'blogs';

export let client: MongoClient;
export let blogsCollection: Collection<BlogType>;

// Подключения к бд
export async function runDB(url: string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME);

    //Инициализация коллекций
    blogsCollection = db.collection<BlogType>(BLOGS_COLLECTION_NAME);

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('✅ Connected to the database');
    } catch (e) {
        await client.close();
        throw new Error(`❌ Database not connected: ${e}`);
    }
}