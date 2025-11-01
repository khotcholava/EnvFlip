import * as vscode from "vscode";

export interface EnvVariable {
  key: string;
  value: string;
  isActive: boolean;
  lineNumber: number;
  originalLine: string;
}

export interface EnvFile {
  uri: vscode.Uri;
  displayName: string;
  variables: EnvVariable[];
}

export class EnvFileParser {
  /**
   * Parse a .env file and extract all environment variables
   */
  static async parseFile(uri: vscode.Uri): Promise<EnvFile> {
    const content = await vscode.workspace.fs.readFile(uri);
    const text = Buffer.from(content).toString("utf8");
    const lines = text.split(/\r?\n/);

    const variables: EnvVariable[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines and comments that are not env variables
      if (
        !trimmedLine ||
        (trimmedLine.startsWith("#") && !this.isCommentedEnvVar(trimmedLine))
      ) {
        return;
      }

      // Check if it's a commented environment variable
      if (trimmedLine.startsWith("#")) {
        const uncommentedLine = trimmedLine.substring(1).trim();
        const match = uncommentedLine.match(
          /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/
        );

        if (match) {
          variables.push({
            key: match[1],
            value: match[2],
            isActive: false,
            lineNumber: index,
            originalLine: line,
          });
        }
      } else {
        // Active environment variable
        const match = trimmedLine.match(
          /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/
        );

        if (match) {
          variables.push({
            key: match[1],
            value: match[2],
            isActive: true,
            lineNumber: index,
            originalLine: line,
          });
        }
      }
    });

    return {
      uri,
      displayName: this.getDisplayName(uri),
      variables,
    };
  }

  /**
   * Check if a commented line is actually a commented environment variable
   */
  private static isCommentedEnvVar(line: string): boolean {
    const uncommented = line.substring(1).trim();
    return /^[A-Za-z_][A-Za-z0-9_]*\s*=/.test(uncommented);
  }

  /**
   * Convert .env filename to display name
   * .env -> "Env"
   * .env.local -> "Env Local"
   * .env.development -> "Env Development"
   */
  static getDisplayName(uri: vscode.Uri): string {
    const filename = uri.path.split("/").pop() || "";

    if (filename === ".env") {
      return "Env";
    }

    // Remove .env prefix and split by dots
    const suffix = filename.replace(/^\.env\.?/, "");

    if (!suffix) {
      return "Env";
    }

    // Capitalize each word
    const words = suffix
      .split(/[._-]/)
      .filter((word: string) => word.length > 0);
    const capitalized = words
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");

    return `Env ${capitalized}`;
  }

  /**
   * Find all .env* files in the workspace
   */
  static async findEnvFiles(): Promise<vscode.Uri[]> {
    const files = await vscode.workspace.findFiles(
      "**/.env*",
      "**/node_modules/**"
    );
    return files.sort((a: vscode.Uri, b: vscode.Uri) => {
      const aName = a.path.split("/").pop() || "";
      const bName = b.path.split("/").pop() || "";

      // Sort .env first, then alphabetically
      if (aName === ".env") return -1;
      if (bName === ".env") return 1;
      return aName.localeCompare(bName);
    });
  }
}
