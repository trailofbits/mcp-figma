import { FigmaApi } from '../utils/api.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  GetFileArgs,
  GetFileNodesArgs,
  GetImageArgs,
  GetImageFillsArgs,
  GetCommentsArgs,
  PostCommentArgs,
  DeleteCommentArgs
} from '../types/files.js';

export class FilesHandler {
  constructor(private api: FigmaApi) {}

  async getFile(args: GetFileArgs) {
    const { fileKey, branch_data, ids, version, depth } = args;
    
    const params: Record<string, string | number | boolean | undefined> = {
      branch_data,
      version,
      depth
    };

    return this.api.makeRequest(`/files/${fileKey}${this.api.buildQueryString(params)}`);
  }

  async getFileNodes(args: GetFileNodesArgs) {
    const { fileKey, node_ids, ...otherParams } = args;
    
    const params: Record<string, string | number | boolean | undefined> = {
      ...otherParams,
      ids: node_ids.join(',')
    };

    return this.api.makeRequest(`/files/${fileKey}/nodes${this.api.buildQueryString(params)}`);
  }

  async getImage(args: GetImageArgs) {
    const { fileKey, ids, scale, format, svg_include_id, svg_simplify_stroke, use_absolute_bounds } = args;
    
    const params: Record<string, string | number | boolean | undefined> = {
      ids: ids.join(','),
      scale,
      format,
      svg_include_id,
      svg_simplify_stroke,
      use_absolute_bounds
    };

    return this.api.makeRequest(`/images/${fileKey}${this.api.buildQueryString(params)}`);
  }

  async getImageFills(args: GetImageFillsArgs) {
    const { fileKey } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/images`);
  }

  async getComments(args: GetCommentsArgs) {
    const { fileKey } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/comments`);
  }

  async postComment(args: PostCommentArgs) {
    const { fileKey, ...commentData } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/comments`, 'POST', commentData);
  }

  async deleteComment(args: DeleteCommentArgs) {
    const { fileKey, comment_id } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/comments/${comment_id}`, 'DELETE');
  }
}