export class ProjectsHandler {
    constructor(api) {
        this.api = api;
    }
    async getTeamProjects(args) {
        const { team_id, ...paginationParams } = args;
        const params = { ...paginationParams };
        return this.api.makeRequest(`/teams/${team_id}/projects${this.api.buildQueryString(params)}`);
    }
    async getProjectFiles(args) {
        const { project_id, branch_data, ...paginationParams } = args;
        const params = { ...paginationParams, branch_data };
        return this.api.makeRequest(`/projects/${project_id}/files${this.api.buildQueryString(params)}`);
    }
    async getTeamComponents(args) {
        const { team_id, ...paginationParams } = args;
        const params = { ...paginationParams };
        return this.api.makeRequest(`/teams/${team_id}/components${this.api.buildQueryString(params)}`);
    }
    async getFileComponents(args) {
        const { fileKey } = args;
        return this.api.makeRequest(`/files/${fileKey}/components`);
    }
    async getComponent(args) {
        const { key } = args;
        return this.api.makeRequest(`/components/${key}`);
    }
    async getTeamComponentSets(args) {
        const { team_id, ...paginationParams } = args;
        const params = { ...paginationParams };
        return this.api.makeRequest(`/teams/${team_id}/component_sets${this.api.buildQueryString(params)}`);
    }
    async getTeamStyles(args) {
        const { team_id, ...paginationParams } = args;
        const params = { ...paginationParams };
        return this.api.makeRequest(`/teams/${team_id}/styles${this.api.buildQueryString(params)}`);
    }
    async getFileStyles(args) {
        const { fileKey } = args;
        return this.api.makeRequest(`/files/${fileKey}/styles`);
    }
    async getStyle(args) {
        const { key } = args;
        return this.api.makeRequest(`/styles/${key}`);
    }
}
