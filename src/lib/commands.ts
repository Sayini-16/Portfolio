import { themes } from "./themes";
import type { ThemeKey } from "./themes";

import aboutData from "../data/about.json";
import projectsData from "../data/projects.json";
import skillsData from "../data/skills.json";
import experienceData from "../data/experience.json";
import educationData from "../data/education.json";
import achievementsData from "../data/achievements.json";
import socialData from "../data/social.json";
import contactData from "../data/contact.json";

import type { HistoryEntry } from "../store/terminalStore";

const getResumeUrl = () => {
  const base = import.meta.env.BASE_URL || "/";
  if (import.meta.env.DEV) return `${base}resume.pdf`;
  if (typeof window === "undefined") return `${base}resume.pdf`;
  return new URL(`${base}resume.pdf`, window.location.origin).toString();
};

export type CommandOutput = {
  type: "info" | "list" | "success" | "error" | "welcome" | "progress";
  content: string;
};

// Context passed to command execute functions
export type CommandContext = {
  input: string;
  setInput: (input: string) => void;
  history: HistoryEntry[];
  setHistory: (history: HistoryEntry[]) => void;
  commandHistory: string[];
  isTyping: boolean;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  inputRef: { current: HTMLInputElement | null };
  terminalRef: { current: HTMLDivElement | null };
  handleSubmit: () => void;
  handleKeyDown: () => void;
  runCommand: (cmd: string) => void;
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  persistHistory: boolean;
  setPersistHistory: (persist: boolean) => void;
};

export type Command = {
  description: string;
  execute: (context: CommandContext, args?: string) => CommandOutput | null;
};

export type CommandKey =
  | "help"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "education"
  | "achievements"
  | "contact"
  | "resume"
  | "download"
  | "social"
  | "history"
  | "theme"
  | "themes"
  | "clear";

const formatProjects = () =>
  projectsData.projects
    .map((p, i) => {
      const details = (p.details || []).map((d) => `   - ${d}`).join("\n");
      const links = (p.links || []).map((l) => `[${l.name}]`).join(" ");
      return [
        `${i + 1}. ${p.title}`,
        `   ${p.description}`,
        details,
        `   Tech: ${p.tech}`,
        `   Links: ${links}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

const bar = (percent: number, length = 20) => {
  const filled = Math.round((percent / 100) * length);
  return "#".repeat(filled) + "-".repeat(length - filled);
};

export const commands: Record<CommandKey, Command> = {
  help: {
    description: "Show available commands",
    execute: () => ({
      type: "info",
      content: [
        "Commands:",
        "",
        "  about        - Learn about me",
        "  projects     - View featured projects",
        "  skills       - See technical skills",
        "  experience   - Work experience",
        "  education    - Education and certifications",
        "  achievements - Key accomplishments",
        "  contact      - Contact information",
        "  resume       - Download my resume",
        "  download     - Download my resume",
        "  social       - Social links",
        "  theme        - Change terminal theme",
        "  themes       - List available themes",
        "  history      - Show command history",
        "  history persist on|off - Toggle history persistence",
        "  clear        - Clear the terminal",
        "  help         - Show this help",
        "",
        "Shortcuts:",
        "  TAB          - Autocomplete",
        "  Up/Down      - Command history",
        "  ESC          - Clear suggestions",
        "  Ctrl/Cmd+T   - Cycle theme",
      ].join("\n"),
    }),
  },
  about: {
    description: "Learn about me",
    execute: () => ({ type: "info", content: aboutData.content }),
  },
  projects: {
    description: "View featured projects",
    execute: () => ({
      type: "list",
      content: `\n${projectsData.title}:\n\n${formatProjects()}`,
    }),
  },
  skills: {
    description: "View technical skills",
    execute: () => {
      const content = skillsData.skills
        .map((s) => [s.name, `${bar(s.level)} ${s.level}%`, s.keywords, ""].join("\n"))
        .join("");
      return { type: "info", content: `\n${skillsData.title}:\n\n${content}` };
    },
  },
  experience: {
    description: "View work experience",
    execute: () => {
      const formatRole = (e: typeof experienceData.experience[0]) => {
        const header = `┌─ ${e.title}`;
        const company = `│  @ ${e.company}`;
        const period = `│  ${e.start} - ${e.end} · ${e.location}`;
        const divider = `│`;
        const bullets = (e.bullets || []).map((b: string) => `│  • ${b}`);
        const tech = e.tech?.length ? `│  ▸ ${e.tech.join(" · ")}` : "";
        const footer = `└${"─".repeat(40)}`;

        return [header, company, period, divider, ...bullets, tech, footer]
          .filter(Boolean)
          .join("\n");
      };

      const content = experienceData.experience
        .map((e) => formatRole(e))
        .join("\n\n");

      return { type: "info", content: `\nWork Experience:\n\n${content}` };
    },
  },
  education: {
    description: "View educational background",
    execute: () => {
      const formatDegree = (d: typeof educationData.degrees[0]) => {
        const header = d.degree;
        const line = `${d.institution} | ${d.start} - ${d.end}`;
        const details = (d.details || []).map((x: string) => `  - ${x}`);
        return [header, `  ${line}`, ...details].join("\n");
      };

      const sections: string[] = [];
      if (educationData.degrees?.length) {
        sections.push("Education:", "");
        sections.push(educationData.degrees.map(formatDegree).join("\n\n"));
      }

      if (educationData.certifications?.length) {
        if (sections.length) sections.push("");
        sections.push(
          "Certifications:",
          ...educationData.certifications.map((c: string) => `  - ${c}`)
        );
      }

      if (educationData.learning?.length) {
        if (sections.length) sections.push("");
        sections.push(
          "Continuous Learning:",
          ...educationData.learning.map((l: string) => `  - ${l}`)
        );
      }

      return { type: "info", content: sections.join("\n") };
    },
  },
  achievements: {
    description: "View accomplishments",
    execute: () => ({
      type: "success",
      content: ["Key Achievements:", "", ...achievementsData.achievements.map((a: string) => `- ${a}`)].join("\n"),
    }),
  },
  contact: {
    description: "Get contact information",
    execute: () => ({
      type: "info",
      content: [
        "",
        "Let's Connect:",
        "",
        `  Email:     ${contactData.email}`,
        `  Phone:     ${contactData.phone}`,
        `  Location:  ${contactData.location}`,
        "",
        `  LinkedIn:  ${contactData.linkedin}`,
        `  GitHub:    ${contactData.github}`,
      ].join("\n"),
    }),
  },
  resume: {
    description: "Download resume",
    execute: () => ({
      type: "success",
      content: `Resume ready:\n${getResumeUrl()}`,
    }),
  },
  download: {
    description: "Download resume",
    execute: () => ({
      type: "success",
      content: `Download:\n${getResumeUrl()}`,
    }),
  },
  social: {
    description: "View social media links",
    execute: () => ({
      type: "info",
      content: ["Find me online:", "", ...socialData.links.map((l) => `  ${l.name}: ${l.url}`)].join("\n"),
    }),
  },
  history: {
    description: "Show command history",
    execute: ({ commandHistory, persistHistory, setPersistHistory }, args) => {
      const tokens = args?.trim().split(/\s+/) ?? [];
      if (tokens[0] === "persist") {
        const next = tokens[1]?.toLowerCase();
        if (next !== "on" && next !== "off") {
          return {
            type: "error",
            content: "Usage: history persist on|off",
          };
        }
        const enable = next === "on";
        setPersistHistory(enable);
        return {
          type: "success",
          content: `History persistence ${enable ? "enabled" : "disabled"}.`,
        };
      }

      return {
        type: "info",
        content:
          commandHistory.length > 0
            ? `Command History:\n\n${commandHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`).join("\n")}`
            : persistHistory
              ? "No command history yet. Run some commands to persist them."
              : "No command history yet. Start typing commands!",
      };
    },
  },
  theme: {
    description: "Change terminal theme",
    execute: ({ theme, setTheme }, args?: string) => {
      if (!args) {
        return {
          type: "info",
          content: `Current theme: ${themes[theme].name}\n\nUsage: theme <name>\nAvailable themes: matrix, dracula, monokai, cyberpunk, hacker\n\nOr type "themes" to see all options`,
        };
      }
      const newTheme = args.toLowerCase();
      if (themes[newTheme as ThemeKey]) {
        setTheme(newTheme as ThemeKey);
        return { type: "success", content: `Theme changed to: ${themes[newTheme as ThemeKey].name}` };
      }
      return {
        type: "error",
        content: "Theme not found. Available: matrix, dracula, monokai, cyberpunk, hacker",
      };
    },
  },
  themes: {
    description: "List all available themes",
    execute: () => ({
      type: "info",
      content: [
        "Available Themes:",
        "1. matrix     - Classic green hacker terminal",
        "2. dracula    - Popular purple and cyan theme",
        "3. monokai    - Sublime Text inspired",
        "4. cyberpunk  - Neon pink and cyan aesthetic",
        "5. hacker     - Pure black & green retro style",
        "",
        "Usage: theme <name>",
        "Example: theme dracula",
      ].join("\n"),
    }),
  },
  clear: {
    description: "Clear the terminal",
    execute: ({ setHistory }) => {
      setHistory([]);
      return null;
    },
  },
};
