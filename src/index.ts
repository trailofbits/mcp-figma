#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { AuthManager } from './utils/auth.js';
import { FigmaApi } from './utils/api.js';
import { FilesHandler } from './handlers/files.js';
import { ProjectsHandler } from './handlers/projects.js';

import {
  GetFileArgs,
  GetFileNodesArgs,
  GetImageArgs,
  GetImageFillsArgs,
  GetCommentsArgs,
  PostCommentArgs,
  DeleteCommentArgs
} from './types/files.js';

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
} from './types/projects.js';

class FigmaServer {
  private validateArgs<T>(args: Record<string, unknown> | undefined, requiredFields: string[]): T {
    if (!args) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Arguments are required'
      );
    }

    for (const field of requiredFields) {
      if (!(field in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required field: ${field}`
        );
      }
    }

    return args as unknown as T;
  }

  private server: Server;
  private authManager: AuthManager;
  private api: FigmaApi;
  private filesHandler: FilesHandler;
  private projectsHandler: ProjectsHandler;

  constructor() {
    this.server = new Server({
      name: 'mcp-figma',
      version: '0.1.0',
      capabilities: {
        tools: {}
      }
    });

    this.authManager = new AuthManager();
    this.api = new FigmaApi(this.authManager);
    this.filesHandler = new FilesHandler(this.api);
    this.projectsHandler = new ProjectsHandler(this.api);

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'set_api_key',
          description: 'Set your Figma API personal access token (will be saved to ~/.mcp-figma/config.json)',
          inputSchema: {
            type: 'object',
            properties: {
              api_key: {
                type: 'string',
                description: 'Your Figma API personal access token'
              }
            },
            required: ['api_key']
          },
        },
        {
          name: 'check_api_key',
          description: 'Check if a Figma API key is already configured',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          },
        },
        {
          name: 'get_file',
          description: 'Get a Figma file by key',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get'
              },
              version: {
                type: 'string',
                description: 'Optional. A specific version ID to get'
              },
              depth: {
                type: 'number',
                description: 'Optional. Depth of nodes to return (1-4)'
              },
              branch_data: {
                type: 'boolean',
                description: 'Optional. Include branch data if true'
              }
            },
            required: ['fileKey']
          },
        },
        {
          name: 'get_file_nodes',
          description: 'Get specific nodes from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get nodes from'
              },
              node_ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of node IDs to get'
              },
              depth: {
                type: 'number',
                description: 'Optional. Depth of nodes to return (1-4)'
              },
              version: {
                type: 'string',
                description: 'Optional. A specific version ID to get'
              }
            },
            required: ['fileKey', 'node_ids']
          },
        },
        {
          name: 'get_image',
          description: 'Get images for nodes in a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get images from'
              },
              ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of node IDs to render'
              },
              scale: {
                type: 'number',
                description: 'Optional. Scale factor to render at (0.01-4)'
              },
              format: {
                type: 'string',
                enum: ['jpg', 'png', 'svg', 'pdf'],
                description: 'Optional. Image format'
              },
              svg_include_id: {
                type: 'boolean',
                description: 'Optional. Include IDs in SVG output'
              },
              svg_simplify_stroke: {
                type: 'boolean',
                description: 'Optional. Simplify strokes in SVG output'
              },
              use_absolute_bounds: {
                type: 'boolean',
                description: 'Optional. Use absolute bounds'
              }
            },
            required: ['fileKey', 'ids']
          },
        },
        {
          name: 'get_image_fills',
          description: 'Get URLs for images used in a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get image fills from'
              }
            },
            required: ['fileKey']
          },
        },
        {
          name: 'get_comments',
          description: 'Get comments on a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get comments from'
              }
            },
            required: ['fileKey']
          },
        },
        {
          name: 'post_comment',
          description: 'Post a comment on a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to comment on'
              },
              message: {
                type: 'string',
                description: 'Comment message text'
              },
              client_meta: {
                type: 'object',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  node_id: { type: 'string' },
                  node_offset: {
                    type: 'object',
                    properties: {
                      x: { type: 'number' },
                      y: { type: 'number' }
                    }
                  }
                },
                description: 'Optional. Position of the comment'
              },
              comment_id: {
                type: 'string',
                description: 'Optional. ID of comment to reply to'
              }
            },
            required: ['fileKey', 'message']
          },
        },
        {
          name: 'delete_comment',
          description: 'Delete a comment from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to delete a comment from'
              },
              comment_id: {
                type: 'string',
                description: 'ID of the comment to delete'
              }
            },
            required: ['fileKey', 'comment_id']
          },
        },
        {
          name: 'get_team_projects',
          description: 'Get projects for a team',
          inputSchema: {
            type: 'object',
            properties: {
              team_id: {
                type: 'string',
                description: 'The team ID'
              },
              page_size: {
                type: 'number',
                description: 'Optional. Number of items per page'
              },
              cursor: {
                type: 'string',
                description: 'Optional. Cursor for pagination'
              }
            },
            required: ['team_id']
          },
        },
        {
          name: 'get_project_files',
          description: 'Get files for a project',
          inputSchema: {
            type: 'object',
            properties: {
              project_id: {
                type: 'string',
                description: 'The project ID'
              },
              page_size: {
                type: 'number',
                description: 'Optional. Number of items per page'
              },
              cursor: {
                type: 'string',
                description: 'Optional. Cursor for pagination'
              },
              branch_data: {
                type: 'boolean',
                description: 'Optional. Include branch data if true'
              }
            },
            required: ['project_id']
          },
        },
        {
          name: 'get_team_components',
          description: 'Get components for a team',
          inputSchema: {
            type: 'object',
            properties: {
              team_id: {
                type: 'string',
                description: 'The team ID'
              },
              page_size: {
                type: 'number',
                description: 'Optional. Number of items per page'
              },
              cursor: {
                type: 'string',
                description: 'Optional. Cursor for pagination'
              }
            },
            required: ['team_id']
          },
        },
        {
          name: 'get_file_components',
          description: 'Get components from a file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get components from'
              }
            },
            required: ['fileKey']
          },
        },
        {
          name: 'get_component',
          description: 'Get a component by key',
          inputSchema: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'The component key'
              }
            },
            required: ['key']
          },
        },
        {
          name: 'get_team_component_sets',
          description: 'Get component sets for a team',
          inputSchema: {
            type: 'object',
            properties: {
              team_id: {
                type: 'string',
                description: 'The team ID'
              },
              page_size: {
                type: 'number',
                description: 'Optional. Number of items per page'
              },
              cursor: {
                type: 'string',
                description: 'Optional. Cursor for pagination'
              }
            },
            required: ['team_id']
          },
        },
        {
          name: 'get_team_styles',
          description: 'Get styles for a team',
          inputSchema: {
            type: 'object',
            properties: {
              team_id: {
                type: 'string',
                description: 'The team ID'
              },
              page_size: {
                type: 'number',
                description: 'Optional. Number of items per page'
              },
              cursor: {
                type: 'string',
                description: 'Optional. Cursor for pagination'
              }
            },
            required: ['team_id']
          },
        },
        {
          name: 'get_file_styles',
          description: 'Get styles from a file',
          inputSchema: {
            type: 'object',
            properties: {
              fileKey: {
                type: 'string',
                description: 'The key of the file to get styles from'
              }
            },
            required: ['fileKey']
          },
        },
        {
          name: 'get_style',
          description: 'Get a style by key',
          inputSchema: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'The style key'
              }
            },
            required: ['key']
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'set_api_key': {
            const args = this.validateArgs<{ api_key: string }>(request.params.arguments, ['api_key']);
            this.authManager.setApiKey(args.api_key);
            return {
              content: [{ type: 'text', text: 'API key set successfully and saved to config file' }],
            };
          }
          
          case 'check_api_key': {
            try {
              const token = await this.authManager.getAccessToken();
              // 只显示部分API key作为安全措施
              const maskedToken = token.substring(0, 5) + '...' + token.substring(token.length - 5);
              return {
                content: [{ type: 'text', text: `API key is configured (${maskedToken})` }],
              };
            } catch (error) {
              return {
                content: [{ type: 'text', text: 'No API key is configured. Please use set_api_key to configure one.' }],
              };
            }
          }

          case 'get_file': {
            const args = this.validateArgs<GetFileArgs>(request.params.arguments, ['fileKey']);
            const result = await this.filesHandler.getFile(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_file_nodes': {
            const args = this.validateArgs<GetFileNodesArgs>(request.params.arguments, ['fileKey', 'node_ids']);
            const result = await this.filesHandler.getFileNodes(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_image': {
            const args = this.validateArgs<GetImageArgs>(request.params.arguments, ['fileKey', 'ids']);
            const result = await this.filesHandler.getImage(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_image_fills': {
            const args = this.validateArgs<GetImageFillsArgs>(request.params.arguments, ['fileKey']);
            const result = await this.filesHandler.getImageFills(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_comments': {
            const args = this.validateArgs<GetCommentsArgs>(request.params.arguments, ['fileKey']);
            const result = await this.filesHandler.getComments(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'post_comment': {
            const args = this.validateArgs<PostCommentArgs>(request.params.arguments, ['fileKey', 'message']);
            const result = await this.filesHandler.postComment(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'delete_comment': {
            const args = this.validateArgs<DeleteCommentArgs>(request.params.arguments, ['fileKey', 'comment_id']);
            const result = await this.filesHandler.deleteComment(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_team_projects': {
            const args = this.validateArgs<GetTeamProjectsArgs>(request.params.arguments, ['team_id']);
            const result = await this.projectsHandler.getTeamProjects(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_project_files': {
            const args = this.validateArgs<GetProjectFilesArgs>(request.params.arguments, ['project_id']);
            const result = await this.projectsHandler.getProjectFiles(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_team_components': {
            const args = this.validateArgs<GetTeamComponentsArgs>(request.params.arguments, ['team_id']);
            const result = await this.projectsHandler.getTeamComponents(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_file_components': {
            const args = this.validateArgs<GetFileComponentsArgs>(request.params.arguments, ['fileKey']);
            const result = await this.projectsHandler.getFileComponents(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_component': {
            const args = this.validateArgs<GetComponentArgs>(request.params.arguments, ['key']);
            const result = await this.projectsHandler.getComponent(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_team_component_sets': {
            const args = this.validateArgs<GetTeamComponentSetsArgs>(request.params.arguments, ['team_id']);
            const result = await this.projectsHandler.getTeamComponentSets(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_team_styles': {
            const args = this.validateArgs<GetTeamStylesArgs>(request.params.arguments, ['team_id']);
            const result = await this.projectsHandler.getTeamStyles(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_file_styles': {
            const args = this.validateArgs<GetFileStylesArgs>(request.params.arguments, ['fileKey']);
            const result = await this.projectsHandler.getFileStyles(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          case 'get_style': {
            const args = this.validateArgs<GetStyleArgs>(request.params.arguments, ['key']);
            const result = await this.projectsHandler.getStyle(args);
            return {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Unexpected error: ${error}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Figma MCP server running on stdio');
  }
}

const server = new FigmaServer();
server.run().catch(console.error);