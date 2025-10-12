import { commands } from './commands';
import type { CommandKey } from './commands';
import { aiResponses } from './ai';

const aiCommandMap = {
  greetings: /^(hi|hello|hey|greetings|howdy|yo)/,
  technologies: /technolog|stack|language|tools/,
  unique: /unique|different|stand out|special/,
  latest: /latest project|recent project|current project|working on/,
  best: /best project|favorite project|proudest/,
  hire: /hire|job|opportunity|available|looking for/,
  passionate: /passionate|love|enjoy|motivate/,
  learning: /learn|studying|improve|education/,
  advice: /advice|tip|recommend|suggest/,
};

import { CommandContext, CommandOutput } from './commands';

export const processCommand = (
  cmd: string,
  commandContext: CommandContext
): CommandOutput | null => {
  const trimmedCmd = cmd.trim();
  if (!trimmedCmd) return null;

  const parts = trimmedCmd.split(" ");
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(" ");

  if (command in commands && commands[command as CommandKey]) {
    return commands[command as CommandKey].execute(commandContext, args);
  }

  const lowerCmd = trimmedCmd.toLowerCase();
  for (const key in aiCommandMap) {
    const keyword = key as keyof typeof aiCommandMap;
    if (lowerCmd.match(aiCommandMap[keyword])) {
      return {
        type: "ai",
        content: aiResponses[keyword](),
      };
    }
  }

  return {
    type: "error",
    content: `Command not found: ${command}\n\nType 'help' for available commands or try asking me a question!\nExample: "What technologies do you know?"`,
  };
};