
import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, ChevronDown, Award, Cpu, Code, Layers, Zap, MessageSquare, Send, Sparkles, X, Loader2 } from 'lucide-react';

// --- Gemini API 配置 ---
// 在 Vercel 部署时，请取消下面这一行的注释，并确保在后台配置了 VITE_GEMINI_API_KEY 环境变量
// const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
// 本地开发或未配置 Key 时使用空字符串
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

// --- SEO 组件 ---
const SEOHead = () => {
  useEffect(() => {
    document.title = "钟辉宇 | 机器人与AI算法工程师 | 个人作品集";
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    setMeta('description', '钟辉宇的个人主页。专注于精准农业、机器人技术与深度学习算法(YOLO/ROS)。');
    setMeta('keywords', '钟辉宇, 算法工程师, 机器人, 深度学习, 精准农业, ROS, YOLO, 作品集');
    setMeta('author', '钟辉宇');
  }, []);
  return null;
};

// --- 通用 Gemini 调用函数 ---
const callGeminiAPI = async (prompt: string, systemInstruction?: string) => {
  try {
    if (!apiKey) return "API Key 未配置。请在代码中设置 apiKey，或在部署平台配置环境变量。";
    const payload: any = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 暂时无法响应，请稍后再试。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "连接 AI 服务时出现错误，请检查网络或稍后再试。";
  }
};

// --- 简历数据 ---
const PORTFOLIO_DATA = {
  personal: {
    name: "钟辉宇",
    title: "机器人与AI算法工程师",
    subtitle: "专注于精准农业 | 深度学习 | 嵌入式系统",
    email: "zhonghuiyu01@gmail.com",
    phone: "13510210698",
    location: "广东深圳",
    education: [
      { school: "中国农业大学", degree: "机械电子工程 (硕士)", year: "2023.09 - 2026.06" },
      { school: "广东工业大学", degree: "机械电子工程 (学士)", year: "2019.09 - 2023.06" }
    ]
  },
  stats: [
    { label: "项目经验", value: "4+" },
    { label: "论文发表", value: "3" },
    { label: "核心技能", value: "10+" },
    { label: "竞赛获奖", value: "5+" }
  ],
  skills: [
    "Python", "Pytorch", "ROS", "C++", "Solidworks", 
    "TensorRT", "OpenCV", "YOLO", "Linux/Ubuntu", "Arduino/Teensy"
  ],
  projects: [
    {
      title: "光机电一体化激光除草系统",
      role: "核心研发 | 2025.05 - 至今",
      desc: "针对精准农业需求开发的非接触式除草系统。基于ROS集成目标检测、轨迹预测与激光控制。",
      tags: ["ROS", "激光控制", "Arduino", "Solidworks"],
      highlights: [
        "自主编写上下位机核心控制代码，实现XY2-100协议振镜控制",
        "提出振镜安装误差标定与枕形畸变补偿算法",
        "激光瞄准误差<1cm，系统延迟<30ms",
        "拟发表EI期刊论文一篇 (第一作者)"
      ]
    },
    {
      title: "智能视觉引导高速行间除草机器人",
      role: "算法与控制 | 2023.04 - 2025.06",
      desc: "打破国外垄断的高速除草机器人。基于YOLOv8与霍夫变换实现作物行线提取与刀具控制。",
      tags: ["YOLOv8", "TensorRT", "Jetson", "运动控制"],
      highlights: [
        "引入模板线匹配与多帧跟踪算法，提高鲁棒性",
        "使用TensorRT加速部署，推理速度提升150%，功耗减少80%",
        "作业速度12km/h，作物杂草检测准确率95%",
        "开发半自动标注程序，大幅提升数据处理效率"
      ]
    },
    {
      title: "基于时空动作检测的肉牛行为识别",
      role: "算法研究 | 2024.07 - 2025.05",
      desc: "基于深度学习的多牛群实时行为分析系统，解决畜牧业智能化监测难题。",
      tags: ["深度学习", "行为识别", "Transformer", "论文"],
      highlights: [
        "提出端到端多牛群行为检测框架 (EDST-Net)",
        "设计跨模态融合与时空可变形注意力机制",
        "准确率提升13.6%，计算量下降65%",
        "投稿中科院一区Top期刊 (Computers and Electronics Agriculture)"
      ]
    }
  ],
  awards: [
    "全国大学生先进成图技术与产品信息建模创新大赛 建模一等奖",
    "中国国际大学生创新大赛北京赛区 一等奖",
    "互联网+ 广东赛区金奖",
    "广东省CAD机械设计职业竞赛 二等奖",
    "中国农业大学 校级一等奖学金 (x3)"
  ]
};

// --- 组件: 粒子背景 (Canvas) ---
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(74, 222, 128, 0.5)'; // Tailwind green-400
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        for (let j = index; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 - distance/1000})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" />;
};

// --- 组件: 导航栏 ---
const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <span className="text-green-400 font-bold text-xl tracking-wider">ZHONG.AI</span>
        </div>
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-8">
            {['关于', '项目', '技能', '经历', '联系'].map((item) => (
              <a key={item} href={`#${item}`} className="text-slate-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// --- 组件: 项目卡片 ---
const ProjectCard = ({ project }: { project: any }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsight = async () => {
    if (aiInsight) return;
    setIsLoading(true);
    
    const prompt = `请作为一名资深技术面试官，用简练、专业、高大上的语言（中文），一句话点评这个项目：“${project.title}: ${project.desc}”。重点突出其技术难点或商业价值。`;
    const result = await callGeminiAPI(prompt);
    
    setAiInsight(result);
    setIsLoading(false);
  };

  return (
    <div className="group relative bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)] hover:-translate-y-1 flex flex-col h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Cpu size={48} className="text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{project.title}</h3>
      <p className="text-green-500 text-sm font-mono mb-4">{project.role}</p>
      <p className="text-slate-400 mb-4 text-sm leading-relaxed">{project.desc}</p>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-slate-900 text-slate-300 text-xs rounded border border-slate-700">
            {tag}
          </span>
        ))}
      </div>

      <ul className="space-y-2 mb-4 flex-grow">
        {project.highlights.map((point: string, idx: number) => (
          <li key={idx} className="flex items-start text-slate-400 text-xs">
            <span className="mr-2 text-green-500 mt-0.5">▹</span>
            {point}
          </li>
        ))}
      </ul>

      {/* AI 洞察部分 */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        {!aiInsight && !isLoading && (
          <button 
            onClick={generateInsight}
            className="flex items-center text-xs text-green-400 hover:text-green-300 transition-colors"
          >
            <Sparkles size={14} className="mr-1" />
            生成核心洞察 (Gemini AI)
          </button>
        )}
        {isLoading && (
          <div className="flex items-center text-xs text-slate-500">
            <Loader2 size={14} className="mr-1 animate-spin" />
            正在分析技术架构...
          </div>
        )}
        {aiInsight && (
          <div className="bg-green-500/10 border border-green-500/20 rounded p-3 animate-fade-in">
            <p className="text-xs text-green-200 italic">
              <Sparkles size={12} className="inline mr-1" />
              "{aiInsight}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 组件: AI 实验助手 ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: '你好！我是钟辉宇的 AI 助手。你可以问我关于他的项目经验、ROS 技能或研究方向的问题。' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    const systemContext = `你是一个基于简历数据的 AI 助手，代表"钟辉宇"。
    请根据以下 JSON 数据回答用户关于技能、项目和经历的问题：
    ${JSON.stringify(PORTFOLIO_DATA)}
    
    规则：
    1. 回答要简练、专业，体现工程师的素养。
    2. 如果用户问的问题不在数据中，请礼貌告知并建议通过邮件联系。
    3. 语气要自信、友好。
    4. 请用中文回答。`;

    const reply = await callGeminiAPI(userMsg, systemContext);
    
    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden animate-slide-up flex flex-col max-h-[500px]">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-white font-bold">AI 实验助手</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95 min-h-[300px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-2 rounded-bl-none border border-slate-700 flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="问我关于项目的问题..."
              className="flex-1 bg-slate-900 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-green-500"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center bg-green-500 hover:bg-green-400 text-slate-900 rounded-full px-4 py-3 shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all hover:scale-105"
      >
        <MessageSquare className="mr-2" size={20} />
        <span className="font-bold">Talk to AI</span>
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs py-1 px-3 rounded-lg border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            试试问我任何关于简历的问题！
          </span>
        )}
      </button>
    </div>
  );
};

// --- 主应用 ---
export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-green-500/30 selection:text-green-200">
      <SEOHead />
      <Navbar />
      <AIChatWidget />
      
      {/* HERO SECTION */}
      <section id="关于" className="relative h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono animate-fade-in">
            Open to Work | 2026届硕士毕业生
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            你好，我是 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{PORTFOLIO_DATA.personal.name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 font-light">
            {PORTFOLIO_DATA.personal.title}
          </p>
          <p className="text-slate-500 mb-10 max-w-2xl mx-auto text-lg">
            致力于将 <span className="text-slate-200">深度学习</span> 与 <span className="text-slate-200">机器人技术</span> 应用于精准农业领域。
            擅长软硬件协同设计，从底层驱动到顶层算法的全栈开发。
          </p>
          
          <div className="flex justify-center gap-4">
            <a href="#联系" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-slate-900 font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              联系我
            </a>
            <a href="#项目" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 transition-all hover:scale-105">
              查看项目
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-600">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* STATS BANNER */}
      <div className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {PORTFOLIO_DATA.stats.map((stat, idx) => (
              <div key={idx} className="p-4">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS SECTION */}
      <section id="技能" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
            <span className="w-2 h-8 bg-green-500 mr-4 rounded-sm"></span>
            技术栈
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Skill Category 1 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center mb-4 text-green-400">
                <Code className="mr-2" />
                <h3 className="text-lg font-bold">编程与算法</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Python", "C/C++", "PyTorch", "OpenCV", "YOLOv8", "TensorRT"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 rounded text-sm text-slate-300 hover:text-green-400 hover:bg-slate-700 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Category 2 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center mb-4 text-blue-400">
                <Layers className="mr-2" />
                <h3 className="text-lg font-bold">机器人与系统</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ROS", "Linux/Ubuntu", "Solidworks", "AutoCAD", "QT", "Git"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 rounded text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Category 3 */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center mb-4 text-purple-400">
                <Zap className="mr-2" />
                <h3 className="text-lg font-bold">嵌入式与硬件</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Arduino", "Teensy", "Jetson Nano/Xavier", "串口通信", "电路设计", "传感器集成"].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-slate-800 rounded text-sm text-slate-300 hover:text-purple-400 hover:bg-slate-700 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="项目" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center">
            <span className="w-2 h-8 bg-green-500 mr-4 rounded-sm"></span>
            精选项目
            <span className="ml-4 text-sm font-normal text-slate-500 flex items-center bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <Sparkles size={14} className="text-green-400 mr-2" />
              已启用 AI 增强分析
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_DATA.projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE / AWARDS */}
      <section id="经历" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Education */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Award className="mr-3 text-green-500" /> 教育背景
              </h2>
              <div className="space-y-8">
                {PORTFOLIO_DATA.personal.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-slate-800">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-green-500"></div>
                    <h3 className="text-xl font-bold text-white">{edu.school}</h3>
                    <p className="text-green-400">{edu.degree}</p>
                    <p className="text-slate-500 text-sm mt-1">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <Award className="mr-3 text-yellow-500" /> 荣誉奖项
              </h2>
              <div className="space-y-4">
                {PORTFOLIO_DATA.awards.map((award, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-slate-900 rounded-lg border border-slate-800 hover:border-yellow-500/30 transition-colors">
                    <Award size={20} className="text-yellow-500 mr-4 flex-shrink-0" />
                    <span className="text-slate-300">{award}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="联系" className="py-20 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">准备好开始下一个挑战了吗？</h2>
          <p className="text-slate-400 mb-12 text-lg">
            我正在寻找2026年的全职工作机会。如果您对我的背景感兴趣，或者想探讨农业机器人的未来，欢迎随时联系。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <a href={`mailto:${PORTFOLIO_DATA.personal.email}`} className="flex items-center justify-center p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:bg-slate-750 hover:border-green-500 transition-all group">
              <Mail className="text-green-500 mr-4 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-500 uppercase">Email</div>
                <div className="text-white font-mono">{PORTFOLIO_DATA.personal.email}</div>
              </div>
            </a>
            <a href={`tel:${PORTFOLIO_DATA.personal.phone}`} className="flex items-center justify-center p-6 bg-slate-800 rounded-2xl border border-slate-700 hover:bg-slate-750 hover:border-green-500 transition-all group">
              <Phone className="text-green-500 mr-4 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-xs text-slate-500 uppercase">Phone</div>
                <div className="text-white font-mono">{PORTFOLIO_DATA.personal.phone}</div>
              </div>
            </a>
          </div>

          <footer className="text-slate-600 text-sm">
            <p>© 2025 {PORTFOLIO_DATA.personal.name}. All rights reserved.</p>
            <p className="mt-2">Designed with React & Tailwind CSS</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

