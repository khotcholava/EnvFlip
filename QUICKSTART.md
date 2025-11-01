# Quick Start Guide

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:

- TypeScript compiler
- VS Code API types
- ESLint for code quality

### 2. Compile the Extension

```bash
npm run compile
```

This compiles the TypeScript source files from `src/` to JavaScript in `dist/`.

### 3. Run the Extension

**Option A: Using VS Code**

1. Open this folder in VS Code
2. Press `F5` (or go to Run → Start Debugging)
3. A new VS Code window will open with the extension loaded

**Option B: Using the Command Palette**

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
2. Type "Debug: Start Debugging" and select it

### 4. Test the Extension

In the Extension Development Host window:

1. **Open a workspace** that contains `.env` files (or create some test files)
2. **Look for the EnvFlip icon** in the Activity Bar (left sidebar)
3. **Click the icon** to open the EnvFlip view
4. You should see all your `.env*` files grouped by name
5. **Click on any environment variable** to toggle it on/off

### 5. Development Workflow

**Watch Mode** (automatically recompile on changes):

```bash
npm run watch
```

After making changes:

1. Reload the Extension Development Host window (`Cmd+R` or `Ctrl+R`)
2. Or restart debugging (`F5`)

## Testing Features

### Create Test .env Files

You can create test files in any workspace to test the extension:

**`.env`**

```env
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=test123
#DEBUG=true
```

**`.env.local`**

```env
DATABASE_URL=postgresql://localhost:5432/mydb_local
API_ENDPOINT=http://localhost:8080
```

**`.env.production`**

```env
DATABASE_URL=postgresql://prod:5432/mydb_prod
API_ENDPOINT=https://api.production.com
```

### Expected Behavior

1. **File Groups**: Each `.env*` file appears as a collapsible group

   - `.env` → "Env"
   - `.env.local` → "Env Local"
   - `.env.production` → "Env Production"

2. **Variable Display**:

   - ✓ icon = Active variable (uncommented)
   - ⊘ icon = Inactive variable (commented)
   - Value shown as description

3. **Toggle Functionality**:

   - Click any variable to toggle it
   - Active → Inactive: Line gets commented with `#`
   - Inactive → Active: `#` is removed
   - File auto-saves after each toggle
   - Status bar shows brief confirmation

4. **Auto-Refresh**:
   - Tree updates when files are modified externally
   - Manual refresh available via button in view title

## Package the Extension

To create a `.vsix` file for distribution:

```bash
npm run package
```

This creates `envflip-0.0.1.vsix` which can be installed in any VS Code instance.

## Installing the Packaged Extension

```bash
code --install-extension envflip-0.0.1.vsix
```

Or via Command Palette:

1. `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type "Extensions: Install from VSIX"
3. Select the `.vsix` file

## Troubleshooting

**Extension doesn't appear:**

- Make sure you opened a folder/workspace (not just a single file)
- Check the Output panel (View → Output) and select "EnvFlip" from the dropdown

**No .env files shown:**

- Ensure you have `.env` files in your workspace
- Try the Refresh button in the view title
- Check that files aren't in `node_modules` (they're excluded)

**Changes not taking effect:**

- Reload the Extension Development Host window
- Check for TypeScript compilation errors in the terminal

## Extension Structure

```
env_manager/
├── src/
│   ├── extension.ts         # Main entry point
│   ├── envTreeProvider.ts   # Tree view implementation
│   ├── envFileParser.ts     # .env file parsing logic
│   └── envFileManager.ts    # File modification logic
├── resources/
│   └── icon.svg             # Activity bar icon
├── package.json             # Extension manifest
├── tsconfig.json            # TypeScript config
└── README.md                # Documentation
```

## Next Steps

- Add unit tests
- Publish to VS Code Marketplace
- Add more features (search, bulk toggle, etc.)
- Customize the icon and theme colors
