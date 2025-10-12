import { themes } from './themes';
import type { ThemeKey } from './themes';
import aboutData from '../data/about.json';
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';

import { HistoryEntry } from '../hooks/useTerminal';

export type CommandOutput = {
  type: string;
  content: string;
};

export type CommandContext = {
  commandHistory: string[];
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  setHistory: (history: HistoryEntry[]) => void;
};

export type Command = {
  description: string;
  execute: (context: CommandContext, args?: string) => CommandOutput | null;
};

export type CommandKey =
  | 'help'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'achievements'
  | 'contact'
  | 'resume'
  | 'social'
  | 'history'
  | 'theme'
  | 'themes'
  | 'clear';

export const commands: Record<CommandKey, Command> = {
  help: {
    description: 'Show available commands',
    execute: () => ({
      type: 'info',
      content: [
        'Available Commands:',
        '',
        '  about       - Learn about me and my background',
        '  projects    - View my featured projects',
        '  skills      - Check out my technical skills',
        '  experience  - See my work experience',
        '  education   - View my educational background',
        '  contact     - Get my contact information',
        '  resume      - Download my resume',
        '  social      - View my social media links',
        '  achievements - See my accomplishments',
        '  theme       - Change terminal theme',
        '  themes      - List all available themes',
        '  clear       - Clear the terminal',
        '  history     - Show command history',
        '  help        - Show this help message',
        '',
        '💡 Pro Tips:',
        '  • Press TAB for command autocomplete',
        '  • Use ↑/↓ arrows for command history',
        '  • Chat naturally - ask me anything!',
        '',
        'Try asking:',
        '  "What technologies do you know?"',
        '  "Tell me about your best project"',
        '  "Why should I hire you?"',
        '  "What are you passionate about?"'
      ].join('\n')
    })
  },
  about: {
    description: 'Learn about me',
    execute: () => ({
      type: 'ai',
      content: aboutData.content
    })
  },
  projects: {
    description: 'View featured projects',
    execute: () => {
      const content = projectsData.projects.map((p, i) =>
        [
          `${i + 1}. ${p.title}`,
          `   ${p.description}`,
          ...p.details.map(d => `   • ${d}`),
          `   Tech: ${p.tech}`,
          `   Links: ${p.links.map(l => `[${l.name}]`).join(' ')}`,
        ].join('\n')
      ).join('\n\n');

      return {
        type: 'list',
        content: `\n🚀 ${projectsData.title}:\n\n${content}`
      };
    }
  },
  skills: {
    description: 'View technical skills',
    execute: () => {
      const bar = (percent: number, length = 20) => {
        const filled = Math.round((percent / 100) * length);
        return '█'.repeat(filled) + '░'.repeat(length - filled);
      };

      const content = skillsData.skills.map(s =>
        [
          s.name,
          `${bar(s.level)} ${s.level}%`,
          s.keywords,
          ''
        ].join('\n')
      ).join('');

      return {
        type: 'progress',
        content: `\n💻 ${skillsData.title}:\n\n${content}`
      };
    }
  },
  experience: {
    description: 'View work experience',
    execute: () => ({
      type: 'ai',
      content: "📊 Professional Journey:\n\n● Senior Full Stack Engineer @ TechCorp Inc.\n  📅 Jan 2022 - Present | San Francisco, CA\n  • Leading a team of 8 developers across 3 major products\n  • Architected microservices platform serving 1M+ requests/day\n  • Reduced infrastructure costs by 40% through optimization\n  • Mentored 12 junior developers, 3 promoted to mid-level\n  • Tech: React, Node.js, Kubernetes, AWS, PostgreSQL\n\n● Full Stack Developer @ StartupXYZ\n  📅 Mar 2020 - Dec 2021 | Remote\n  • Built the entire platform from 0 to 50K users in 18 months\n  • Implemented real-time collaboration features\n  • Achieved 99.9% uptime with robust monitoring\n  • Raised Series A ($5M) based on technical excellence\n  • Tech: Next.js, Python, MongoDB, Redis, GCP\n\n● Software Developer @ WebAgency Pro\n  📅 Jun 2019 - Feb 2020 | New York, NY\n  • Developed 20+ responsive websites for enterprise clients\n  • Improved page load times by 60% on average\n  • Introduced modern dev practices (CI/CD, code reviews)\n  • Tech: React, Node.js, MySQL, AWS\n\n● Junior Developer @ Digital Solutions\n  📅 Jan 2019 - May 2019 | New York, NY\n  • First role out of bootcamp, learned professional development\n  • Contributed to 5 client projects\n  • Gained foundation in full-stack development"
    })
  },
  education: {
    description: 'View educational background',
    execute: () => ({
      type: 'info',
      content: '🎓 Education & Certifications:\n\n● Bachelor of Science in Computer Science\n  University of Technology | 2015 - 2018\n  GPA: 3.8/4.0 | Dean\'s List\n\n● Full Stack Web Development Bootcamp\n  Tech Academy | 2018\n  Graduated Top of Class\n\n📜 Certifications:\n  • AWS Certified Solutions Architect\n  • Google Cloud Professional Developer\n  • MongoDB Certified Developer\n  • Certified Kubernetes Administrator (CKA)\n\n📚 Continuous Learning:\n  • Machine Learning Specialization (Stanford Online)\n  • System Design Masterclass\n  • Advanced React Patterns'
    })
  },
  achievements: {
    description: 'View accomplishments',
    execute: () => ({
      type: 'success',
      content: '🏆 Key Achievements:\n\n• Built open-source library with 2K+ GitHub stars\n• Speaker at ReactConf 2023 & Node.js Summit 2024\n• Hackathon Winner - Best AI Implementation (2023)\n• Reduced company infrastructure costs by $120K annually\n• Mentored 12 developers, 3 promoted within 6 months\n• Published 25+ technical articles (50K+ readers)\n• Contributed to React, Next.js, and TensorFlow\n• 99.9% uptime maintained across all major projects\n• Led migration serving 1M+ users with zero downtime'
    })
  },
  contact: {
    description: 'Get contact information',
    execute: () => ({
      type: 'info',
      content: [
        '',
        '📬 Let\'s Connect:',
        '',
        '  📧 Email:     your.email@example.com',
        '  📱 Phone:     +1 (555) 123-4567',
        '  📍 Location:  San Francisco, CA',
        '  🌐 Website:   yourportfolio.com',
        '',
        '  💼 LinkedIn:  linkedin.com/in/yourname',
        '  🐙 GitHub:    github.com/yourname',
        '  🐦 Twitter:   @yourhandle',
        '  📝 Medium:    medium.com/@yourname',
        '',
        '⚡ Quick Response: I typically reply within 24 hours!',
        '🤝 Open To: Full-time roles, consulting, collaborations'
      ].join('\n')
    })
  },
  resume: {
    description: 'Download resume',
    execute: () => ({
      type: 'success',
      content: '📄 Initiating download...\n\n████████████████████ 100%\n\n✓ resume.pdf downloaded successfully!\n✓ File size: 245 KB\n✓ Last updated: October 2025\n\nCheck your downloads folder!'
    })
  },
  social: {
    description: 'View social media links',
    execute: () => ({
      type: 'info',
      content: '🔗 Find me online:\n\n  GitHub:    github.com/yourname (2K+ stars)\n  LinkedIn:  linkedin.com/in/yourname (5K+ connections)\n  Twitter:   twitter.com/@yourhandle (Tech & dev content)\n  Medium:    medium.com/@yourname (25+ articles)\n  Dev.to:    dev.to/yourname (Top author)\n  YouTube:   youtube.com/@yourname (Coding tutorials)\n  Stack Overflow: stackoverflow.com/users/yourname (Top 5%)'
    })
  },
  history: {
    description: 'Show command history',
    execute: ({ commandHistory }) => ({
      type: 'info',
      content: commandHistory.length > 0
        ? `Command History:\n\n${commandHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`).join('\n')}`
        : 'No command history yet. Start typing commands!'
    })
  },
  theme: {
    description: 'Change terminal theme',
    execute: ({ theme, setTheme }, args?: string) => {
      if (!args) {
        return {
          type: 'info',
          content: '🎨 Current theme: ' + themes[theme].name + '\n\nUsage: theme <name>\nAvailable themes: matrix, dracula, monokai, cyberpunk, hacker\n\nOr type "themes" to see all options with previews!'
        };
      }
      const newTheme = args.toLowerCase();
      if (themes[newTheme as ThemeKey]) {
        setTheme(newTheme as ThemeKey);
        return {
          type: 'success',
          content: `✓ Theme changed to: ${themes[newTheme as ThemeKey].name}\n\nLooking good! 😎`
        };
      }
      return {
        type: 'error',
        content: 'Theme not found. Available: matrix, dracula, monokai, cyberpunk, hacker'
      };
    }
  },
  themes: {
    description: 'List all available themes',
    execute: () => ({
      type: 'info',
      content: '🎨 Available Themes:\n\n1. matrix     - Classic green hacker terminal\n2. dracula    - Popular purple and cyan theme\n3. monokai    - Sublime Text inspired\n4. cyberpunk  - Neon pink and cyan aesthetic\n5. hacker     - Pure black & green retro style\n\nUsage: theme <name>\nExample: theme dracula'
    })
  },
  clear: {
    description: 'Clear the terminal',
    execute: ({ setHistory }) => {
      setHistory([]);
      return null;
    }
  }
};