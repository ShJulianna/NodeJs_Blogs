export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: false;
  createdAt: string;
};

export type BlogDTO = Omit<BlogType, "id">;
