# EnvFlip

<p align="center">
  <img src="resources/icon.svg" alt="EnvFlip Icon" width="128" height="128">
</p>

A Visual Studio Code extension for managing environment variables in `.env` files with easy toggle functionality.

## Features

- **Custom Sidebar View**: Access all your `.env*` files from a dedicated Activity Bar view
- **File Grouping**: Automatically groups and displays files by name (e.g., `.env` → "Env", `.env.local` → "Env Local")
- **Toggle Variables**: Easily activate/deactivate environment variables by commenting/uncommenting them
- **Auto-Save**: Changes are automatically saved when you toggle a variable
- **File Watching**: Tree view automatically refreshes when `.env` files change

## Usage

1. Open a workspace containing `.env` files
2. Click on the EnvFlip icon in the Activity Bar (left sidebar)
3. Expand the file groups to see all environment variables
4. Click on any variable to toggle it between active and inactive states
   - Active: `KEY=value` (shown with ✓ icon)
   - Inactive: `#KEY=value` (shown with ⊘ icon)

## Supported Files

The extension works with all `.env*` files in your workspace:

- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.staging`
- And any other `.env.*` variants

## Commands

- **Refresh**: Manually refresh the environment files view (also available via the refresh button in the view title)
- **Toggle Environment Variable**: Toggle a variable between active and inactive state (click on the variable)

## Installation

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` to open a new VS Code window with the extension loaded

### From VSIX

1. Run `npm run package` to create a `.vsix` file
2. Install the extension in VS Code:
   - Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
   - Type "Install from VSIX"
   - Select the generated `.vsix` file

## Development

### Prerequisites

- Node.js (v18 or higher)
- Visual Studio Code (v1.85.0 or higher)

### Building

```bash
npm install
npm run compile
```

### Running in Development

Press `F5` in VS Code to open a new Extension Development Host window with the extension loaded.

### Packaging

```bash
npm run package
```

This creates a `.vsix` file that can be installed in VS Code.

## Requirements

- VS Code 1.85.0 or higher

## Known Issues

None at this time. Please report issues on the project repository.

## Release Notes

### 0.0.1

Initial release with core functionality:

- Display `.env*` files in a custom sidebar
- Toggle environment variables on/off
- Auto-save changes
- File watching and auto-refresh

## License

MIT

# EnvFlip
