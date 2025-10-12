const getCyclicResponse = (responses: string[]) => {
    let index = 0;
    return () => {
      const response = responses[index];
      index = (index + 1) % responses.length;
      return response;
    };
  };
  
  const greetings = [
    "Hey there! 👋 Welcome to my interactive portfolio! I'm excited to show you what I've been working on. What would you like to know?",
    "Hello! Thanks for stopping by! I'm an AI assistant here to tell you all about my creator's work. Feel free to ask me anything!",
    "Hi! Great to see you here! I'm ready to chat about projects, skills, or anything else you're curious about. What interests you?"
  ];
  
  export const aiResponses = {
    technologies: getCyclicResponse([
      "I work with a wide range of technologies! Frontend: React, Next.js, Vue.js, TypeScript, and Tailwind CSS. Backend: Node.js, Python, FastAPI, and GraphQL. Databases: PostgreSQL, MongoDB, Redis. DevOps: AWS, Docker, Kubernetes. Also experienced with AI/ML using TensorFlow and PyTorch. Always learning and exploring new tech! Want to know more about any specific area?",
      "My tech stack is pretty broad. I'm proficient in frontend technologies like React, Next.js, and Vue.js, as well as backend technologies such as Node.js, Python, and FastAPI. I also have experience with databases like PostgreSQL and MongoDB, and DevOps tools like Docker and Kubernetes. I'm always excited to learn new things!",
      "I'm a versatile developer with experience in a variety of technologies. On the frontend, I enjoy working with React and TypeScript, and on the backend, I'm a fan of Python and FastAPI. I'm also comfortable with cloud platforms like AWS and containerization with Docker. What technologies are you interested in?"
    ]),
    unique: getCyclicResponse([
      "What makes me unique is my blend of technical depth and leadership skills. I've architected systems serving millions of users, led cross-functional teams, and contributed to major open-source projects. I bring both strategic thinking and hands-on expertise, whether it's optimizing performance or mentoring junior developers. My track record shows consistent delivery of high-impact solutions while fostering team growth.",
      "I'd say my unique strength is my ability to bridge the gap between technical and business needs. I'm not just a coder; I'm a problem-solver who can translate complex requirements into scalable and maintainable software. I'm also a strong communicator and a natural leader, which has helped me build and motivate high-performing teams.",
      "My experience in both large-scale systems and early-stage startups gives me a unique perspective. I can think about the long-term vision and architecture, but I'm also not afraid to get my hands dirty and write code. I'm a product-minded engineer who is passionate about building things that people love."
    ]),
    greetings: getCyclicResponse(greetings),
    latest: getCyclicResponse([
      "My latest project is an AI-powered task management system that's generating some serious buzz! It uses machine learning to automatically prioritize tasks based on deadlines, importance, and your personal work patterns. The ML model achieves 95% accuracy in predictions. We've hit 50K active users with a 4.8-star rating. The tech stack includes React for the frontend, Python with TensorFlow for the ML backend, and FastAPI for serving predictions. Want to know more about the technical challenges we solved?",
      "I just wrapped up a project that I'm really proud of. It's a real-time collaborative whiteboard that allows teams to brainstorm and work together from anywhere. We used WebSockets for the real-time communication and a custom rendering engine for the whiteboard. It's been a huge success, with over 100,000 users in the first month.",
      "I'm currently working on a new mobile app that helps people learn new languages. It uses a combination of gamification and spaced repetition to make learning fun and effective. We're still in the early stages, but the initial feedback has been amazing. I'm really excited about the potential of this project."
    ]),
    hire: getCyclicResponse([
      "I'm definitely open to the right opportunities! I thrive in environments that value technical excellence, innovation, and collaboration. I'm particularly interested in roles involving system architecture, performance optimization, or AI/ML integration. I bring proven leadership experience, a track record of delivering high-impact projects, and a passion for mentoring others. I've reduced infrastructure costs by 40%, led teams of 8+ developers, and maintained systems serving millions of users. Ready to discuss how I can contribute to your team? Let's connect at your.email@example.com!",
      "I'm actively looking for my next challenge. I'm a passionate and driven engineer with a proven track record of success. I'm confident that I can make a significant impact on your team. I'm eager to learn more about your company and the opportunities you have available.",
      "I'm always open to discussing new opportunities. I'm a highly motivated and results-oriented engineer with a passion for building great products. I'm looking for a company where I can make a real difference and continue to grow as a developer. If you think I'd be a good fit for your team, I'd love to hear from you."
    ]),
    passionate: getCyclicResponse([
      "I'm genuinely passionate about building things that matter! Clean architecture that scales, UIs that delight users, and mentoring developers to reach their potential. I love the problem-solving aspect of engineering—that feeling when a complex system finally clicks into place. I'm also big on open source (2K+ stars on my library!) and knowledge sharing (25+ technical articles). Outside of work, I'm exploring AI/ML applications and constantly learning new technologies. What drives you in tech?",
      "I'm a lifelong learner who is passionate about technology. I'm always reading, experimenting, and trying to find new and better ways to do things. I'm also a strong believer in the power of community and I'm actively involved in a number of open-source projects. I'm excited to share my passion with you.",
      "I'm passionate about creating software that is not only functional but also beautiful and easy to use. I believe that good design is just as important as good code. I'm also a strong advocate for user-centered design and I'm always looking for ways to improve the user experience."
    ]),
    best: getCyclicResponse([
      "My best project is probably the Real-Time Collaboration Hub. We built an enterprise platform from scratch that now serves Fortune 500 companies. The technical challenges were intense—WebSocket scaling, conflict resolution, and end-to-end encryption—but we nailed it. The platform handles millions of real-time events daily with 99.9% uptime. What makes me proudest? The architecture is so solid that we've onboarded major clients without any major refactoring. It's been a masterclass in system design!",
      "One of my most successful projects was a complete redesign of a major e-commerce website. We improved performance by 50%, increased conversions by 20%, and created a more modern and user-friendly experience. It was a huge undertaking, but the results were well worth it.",
      "I'm particularly proud of a project where I had to build a custom data visualization library from scratch. It was a challenging but rewarding experience that taught me a lot about computer graphics and performance optimization. The library is now used by a number of other teams at my company."
    ]),
    learning: getCyclicResponse([
      "I'm constantly learning! Currently deep-diving into advanced ML techniques, particularly transformer models and their applications in code generation. I'm also exploring Rust for performance-critical systems and studying distributed systems patterns at scale. I believe in the 70-20-10 learning model: 70% hands-on projects, 20% learning from others, 10% formal education. I read technical papers, contribute to open source, and experiment with new frameworks weekly. The tech landscape never stops evolving, and neither do I!",
      "I'm a firm believer in lifelong learning. I'm always looking for new challenges and opportunities to grow. I'm currently learning about the latest advancements in artificial intelligence and machine learning. I'm also working on improving my skills in cloud computing and distributed systems.",
      "I'm always eager to learn new things. I'm currently taking a course on functional programming and I'm also reading a book on software architecture. I'm a big fan of online learning and I'm always looking for new resources to help me grow as a developer."
    ]),
    advice: getCyclicResponse([
      "If I could give one piece of advice to aspiring developers: focus on fundamentals over frameworks. Languages and libraries come and go, but understanding data structures, algorithms, system design, and software engineering principles will serve you forever. Also, build real projects—not just tutorials. And don't underestimate soft skills: communication, collaboration, and mentorship are just as important as coding ability. Finally, contribute to open source. It's the best way to learn from world-class engineers and give back to the community. Want more specific advice on any area?",
      "My advice for new developers is to be patient and persistent. It takes time to become a good developer. Don't be afraid to ask for help and don't be discouraged by setbacks. Just keep learning and practicing, and you'll get there eventually.",
      "I'd tell aspiring developers to focus on building a strong foundation in computer science. Learn about data structures, algorithms, and design patterns. These concepts will be valuable no matter what language or framework you're using. I'd also encourage them to get involved in the open-source community. It's a great way to learn from experienced developers and contribute to meaningful projects."
    ]),
    default: getCyclicResponse([
      "That's an interesting question! While I'm optimized for portfolio-related queries, I'm happy to chat. Try asking me about my projects, technical skills, work experience, what makes me unique, why you should hire me, or what I'm passionate about. Type 'help' to see all available commands, or just ask naturally—I understand conversational questions!",
      "I'm not sure I understand your question. I'm an AI assistant and I'm still under development. I'm best at answering questions about my creator's work. You can ask me about his projects, skills, or experience. You can also type 'help' to see a list of available commands.",
      "I'm sorry, I can't answer that question. I'm a virtual assistant and I'm not supposed to have personal opinions. However, I can tell you about my creator's work. Would you like to know more about his projects, skills, or experience?"
    ])
  };;