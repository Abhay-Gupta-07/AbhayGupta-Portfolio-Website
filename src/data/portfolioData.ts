export type ProjectCategory = 'Full Stack' | 'AI & Vision' | 'Robotics / IoT' | 'Mobile';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  tags: string[];
  image: string;
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
  metrics: string;
  features: string[];
  techStack: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  badge: string;
  skillsCovered: string[];
  imageUrl?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  iconName?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  highlights: string[];
  type: 'education' | 'leadership' | 'experience';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  features: string[];
}

export interface PersonalInfo {
  name: string;
  handle: string;
  titles: string[];
  bio: string;
  longBio: string;
  education: string;
  location: string;
  email: string;
  socials: {
    instagram: string;
    github: string;
    linkedin: string;
  };
  resumeUrl: string;
  avatarUrl: string;
  livePortfolioUrl: string;
  stats: { label: string; value: string }[];
}

export interface PortfolioData {
  personal: PersonalInfo;
  projects: Project[];
  certificates: Certificate[];
  skills: SkillCategory[];
  services: ServiceItem[];
  timeline: TimelineItem[];
}

export const initialPortfolioData: PortfolioData = {
  personal: {
    name: "ABHAY GUPTA",
    handle: "@darshkawaqt",
    titles: [
      "AI & Machine Learning Engineer",
      "Next.js & Full Stack Developer",
      "Computer Science Engineer (CSE AI/ML)",
      "Computer Vision & Deep Learning Specialist",
      "Creative Technologist"
    ],
    bio: "Passionate B.Tech Final Year CSE Engineer specializing in AI & Machine Learning, crafting high-performance neural networks, computer vision models, and dark luxury web applications.",
    longBio: "I specialize in Artificial Intelligence & Machine Learning pipelines (Python, TensorFlow, PyTorch, OpenCV), modern web architecture (Next.js, React 19, TypeScript), and full-stack software development. Currently in my B.Tech Final Year CSE (AI & ML) at Mahaveer Institute of Science and Technology, Hyderabad, Telangana, India.",
    education: "B.Tech Final Year Computer Science & Engineering (AI & ML)",
    location: "Hyderabad, Telangana, India",
    email: "abbaabhayyy@gmail.com",
    socials: {
      instagram: "https://www.instagram.com/darshkawaqt/",
      github: "https://github.com/Abhay-Gupta-07",
      linkedin: "https://www.linkedin.com/in/abhay-gupta-6546aa299/"
    },
    resumeUrl: "/assets/Abhay_Gupta_CV.pdf",
    avatarUrl: "/assets/avatar.png",
    livePortfolioUrl: "https://abhaygupta.vercel.app/",
    stats: [
      { label: "AI & ML Models", value: "10+" },
      { label: "B.Tech CSE Year", value: "Final Year" },
      { label: "Institute", value: "MIST Hyderabad" },
      { label: "Code FPS Target", value: "60 FPS" }
    ]
  },
  projects: [
    {
      id: "official-portfolio",
      title: "Abhay Gupta Official AI & Dev Portfolio",
      subtitle: "Ultra-Dark Marvel Luxury Developer Portfolio",
      description: "Ultra-premium personal portfolio website featuring 192-frame canvas scroll animation, glassmorphism cards, and Spidey Admin console.",
      longDescription: "Engineered with Next.js/Vite React architecture, 60 FPS HTML5 canvas background frame preloader, Framer Motion spring physics interactive 3D lanyard ID card, and deep crimson dark luxury aesthetics.",
      category: "Full Stack",
      tags: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Canvas API", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      liveUrl: "https://abhaygupta.vercel.app/",
      githubUrl: "https://github.com/Abhay-Gupta-07",
      featured: true,
      metrics: "60 FPS Smooth Canvas Scroll",
      features: [
        "192-frame canvas scroll animation renderer",
        "Radial dark patch (#0a0404) watermark masking",
        "Interactive 3D pendulum lanyard ID card for Abhay Gupta",
        "Spidey Admin Console for live bio/project updates"
      ],
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"]
    },
    {
      id: "ai-attendance",
      title: "AI & Machine Learning Biometric System",
      subtitle: "Deep Learning Face Recognition & Analytics Engine",
      description: "Automated real-time face detection & attendance logging system powered by OpenCV, Python PyTorch backend, Supabase, and Next.js UI.",
      longDescription: "High-speed facial landmark extraction and biometric neural network comparison pipeline that automatically logs records into Supabase with low-latency real-time telemetry analytics.",
      category: "AI & Vision",
      tags: ["Python", "PyTorch", "OpenCV", "Next.js", "Supabase", "Machine Learning"],
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
      liveUrl: "https://abhaygupta.vercel.app/",
      githubUrl: "https://github.com/Abhay-Gupta-07",
      featured: true,
      metrics: "99.4% Model Accuracy",
      features: [
        "Multi-face real-time neural network detection",
        "Instant Supabase record logging & verification",
        "Exportable PDF/Excel attendance analytics",
        "Dark glassmorphism administrative dashboard"
      ],
      techStack: ["Python", "PyTorch", "OpenCV", "Next.js", "Supabase"]
    },
    {
      id: "expense-tracker",
      title: "Next.js AI Financial Expense Analytics",
      subtitle: "Smart Money Management & Predictive Insights",
      description: "Comprehensive financial tracker with dark luxury glass visual charts, AI spending prediction, budget tracking, and real-time backend.",
      longDescription: "Full-stack finance management platform allowing users to budget monthly expenses, visualize spending categories via interactive charts, and receive AI-driven spending recommendations.",
      category: "Full Stack",
      tags: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS", "Python AI"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      liveUrl: "https://abhaygupta.vercel.app/",
      githubUrl: "https://github.com/Abhay-Gupta-07",
      featured: true,
      metrics: "< 40ms Data Sync",
      features: [
        "Interactive dark luxury glass financial charts",
        "Category tagging and monthly spending limits",
        "Predictive machine learning spending alerts"
      ],
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"]
    },
    {
      id: "robotics-dashboard",
      title: "IoT & AI Telemetry Control Dashboard",
      subtitle: "Real-Time Sensor & Neural Control Hub",
      description: "Interactive IoT dashboard for real-time sensor visualization, servo control, and telemetry logging for Arduino & ESP32 hardware.",
      longDescription: "Built for hardware prototyping and AI telemetry processing. Connects via WebSockets/Serial to stream real-time motor telemetry, battery voltage, ultrasonic distance, and environmental sensor data.",
      category: "Robotics / IoT",
      tags: ["Arduino", "IoT", "Python AI", "Next.js", "WebSockets", "C++"],
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
      liveUrl: "https://abhaygupta.vercel.app/",
      githubUrl: "https://github.com/Abhay-Gupta-07",
      featured: true,
      metrics: "Sub-10ms Hardware Latency",
      features: [
        "Real-time sensor telemetry gauge charts",
        "Remote motor direction & PWM speed controller",
        "Arduino micro-controller serial bridge protocol"
      ],
      techStack: ["Arduino", "C++", "Next.js", "WebSockets", "Python"]
    },
    {
      id: "flutter-app",
      title: "Cross-Platform AI Mobile App",
      subtitle: "Flutter Neural Processing Solution",
      description: "Native cross-platform Android & iOS application with real-time Firebase backend, smooth animations, and AI model inference.",
      longDescription: "Clean Architecture Flutter mobile app designed for fast performance, offline data caching, push notifications, and on-device AI inference.",
      category: "Mobile",
      tags: ["Flutter", "Dart", "Firebase", "TensorFlow Lite", "Android Studio"],
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      liveUrl: "https://abhaygupta.vercel.app/",
      githubUrl: "https://github.com/Abhay-Gupta-07",
      featured: false,
      metrics: "Cross-Platform 60 FPS UI",
      features: [
        "Flutter BLoC architecture for state management",
        "Real-time Firebase Firestore database sync",
        "Custom dark UI components & push notifications"
      ],
      techStack: ["Flutter", "Dart", "Firebase", "Android Studio"]
    }
  ],
  certificates: [
    {
      id: "cert-scale-up-2k26",
      title: "SCALE-UP 2K26 VOLUNTEER",
      issuer: "Scale-Up Village",
      date: "2026",
      badge: "Scale-Up Village 2026",
      skillsCovered: ["Event Management", "Technical Operations", "Leadership"],
      credentialUrl: "https://www.linkedin.com/in/abhay-gupta-6546aa299/",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-volunteer-2k26",
      title: "VOLUNTEER CERTIFICATE",
      issuer: "Scale-Up 2K26",
      date: "2026 / March 25,26",
      badge: "Volunteer Certification",
      skillsCovered: ["Student Coordination", "Logistics", "Community Outreach"],
      credentialUrl: "https://www.linkedin.com/in/abhay-gupta-6546aa299/",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-technical-support",
      title: "TECHNICAL SUPPORT",
      issuer: "MEX 25",
      date: "2025",
      badge: "MEX 25",
      skillsCovered: ["Hardware Troubleshooting", "Network Infrastructure", "System Admin"],
      credentialUrl: "https://github.com/Abhay-Gupta-07",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-iot-workshop",
      title: "IOT WORKSHOP PARTICIPATION",
      issuer: "IEDC MCEM",
      date: "2024 August 21",
      badge: "IEDC MCEM 2024",
      skillsCovered: ["IoT Sensors", "Arduino Telemetry", "Embedded C++"],
      credentialUrl: "https://github.com/Abhay-Gupta-07",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-developed-arts-website",
      title: "DEVELOPED ARTS WEBSITE",
      issuer: "CSE 2025",
      date: "2025",
      badge: "CSE 2025",
      skillsCovered: ["Full-Stack Engineering", "React", "Next.js", "UI/UX Design"],
      credentialUrl: "https://github.com/Abhay-Gupta-07",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-idea-presentation",
      title: 'IDEA PRESENTATION "THE BIG IDEA"',
      issuer: "IEDC MCEM",
      date: "2024 August 8",
      badge: "Participation",
      skillsCovered: ["Product Pitching", "AI Innovation", "Startup Strategy"],
      credentialUrl: "https://www.linkedin.com/in/abhay-gupta-6546aa299/",
      imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-appreciation-yip",
      title: "APPRECIATION CERTIFICATE",
      issuer: "YIP 7.0",
      date: "2024 November 12",
      badge: "YIP 7.0 2024",
      skillsCovered: ["Youth Innovation", "Research & Prototyping", "AI Models"],
      credentialUrl: "https://www.linkedin.com/in/abhay-gupta-6546aa299/",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "cert-innovation-bootcamp",
      title: "INNOVATION BOOTCAMP PARTICIPATION",
      issuer: "IEDC MCEM",
      date: "2025 January 4-5",
      badge: "IEDC MCEM 2025",
      skillsCovered: ["Design Thinking", "Rapid Prototyping", "Machine Learning"],
      credentialUrl: "https://www.linkedin.com/in/abhay-gupta-6546aa299/",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
    }
  ],
  skills: [
    {
      category: "Artificial Intelligence & Machine Learning",
      description: "Core AI engine, deep neural networks, computer vision, and NLP frameworks",
      skills: [
        { name: "Python", level: 96, highlight: true },
        { name: "Machine Learning & Deep Learning", level: 94, highlight: true },
        { name: "PyTorch & TensorFlow", level: 90, highlight: true },
        { name: "OpenCV & Computer Vision", level: 92, highlight: true },
        { name: "NLP & Scikit-Learn", level: 88, highlight: true },
        { name: "FastAPI & AI Microservices", level: 86 }
      ]
    },
    {
      category: "Languages & Web Frameworks",
      description: "Full-stack web architecture powering scalable web apps",
      skills: [
        { name: "Next.js (App Router)", level: 92, highlight: true },
        { name: "React 19", level: 95, highlight: true },
        { name: "TypeScript", level: 90, highlight: true },
        { name: "Tailwind CSS", level: 96, highlight: true },
        { name: "Node.js & Express", level: 85 },
        { name: "Flutter & Dart", level: 84 },
        { name: "C++", level: 82 },
        { name: "Java", level: 80 }
      ]
    },
    {
      category: "Databases, Hardware & Cloud Tools",
      description: "Cloud infrastructure, database systems, and version control",
      skills: [
        { name: "PostgreSQL & Supabase", level: 90, highlight: true },
        { name: "MongoDB & Firebase", level: 85 },
        { name: "Git & GitHub", level: 94, highlight: true },
        { name: "Vercel & Cloud Deployments", level: 95, highlight: true },
        { name: "Arduino & Embedded Systems", level: 86 }
      ]
    }
  ],
  services: [
    {
      id: "ai-ml-eng",
      title: "AI & Machine Learning Engineering",
      description: "Developing custom deep learning models, computer vision neural networks, and NLP analytics pipelines in Python, PyTorch & TensorFlow.",
      icon: "Eye",
      tags: ["Python", "PyTorch", "TensorFlow", "OpenCV"],
      features: [
        "Facial recognition & biometric detection models",
        "Object detection & image segmentation pipelines",
        "Predictive analytics & classification algorithms",
        "FastAPI deployment for web & mobile integration"
      ]
    },
    {
      id: "fullstack",
      title: "Next.js Full Stack Web Architecture",
      description: "Building ultra-fast dark luxury web apps with Next.js App Router, React 19, TypeScript, and modern database backends.",
      icon: "Code",
      tags: ["Next.js", "React 19", "TypeScript", "Tailwind CSS"],
      features: [
        "Custom glassmorphic 60 FPS user interfaces",
        "Server Actions & API microservices integration",
        "Database integration with Supabase & PostgreSQL",
        "Vercel deployment & performance optimization"
      ]
    },
    {
      id: "flutter",
      title: "Flutter & AI Mobile Application Dev",
      description: "Crafting native cross-platform mobile apps for Android & iOS with Flutter, Firebase, and on-device AI inference.",
      icon: "Smartphone",
      tags: ["Flutter", "Dart", "Firebase", "Android Studio"],
      features: [
        "Smooth native 60 FPS UI/UX animations",
        "Real-time Firebase Firestore database sync",
        "Clean architecture code structure",
        "Cross-platform APK and iOS builds"
      ]
    },
    {
      id: "iot-telemetry",
      title: "IoT Telemetry & Smart Automation",
      description: "Designing real-time microcontroller hardware dashboards, Arduino sensor integration, and telemetry control interfaces.",
      icon: "Cpu",
      tags: ["Arduino", "C++", "IoT", "Telemetry"],
      features: [
        "Arduino micro-controller C++ programming",
        "Real-time sensor telemetry visualization",
        "Remote WebSocket hardware controller",
        "Hardware-software integration"
      ]
    },
    {
      id: "tech-leadership",
      title: "Technical Leadership & Project Guidance",
      description: "Leading AI/ML engineering projects, conducting technical code reviews, and building innovative software solutions at Mahaveer Institute.",
      icon: "Users",
      tags: ["MIST", "Hyderabad", "Mentorship", "AI/ML Lead"],
      features: [
        "B.Tech Final Year Project Lead",
        "Hands-on AI/ML project workshops",
        "Code review & architectural guidance",
        "Team coordination & hackathon execution"
      ]
    }
  ],
  timeline: [
    {
      id: "education-btech",
      period: "2022 - Present",
      role: "B.Tech Final Year Computer Science Engineering (AI & ML)",
      organization: "Mahaveer Institute of Science and Technology",
      location: "Hyderabad, Telangana, India",
      description: "Specializing in Artificial Intelligence, Machine Learning, Deep Learning, Data Structures, Algorithms, Computer Vision, and Full-Stack Software Engineering.",
      highlights: [
        "Specialized stream in AI & Machine Learning",
        "10+ production AI models and full-stack applications engineered",
        "Final year capstone engineering project lead"
      ],
      type: "education"
    },
    {
      id: "leadership-ai-lead",
      period: "2024 - Present",
      role: "AI & Computer Vision Project Lead",
      organization: "Mahaveer Institute Innovation Hub",
      location: "Hyderabad, Telangana, India",
      description: "Leading technical research projects in computer vision facial recognition, automated attendance systems, and deep learning analytics.",
      highlights: [
        "Engineered real-time facial biometric attendance system",
        "Mentored junior CSE students in Python AI/ML libraries",
        "Built dark luxury telemetry web interfaces"
      ],
      type: "leadership"
    },
    {
      id: "experience-freelance",
      period: "2024 - Present",
      role: "Full Stack & AI Engineer (Freelance / Projects)",
      organization: "Independent Software Practice",
      location: "Hyderabad, Telangana, India",
      description: "Building production web applications, AI API integrations, and mobile solutions for clients and open-source projects.",
      highlights: [
        "Built 60 FPS glassmorphism web applications",
        "Integrated OpenCV & PyTorch pipelines into cloud databases",
        "Delivered end-to-end full-stack software"
      ],
      type: "experience"
    }
  ]
};
