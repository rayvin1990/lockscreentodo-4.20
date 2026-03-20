"use client";

import { useState, useEffect } from "react";
import { trpc } from "~/trpc/client";
import {
  FileText,
  FolderOpen,
  ChevronRight,
  AlertTriangle,
  Terminal,
  Eye,
  Download,
  Upload,
  Sparkles
} from "lucide-react";
import { useToast } from "./mock-ui";

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
}

export function ProfessionalResumeEditor() {
  const { toast } = useToast();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState([
    { time: "14:32:01", type: "info", message: "STAR 2.0 Engine initialized" },
    { time: "14:32:02", type: "success", message: "Master resume loaded" },
    { time: "14:32:03", type: "warning", message: "Missing quantitative data in work experience #1" },
  ]);
  const [resume, setResume] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch resume data
  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const data = await trpc.resume.getMasterResume.query();
      setResume(data);
    } catch (error: any) {
      console.error("Failed to fetch resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const parseResume = async (input: { file: File }) => {
    try {
      setIsUploading(true);
      addTerminalLog("info", `Converting file to base64: ${input.file.name}`);

      // Convert file to base64 for tRPC transport
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(input.file);

      const base64 = await base64Promise;
      addTerminalLog("success", `File converted, sending to API...`);

      await trpc.resume.parseResume.mutate({
        file: base64,
        fileName: input.file.name,
        fileType: input.file.type,
      });

      toast({
        title: "✅ 简历解析成功",
        description: "AI 已自动解析并创建母简历",
      });
      await fetchResume();
      addTerminalLog("success", "Resume parsed successfully by AI");
    } catch (error: any) {
      toast({
        title: "❌ 解析失败",
        description: error.message || "简历解析失败，请重试",
      });
      addTerminalLog("error", `Parse failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addTerminalLog = (type: "info" | "success" | "warning" | "error", message: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setTerminalLogs(prev => [...prev, { time, type, message }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "❌ 文件过大",
        description: "文件大小不能超过 10MB",
      });
      return;
    }

    addTerminalLog("info", `Uploading file: ${file.name}`);
    parseResume({ file });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#00ff41]" />
          <h1 className="text-lg font-bold text-white">EchoCV Pro - Resume Studio</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all flex items-center gap-2">
            <Eye className="w-4 h-4" />
            预览
          </button>
          <button className="px-3 py-1.5 text-sm bg-[#00ff41] hover:bg-[#00cc33] text-black font-semibold rounded-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出 PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Tree */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">简历库</h2>

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-[#00ff41] hover:bg-[#00ff41]/5 transition-all group">
              <Upload className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''} text-slate-500 group-hover:text-[#00ff41]`} />
              <span className="text-sm text-slate-400 group-hover:text-slate-300">
                {isUploading ? '处理中...' : '上传简历'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            <p className="text-xs text-slate-500 mt-2 text-center">
              支持 PDF、图片、文档格式
            </p>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Master Resume */}
            <div className="mb-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer transition-all">
                <FolderOpen className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span className="text-sm font-medium">Master Resume</span>
              </div>

              {resume && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {resume.workExps?.map((exp: any) => (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedSection(exp.id)}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer transition-all ${
                        selectedSection === exp.id
                          ? 'bg-[#00ff41]/10 text-[#00ff41]'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate">{exp.company}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Job Versions */}
            <div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer transition-all">
                <FolderOpen className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span className="text-sm font-medium">Job Versions</span>
              </div>
              <div className="ml-6 mt-1 text-xs text-slate-600 px-2">
                暂无定制版本
              </div>
            </div>
          </div>
        </div>

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col">
          {!resume ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">上传简历开始编辑</p>
                <p className="text-xs text-slate-600 mb-4">支持 PDF、Word、TXT、图片格式</p>
                <label className="px-6 py-3 bg-[#00ff41] hover:bg-[#00cc33] text-black font-semibold rounded-lg cursor-pointer transition-all inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  选择文件
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Info */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <h1 className="text-2xl font-bold text-white mb-2">{resume.name}</h1>
                  <p className="text-slate-400">点击左侧列表编辑经历</p>
                </div>

                {/* Work Experiences */}
                <div className="space-y-4">
                  {resume.workExps?.map((exp: any, idx: number) => (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedSection(exp.id)}
                      className={`bg-slate-900/30 border rounded-xl p-5 transition-all cursor-pointer ${
                        selectedSection === exp.id
                          ? 'border-[#00ff41] bg-[#00ff41]/5'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Warning Banner */}
                      <div className="flex items-center gap-2 mb-3 text-[#ffa500]">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">缺少量化数据 - 需要添加具体数字和成果</span>
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                          <p className="text-slate-400">{exp.company}</p>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                          {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : '至今'}
                        </span>
                      </div>

                      {/* Syntax-highlighted description */}
                      {exp.description && (
                        <div className="mt-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800 font-mono text-sm">
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      )}

                      {/* STAR Analysis Tags */}
                      <div className="mt-3 flex gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                          Situation: ✅
                        </span>
                        <span className="px-2 py-1 bg-[#00ff41]/10 text-[#00ff41] text-xs rounded border border-[#00ff41]/20">
                          Task: ✅
                        </span>
                        <span className="px-2 py-1 bg-[#ffa500]/10 text-[#ffa500] text-xs rounded border border-[#ffa500]/20">
                          Action: ⚠️
                        </span>
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">
                          Result: ❌
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - PDF Preview */}
        <div className="w-96 border-l border-slate-800 bg-white flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">简历预览</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            {/* ATS Radar Chart Placeholder */}
            <div className="mb-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <h4 className="text-xs font-semibold text-slate-700 mb-3">ATS 匹配度雷达图</h4>
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00ff41] mb-1">85%</div>
                  <div className="text-xs text-slate-500">匹配分数</div>
                </div>
              </div>
            </div>

            {/* PDF Preview Placeholder */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm min-h-[400px]">
              <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <h2 className="text-xl font-bold text-slate-900">{resume?.name || "我的简历"}</h2>
                <p className="text-sm text-slate-600 mt-2">实时预览会在这里显示</p>
              </div>

              {resume?.workExps?.map((exp: any) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-1">{exp.company}</p>
                  {exp.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Terminal */}
      {showTerminal && (
        <div className="h-48 border-t border-slate-800 bg-slate-950 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00ff41]" />
              <h3 className="text-sm font-semibold text-white">STAR 2.0 Debug Console</h3>
            </div>
            <button
              onClick={() => setShowTerminal(false)}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="flex gap-3">
                <span className="text-slate-600">{log.time}</span>
                <span className={
                  log.type === 'success' ? 'text-[#00ff41]' :
                  log.type === 'error' ? 'text-red-500' :
                  log.type === 'warning' ? 'text-[#ffa500]' :
                  'text-blue-400'
                }>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
