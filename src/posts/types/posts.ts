export type PostType = {
  id: string; // Уникальный идентификатор поста
  title: string; // Заголовок
  shortDescription: string; // Краткое превью
  content: string; // Основной текст (HTML или Markdown)
  blogId: string; // ID родительского блога
  blogName: string;
};

export type PostDTO = {
  title: string; // Заголовок
  shortDescription: string; // Краткое превью
  content: string; // Основной текст (HTML или Markdown)
  blogId: string;
};
