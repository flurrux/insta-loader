

export interface DownloadRequest {
	type: "request-download",
	filePath: string,
	url: string
};
export interface DownloadStateRequest {
	type: "request-state",
	id: number
};

export interface DownloadIdResponse {
	type: "download-id",
	id: number
};

export interface DownloadErrorResponse {
	type: "error",
	error: string
};
export interface DownloadSuccessResponse {
	type: "success"
};
export type DownloadProgressCallback = (progressData: DownloadProgress) => void;
export interface DownloadProgress {
	progress: number,
	bytesReceived: number,
	totalBytes: number
};
export interface DownloadProgressResponse {
	type: "progress",
	progress: DownloadProgress
};
export type DownloadResponse = DownloadErrorResponse | 
	DownloadSuccessResponse | 
	DownloadProgressResponse | 
	DownloadIdResponse;