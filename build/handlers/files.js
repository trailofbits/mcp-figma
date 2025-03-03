export class FilesHandler {
    constructor(api) {
        this.api = api;
    }
    async getFile(args) {
        const { fileKey, branch_data, ids, version, depth } = args;
        const params = {
            branch_data,
            version,
            depth
        };
        return this.api.makeRequest(`/files/${fileKey}${this.api.buildQueryString(params)}`);
    }
    async getFileNodes(args) {
        const { fileKey, node_ids, ...otherParams } = args;
        const params = {
            ...otherParams,
            ids: node_ids.join(',')
        };
        return this.api.makeRequest(`/files/${fileKey}/nodes${this.api.buildQueryString(params)}`);
    }
    async getImage(args) {
        const { fileKey, ids, scale, format, svg_include_id, svg_simplify_stroke, use_absolute_bounds } = args;
        const params = {
            ids: ids.join(','),
            scale,
            format,
            svg_include_id,
            svg_simplify_stroke,
            use_absolute_bounds
        };
        return this.api.makeRequest(`/images/${fileKey}${this.api.buildQueryString(params)}`);
    }
    async getImageFills(args) {
        const { fileKey } = args;
        return this.api.makeRequest(`/files/${fileKey}/images`);
    }
    async getComments(args) {
        const { fileKey } = args;
        return this.api.makeRequest(`/files/${fileKey}/comments`);
    }
    async postComment(args) {
        const { fileKey, ...commentData } = args;
        return this.api.makeRequest(`/files/${fileKey}/comments`, 'POST', commentData);
    }
    async deleteComment(args) {
        const { fileKey, comment_id } = args;
        return this.api.makeRequest(`/files/${fileKey}/comments/${comment_id}`, 'DELETE');
    }
}
