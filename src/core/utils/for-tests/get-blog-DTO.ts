import { BlogType } from "../../../blogs/types/blogs";

export function getBlogDto(): BlogType {
  return {
    name: "Путь QA",
    description: "Тестирование, автоматизация тестов и обеспечение качества.",
    websiteUrl: "https://qa-pathway.ru",
    isMembership: false,
    createdAt: "dfv",
  };
}
