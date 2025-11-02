import * as vscode from "vscode";
import { EnvFileParser, EnvFile, EnvVariable } from "./envFileParser";

export class EnvTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly type: "file" | "variable",
    public readonly envFile?: EnvFile,
    public readonly variable?: EnvVariable
  ) {
    super(label, collapsibleState);

    if (type === "file") {
      this.contextValue = "envFile";
      this.iconPath = new vscode.ThemeIcon("file-code");
      this.tooltip = envFile?.uri.fsPath;
    } else if (type === "variable" && variable) {
      this.contextValue = "envVariable";
      this.tooltip = `${variable.key}=${variable.value}`;
      this.description = variable.value;

      // Set icon based on active/inactive state
      if (variable.isActive) {
        this.iconPath = new vscode.ThemeIcon(
          "check",
          new vscode.ThemeColor("testing.iconPassed")
        );
      } else {
        this.iconPath = new vscode.ThemeIcon(
          "circle-slash",
          new vscode.ThemeColor("testing.iconSkipped")
        );
      }

      // Make it clickable
      this.command = {
        command: "envflip.toggleEnvVar",
        title: "Toggle Variable",
        arguments: [this],
      };
    }
  }
}

export class EnvTreeProvider implements vscode.TreeDataProvider<EnvTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<
    EnvTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private envFiles: EnvFile[] = [];
  private fileWatcher?: vscode.FileSystemWatcher;
  private filterText: string = "";
  private treeView?: vscode.TreeView<EnvTreeItem>;
  private message: string = "";

  constructor(private context: vscode.ExtensionContext) {
    this.setupFileWatcher();
  }

  public setTreeView(treeView: vscode.TreeView<EnvTreeItem>) {
    this.treeView = treeView;
    treeView.message = this.message;
  }

  /**
   * Update the message shown above the tree view
   */
  public updateMessage(filterText: string): void {
    if (this.treeView) {
      if (filterText) {
        this.message = `Filtering by: "${filterText}"`;
      } else {
        this.message = "";
      }
      this.treeView.message = this.message;
    }
  }

  /**
   * Set filter text for filtering variables
   */
  setFilter(filterText: string): void {
    this.filterText = filterText;
    this.updateMessage(filterText);
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get current filter text
   */
  getFilter(): string {
    return this.filterText;
  }

  /**
   * Setup file watcher for .env files
   */
  private setupFileWatcher(): void {
    this.fileWatcher = vscode.workspace.createFileSystemWatcher("**/.env*");

    this.fileWatcher.onDidCreate(() => this.refresh());
    this.fileWatcher.onDidChange(() => this.refresh());
    this.fileWatcher.onDidDelete(() => this.refresh());

    this.context.subscriptions.push(this.fileWatcher);
  }

  /**
   * Refresh the tree view
   */
  async refresh(): Promise<void> {
    await this.loadEnvFiles();
    this._onDidChangeTreeData.fire();
  }

  /**
   * Load all .env files from workspace
   */
  private async loadEnvFiles(): Promise<void> {
    const uris = await EnvFileParser.findEnvFiles();
    this.envFiles = await Promise.all(
      uris.map((uri) => EnvFileParser.parseFile(uri))
    );
  }

  getTreeItem(element: EnvTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: EnvTreeItem): Promise<EnvTreeItem[]> {
    if (!element) {
      // Root level - show env files
      if (this.envFiles.length === 0) {
        await this.loadEnvFiles();
      }

      if (this.envFiles.length === 0) {
        return [];
      }

      return this.envFiles.map(
        (file) =>
          new EnvTreeItem(
            file.displayName,
            vscode.TreeItemCollapsibleState.Expanded,
            "file",
            file
          )
      );
    } else if (element.type === "file" && element.envFile) {
      // Child level - show variables
      let variables = element.envFile.variables;

      // Apply filter if set
      if (this.filterText) {
        const filterLower = this.filterText.toLowerCase();
        variables = variables.filter(
          (variable) =>
            variable.key.toLowerCase().includes(filterLower) ||
            variable.value.toLowerCase().includes(filterLower)
        );
      }

      return variables.map(
        (variable) =>
          new EnvTreeItem(
            variable.key,
            vscode.TreeItemCollapsibleState.None,
            "variable",
            element.envFile,
            variable
          )
      );
    }

    return [];
  }

  /**
   * Get the EnvFile for a given tree item
   */
  getEnvFile(item: EnvTreeItem): EnvFile | undefined {
    return item.envFile;
  }

  dispose(): void {
    this.fileWatcher?.dispose();
  }
}
