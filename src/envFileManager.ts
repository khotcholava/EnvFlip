import * as vscode from "vscode";
import { EnvVariable } from "./envFileParser";

export class EnvFileManager {
  /**
   * Toggle an environment variable (comment/uncomment) and auto-save
   */
  static async toggleVariable(
    uri: vscode.Uri,
    variable: EnvVariable
  ): Promise<void> {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString("utf8");
      const lines = text.split(/\r?\n/);

      if (variable.lineNumber >= lines.length) {
        vscode.window.showErrorMessage("Invalid line number");
        return;
      }

      const line = lines[variable.lineNumber];
      let newLine: string;

      if (variable.isActive) {
        // Comment the line - preserve original indentation
        const leadingWhitespace = line.match(/^\s*/)?.[0] || "";
        const trimmedLine = line.trim();
        newLine = `${leadingWhitespace}#${trimmedLine}`;
      } else {
        // Uncomment the line - preserve original indentation
        const leadingWhitespace = line.match(/^\s*/)?.[0] || "";
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("#")) {
          const uncommented = trimmedLine.substring(1).trim();
          newLine = `${leadingWhitespace}${uncommented}`;
        } else {
          newLine = line; // Should not happen, but fallback
        }
      }

      lines[variable.lineNumber] = newLine;
      const newContent = lines.join("\n");

      // Write the file
      await vscode.workspace.fs.writeFile(uri, Buffer.from(newContent, "utf8"));

      // Show a brief message
      const action = variable.isActive ? "deactivated" : "activated";
      vscode.window.setStatusBarMessage(`${variable.key} ${action}`, 2000);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to toggle variable: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate that a file is a valid .env file
   */
  static isEnvFile(uri: vscode.Uri): boolean {
    const filename = uri.path.split("/").pop() || "";
    return filename.startsWith(".env");
  }
}
