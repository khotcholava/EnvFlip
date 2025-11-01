import * as vscode from "vscode";
import { EnvTreeProvider, EnvTreeItem } from "./envTreeProvider";
import { EnvFileManager } from "./envFileManager";

export function activate(context: vscode.ExtensionContext) {
  console.log("EnvFlip extension is now active");

  // Create tree view provider
  const treeProvider = new EnvTreeProvider(context);

  // Register tree view
  const treeView = vscode.window.createTreeView("envflip.envView", {
    treeDataProvider: treeProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(treeView);

  // Register refresh command
  const refreshCommand = vscode.commands.registerCommand(
    "envflip.envflip",
    async () => {
      await treeProvider.refresh();
      vscode.window.showInformationMessage("Environment files refreshed");
    }
  );

  context.subscriptions.push(refreshCommand);

  // Register toggle command
  const toggleCommand = vscode.commands.registerCommand(
    "envflip.toggleEnvVar",
    async (item: EnvTreeItem) => {
      if (item.type === "variable" && item.variable && item.envFile) {
        await EnvFileManager.toggleVariable(item.envFile.uri, item.variable);
        // Refresh the tree to show updated state
        await treeProvider.refresh();
      }
    }
  );

  context.subscriptions.push(toggleCommand);

  // Initial load
  treeProvider.refresh();
}

export function deactivate() {
  console.log("EnvFlip extension is now deactivated");
}
