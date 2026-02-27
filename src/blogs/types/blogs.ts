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

export type BlogsQueryParams = {
  searchNameTerm?: string | null;
  sortBy?: keyof BlogType | "id" | "createdAt";
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};

export type BlogListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: (BlogType & { id: string })[];
};

export type BlogPostsQueryParams = {
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
};
