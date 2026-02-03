import { BlogType } from "../blogs/types/blogs";

export const blogsBD: { blogs: BlogType[] } = {
  blogs: [
    {
      id: "blog-001",
      name: "Код и Кофе",
      description:
        "Заметки о разработке ПО, архитектуре и поиске идеального эспрессо.",
      websiteUrl: "https://code-and-coffee.dev",
    },
    {
      id: "blog-002",
      name: "Дизайн-Системы 101",
      description: "Все, что вы хотели знать о UI-китах, но боялись спросить.",
      websiteUrl: "https://design-logic.io",
    },
    {
      id: "blog-003",
      name: "Минималист",
      description: "Блог о том, как избавиться от лишнего в коде и в жизни.",
      websiteUrl: "https://minimal-life.ru",
    },
  ],
};
