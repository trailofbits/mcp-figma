import { PaginationParams } from './common.js';

export interface GetTeamProjectsArgs extends PaginationParams {
  team_id: string;
}

export interface GetProjectFilesArgs extends PaginationParams {
  project_id: string;
  branch_data?: boolean;
}

export interface GetTeamComponentsArgs extends PaginationParams {
  team_id: string;
}

export interface GetFileComponentsArgs {
  fileKey: string;
}

export interface GetComponentArgs {
  key: string;
}

export interface GetTeamComponentSetsArgs extends PaginationParams {
  team_id: string;
}

export interface GetTeamStylesArgs extends PaginationParams {
  team_id: string;
}

export interface GetFileStylesArgs {
  fileKey: string;
}

export interface GetStyleArgs {
  key: string;
}