import { Brain, ListChecks, Timer, BookOpen, Dumbbell, Pill } from "lucide-react";

export function getSeoScenario(slug: string) {
  return seoScenarios.find((s) => s.slug === slug);
}

export function getScenarioGeneratorHref(lang: "en" | "zh", scenario: SeoScenario) {
  const tasks = encodeURIComponent(JSON.stringify(scenario.tasks[lang]));
  return `/generator?template=&gradient=&tasks=${tasks}`;
}

export type SeoScenario = {
  slug: string;
  icon: typeof Brain;
  template: string;
  gradient: string;
  eyebrow: {
    en: string;
    zh: string;
  };
  title: {
    en: string;
    zh: string;
  };
  description: {
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
  faqs?: {
    q: {
      en: string;
      zh: string;
    };
    a: {
      en: string;
      zh: string;
    };
  }[];
  keywords: string[];
  keywordsZh?: string[];
  heroMetric?: {
    en: string;
    zh: string;
  };
};

export const seoScenarios: SeoScenario[] = [
  {
    slug: "notion-task-lock-screen",
    icon: ListChecks,
    template: "calm-list",
    gradient: "linear-gradient(160deg, #0f172a 0%, #2563eb 46%, #020617 100%)",
    eyebrow: {
      en: "Notion task lock screen",
      zh: "Notion 待办锁屏",
    },
    title: {
      en: "Notion Task Lock Screen: Put Your To-Do List Where You Actually See It.",
      zh: "Notion 待办锁屏：把任务放到你真正会看到的地方。",
    },
    description: {
      en: "Turn today's Notion tasks into a clean phone lock screen wallpaper, so your priorities stay visible before you open another app.",
      zh: "把今天的 Notion 任务生成一张干净的手机锁屏壁纸，让重点任务在打开任何 App 之前就被看到。",
    },
    audience: {
      en: "Best for Notion users who plan carefully, then still miss tasks because the list is hidden inside a workspace, dashboard, or database view.",
      zh: "适合认真用 Notion 做计划，却因为任务藏在工作区、仪表盘或数据库视图里而经常漏掉重点的人。",
    },
    tasks: {
      en: [
        "Notion: review today's priority tasks",
        "Ship pricing page before 4 PM",
        "Follow up with 2 beta users",
        "Plan tomorrow's top 3",
      ],
      zh: ["Notion：查看今日重点任务", "16:00 前上线定价页", "跟进 2 个测试用户", "写下明天 Top 3"],
    },
    faqs: [
      {
        q: {
          en: "Can I put Notion tasks on my lock screen?",
          zh: "可以把 Notion 任务放到锁屏上吗？",
        },
        a: {
          en: "Yes. Lockscreen Todo lets you preview a task wallpaper, connect Notion, import your tasks, then save the result as a phone lock screen wallpaper.",
          zh: "可以。Lockscreen Todo 支持先预览任务壁纸，再连接 Notion 导入任务，最后把生成结果保存成手机锁屏壁纸。",
        },
      },
      {
        q: {
          en: "Does this replace my Notion task database?",
          zh: "这会替代我的 Notion 任务数据库吗？",
        },
        a: {
          en: "No. Keep Notion as your planning system. Lockscreen Todo is the visibility layer for the few tasks you need to see before unlocking your phone.",
          zh: "不会。Notion 继续作为你的计划系统，Lockscreen Todo 只负责把少数必须看到的任务变成锁屏上的可见提醒。",
        },
      },
      {
        q: {
          en: "Will the lock screen update automatically from Notion?",
          zh: "锁屏会自动跟随 Notion 更新吗？",
        },
        a: {
          en: "Not in the current web version. iOS and Android restrict websites from changing the lock screen automatically, so the current flow is manual and reliable.",
          zh: "当前网页版本不会自动更新。iOS 和 Android 都限制网页自动修改锁屏，所以目前流程是手动保存和设置，更稳定。",
        },
      },
    ],
    keywords: [
      "Notion task lock screen",
      "Notion todo lock screen",
      "Notion tasks on lock screen",
      "Notion task wallpaper",
      "Notion lock screen todo",
      "how to put Notion tasks on lock screen",
      "Notion to do list lock screen",
      "Notion reminder lock screen",
      "Notion wallpaper generator",
      "Notion lockscreen widget alternative",
      "Notion daily task wallpaper",
    ],
    keywordsZh: [
      "Notion 待办锁屏",
      "Notion 任务锁屏",
      "Notion 锁屏壁纸",
      "把 Notion 任务放到锁屏",
      "Notion 待办清单 锁屏",
      "Notion 提醒 锁屏",
      "Notion 任务 壁纸",
      "Notion 锁屏小组件 替代",
      "Notion 每日任务 壁纸",
      "锁屏待办 Notion",
      "手机锁屏 任务 Notion",
    ],
  },
  {
    slug: "adhd-lockscreen-reminder",
    icon: Brain,
    template: "bold-minimal",
    gradient: "linear-gradient(160deg, #7c3aed 0%, #ec4899 46%, #020617 100%)",
    eyebrow: {
      en: "ADHD lock screen reminder",
      zh: "ADHD 锁屏提醒",
    },
    title: {
      en: "ADHD Lock Screen Reminders: Stop Forgetting Important Tasks Before You Unlock Your Phone.",
      zh: "ADHD 锁屏提醒：在解锁手机之前就不会忘事。",
    },
    description: {
      en: "Turn your most important daily reminders into a bold, high-contrast lock screen wallpaper that you can't miss, even when distracted.",
      zh: "把你最重要的日常提醒做成高对比度的锁屏壁纸，即使注意力分散也不会错过。",
    },
    audience: {
      en: "Perfect for ADHD neurodivergent users who struggle with working memory, forgetfulness, and missed tasks hidden in app notifications.",
      zh: "适合工作记忆差、容易忘事、经常错过 App 通知里的任务的 ADHD 神经多样性用户。",
    },
    tasks: {
      en: [
        "Take meds with breakfast",
        "Drink water every 2 hours",
        "Respond to urgent emails before 3pm",
        "Pick up package on way home",
      ],
      zh: [
        "早餐时吃药",
        "每2小时喝一次水",
        "15:00 前回复紧急邮件",
        "回家路上取快递",
      ],
    },
    keywords: [
      "ADHD lock screen reminder",
      "ADHD to do list lock screen",
      "ADHD reminder wallpaper",
      "ADHD phone reminder",
      "neurodivergent lock screen",
      "ADHD visual reminder",
      "ADHD daily reminder",
    ],
    keywordsZh: [
      "ADHD 锁屏提醒",
      "ADHD 待办锁屏",
      "ADHD 提醒壁纸",
      "ADHD 手机提醒",
      "神经多样性 锁屏",
      "ADHD 视觉提醒",
      "ADHD 日常提醒",
    ],
  },
  {
    slug: "exam-countdown-lock-screen",
    icon: Timer,
    template: "countdown-bold",
    gradient: "linear-gradient(160deg, #ef4444 0%, #f97316 46%, #020617 100%)",
    eyebrow: {
      en: "Exam countdown lock screen",
      zh: "考试倒计时锁屏",
    },
    title: {
      en: "Exam Countdown Lock Screen: See How Many Days Are Left Every Time You Pick Up Your Phone.",
      zh: "考试倒计时锁屏：每次拿手机都能看到还剩多少天。",
    },
    description: {
      en: "Create a custom exam countdown lock screen wallpaper with your exam date and daily study tasks, so you stay focused on your goal every time you unlock your phone.",
      zh: "自定义考试倒计时锁屏壁纸，写上考试日期和每日学习任务，每次解锁手机都能提醒你专注目标。",
    },
    audience: {
      en: "Ideal for high school, college, and professional certification students who need a constant visible reminder of upcoming exams and study goals.",
      zh: "适合高中生、大学生和考职业证书的人，需要持续可见的提醒来关注即将到来的考试和学习目标。",
    },
    tasks: {
      en: [
        "Final exam in 12 days",
        "Review math chapters 5-7 today",
        "Finish practice test 3 before dinner",
        "Memorize 50 new vocabulary words",
      ],
      zh: [
        "期末考试还有 12 天",
        "今天复习数学 5-7 章",
        "晚饭前完成模拟卷 3",
        "背 50 个新单词",
      ],
    },
    keywords: [
      "exam countdown lock screen",
      "study countdown wallpaper",
      "test countdown lock screen",
      "exam reminder wallpaper",
      "study lock screen wallpaper",
      "countdown to exam wallpaper",
      "student lock screen todo",
    ],
    keywordsZh: [
      "考试倒计时锁屏",
      "学习倒计时壁纸",
      "考试提醒壁纸",
      "学习锁屏壁纸",
      "考试倒计时壁纸",
      "学生锁屏待办",
      "考研倒计时锁屏",
      "中考倒计时壁纸",
      "高考倒计时锁屏",
    ],
  },
  {
    slug: "study-plan-lock-screen",
    icon: BookOpen,
    template: "calm-list",
    gradient: "linear-gradient(160deg, #10b981 0%, #3b82f6 46%, #020617 100%)",
    eyebrow: {
      en: "Study plan lock screen",
      zh: "学习计划锁屏",
    },
    title: {
      en: "Study Plan Lock Screen: Turn Your Daily Study Schedule Into a Wallpaper You See 100+ Times a Day.",
      zh: "学习计划锁屏：把你的每日学习计划变成每天看100多次的壁纸。",
    },
    description: {
      en: "Organize your daily study tasks into a clean, distraction-free lock screen wallpaper that keeps you on track with your learning goals without opening a study app.",
      zh: "把你的每日学习任务整理成干净无干扰的锁屏壁纸，不用打开学习App就能保持学习进度。",
    },
    audience: {
      en: "Perfect for students of all ages, from middle school to graduate school, who want to stay focused on their study schedule without digital distractions.",
      zh: "适合从中学到研究生的各年龄段学生，想要专注学习计划，不被电子设备干扰。",
    },
    tasks: {
      en: [
        "Math: 2 hours problem solving",
        "English: 1 hour reading practice",
        "Science: review chapter 8 notes",
        "Break: 30 minutes walk outside",
      ],
      zh: [
        "数学：2 小时刷题",
        "英语：1 小时阅读练习",
        "物理：复习第 8 章笔记",
        "休息：30 分钟出门散步",
      ],
    },
    keywords: [
      "study plan lock screen",
      "study schedule wallpaper",
      "student to do list lock screen",
      "study reminder wallpaper",
      "learning lock screen wallpaper",
      "study motivation lock screen",
    ],
    keywordsZh: [
      "学习计划锁屏",
      "学习日程壁纸",
      "学生待办锁屏",
      "学习提醒壁纸",
      "学习锁屏壁纸",
      "学习动力锁屏",
      "考研计划锁屏",
      "考公计划壁纸",
    ],
  },
  {
    slug: "workout-routine-lock-screen",
    icon: Dumbbell,
    template: "bold-minimal",
    gradient: "linear-gradient(160deg, #84cc16 0%, #10b981 46%, #020617 100%)",
    eyebrow: {
      en: "Workout routine lock screen",
      zh: "健身计划锁屏",
    },
    title: {
      en: "Workout Routine Lock Screen: Never Skip a Gym Day Because You Forgot Your Plan.",
      zh: "健身计划锁屏：再也不会因为忘了计划而跳过健身日。",
    },
    description: {
      en: "Put your daily workout routine directly on your lock screen, so you see your exercise plan before you even open your fitness app.",
      zh: "把你的每日健身计划直接放到锁屏上，在打开健身App之前就能看到你的训练计划。",
    },
    audience: {
      en: "Great for gym goers, runners, home workout enthusiasts, and anyone who struggles to stick to their exercise routine.",
      zh: "适合健身爱好者、跑步爱好者、居家健身人群，以及难以坚持锻炼计划的人。",
    },
    tasks: {
      en: [
        "Gym day: upper body",
        "Bench press: 4 sets x 8 reps",
        "Pull ups: 4 sets x 10 reps",
        "Cardio: 20 minutes rowing",
      ],
      zh: [
        "健身日：上肢训练",
        "卧推：4 组 x 8 次",
        "引体向上：4 组 x 10 次",
        "有氧：20 分钟划船",
      ],
    },
    keywords: [
      "workout routine lock screen",
      "gym plan wallpaper",
      "exercise to do list lock screen",
      "fitness reminder wallpaper",
      "workout plan lock screen",
      "gym motivation lock screen",
    ],
    keywordsZh: [
      "健身计划锁屏",
      "健身日程壁纸",
      "训练计划锁屏",
      "健身提醒壁纸",
      "健身计划壁纸",
      "健身动力锁屏",
      "撸铁计划锁屏",
    ],
  },
  {
    slug: "medication-reminder-lock-screen",
    icon: Pill,
    template: "simple-text",
    gradient: "linear-gradient(160deg, #06b6d4 0%, #8b5cf6 46%, #020617 100%)",
    eyebrow: {
      en: "Medication reminder lock screen",
      zh: "吃药提醒锁屏",
    },
    title: {
      en: "Medication Reminder Lock Screen: Never Forget to Take Your Pills Again.",
      zh: "吃药提醒锁屏：再也不会忘记吃药。",
    },
    description: {
      en: "Create a simple, clear medication reminder lock screen wallpaper that you see every time you pick up your phone, so you never miss a dose.",
      zh: "制作一个简单清晰的吃药提醒锁屏壁纸，每次拿手机都能看到，再也不会忘记吃药。",
    },
    audience: {
      en: "Ideal for anyone who takes regular medication, vitamins, or supplements, especially older adults and people with busy schedules.",
      zh: "适合需要定期吃药、吃维生素或保健品的人，尤其是老年人和日程繁忙的人。",
    },
    tasks: {
      en: [
        "Take meds after breakfast",
        "Take vitamins with lunch",
        "Take evening pills before bed",
        "Refill prescription this weekend",
      ],
      zh: [
        "早饭后吃药",
        "午饭时吃维生素",
        "睡前吃晚上的药",
        "这周去补开处方",
      ],
    },
    keywords: [
      "medication reminder lock screen",
      "pill reminder wallpaper",
      "medicine to do list lock screen",
      "health reminder wallpaper",
      "medication schedule lock screen",
      "pill reminder for phone lock screen",
    ],
    keywordsZh: [
      "吃药提醒锁屏",
      "吃药提醒壁纸",
      "服药提醒锁屏",
      "健康提醒壁纸",
      "用药计划锁屏",
      "手机锁屏吃药提醒",
      "老人吃药提醒壁纸",
    ],
  },
];
