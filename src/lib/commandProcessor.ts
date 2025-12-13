import { commands } from "./commands";
import type { CommandKey } from "./commands";
// Pure terminal: no AI imports

// No AI keyword matching

import type { CommandContext } from "./commands";
import type { CommandOutput } from "./commands";

export const processCommand = (
  cmd: string,
  terminalState: CommandContext
): CommandOutput | null => {
  const trimmedCmd = cmd.trim();
  if (!trimmedCmd) return null;

  const parts = trimmedCmd.split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  if (command in commands && commands[command as CommandKey]) {
    return commands[command as CommandKey].execute(terminalState, args);
  }

  // No AI fallback; unknown text is an error

  return {
    type: "error",
    content: `Unknown command: ${command}\n\nType 'help' to list available commands.`,
  };
};
