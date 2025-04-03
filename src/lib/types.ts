
export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  source: string;
  sourceUrl: string;
  fileSize?: string;
}

export interface SearchResponse {
  success: boolean;
  results: ImageResult[];
  error?: string;
}
