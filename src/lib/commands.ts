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

// ============================================
// Formatting Helpers for Improved Readability
// ============================================

/** Creates a section header: === TEXT === */
const header = (text: string): string => `=== ${text.toUpperCase()} ===`;

/** Creates a cleaner skill bar: [=====     ] */
const skillBar = (percent: number, width = 20): string => {
  const filled = Math.round((percent / 100) * width);
  return `[${"=".repeat(filled)}${" ".repeat(width - filled)}]`;
};

/** Right-aligns text within a given width */
const alignRight = (left: string, right: string, width = 38): string => {
  const padding = width - left.length - right.length;
  return `${left}${" ".repeat(Math.max(1, padding))}${right}`;
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

/** Formats projects with improved readability */
const formatProjects = () =>
  projectsData.projects
    .map((p) => {
      const title = p.title.toUpperCase();
      const desc = p.description;
      const details = (p.details || []).map((d) => `  > ${d}`).join("\n");
      const tech = `  * ${p.tech}`;
      const links = (p.links || []).map((l) => l.name).join(" | ");
      const linkLine = `  @ ${links}`;

      return [title, desc, "", details, "", tech, linkLine].join("\n");
    })
    .join("\n\n\n");

export const commands: Record<CommandKey, Command> = {
  help: {
    description: "Show available commands",
    execute: () => ({
      type: "info",
      content: [
        header("COMMANDS"),
        "",
        "Content",
        "-------",
        "  about         Learn about me",
        "  projects      View featured projects",
        "  skills        Technical skills",
        "  experience    Work experience",
        "  education     Education background",
        "  achievements  Key accomplishments",
        "  contact       Contact information",
        "  social        Social links",
        "",
        "Tools",
        "-----",
        "  resume        Download my resume",
        "  theme <name>  Change theme",
        "  themes        List all themes",
        "  history       Command history",
        "  clear         Clear terminal",
        "",
        "Shortcuts",
        "---------",
        "  TAB           Autocomplete",
        "  Up/Down       History navigation",
        "  Ctrl+T        Cycle theme",
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
      content: `${header("FEATURED PROJECTS")}\n\n\n${formatProjects()}`,
    }),
  },
  skills: {
    description: "View technical skills",
    execute: () => {
      const content = skillsData.skills
        .map((s) => {
          const titleLine = alignRight(s.name, `${s.level}%`);
          const bar = skillBar(s.level);
          return [titleLine, bar, s.keywords].join("\n");
        })
        .join("\n\n");
      return { type: "info", content: `${header("TECHNICAL SKILLS")}\n\n\n${content}` };
    },
  },
  experience: {
    description: "View work experience",
    execute: () => {
      const formatRole = (e: typeof experienceData.experience[0]) => {
        const title = e.title.toUpperCase();
        const company = e.company;
        const period = `${e.start} - ${e.end} | ${e.location}`;
        const bullets = (e.bullets || []).map((b: string) => `  > ${b}`);
        const tech = e.tech?.length ? `  * ${e.tech.join(", ")}` : "";

        return [title, company, period, "", ...bullets, "", tech]
          .filter(Boolean)
          .join("\n");
      };

      const content = experienceData.experience
        .map((e) => formatRole(e))
        .join("\n\n---\n\n");

      return { type: "info", content: `${header("WORK EXPERIENCE")}\n\n\n${content}` };
    },
  },
  education: {
    description: "View educational background",
    execute: () => {
      const formatDegree = (d: typeof educationData.degrees[0]) => {
        const degree = d.degree.toUpperCase();
        // Shorten long institution names for mobile
        const inst = d.institution.length > 30
          ? d.institution.split(" ").slice(0, 3).join(" ")
          : d.institution;
        const period = `${d.start} - ${d.end}`;
        const details = (d.details || []).map((x: string) => `  ${x}`);
        return [degree, inst, period, "", ...details].join("\n");
      };

      const sections: string[] = [header("EDUCATION"), "", ""];

      if (educationData.degrees?.length) {
        sections.push(educationData.degrees.map(formatDegree).join("\n\n---\n\n"));
      }

      if (educationData.certifications?.length) {
        sections.push("", "", header("CERTIFICATIONS"), "");
        sections.push(...educationData.certifications.map((c: string) => `  > ${c}`));
      }

      if (educationData.learning?.length) {
        sections.push("", "", header("CURRENT LEARNING"), "");
        sections.push(...educationData.learning.map((l: string) => `  - ${l}`));
      }

      return { type: "info", content: sections.join("\n") };
    },
  },
  achievements: {
    description: "View accomplishments",
    execute: () => ({
      type: "success",
      content: [
        header("KEY ACHIEVEMENTS"),
        "",
        ...achievementsData.achievements.map((a: string) => `  > ${a}`),
      ].join("\n"),
    }),
  },
  contact: {
    description: "Get contact information",
    execute: () => ({
      type: "info",
      content: [
        header("CONTACT"),
        "",
        `  Email      ${contactData.email}`,
        `  Phone      ${contactData.phone}`,
        `  Location   ${contactData.location}`,
        "",
        "  ---",
        "",
        `  LinkedIn   ${contactData.linkedin}`,
        `  GitHub     ${contactData.github}`,
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
      content: [
        header("SOCIAL"),
        "",
        ...socialData.links.map((l) => `  ${l.name.padEnd(12)} ${l.url}`),
      ].join("\n"),
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
        header("THEMES"),
        "",
        "  matrix      Green hacker terminal",
        "  dracula     Purple and cyan",
        "  monokai     Sublime inspired",
        "  cyberpunk   Neon pink and cyan",
        "  hacker      Black & green retro",
        "",
        "Usage: theme <name>",
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
