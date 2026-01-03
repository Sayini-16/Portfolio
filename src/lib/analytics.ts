type CommandResult = "info" | "list" | "success" | "error" | "welcome" | "progress" | "noop";

export const trackCommandUsage = (command: string, result: CommandResult) => {
  if (typeof window === "undefined") return;

  const payload = { command, result };
  const w = window as any;

  if (typeof w.plausible === "function") {
    w.plausible("terminal_command", { props: payload });
    return;
  }

  if (w.umami && typeof w.umami.track === "function") {
    w.umami.track("terminal_command", payload);
    return;
  }

  if (typeof w.gtag === "function") {
    w.gtag("event", "terminal_command", payload);
  }
};
