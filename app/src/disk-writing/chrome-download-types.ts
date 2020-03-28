export interface DownloadRequest {
	filePath: string,
	url: string
};

export interface DownloadErrorResponse {
	type: "error",
	error: string
};
export interface DownloadSuccessResponse {
	type: "success"
};
export interface DownloadProgressResponse {
	type: "progress",
	progress: DownloadProgress
};
export type DownloadResponse = DownloadErrorResponse | 
	DownloadSuccessResponse | DownloadProgressResponse;