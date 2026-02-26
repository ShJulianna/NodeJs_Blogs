// То, что лежит в коллекции blogs (без _id)
export interface BlogType {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

// Входные данные для создания блога (req.body в POST /blogs)
export interface BlogCreateInput {
  name: string;
  description: string;
  websiteUrl: string;
}

// Входные данные для обновления блога (req.body в PUT /blogs/:id)
export interface BlogUpdateInput {
  name: string;
  description: string;
  websiteUrl: string;
}
