"use client";

import { X } from "lucide-react";

interface InspirationPanelProps {
  onClose: () => void;
  onApply: (tasks: any[]) => void;
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
    {
      id: 4,
      name: isEnglish ? "Wellness Focus" : "健康专注",
      emoji: "💪",
      tasks: [
        { id: "1", text: isEnglish ? "8 hours sleep" : "睡8小时", x: 132, y: 80, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "2", text: isEnglish ? "Take vitamins" : "吃维生素", x: 132, y: 130, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "3", text: isEnglish ? "Stretch breaks" : "伸展休息", x: 132, y: 180, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "4", text: isEnglish ? "Limit screen time" : "限制屏幕时间", x: 132, y: 230, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
      ],
    },
    {
      id: 5,
      name: isEnglish ? "Random Motivation" : "随机激励",
      emoji: "🎲",
      tasks: [
        { id: "1", text: isEnglish ? "Make today count" : "让今天有意义", x: 132, y: 80, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "2", text: isEnglish ? "Focus on progress, not perfection" : "关注进步，而非完美", x: 132, y: 130, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
        { id: "3", text: isEnglish ? "You've got this!" : "你能做到！", x: 132, y: 180, fontSize: 24, color: "#ffffff", backgroundColor: "transparent", backgroundOpacity: 0.6, opacity: 1, isBold: false, isItalic: false, isCompleted: false, textAlign: "center" as const, fontFamily: "var(--font-inter)" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEnglish ? "Inspiration Templates" : "灵感模板"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onApply(template.tasks)}
              className="bg-brand-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-brand-green rounded-xl p-4 text-left transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-green transition-colors">
                  {template.name}
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                {template.tasks.length} {isEnglish ? "tasks" : "任务"}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}