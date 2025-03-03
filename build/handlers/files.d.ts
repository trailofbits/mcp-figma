import { FigmaApi } from '../utils/api.js';
import { GetFileArgs, GetFileNodesArgs, GetImageArgs, GetImageFillsArgs, GetCommentsArgs, PostCommentArgs, DeleteCommentArgs } from '../types/files.js';
export declare class FilesHandler {
    private api;
    constructor(api: FigmaApi);
    getFile(args: GetFileArgs): Promise<unknown>;
    getFileNodes(args: GetFileNodesArgs): Promise<unknown>;
    getImage(args: GetImageArgs): Promise<unknown>;
    getImageFills(args: GetImageFillsArgs): Promise<unknown>;
    getComments(args: GetCommentsArgs): Promise<unknown>;
    postComment(args: PostCommentArgs): Promise<unknown>;
    deleteComment(args: DeleteCommentArgs): Promise<unknown>;
}
