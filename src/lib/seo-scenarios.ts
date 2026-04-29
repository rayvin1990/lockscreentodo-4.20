import {
  AlertTriangle,
  CalendarDays,
  Dumbbell,
  Focus,
  GraduationCap,
  HeartPulse,
  KeyRound,
  ListChecks,
  Plane,
  ServerCrash,
  Target,
} from "lucide-react";

export type SeoScenarioTemplate =
  | "countdown"
  | "large-reminder"
  | "urgent"
  | "interruption"
  | "fitness"
  | "calm-list"
  | "ops-alert";

export type SeoScenario = {
  slug: string;
  icon: typeof GraduationCap;
  template: SeoScenarioTemplate;
  gradient: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  eyebrow: {
    en: string;
    zh: string;
  };
  audience: {
    en: string;
    zh: string;
  };
  tasks: {
    en: string[];
    zh: string[];
  };
  heroMetric?: {
    en: string;
    zh: string;
  };
  keywords: string[];
};

export const seoScenarios: SeoScenario[] = [
  {
    slug: "exam-countdown-wallpaper",
    icon: CalendarDays,
    template: "countdown",
    gradient: "linear-gradient(160deg, #111827 0%, #4f46e5 48%, #020617 100%)",
    eyebrow: {
      en: "Exam countdown wallpaper",
      zh: "考试倒计时锁屏壁纸",
    },
    title: {
      en: "Turn your exam date into a lock screen countdown.",
      zh: "把考试日期变成一张锁屏倒计时壁纸。",
    },
    description: {
      en: "Keep the exam date, review plan, and daily study tasks visible every time you check your phone.",
      zh: "把考试日期、复习计划和每日任务放到锁屏上，每次看手机都能看到重点。",
    },
    audience: {
      en: "Best for students, certification exams, language tests, and final-week review plans.",
      zh: "适合学生、资格考试、语言考试和期末冲刺复习。",
    },
    tasks: {
      en: ["Exam in 30 days", "Review vocabulary", "Finish mock test", "Sleep before 11 PM"],
      zh: ["距离考试 30 天", "复习高频词汇", "完成一套模拟题", "23:00 前睡觉"],
    },
    heroMetric: {
      en: "30",
      zh: "30",
    },
    keywords: ["exam countdown wallpaper", "study countdown wallpaper", "exam lock screen"],
  },
  {
    slug: "keys-wallet-door-card-reminder",
    icon: KeyRound,
    template: "large-reminder",
    gradient: "linear-gradient(160deg, #450a0a 0%, #dc2626 52%, #111827 100%)",
    eyebrow: {
      en: "Keys and access card lock screen",
      zh: "钥匙门禁卡防呆锁屏",
    },
    title: {
      en: "Stop leaving without your keys, wallet, or access card.",
      zh: "出门前，别再忘带钥匙、钱包和门禁卡。",
    },
    description: {
      en: "Make the one thing you always forget impossible to miss before you leave home.",
      zh: "把最容易忘的小东西放到锁屏最显眼的位置，关门前一眼看到。",
    },
    audience: {
      en: "Best for people who get locked out, forget badges, or rush out every morning.",
      zh: "适合经常忘带钥匙、门禁卡、工牌，早上总是匆忙出门的人。",
    },
    tasks: {
      en: ["KEYS + WALLET + ACCESS CARD", "Check before closing the door", "Umbrella if raining"],
      zh: ["钥匙 + 钱包 + 门禁卡", "关门前再确认一次", "下雨记得带伞"],
    },
    keywords: ["keys wallet reminder", "access card lock screen", "leaving home checklist wallpaper"],
  },
  {
    slug: "metformin-after-dinner-reminder",
    icon: HeartPulse,
    template: "large-reminder",
    gradient: "linear-gradient(160deg, #1e1b4b 0%, #db2777 48%, #111827 100%)",
    eyebrow: {
      en: "Metformin after dinner reminder",
      zh: "饭后二甲双胍提醒锁屏",
    },
    title: {
      en: "Put the after-dinner medication reminder where it cannot be swiped away.",
      zh: "把饭后吃药提醒放到不能随手划掉的位置。",
    },
    description: {
      en: "A large-text medication lock screen for people who ignore alarms but still check their phone.",
      zh: "适合普通闹钟容易被划掉，但会频繁看手机的人。大字、清楚、少干扰。",
    },
    audience: {
      en: "Best for personal medication routines or family members setting up a simple visual reminder.",
      zh: "适合个人用药习惯，也适合子女帮家人设置简单视觉提醒。",
    },
    tasks: {
      en: ["AFTER DINNER: TAKE METFORMIN", "Drink water", "Mark done after taking it"],
      zh: ["饭后：吃二甲双胍", "喝一杯水", "吃完再划掉提醒"],
    },
    keywords: ["metformin reminder wallpaper", "after dinner medication reminder", "medicine lock screen"],
  },
  {
    slug: "passport-before-flight-lock-screen",
    icon: Plane,
    template: "urgent",
    gradient: "linear-gradient(160deg, #0c4a6e 0%, #0284c7 46%, #020617 100%)",
    eyebrow: {
      en: "Passport before flight lock screen",
      zh: "航班护照确认锁屏",
    },
    title: {
      en: "Make passport check the last thing you see before leaving.",
      zh: "出发前最后一眼，确认护照在身上。",
    },
    description: {
      en: "A travel lock screen for international flights, airport transfers, visa documents, and boarding essentials.",
      zh: "为国际航班、机场出发、签证材料和登机必备物品准备的锁屏确认页。",
    },
    audience: {
      en: "Best for international travelers, business trips, and anyone who cannot afford a passport mistake.",
      zh: "适合国际差旅、出国考试、旅行出发，以及绝不能忘护照的人。",
    },
    tasks: {
      en: ["PASSPORT IN BAG?", "Visa / ID / boarding pass", "Arrive airport 2h early", "Power bank in carry-on"],
      zh: ["护照在包里吗？", "签证 / 身份证 / 登机牌", "提前 2 小时到机场", "充电宝放随身包"],
    },
    keywords: ["passport reminder wallpaper", "flight checklist lock screen", "travel lock screen checklist"],
  },
  {
    slug: "stop-doomscrolling-lock-screen",
    icon: Focus,
    template: "interruption",
    gradient: "linear-gradient(160deg, #18181b 0%, #7c2d12 48%, #020617 100%)",
    eyebrow: {
      en: "Stop doomscrolling lock screen",
      zh: "打断无意识刷手机锁屏",
    },
    title: {
      en: "Interrupt the one-second habit before you open short videos.",
      zh: "在点开短视频前，用锁屏打断那一秒肌肉记忆。",
    },
    description: {
      en: "A direct lock screen prompt for people who pick up the phone and lose twenty minutes without meaning to.",
      zh: "给一拿起手机就无意识刷短视频的人，一句足够醒目的锁屏提醒。",
    },
    audience: {
      en: "Best for TikTok, Shorts, Reels, and late-night scrolling control.",
      zh: "适合想减少抖音、短视频、信息流和睡前刷手机的人。",
    },
    tasks: {
      en: ["Do you actually need your phone?", "Open it only for one task", "Put it down after 5 minutes"],
      zh: ["你现在拿手机是真的有事吗？", "只打开一个必要任务", "5 分钟后放下手机"],
    },
    keywords: ["stop doomscrolling wallpaper", "phone addiction lock screen", "short video interruption"],
  },
  {
    slug: "p0-incident-lock-screen-alert",
    icon: ServerCrash,
    template: "ops-alert",
    gradient: "linear-gradient(160deg, #020617 0%, #991b1b 45%, #000000 100%)",
    eyebrow: {
      en: "P0 incident lock screen alert",
      zh: "P0 故障锁屏报警",
    },
    title: {
      en: "Put critical ops alerts on the surface you cannot miss.",
      zh: "把 P0 报警糊到最不容易错过的屏幕上。",
    },
    description: {
      en: "A developer-facing lock screen alert concept for n8n, webhooks, on-call workflows, and critical incidents.",
      zh: "面向运维和开发者的锁屏报警场景，适合 n8n、Webhook、值班和关键故障。",
    },
    audience: {
      en: "Best for indie ops, on-call engineers, and automation builders who already use webhooks.",
      zh: "适合独立开发者、运维值班人员，以及已经在用 Webhook 自动化的人。",
    },
    tasks: {
      en: ["P0: DATABASE DOWN", "Check api-prod-01", "Open incident runbook", "Post update in 10 min"],
      zh: ["P0：数据库不可用", "检查 api-prod-01", "打开故障手册", "10 分钟内同步进展"],
    },
    keywords: ["P0 alert lock screen", "n8n phone alert", "on-call lock screen"],
  },
  {
    slug: "ai-one-thing-lock-screen",
    icon: Target,
    template: "calm-list",
    gradient: "linear-gradient(160deg, #172554 0%, #4338ca 45%, #020617 100%)",
    eyebrow: {
      en: "AI one thing lock screen",
      zh: "AI 今日最重要一件事锁屏",
    },
    title: {
      en: "Let your AI plan the day, then put the one thing on your lock screen.",
      zh: "让 AI 做计划，再把今天最重要的一件事放到锁屏上。",
    },
    description: {
      en: "For people who use Claude, ChatGPT, or OpenClaw to plan, but need the final priority to stay visible.",
      zh: "适合用 AI 做计划，但计划完容易扔一边的人。锁屏只保留今天最关键的一件事。",
    },
    audience: {
      en: "Best for AI power users, makers, founders, and anyone who wants one daily anchor.",
      zh: "适合 AI 重度用户、独立开发者、创业者，以及想给一天一个锚点的人。",
    },
    tasks: {
      en: ["THE ONE THING: Ship pricing page", "Ignore minor polish", "Review after 5 PM"],
      zh: ["今日唯一重点：上线定价页", "忽略细枝末节", "17:00 后复盘"],
    },
    keywords: ["AI daily priority lock screen", "one thing wallpaper", "OpenClaw lock screen"],
  },
  {
    slug: "study-lock-screen-wallpaper",
    icon: GraduationCap,
    template: "calm-list",
    gradient: "linear-gradient(160deg, #0f172a 0%, #2563eb 48%, #111827 100%)",
    eyebrow: {
      en: "Study lock screen wallpaper",
      zh: "学习计划锁屏壁纸",
    },
    title: {
      en: "Put today's study plan on your lock screen.",
      zh: "把今天的学习计划放到锁屏上。",
    },
    description: {
      en: "Create a calm lock screen for reading plans, assignments, review tasks, and focus sessions.",
      zh: "为阅读计划、作业、复习任务和专注时段生成一张干净的锁屏壁纸。",
    },
    audience: {
      en: "Best for school, college, language learning, and self-study routines.",
      zh: "适合校园学习、大学课程、语言学习和自学计划。",
    },
    tasks: {
      en: ["Read chapter 4", "Finish math worksheet", "Review notes for 20 min", "No phone until 9 PM"],
      zh: ["阅读第 4 章", "完成数学练习", "复习笔记 20 分钟", "21:00 前不刷手机"],
    },
    keywords: ["study lock screen wallpaper", "student todo wallpaper", "focus study wallpaper"],
  },
  {
    slug: "habit-tracker-lock-screen",
    icon: Dumbbell,
    template: "fitness",
    gradient: "linear-gradient(160deg, #052e16 0%, #16a34a 48%, #111827 100%)",
    eyebrow: {
      en: "Fitness habit lock screen",
      zh: "健身习惯打卡锁屏",
    },
    title: {
      en: "Make your workout cues visible before you unlock your phone.",
      zh: "解锁手机之前，先看到今天的训练提醒。",
    },
    description: {
      en: "Turn water, workout, stretching, protein, and sleep goals into a punchy daily lock screen checklist.",
      zh: "把喝水、训练、拉伸、蛋白质和睡眠目标做成更醒目的每日锁屏清单。",
    },
    audience: {
      en: "Best for fitness goals, simple habit tracking, and low-friction daily routines.",
      zh: "适合健身目标、简单习惯打卡和低摩擦的每日计划。",
    },
    tasks: {
      en: ["TRAIN TODAY", "Drink 2L water", "20 min workout", "Stretch before bed"],
      zh: ["今天必须训练", "喝水 2L", "训练 20 分钟", "睡前拉伸"],
    },
    keywords: ["habit tracker lock screen", "fitness wallpaper", "daily habit checklist"],
  },
  {
    slug: "daily-todo-wallpaper",
    icon: ListChecks,
    template: "calm-list",
    gradient: "linear-gradient(160deg, #20251f 0%, #4b5549 48%, #111318 100%)",
    eyebrow: {
      en: "Daily todo wallpaper",
      zh: "每日待办锁屏壁纸",
    },
    title: {
      en: "Turn today's top tasks into a clean lock screen.",
      zh: "把今天最重要的任务做成一张干净锁屏。",
    },
    description: {
      en: "A simple lock screen todo list for errands, personal tasks, appointments, and daily priorities.",
      zh: "适合差事、个人任务、预约和每日重点事项的锁屏待办清单。",
    },
    audience: {
      en: "Best for anyone who wants a visible task list without opening a productivity app.",
      zh: "适合不想频繁打开效率 App、只想一眼看到重点任务的人。",
    },
    tasks: {
      en: ["Pay rent before 6 PM", "Pick up package", "Call dentist", "Prepare tomorrow's bag"],
      zh: ["18:00 前交房租", "取快递", "给牙医打电话", "整理明天的包"],
    },
    keywords: ["daily todo wallpaper", "lock screen todo list", "task wallpaper"],
  },
];

export function getSeoScenario(slug: string) {
  return seoScenarios.find((scenario) => scenario.slug === slug);
}

export function getScenarioGeneratorHref(lang: string, scenario: SeoScenario) {
  const tasks = scenario.tasks[lang === "zh" ? "zh" : "en"].join("\n");
  return `/${lang}/generator?scenario=${encodeURIComponent(scenario.slug)}&template=${encodeURIComponent(scenario.template)}&bg=${encodeURIComponent(scenario.gradient)}&tasks=${encodeURIComponent(tasks)}`;
}
