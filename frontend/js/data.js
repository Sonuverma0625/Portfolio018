const portfolio = {
  name: 'Sonu',
  brand: 'Darkside',
  role: 'Full Stack Developer',
  roles: ['Full Stack Developer', 'C++ Programmer', 'AI/ML Enthusiast', 'Robotics Tinkerer'],
  email: 'vermasonu0625144@gmail.com',
  phone: '+91 9569695752',
  current: 'B.Tech Electronics & Communication Engineering Student',
  about: 'I am Sonu, a Full Stack Developer, C++ Programmer, and AI/ML Enthusiast currently pursuing B.Tech in Electronics and Communication Engineering. I have experience in building responsive websites, full-stack applications, and interactive user interfaces using HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, and MySQL.',
  aboutDetail: 'I am also focused on Data Structures and Algorithms using C++ and continuously improving my problem-solving skills through LeetCode. Along with web development, I have worked on AI/ML concepts through internships and certifications. I enjoy learning new technologies, building practical projects, and turning ideas into clean, functional, and scalable applications.',
  socials: [
    { label: 'GitHub', url: 'https://github.com/Sonuverma0625', mark: 'GH' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/sonu0625', mark: 'in' },
    { label: 'X', url: 'https://x.com/Iam_sonu0625', mark: '𝕏' },
    { label: 'Fiverr', url: 'https://www.fiverr.com/darksideweb', mark: 'Fi' },
  ],
};

const technologies = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'MySQL',
  'C++', 'DSA', 'Python', 'C', 'AI/ML', 'Arduino',
];

const skills = [
  {
    category: 'Frontend',
    number: '01',
    items: [
      { name: 'HTML', level: 95 },
      { name: 'CSS', level: 90 },
      { name: 'JavaScript', level: 88 },
      { name: 'React.js', level: 82 },
    ],
  },
  {
    category: 'Backend & Databases',
    number: '02',
    items: [
      { name: 'Node.js', level: 84 },
      { name: 'Express.js', level: 78 },
      { name: 'MongoDB', level: 80 },
      { name: 'MySQL', level: 76 },
    ],
  },
  {
    category: 'Programming & Tools',
    number: '03',
    items: [
      { name: 'C++ / DSA', level: 90 },
      { name: 'Python', level: 82 },
      { name: 'Git & GitHub', level: 85 },
      { name: 'AI/ML Basics', level: 72 },
      { name: 'UI/UX Design', level: 78 },
    ],
  },
];

const projects = [
  {
    id: '01', title: 'Portfolio Website',
    description: 'A modern and responsive personal portfolio website showcasing my skills, projects, certifications, and contact details. Built with HTML, CSS, and JavaScript with smooth navigation and a clean UI.',
    tags: ['HTML', 'CSS', 'JavaScript'], image: 'portfolio-optimized.jpg',
    link: 'https://sonuportfolio0625.netlify.app/',
  },
  {
    id: '02', title: 'E-commerce Website - Darkside',
    description: 'A responsive e-commerce website with product listings, shopping cart, checkout flow, and smooth user experience. Designed with a modern UI and built using frontend technologies with backend support.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'], image: 'e-comm.jpg',
    link: 'https://darkside-ecom.onrender.com/',
  },
  {
    id: '03', title: 'Coffee Website',
    description: 'A full-stack coffee website with a modern UI, product sections, cart functionality, backend APIs, and database integration. Designed to provide a clean and smooth ordering experience.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'], image: 'coffee-optimized.jpg',
    link: 'https://darkside-coffee.onrender.com/',
  },
  {
    id: '04', title: 'Food Website',
    description: 'A responsive food website showcasing food items, recipes, categories, and contact sections. Built with modern design, attractive visuals, and interactive UI components.',
    tags: ['HTML', 'CSS', 'JavaScript'], image: 'food-optimized.jpg',
  },
  {
    id: '05', title: 'Travel Website',
    description: 'A responsive travel website designed to showcase destinations, travel tips, booking inquiry sections, and smooth animations for a better user experience.',
    tags: ['HTML', 'CSS', 'JavaScript'], image: 'travel-optimized.jpg',
  },
  {
    id: '06', title: 'Maze-Solving Robot Car',
    description: 'An autonomous robot car designed to solve mazes using IR sensors, Arduino UNO, and L298N motor driver. It uses path-following logic and sensor-based decision-making.',
    tags: ['Arduino', 'C++', 'IR Sensors', 'L298N Motor Driver'], image: 'maze.jpg',
  },
  {
    id: '07', title: 'AtomQuest Goal Setting & Tracking Portal',
    description: 'A digital goal-setting and tracking portal designed to help organizations manage employee goals, quarterly check-ins, alignment, visibility, and performance tracking.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'], image: 'atomquest-optimized.jpg',
    link: 'https://atom-gkdo.onrender.com/',
  },
];

const experience = [
  {
    role: '6-Week Internship in Artificial Intelligence & Machine Learning',
    company: 'Edunet Foundation / AICTE', period: 'Internship',
    description: 'Completed a 6-week AI/ML internship focused on machine learning fundamentals, data processing, model building, and practical AI-based project development.',
  },
  {
    role: 'Accenture Developer & Technology Job Simulation',
    company: 'Accenture (Forage)', period: 'Forage',
    description: 'Completed a virtual job simulation focused on software development, technology consulting, problem-solving, and real-world development tasks.',
  },
  {
    role: 'Software Engineering Job Simulation',
    company: 'JPMorgan Chase & Co. (Forage)', period: 'Forage',
    description: 'Completed JPMorgan Chase Software Engineering Job Simulation and gained practical experience in software engineering workflows, debugging, code optimization, and real-world engineering tasks.',
  },
  {
    role: 'GenAI-Powered Data Analytics Job Simulation',
    company: 'Tata (Forage)', period: 'Forage',
    description: 'Completed Tata GenAI-Powered Data Analytics Job Simulation, learning how generative AI can support data analysis, insights generation, automation, and business decision-making.',
  },
];

const certificates = [
  {
    title: 'AWS Cloud Practitioner Essentials', issuer: 'AWS',
    description: 'Completed AWS Cloud Practitioner Essentials and gained understanding of cloud computing fundamentals, AWS services, cloud architecture, security, and deployment concepts.',
    image: 'aws.png',
  },
  {
    title: '6-Week Internship in Artificial Intelligence & Machine Learning', issuer: 'Edunet Foundation / AICTE',
    description: 'Completed a 6-week AI/ML internship focused on machine learning fundamentals, data processing, model building, and practical AI-based project development.',
    image: 'edunet-ai.png',
  },
  {
    title: 'Accenture Developer & Technology Job Simulation', issuer: 'Forage',
    description: 'Completed a virtual job simulation focused on software development, technology consulting, problem-solving, and real-world development tasks.',
    image: 'accenture.jpeg',
  },
  {
    title: 'Software Engineering Job Simulation', issuer: 'JPMorgan Chase & Co. - Forage',
    description: 'Completed JPMorgan Chase Software Engineering Job Simulation and gained practical experience in software engineering workflows, debugging, code optimization, and real-world engineering tasks.',
    image: 'jp.jpg',
  },
  {
    title: 'GenAI-Powered Data Analytics Job Simulation', issuer: 'Tata - Forage',
    description: 'Completed Tata GenAI-Powered Data Analytics Job Simulation, learning how generative AI can support data analysis, insights generation, automation, and business decision-making.',
    image: 'tata.png',
  },
  {
    title: 'India AI Impact Buildathon', issuer: 'HCL GUVI / AI Impact Summit',
    description: 'Participated in the India AI Impact Buildathon, a nationwide AI innovation challenge conducted at India AI Impact Summit 2026, demonstrating AI-led problem solving and solution-building skills.',
    image: 'hcl.jpeg',
  },
  {
    title: 'EY Techathon 6.0', issuer: 'EY / Unstop',
    description: 'Participated in Round 1: Executive Summary Submission of EY Techathon 6.0, gaining exposure to technology-driven problem solving, innovation, and structured solution presentation.',
    image: 'ey.jpeg',
  },
  {
    title: 'Python Certification', issuer: 'Python',
    description: 'Completed Python certification covering programming fundamentals, logic building, and practical Python concepts.',
    image: 'pd.png',
  },
  {
    title: 'UI/UX Design Certification', issuer: 'Interface Design',
    description: 'Completed UI/UX design certification focused on user-friendly, responsive, and visually appealing web interfaces.',
    image: 'ui.png',
  },
];

export { portfolio, technologies, skills, projects, experience, certificates };
