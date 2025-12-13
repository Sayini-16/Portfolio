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
        "  social       - Social links",
        "  theme        - Change terminal theme",
        "  themes       - List available themes",
        "  history      - Show command history",
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
      const content = experienceData.experience
        .map((e) =>
          [
            `- ${e.title} @ ${e.company}`,
            `  ${e.start} - ${e.end} | ${e.location}`,
            ...(e.bullets || []).map((b: string) => `  - ${b}`),
            e.tech && e.tech.length ? `  Tech: ${e.tech.join(", ")}` : "",
            "",
          ].join("\n")
        )
        .join("");
      return { type: "info", content };
    },
  },
  education: {
    description: "View educational background",
    execute: () => {
      const degrees = educationData.degrees
        .map((d) =>
          [
            `- ${d.degree}`,
            `  ${d.institution} | ${d.start} - ${d.end}`,
            ...(d.details || []).map((x: string) => `  - ${x}`),
            "",
          ].join("\n")
        )
        .join("");
      const certs = educationData.certifications?.length
        ? ["Certifications:", ...educationData.certifications.map((c: string) => `- ${c}`), ""].join("\n")
        : "";
      const learning = educationData.learning?.length
        ? ["Continuous Learning:", ...educationData.learning.map((l: string) => `- ${l}`)].join("\n")
        : "";
      return { type: "info", content: [degrees, certs, learning].filter(Boolean).join("\n") };
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
        `  Website:   ${contactData.website}`,
        "",
        `  LinkedIn:  ${contactData.linkedin}`,
        `  GitHub:    ${contactData.github}`,
        contactData.twitter ? `  Twitter:   ${contactData.twitter}` : "",
        contactData.medium ? `  Medium:    ${contactData.medium}` : "",
      ].filter(Boolean).join("\n"),
    }),
  },
  resume: {
    description: "Download resume",
    execute: () => ({ type: "success", content: "Resume download is not enabled in this demo." }),
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
    execute: ({ commandHistory }) => ({
      type: "info",
      content:
        commandHistory.length > 0
          ? `Command History:\n\n${commandHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`).join("\n")}`
          : "No command history yet. Start typing commands!",
    }),
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

