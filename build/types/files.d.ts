import { BaseParams } from './common.js';
export interface GetFileArgs extends BaseParams {
    fileKey: string;
    branch_data?: boolean;
}
export interface GetFileNodesArgs extends BaseParams {
    fileKey: string;
    node_ids: string[];
}
export interface GetImageArgs {
    fileKey: string;
    ids: string[];
    scale?: number;
    format?: 'jpg' | 'png' | 'svg' | 'pdf';
    svg_include_id?: boolean;
    svg_simplify_stroke?: boolean;
    use_absolute_bounds?: boolean;
}
export interface GetImageFillsArgs {
    fileKey: string;
}
export interface GetCommentsArgs {
    fileKey: string;
}
export interface PostCommentArgs {
    fileKey: string;
    message: string;
    client_meta?: {
        x: number;
        y: number;
        node_id?: string;
        node_offset?: {
            x: number;
            y: number;
        };
    };
    comment_id?: string;
}
export interface DeleteCommentArgs {
    fileKey: string;
    comment_id: string;
}
