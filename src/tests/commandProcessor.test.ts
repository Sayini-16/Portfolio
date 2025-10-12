import { describe, it, expect, vi } from 'vitest';
import { processCommand } from '../lib/commandProcessor';
import * as commands from '../lib/commands';
import { CommandContext } from '../lib/commands';

describe('processCommand', () => {
  const commandContext: CommandContext = {
    commandHistory: [],
    theme: 'matrix' as const,
    setTheme: vi.fn(),
    setHistory: vi.fn(),
  };

  it('should return null for an empty command', () => {
    const result = processCommand('', commandContext);
    expect(result).toBeNull();
  });

  it('should return the output of a valid command', () => {
    const result = processCommand('help', commandContext);
    expect(result).toEqual(commands.commands.help.execute(commandContext));
  });

  it('should return an error for an unknown command', () => {
    const result = processCommand('unknown', commandContext);
    expect(result).toEqual({
      type: 'error',
      content: `Command not found: unknown\n\nType 'help' for available commands or try asking me a question!\nExample: "What technologies do you know?"`,
    });
  });

  it('should return an AI response for a natural language query', () => {
    const result = processCommand('what technologies do you know?', commandContext);
    expect(result?.type).toBe('ai');
    expect(result?.content).toBeDefined();
  });
});