import { FigmaApi } from '../utils/api.js';
import { GetTeamProjectsArgs, GetProjectFilesArgs, GetTeamComponentsArgs, GetFileComponentsArgs, GetComponentArgs, GetTeamComponentSetsArgs, GetTeamStylesArgs, GetFileStylesArgs, GetStyleArgs } from '../types/projects.js';
export declare class ProjectsHandler {
    private api;
    constructor(api: FigmaApi);
    getTeamProjects(args: GetTeamProjectsArgs): Promise<unknown>;
    getProjectFiles(args: GetProjectFilesArgs): Promise<unknown>;
    getTeamComponents(args: GetTeamComponentsArgs): Promise<unknown>;
    getFileComponents(args: GetFileComponentsArgs): Promise<unknown>;
    getComponent(args: GetComponentArgs): Promise<unknown>;
    getTeamComponentSets(args: GetTeamComponentSetsArgs): Promise<unknown>;
    getTeamStyles(args: GetTeamStylesArgs): Promise<unknown>;
    getFileStyles(args: GetFileStylesArgs): Promise<unknown>;
    getStyle(args: GetStyleArgs): Promise<unknown>;
}
