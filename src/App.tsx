import { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, ChevronDown, Award, Cpu, Zap,
  MessageSquare, Send, Sparkles, X, Loader2, User, BookOpen,
  Camera, PlayCircle, Calendar, ExternalLink, Globe, Activity, Trophy, BookText, FileText, Users, Target
} from 'lucide-react';

// --- 配置区域 ---
// 在 Vercel 部署时，请在后台配置 VITE_DEEPSEEK_API_KEY 环境变量
// 本地开发或未配置 Key 时使用空字符串
let apiKey = "";
try {
  // @ts-ignore
  apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
} catch (e) {
  console.warn("import.meta is not available, using empty API key.");
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"; // DeepSeek API 端点

// --- 类型定义 ---
interface Project {
  id: string;
  title: string;
  role: string;
  period: string;
  shortDesc: string;
  tags: string[];
  background: string;
  work: string[];
  result: string[];
  images?: string[];
  videoUrl?: string; // 外部视频链接 (Bilibili, YouTube 等)
  paper?: string;
}

// --- 数据源 ---
const PORTFOLIO_DATA = {
  personal: {
    name: "钟辉宇",
    title: "机器人与AI算法工程师",
    subtitle: "聚焦精准农业 | 深度学习 | 嵌入式系统 | 机械设计",
    email: "zhonghuiyu01@gmail.com",
    phone: "13510210698",
    location: "广东深圳 / 北京",
    // 个人介绍：已根据最新要求修改和润色
    bio: `我是一名致力于将人工智能与机器人技术落地于精准农业的硕士研究生。
    
    我的工程之路始于本科期间对 SolidWorks 的热爱，在“大西瓜”创新团队中，我从一名结构设计成员成长为团队负责人，积累了扎实的机械设计功底。硕士期间，我转向智能化方向，主攻计算机视觉与机器人控制。
    
    我具备独特的“软硬全栈”能力：
    • 硬件端：能独立完成除草系统的结构设计、设备选型、嵌入式通信（Arduino/Teensy）以及系统集成测试。
    • 软件端：熟悉 Python 编程，深入理解并应用前沿深度学习模型：
      - 目标检测：YOLO 系列, DETR (端到端检测)
      - 语义/实例分割：SAM (Segment Anything Model)
      - 行为识别：SlowFast, VideoMAE (视频自编码器)
      - 部署与控制：在 Jetson 平台上进行 TensorRT 加速部署，并基于 ROS 开发上层控制系统。
    • 语言能力：英语口语流利，能够进行日常对话与技术交流。`,
    education: [
      {
        school: "中国农业大学",
        degree: "机械电子工程 (硕士 | 保研)",
        year: "2023.09 - 2026.06",
        desc: "研究方向：机器人和AI技术在精准农业上的应用 | 获一次一等奖学金，两次二等奖学金"
      },
      {
        school: "广东工业大学",
        degree: "机械电子工程 (学士 | 创新班)",
        year: "2019.09 - 2023.06",
        desc: "获两次一等奖学金，一次二等奖学金 | 英语六级 451"
      }
    ]
  },
  stats: [
    { label: "核心项目", value: "6+" },
    { label: "学术论文", value: "3" },
    { label: "发明专利", value: "2" },
    { label: "国家/省奖", value: "6+" }
  ],
  skills: {
    core: ["Python", "SolidWorks", "ROS", "System Integration"],
    ai: ["PyTorch", "YOLOv8", "DETR", "SAM", "SlowFast", "VideoMAE", "TensorRT"],
    hardware: ["Arduino/Teensy", "Jetson Nano/Xavier", "AutoCAD", "RS485"],
    tools: ["Ubuntu Linux", "Git", "Conda", "QT", "LaTeX"]
  },
  projects: [
    {
      id: "laser-weeding",
      title: "光机电一体化激光除草系统",
      role: "项目负责人 (全栈研发)",
      period: "2025.05 - 2026.06",
      shortDesc: "自主研发的高精度激光除草样机，集成视觉定位、轨迹预测与振镜控制。",
      tags: ["ROS", "机器视觉", "激光控制", "Solidworks", "Teensy"],
      background: "针对精准农业除草需求，传统机械除草易伤苗，化学除草污染重。本项目旨在研发一套非接触式、高精度的激光除草系统。",
      work: [
        "系统架构：负责激光器、振镜、深度相机等核心硬件选型与成本控制；使用 SolidWorks 设计并搭建室内实验平台及样机外壳。",
        "算法开发：自主编写 ROS 上位机代码，集成目标检测跟踪与轨迹预测算法。",
        "嵌入式控制：基于 Teensy 3.2 (Arduino) 实现 XY2-100 协议，完成微秒级激光振镜控制。",
        "精度优化：提出振镜安装误差标定修正算法与枕形畸变补偿算法，解决定位偏差问题。"
      ],
      result: [
        "性能指标：激光瞄准误差 <1cm，系统整体延迟 <30ms，满足实时性要求。",
        "实验验证：完成内外参标定、激光能量实验及室内验证。",
        "学术成果：论文《田间激光除草机器人对靶控制系统设计与试验》被《农业机械学报》(EI) 录用（第一作者）。"
      ],
      // 使用 Placehold.co 占位图
      images: [
        "/assets/laser-1.png",
        "/assets/laser-2.jpg",
        "/assets/laser-4.png",
        "/assets/laser-6.png"
      ],
      videoUrl: ""
    },
    {
      id: "visual-weeding",
      title: "智能视觉引导高速行间除草机器人",
      role: "核心成员 (算法部署与控制)",
      period: "2024.03 - 2025.06",
      shortDesc: "基于Jetson平台与TensorRT加速的除草机器人，实现12km/h高速作业。",
      tags: ["YOLOv8", "TensorRT", "Jetson", "运动控制", "CVAT"],
      background: "原有除草机器人计算平台功耗高、处理速度慢，限制了作业效率，亟需进行软硬件升级。",
      work: [
        "硬件改造：主导将工控机替换为低功耗、高性能的 Jetson 嵌入式平台。",
        "算法加速：基于 YOLOv8 进行作物/杂草检测，结合霍夫变换提取行线；引入 TensorRT 进行模型量化加速。",
        "闭环控制：将视觉偏差转化为 RS485 指令，闭环控制刀具横移修正。",
        "数据流：开发半自动标注工具，结合 CVAT 加速数据集构建。"
      ],
      result: [
        "提速降耗：推理速度提升 150%，平台功耗降低 80%。",
        "实地表现：实现了 12km/h 高速作业下的稳定除草，伤苗率 <1%，检测准确率 95%。"
      ],
      // 视觉项目：4张占位图
      images: [
        "/assets/weeding-1.jpg",
        "/assets/weeding-2.png",
        "/assets/weeding-3.png",
        "https://placehold.co/800x450/0f172a/60a5fa?text=Image+4"
      ],
      videoUrl: ""
    },
    // --- 核心修改：肉牛行为识别 - 增加 4 张图片 ---
    {
      id: "cattle-behavior",
      title: "基于时空动作检测的肉牛行为识别",
      role: "项目负责人 (算法研究)",
      period: "2024.07 - 2025.05",
      shortDesc: "提出EDST-Net端到端框架，解决多目标牛群实时行为监测难题。",
      tags: ["深度学习", "Transformer", "行为识别", "论文投稿"],
      background: "畜牧业智能化监测中，传统方法难以同时兼顾多目标的定位与复杂动作识别。",
      work: [
        "框架创新：提出 EDST-Net 端到端框架，双流并行统一目标检测与行为识别，无需外部检测器。",
        "时空融合：设计跨模态与分阶段融合方法，并引入时空可变形注意力机制，高效聚焦关键特征。"
      ],
      result: [
        "性能提升：在 CVB 数据集上准确率提升 13.6%，计算量下降 65%，推理速度 23.3 FPS。",
        "学术成果：论文投稿中科院一区 Top 期刊 Computers and Electronics in Agriculture (在审)。"
      ],
      paper: "EDST-Net: Efficient Dual-Stream Spatio-Temporal Network...",
      images: [ // 增加 4 张占位图
        "/assets/cattle-1.png",
        "/assets/cattle-2.png",
        "/assets/cattle-3.png",
        "https://placehold.co/800x450/ca8a04/ffffff?text=Temporal+Tracking"
      ],
    },
    // --- 核心修改：生菜检测与跟踪 - 增加 4 张图片 ---
    {
      id: "lettuce-detection",
      title: "农业机器人生菜检测与跟踪",
      role: "参与成员",
      period: "2023.02 - 2024.09",
      shortDesc: "构建生菜MOTS数据集，辅助实现精密喷洒。",
      tags: ["MOTS", "深度学习", "数据集构建"],
      background: "面向精密喷洒需求，研究蔬菜的形状特征分割与跟踪。",
      work: [
        "使用 CVAT 构建并标注生菜 MOTS 多目标跟踪与分割数据集。",
        "配置 Conda 环境，完成多组模型对比实验。"
      ],
      result: [
        "论文发表于 Journal of Field Robotics (中科院二区 IF=5.2，第四作者)。"
      ],
      images: [ // 增加 4 张占位图
        "/assets/lettuce-1.png",
        "/assets/lettuce-2.png",
        "https://placehold.co/800x450/a78bfa/ffffff?text=Tracking+Visualization",
        "https://placehold.co/800x450/8b5cf6/ffffff?text=Precision+Spraying+App"
      ]
    },
    // --- 核心修改：本科创新项目集锦 - 增加 4 张图片 ---
    {
      id: "undergrad-innovation",
      title: "本科创新项目集锦",
      role: "核心成员 / 负责人",
      period: "2019 - 2023",
      shortDesc: "包含工业CT设计、静电纺丝面膜制备等多个省级/国家级获奖项目。",
      tags: ["SolidWorks", "KeyShot", "机械设计", "静电纺丝"],
      background: "本科期间在广东工业大学“大西瓜”团队及国家重点实验室的科研探索。",
      work: [
        "面向芯片封装检测的高速高精工业CT：负责设备外观与内部结构设计，使用 KeyShot 渲染，获“挑战杯”省赛铜奖。",
        "基于静电纺丝的高端面膜：优化纺丝液配方（加入PEG），解决成膜难问题，获发明专利。",
      ],
      result: [
        "获互联网+省金奖、挑战杯省铜奖、成图大赛国家一等奖。",
        "积累了丰富的设计与动手能力。"
      ],
      images: [ // 增加 4 张占位图
        "/assets/benke-1.png",
        "/assets/benke-2.png",
        "/assets/benke-6.jpg",
        "/assets/benke-7.jpg"
      ]
    }
  ] as Project[],
  activities: [
    {
      title: "“大西瓜”微纳加工创新团队 负责人",
      org: "广东工业大学 (2020-2022)",
      desc: "作为团队核心负责人，全权统筹团队日常运营与管理。主导招新宣讲与人才选拔，负责协调团队与指导老师及研究生的项目对接。成功组织并带领团队成员参与多项省级高水平竞赛，展现了卓越的团队领导力与组织协调能力。"
    },
    {
      title: "成图协会 副会长",
      org: "广东工业大学 (2021-2022)",
      desc: "作为联合创始人参与协会组建，建立健全内部管理制度。制定并实施针对新成员的 SolidWorks/CAD 软件培训计划。在校级科技节中，主持绘图比赛的命题与评审工作，致力于在校园内推广先进的工程制图技术与规范。"
    },
    {
      title: "青春健康协会 讲师干事",
      org: "广东工业大学 (2019-2020)",
      desc: "担任同伴教育讲师，面向全校3个学院15个班级，累计开展青春健康知识讲座覆盖800余人次。提供专业的朋辈咨询服务，以亲和力与专业度获得师生认可。"
    },
    {
      title: "志愿服务与社会实践",
      org: "多地",
      desc: "积极投身社会服务，担任迎新志愿者助力20级新生融入校园；在深圳疫情期间挺身而出，担任社区核酸检测志愿者；寒假期间回访母校进行招生宣传，获寒招“优秀个人”称号。"
    }
  ],
  publications: [
    {
      type: "论文",
      title: "EDST-Net: Efficient Dual-Stream Spatio-Temporal Network based Multi-cattle Behavior Detection",
      journal: "Computers and Electronics in Agriculture (中科院一区 Top, IF=8.9)",
      status: "在审",
      role: "第一作者"
    },
    {
      type: "论文",
      title: "田间激光除草机器人对靶控制系统设计与试验",
      journal: "农业机械学报 (EI)",
      status: "录用",
      role: "第一作者"
    },
    {
      type: "论文",
      title: "Segmentation and tracking of vegetable plants by exploiting vegetable shape feature...",
      journal: "Journal of Field Robotics (中科院二区, IF=5.2)",
      status: "见刊",
      role: "第四作者"
    },
    {
      type: "专利",
      title: "一种饲喂投料机器人",
      number: "CN120694185A",
      status: "实质审查",
      role: "除导师外第一作者"
    },
    {
      type: "专利",
      title: "一种基于静电纺丝的新型速溶面膜制备方法及设备",
      number: "(本科创新项目)",
      status: "已发表",
      role: "核心成员"
    }
  ],
  allAwards: [
    { name: "全国大学生先进成图技术与产品信息建模创新大赛 建模一等奖", level: "国家级" },
    { name: "中国国际大学生创新大赛北京赛区 一等奖", level: "省部级" },
    { name: "互联网+ 广东赛区金奖", level: "省部级" },
    { name: "“挑战杯”大学生创业大赛广东赛区铜奖", level: "省部级" },
    { name: "广东省CAD机械设计职业竞赛机械设计 二等奖", level: "省部级" },
    { name: "广东省CAD机械设计职业竞赛团体 二等奖", level: "省部级" },
    { name: "大学城实验技能大赛 一等奖", level: "校级" },
    { name: "机电工程学院学术科技节 一等奖 (x3)", level: "院级" },
    { name: "优秀学生一等奖学金 (本科x2, 硕士x1)", level: "校级" },
    { name: "优秀学生二等奖学金 (本科x1, 硕士x2)", level: "校级" }
  ],
  // 核心修改：重新定义多彩生活部分
  life: [
    { title: "学术交流：iROS 参会", icon: Globe, url: "/assets/4.jpg", desc: "参与国际机器人与自动化顶会，追踪前沿技术，拓宽学术视野。", tag: "学术" },
    { title: "工程实践：实验日常", icon: Zap, url: "/assets/2.jpg", desc: "在实验室进行系统集成、设备调试和算法验证的日常，是科研落地的核心环节。", tag: "科研" },
    { title: "运动休闲：高尔夫", icon: Activity, url: "/assets/5.png", desc: "通过高尔夫放松身心，训练专注力与策略思维，保持身心平衡。", tag: "休闲" },
    { title: "人文探索：旅行摄影", icon: Camera, url: "/assets/6.jpg", desc: "用镜头记录旅途中的自然风光与人文细节，在探索中汲取创造灵感。", tag: "生活" },
  ]
};

// --- SEO 组件 ---
const SEOHead = () => {
  useEffect(() => {
    document.title = `${PORTFOLIO_DATA.personal.name} | 机器人与AI算法工程师`;
  }, []);
  return null;
};

// --- 通用 UI 组件 ---
const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <h2 className="text-3xl font-bold text-white mb-12 flex items-center group">
    {Icon && <Icon className="mr-3 text-green-500 group-hover:scale-110 transition-transform" size={32} />}
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
      {children}
    </span>
    <div className="h-px bg-slate-800 flex-grow ml-6 group-hover:bg-green-500/50 transition-colors"></div>
  </h2>
);

// --- 模态框组件：视频嵌入 ---
const VideoEmbedModal = ({ videoUrl, onClose }: { videoUrl: string, onClose: () => void }) => {
  let embedUrl = videoUrl;

  // Aspect Ratio for Video Player
  const aspectRatioClass = "aspect-video";

  // Bilibili iframe embedding logic
  if (videoUrl.includes('b23.tv') || videoUrl.includes('bilibili.com')) {
    const url = new URL(videoUrl.includes('b23.tv') ? `https://www.bilibili.com/video/${videoUrl.split('/').pop()}` : videoUrl);

    let bvid = url.searchParams.get('bvid');
    let aid = url.searchParams.get('aid');

    if (!bvid && url.pathname.startsWith('/video/')) {
        bvid = url.pathname.split('/')[2];
    }

    if (bvid) {
        embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&as_wide=1&danmaku=0`;
    } else if (aid) {
        embedUrl = `https://player.bilibili.com/player.html?aid=${aid}&page=1&high_quality=1&as_wide=1&danmaku=0`;
    } else {
        embedUrl = "https://placehold.co/560x315/ccfbf1/052e16?text=Invalid+Bilibili+URL";
    }

  } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    // YouTube embedding logic
    const videoIdMatch = videoUrl.match(/(?:\/embed\/|\/watch\?v=|\/youtu\.be\/|\/v\/)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : videoUrl.split('/').pop();
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  if (!embedUrl || !embedUrl.startsWith('http')) {
      // Fallback for invalid/unsupported URLs
      embedUrl = "https://placehold.co/560x315/ccfbf1/052e16?text=Invalid+Video+URL";
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors z-10">
                <X size={24} />
            </button>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">项目演示视频</h3>
                <div className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-xl`}>
                    <iframe
                        className="w-full h-full"
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Project Video Demonstration"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
  );
};


// --- 模态框组件：项目详情 ---
const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  if (!project) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>

          {/* 关闭按钮 */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors z-20">
            <X size={24} />
          </button>

          {/* 顶部 Banner */}
          <div className="relative h-64 bg-slate-800 flex items-end p-8 overflow-hidden shrink-0">
            {/* 媒体展示 (使用第一张图片作为 Banner) */}
            {project.images?.[0] && <img src={project.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="bg"/>}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            <div className="relative z-10 w-full">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 shadow-sm">{project.title}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-green-300 font-mono items-center">
                <span className="flex items-center bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700"><User size={14} className="mr-2"/> {project.role}</span>
                <span className="flex items-center bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700"><Calendar size={14} className="mr-2"/> {project.period}</span>
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-8 space-y-10">

            {/* 1. 媒体展示区 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* <-- 关键修改：md:grid-cols-3，每行显示 3 张图片 */}
              {project.images?.map((img, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-xl border border-slate-700 aspect-video bg-slate-800">
                  <img src={img} alt={`Project Detail ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">项目截图 {idx + 1}</span>
                  </div>
                </div>
              ))}
              {/* 视频占位符 - 触发视频模态框 */}
              {project.videoUrl ? (
                <div
                  className="relative rounded-xl border border-slate-700 border-dashed aspect-video bg-slate-800/50 flex flex-col items-center justify-center group text-slate-500 hover:text-green-400 hover:border-green-500/50 transition-colors cursor-pointer"
                  onClick={() => setCurrentVideoUrl(project.videoUrl!)}
                >
                  <PlayCircle size={48} className="mb-2" />
                  <p className="text-sm">点击播放演示视频</p>
                </div>
              ) : (
                <div className="relative rounded-xl border border-slate-700 border-dashed aspect-video bg-slate-800/50 flex flex-col items-center justify-center group text-slate-500">
                  <PlayCircle size={48} className="mb-2" />
                  <p className="text-sm">视频演示 (待添加)</p>
                </div>
              )}
            </div>

            {/* 2. 核心信息 */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* 左侧：详细描述 */}
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Target size={20} className="mr-2 text-green-500"/> 项目背景</h3>
                  <p className="text-slate-300 leading-relaxed text-lg">{project.background}</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center"><Cpu size={20} className="mr-2 text-blue-500"/> 核心工作与挑战</h3>
                  <ul className="space-y-4">
                    {project.work.map((w, i) => (
                      <li key={i} className="flex items-start text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                        <span className="mr-3 text-blue-500 mt-1 font-bold">0{i+1}.</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* 右侧：成果与技术 */}
              <div className="space-y-8">
                <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center"><Award size={20} className="mr-2 text-yellow-500"/> 成果与产出</h3>
                  <ul className="space-y-3">
                    {project.result.map((r, i) => (
                      <li key={i} className="text-sm text-slate-300 border-l-2 border-yellow-500/50 pl-3">
                        {r}
                      </li>
                    ))}
                  </ul>
                  {project.paper && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-500 uppercase mb-1">发表论文</div>
                      <div className="text-xs text-green-300 font-mono">{project.paper}</div>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">技术栈</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-800 text-green-400 text-xs rounded-full border border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              </div>
            </div>

          </div>
        </div>
      </div >

      {/* 嵌套的视频嵌入模态框 */}
      {currentVideoUrl && (
        <VideoEmbedModal
          videoUrl={currentVideoUrl}
          onClose={() => setCurrentVideoUrl(null)}
        />
      )}
    </>
  );
};

// --- AI 助手组件 ---
const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    {role: 'model', text: '你好！我是钟辉宇的 AI 助手。我熟悉他的所有项目细节（激光除草、肉牛识别等）和简历内容，有什么可以帮你的吗？'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isOpen]);

  const send = async () => {
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userText}]);
    setLoading(true);

    // 如果没有 API Key，使用模拟回复
    if (!apiKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, {role: 'model', text: "（演示模式）请在部署环境变量中配置 VITE_DEEPSEEK_API_KEY 以启用真实 AI 回复。我目前知道钟辉宇在做激光除草机器人，用了 YOLO 和 ROS。"}]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const context = `你扮演钟辉宇的数字分身。基于以下数据回答：${JSON.stringify(PORTFOLIO_DATA)}。简练、专业、自信。`;
      const response = await fetch(
        DEEPSEEK_API_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: context },
              { role: "user", content: userText }
            ]
          })
        }
      );
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "AI 暂时无法响应。";
      setMessages(prev => [...prev, {role: 'model', text: reply}]);
    } catch (e) {
      setMessages(prev => [...prev, {role: 'model', text: "连接 AI 服务出错，请检查网络或 Key。"}]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up h-[500px]">
          <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
            <span className="font-bold text-white flex items-center"><Sparkles size={16} className="mr-2 text-green-400"/> AI 简历助手</span>
            <button onClick={() => setIsOpen(false)}><X size={18} className="text-slate-400 hover:text-white"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center text-slate-500 text-xs"><Loader2 size={12} className="animate-spin mr-1"/> 正在思考...</div>}
            <div ref={scrollRef}/>
          </div>
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none placeholder-slate-500"
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="问我关于项目的问题..."
            />
            <button onClick={send} disabled={loading} className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-500 disabled:opacity-50"><Send size={18}/></button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-green-500 hover:bg-green-400 text-slate-900 p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-transform hover:scale-110">
        <MessageSquare size={24} fill="currentColor" />
      </button>
    </div>
  );
};

// --- 主应用 ---
export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-green-500/30 selection:text-green-200">
      <SEOHead />
      <AIChatWidget />
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* 导航栏 */}
      <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tighter text-white flex items-center">
            ZHONG<span className="text-green-500">.AI</span>
          </span>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {['关于', '项目', '成果', '经历', '荣誉', '生活', '联系'].map(item => (
              <a key={item} href={`#${item}`} className="hover:text-green-400 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section id="关于" className="pt-32 pb-20 px-4 min-h-[80vh] flex items-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-12 items-start relative z-10">
          <div className="flex-1 space-y-8 animate-fade-in-left pt-6 md:pt-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Open to Work | 2026 届硕士
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
                你好，我是<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{PORTFOLIO_DATA.personal.name}</span>
              </h1>
              <p className="text-2xl text-slate-400 font-light">{PORTFOLIO_DATA.personal.title}</p>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-xl whitespace-pre-line text-lg">
              {PORTFOLIO_DATA.personal.bio}
            </p>

            <div className="flex gap-4 pt-4">
              <a href="#联系" className="px-8 py-3 bg-green-500 text-slate-900 font-bold rounded-full hover:bg-green-400 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]">联系我</a>
              <a href="#项目" className="px-8 py-3 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors flex items-center">
                浏览项目 <ChevronDown size={16} className="ml-2"/>
              </a>
            </div>
          </div>

          {/* 优化后的图片展示区域 - 保持中等尺寸，减少旋转，与文字保持距离 */}
          <div className="relative animate-fade-in-right flex-shrink-0 flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="relative w-64"> {/* <-- 目标尺寸容器 w-64 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                <div className="aspect-[3/4] bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                   {/* 你的照片 URL，取消注释并替换为实际路径 */}
                   <img
                     src="/assets/3.jpg"
                     alt="钟辉宇证件照"
                     className="w-full h-full object-cover"
                   />
                </div>

                {/* 悬浮数据卡片 */}
                <div className="absolute -bottom-4 -left-8 bg-slate-800/90 backdrop-blur p-3 rounded-lg border border-slate-700 shadow-2xl flex gap-4">
                  {PORTFOLIO_DATA.stats.slice(0,2).map((s,i) => (
                    <div key={i} className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 项目区域 */}
      <section id="项目" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle icon={Cpu}>精选工程项目</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            {PORTFOLIO_DATA.projects.map((project) => (
              <div key={project.id} className="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col h-full" onClick={() => setSelectedProject(project)}>
                {/* 卡片顶部图片 */}
                <div className="h-56 bg-slate-700/50 relative overflow-hidden">
                  <img src={project.images?.[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{project.title}</h3>
                        <p className="text-xs text-green-400 font-mono bg-green-500/10 inline-block px-2 py-1 rounded border border-green-500/20">{project.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 卡片内容 */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{project.shortDesc}</p>
                  <div className="mt-auto pt-6 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex gap-2 overflow-hidden">
                      {project.tags.slice(0,3).map(t => (
                        <span key={t} className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-400 border border-slate-700">{t}</span>
                      ))}
                    </div>
                    <span className="text-white text-sm font-medium group-hover:translate-x-1 transition-transform flex items-center shrink-0 ml-4">
                      查看详情 <ExternalLink size={14} className="ml-1 text-green-500"/>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新增：学术成果板块 */}
      <section id="成果" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle icon={BookText}>学术成果与专利</SectionTitle>
          <div className="grid gap-6">
            {PORTFOLIO_DATA.publications.map((pub, i) => (
              <div key={i} className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 hover:border-green-500/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs px-2 py-1 rounded border ${pub.type === '论文' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                      {pub.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-200">{pub.title}</h3>
                  </div>
                  <div className="text-sm text-slate-400 flex flex-wrap gap-4">
                    {pub.journal && <span className="flex items-center"><FileText size={14} className="mr-1"/> {pub.journal}</span>}
                    {pub.number && <span className="flex items-center"><FileText size={14} className="mr-1"/> 专利号: {pub.number}</span>}
                    <span className="flex items-center text-green-400"><User size={14} className="mr-1"/> {pub.role}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                    pub.status === '见刊' || pub.status === '已发表' || pub.status === '录用'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 经历与活动 */}
      <section id="经历" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16">

          {/* 教育背景 */}
          <div>
            <SectionTitle icon={BookOpen}>教育背景</SectionTitle>
            <div className="space-y-12 pl-4 border-l-2 border-slate-800 ml-3">
              {PORTFOLIO_DATA.personal.education.map((edu, i) => (
                <div key={i} className="relative pl-8 group">
                  <span className="absolute -left-[25px] top-1 w-5 h-5 bg-slate-900 border-2 border-slate-600 group-hover:border-green-500 rounded-full transition-colors"></span>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{edu.school}</h3>
                  <div className="text-green-500 font-medium mb-1 text-sm">{edu.degree}</div>
                  <div className="text-slate-500 text-xs mb-3 font-mono">{edu.year}</div>
                  <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-slate-800 pl-3">{edu.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 校园活动 */}
          <div>
            <SectionTitle icon={Users}>社团与领导力</SectionTitle>
            <div className="space-y-4">
              {PORTFOLIO_DATA.activities.map((act, i) => (
                <div key={i} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:border-green-500/30 transition-all hover:bg-slate-800 group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">{act.title}</h3>
                    <span className="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">{act.org}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 荣誉奖项 */}
      <section id="荣誉" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle icon={Trophy}>荣誉奖项</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTFOLIO_DATA.allAwards.map((award, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500/50 transition-colors group">
                <div className="flex items-center">
                  <Award size={20} className="text-yellow-500 mr-3 group-hover:scale-110 transition-transform"/>
                  <span className="text-slate-200 text-sm">{award.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{award.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 多彩生活 */}
      <section id="生活" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle icon={Camera}>多彩生活</SectionTitle>
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              探索工作之外的世界，是我保持创造力和专注力的源泉。无论是追踪前沿学术，还是享受休闲运动，都能让我以更平衡的心态投入到工程研究中。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTFOLIO_DATA.life.map((item, i) => (
              <div key={i} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-slate-800">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-xs text-green-400 font-mono bg-black/50 px-2 py-0.5 rounded mb-2 inline-block">{item.tag}</span>
                    <span className="text-white font-bold text-md translate-y-2 group-hover:translate-y-0 transition-transform block">{item.title}</span>
                    <p className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚联系 */}
      <footer id="联系" className="py-24 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">准备好开始下一个挑战了吗？</h2>
          <p className="text-slate-400 mb-12">如果您对我的项目感兴趣，或有合作意向，欢迎随时联系。</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <a href={`mailto:${PORTFOLIO_DATA.personal.email}`} className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-green-500/50 px-8 py-5 rounded-2xl transition-all group">
              <div className="bg-slate-800 p-3 rounded-full group-hover:bg-green-500/20 transition-colors">
                <Mail className="text-green-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email Me</div>
                <div className="text-white font-mono text-lg">{PORTFOLIO_DATA.personal.email}</div>
              </div>
            </a>
            <a href={`tel:${PORTFOLIO_DATA.personal.phone}`} className="flex items-center gap-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 px-8 py-5 rounded-2xl transition-all group">
              <div className="bg-slate-800 p-3 rounded-full group-hover:bg-blue-500/20 transition-colors">
                <Phone className="text-blue-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Call Me</div>
                <div className="text-white font-mono text-lg">{PORTFOLIO_DATA.personal.phone}</div>
              </div>
            </a>
          </div>
          <div className="border-t border-slate-900 pt-8">
            <p className="text-slate-600 text-sm">© 2025 {PORTFOLIO_DATA.personal.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}