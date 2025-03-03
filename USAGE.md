# Using the Figma MCP Server

This document explains how to use the mcp-figma package.

## Setup

### Installation

To install the package globally:
```bash
npm install -g mcp-figma
```

Or install it locally:
```bash
npm install mcp-figma
```

### Configuration with Claude

Add mcp-figma to your Claude configuration (typically found in `~/.config/anthropic/claude/mcp_config.json` or similar):

```json
"mcp-figma": {
  "command": "npx",
  "args": [
    "-y", 
    "mcp-figma"
  ]
}
```

## Obtaining a Figma API Key

To use this MCP server, you need a Figma personal access token:

1. Go to your Figma account settings
2. Navigate to the "Personal Access Tokens" section
3. Create a new token (give it a name that helps you remember what it's for)
4. Copy the token - you'll need to provide it to the MCP server

## Basic Usage

### Setting up your API Key

When using Claude with mcp-figma for the first time, you need to set your API key:

```
Please use mcp-figma to set my Figma API key: figd_xxxxxxxxxxxxxxxxxxxxxxx
```

Your API key will be saved to `~/.mcp-figma/config.json` and will be automatically loaded in future sessions.

### Checking API Key Status

You can verify if an API key is already configured:

```
Please use mcp-figma to check my API key status
```

### Using Figma API Functions

After setting the API key, you can use any of the other tools:

```
Please use mcp-figma to get the file with key abc123
```

## Available Tools

### Files

- `get_file`: Get a Figma file by key
  ```json
  {
    "name": "get_file",
    "arguments": {
      "fileKey": "your-file-key"
    }
  }
  ```

- `get_file_nodes`: Get specific nodes from a Figma file
  ```json
  {
    "name": "get_file_nodes",
    "arguments": {
      "fileKey": "your-file-key",
      "node_ids": ["node-id-1", "node-id-2"]
    }
  }
  ```

- `get_image`: Get images for nodes in a Figma file
  ```json
  {
    "name": "get_image",
    "arguments": {
      "fileKey": "your-file-key",
      "ids": ["node-id-1", "node-id-2"],
      "format": "png",
      "scale": 2
    }
  }
  ```

- `get_image_fills`: Get URLs for images used in a Figma file
  ```json
  {
    "name": "get_image_fills",
    "arguments": {
      "fileKey": "your-file-key"
    }
  }
  ```

### Comments

- `get_comments`: Get comments on a Figma file
  ```json
  {
    "name": "get_comments",
    "arguments": {
      "fileKey": "your-file-key"
    }
  }
  ```

- `post_comment`: Post a comment on a Figma file
  ```json
  {
    "name": "post_comment",
    "arguments": {
      "fileKey": "your-file-key",
      "message": "This is a comment",
      "client_meta": {
        "x": 100,
        "y": 200
      }
    }
  }
  ```

- `delete_comment`: Delete a comment from a Figma file
  ```json
  {
    "name": "delete_comment",
    "arguments": {
      "fileKey": "your-file-key",
      "comment_id": "comment-id"
    }
  }
  ```

### Teams and Projects

- `get_team_projects`: Get projects for a team
  ```json
  {
    "name": "get_team_projects",
    "arguments": {
      "team_id": "team-id"
    }
  }
  ```

- `get_project_files`: Get files for a project
  ```json
  {
    "name": "get_project_files",
    "arguments": {
      "project_id": "project-id"
    }
  }
  ```

### Components and Styles

- `get_team_components`: Get components for a team
  ```json
  {
    "name": "get_team_components",
    "arguments": {
      "team_id": "team-id"
    }
  }
  ```

- `get_file_components`: Get components from a file
  ```json
  {
    "name": "get_file_components",
    "arguments": {
      "fileKey": "your-file-key"
    }
  }
  ```

- `get_component`: Get a component by key
  ```json
  {
    "name": "get_component",
    "arguments": {
      "key": "component-key"
    }
  }
  ```

- `get_file_styles`: Get styles from a file
  ```json
  {
    "name": "get_file_styles",
    "arguments": {
      "fileKey": "your-file-key"
    }
  }
  ```

- `get_style`: Get a style by key
  ```json
  {
    "name": "get_style",
    "arguments": {
      "key": "style-key"
    }
  }
  ```

## Troubleshooting

If you encounter errors:

1. Make sure your Figma API key is valid
2. Check that the fileKey or other IDs are correct
3. Verify you have the right permissions for the resource you're trying to access
4. Examine error messages - they will usually indicate what went wrong

## Limitations

Remember that the Figma API has rate limits. If you make too many requests in a short period, you may be rate-limited.