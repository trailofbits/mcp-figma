import { FigmaApi } from '../utils/api.js';
import {
  GetTeamProjectsArgs,
  GetProjectFilesArgs,
  GetTeamComponentsArgs,
  GetFileComponentsArgs,
  GetComponentArgs,
  GetTeamComponentSetsArgs,
  GetTeamStylesArgs,
  GetFileStylesArgs,
  GetStyleArgs
} from '../types/projects.js';

export class ProjectsHandler {
  constructor(private api: FigmaApi) {}

  async getTeamProjects(args: GetTeamProjectsArgs) {
    const { team_id, ...paginationParams } = args;
    
    const params = { ...paginationParams };
    return this.api.makeRequest(`/teams/${team_id}/projects${this.api.buildQueryString(params)}`);
  }

  async getProjectFiles(args: GetProjectFilesArgs) {
    const { project_id, branch_data, ...paginationParams } = args;
    
    const params = { ...paginationParams, branch_data };
    return this.api.makeRequest(`/projects/${project_id}/files${this.api.buildQueryString(params)}`);
  }

  async getTeamComponents(args: GetTeamComponentsArgs) {
    const { team_id, ...paginationParams } = args;
    
    const params = { ...paginationParams };
    return this.api.makeRequest(`/teams/${team_id}/components${this.api.buildQueryString(params)}`);
  }

  async getFileComponents(args: GetFileComponentsArgs) {
    const { fileKey } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/components`);
  }

  async getComponent(args: GetComponentArgs) {
    const { key } = args;
    
    return this.api.makeRequest(`/components/${key}`);
  }

  async getTeamComponentSets(args: GetTeamComponentSetsArgs) {
    const { team_id, ...paginationParams } = args;
    
    const params = { ...paginationParams };
    return this.api.makeRequest(`/teams/${team_id}/component_sets${this.api.buildQueryString(params)}`);
  }

  async getTeamStyles(args: GetTeamStylesArgs) {
    const { team_id, ...paginationParams } = args;
    
    const params = { ...paginationParams };
    return this.api.makeRequest(`/teams/${team_id}/styles${this.api.buildQueryString(params)}`);
  }

  async getFileStyles(args: GetFileStylesArgs) {
    const { fileKey } = args;
    
    return this.api.makeRequest(`/files/${fileKey}/styles`);
  }

  async getStyle(args: GetStyleArgs) {
    const { key } = args;
    
    return this.api.makeRequest(`/styles/${key}`);
  }
}