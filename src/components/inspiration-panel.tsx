"use client";

import { X } from "lucide-react";

interface InspirationPanelProps {
  onClose?: () => void;
  onApply?: (tasks: any[]) => void;
  isEnglish: boolean;
}

export function InspirationPanel({ onClose, onApply, isEnglish }: InspirationPanelProps) {
  const templates = [
    {
      id: 1,
      name: isEnglish ? "New Year Goals" : "新年目标",
      emoji: "🎯",
      tasks: [
        { id: "1", text: isEnglish ? "Exercise 3x per week" : "每周健身3次", x: 132, y: 80, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "2", text: isEnglish ? "Read 2 books per month" : "每月读2本书", x: 132, y: 130, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "3", text: isEnglish ? "Save $500 monthly" : "每月存$500", x: 132, y: 180, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "4", text: isEnglish ? "Learn a new skill" : "学习新技能", x: 132, y: 230, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "5", text: isEnglish ? "Drink 8 glasses of water" : "每天喝8杯水", x: 132, y: 280, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
      ],
    },
    {
      id: 2,
      name: isEnglish ? "Daily Habits" : "日常习惯",
      emoji: "📅",
      tasks: [
        { id: "1", text: isEnglish ? "Morning meditation" : "早晨冥想", x: 132, y: 80, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "2", text: isEnglish ? "Healthy breakfast" : "健康早餐", x: 132, y: 130, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "3", text: isEnglish ? "Check emails" : "查看邮件", x: 132, y: 180, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "4", text: isEnglish ? "Team standup" : "团队站会", x: 132, y: 230, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "5", text: isEnglish ? "Evening walk" : "晚间散步", x: 132, y: 280, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
      ],
    },
    {
      id: 3,
      name: isEnglish ? "Productivity Boost" : "生产力提升",
      emoji: "🚀",
      tasks: [
        { id: "1", text: isEnglish ? "Priority #1 task first" : "先做优先级#1任务", x: 132, y: 80, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "2", text: isEnglish ? "Time blocking" : "时间块管理", x: 132, y: 130, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "3", text: isEnglish ? "No meetings day" : "无会议日", x: 132, y: 180, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "4", text: isEnglish ? "Deep work 2 hours" : "深度工作2小时", x: 132, y: 230, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl animate-in fade-in duration-300">
      <div className="bg-brand-card rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-800 ring-1 ring-white/10 shadow-indigo-500/10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isEnglish ? "Choose a Template" : "选择灵感模板"}
            </h2>
            <p className="text-gray-400 mt-1">{isEnglish ? "Get started in seconds" : "几秒钟内快速开始"}</p>
          </div>
          <button 
            onClick={() => onClose?.()} 
            className="text-gray-500 hover:text-white p-3 hover:bg-white/10 rounded-2xl transition-all"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="grid gap-5">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                if (onApply) {
                  onApply(template.tasks);
                } else {
                  // Fallback for Landing Page
                  window.location.href = `/${isEnglish ? 'en' : 'zh'}/generator`;
                }
              }}
              className="bg-brand-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-indigo-500 rounded-2xl p-5 text-left transition-all hover:scale-[1.01] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-12 -mt-12" />
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{template.emoji}</span>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {template.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400 font-medium">
                {template.tasks.length} {isEnglish ? "Power Tasks" : "个高效任务"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
