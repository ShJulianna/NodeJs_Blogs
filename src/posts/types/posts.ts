// export type PostType = {
//   id: string; // Уникальный идентификатор поста
//   title: string; // Заголовок
//   shortDescription: string; // Краткое превью
//   content: string; // Основной текст (HTML или Markdown)
//   blogId: string; // ID родительского блога
//   blogName: string;
//   createdAt: string;
// };

// export type PostDTO = {
//   title: string; // Заголовок
//   shortDescription: string; // Краткое превью
//   content: string; // Основной текст (HTML или Markdown)
//   blogId: string;
//   blogName?: string;
//   createdAt?: string;
// };

export interface PostCreateInput {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export interface PostUpdateInput {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

// То, что лежит в БД (без _id)
export interface PostType {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

// DTO, который сейчас использует репозиторий для update
export interface PostDTO {
  title: string;
  shortDescription: string;
  content: string;
}
