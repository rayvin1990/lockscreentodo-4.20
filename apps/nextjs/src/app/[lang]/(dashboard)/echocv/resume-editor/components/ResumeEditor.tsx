"use client";

import { useState, useRef, useEffect } from "react";
import { trpc } from "~/trpc/client";
import {
  Upload,
  FileText,
  Bolt,
  Trash2,
  Plus,
  Download,
  Eye,
} from "./mock-ui";
import { useToast } from "./mock-ui";
import { InterviewModal } from "./InterviewModal";
import { AnnotationPanel } from "./AnnotationPanel";
import { STAREngineV2 } from "./STAREngineV2";

// Mock data for development preview
const mockResume = {
  id: "mock-id",
  name: "Mock User",
  workExps: [
    {
      id: "exp1",
      company: "Mock Company",
      position: "Software Engineer",
      description: "Developed web applications using React and Node.js.",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2023-01-01"),
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "Mock Project",
      role: "Lead Developer",
      description: "Built a scalable web app.",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2022-12-01"),
    },
  ],
  education: [],
};

export function ResumeEditor() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [showInterview, setShowInterview] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showSTAREngine, setShowSTAREngine] = useState(false);
  const [starEngineSection, setStarEngineSection] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resume data
  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const data = await trpc.resume.getMasterResume.query();
      setResume(data);
    } catch (error: any) {
      console.error("Failed to fetch resume:", error);
      // Don't show toast on initial load failure
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleGetOrCreate = async () => {
    try {
      console.log("🚀 [handleGetOrCreate] Creating master resume...");
      setUploading(true);
      await trpc.resume.getOrCreateMasterResume.mutate();
      console.log("✅ [handleGetOrCreate] Master resume created successfully");
      toast({
        title: "✅ 创建成功",
        description: "母简历已创建",
      });
      await fetchResume();
    } catch (error: any) {
      console.error("❌ [handleGetOrCreate] Error:", error);
      toast({
        title: "❌ 创建失败",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleParseResume = async (file: File) => {
    try {
      console.log("🚀 [handleParseResume] Starting file upload...");
      console.log("📁 [handleParseResume] File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      setUploading(true);

      // Convert file to base64 for tRPC transport
      console.log("🔄 [handleParseResume] Converting file to base64...");
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          console.log("✅ [FileReader] File read completed, result length:", result.length);
          // Remove data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = result.split(',')[1];
          console.log("✅ [FileReader] Base64 extracted, length:", base64.length);
          resolve(base64);
        };
        reader.onerror = (error) => {
          console.error("❌ [FileReader] Error reading file:", error);
          reject(error);
        };
      });
      reader.readAsDataURL(file);

      const base64 = await base64Promise;
      console.log("✅ [handleParseResume] Base64 conversion complete");

      console.log("📡 [handleParseResume] Calling tRPC.resume.parseResume.mutate()...");
      console.log("📤 [handleParseResume] Request payload:", {
        fileName: file.name,
        fileType: file.type,
        base64Length: base64.length,
      });

      await trpc.resume.parseResume.mutate({
        file: base64,
        fileName: file.name,
        fileType: file.type,
      });

      console.log("✅ [handleParseResume] tRPC mutation successful!");

      toast({
        title: "✅ 简历解析成功",
        description: "AI 已自动解析并创建母简历",
      });
      await fetchResume();
    } catch (error: any) {
      console.error("❌ [handleParseResume] Error occurred:", error);
      console.error("❌ [handleParseResume] Error details:", {
        message: error.message,
        code: error.code,
        data: error.data,
      });
      toast({
        title: "❌ 解析失败",
        description: error.message || "简历解析失败，请重试",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "❌ 文件过大",
        description: "文件大小不能超过 10MB",
      });
      return;
    }

    await handleParseResume(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "❌ 文件过大",
        description: "文件大小不能超过 10MB",
      });
      return;
    }

    handleParseResume(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div
          className="w-full max-w-xl p-12 border-2 border-dashed border-slate-700 rounded-2xl text-center cursor-pointer hover:border-brand-green transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.png,.jpg,.jpeg,.gif,.bmp,.webp"
            onChange={handleUpload}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-300">AI 正在解析简历...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-16 h-16 text-brand-green" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  上传现有简历
                </h3>
                <p className="text-slate-400 mb-4">支持 PDF、Word、TXT、图片等所有格式</p>
              </div>
              <button className="px-6 py-3 bg-brand-green hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all">
                选择文件
              </button>
              <p className="text-sm text-slate-500 mt-4">
                或点击下方手动创建简历
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => handleGetOrCreate()}
          className="mt-8 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
        >
          手动创建母简历
        </button>
      </div>
    );
  }

  const startInterview = (section: any) => {
    setSelectedSection(section);
    setShowInterview(true);
  };

  const startSTAREngine = (section: any) => {
    setStarEngineSection(section);
    setShowSTAREngine(true);
  };

  const showAnnotation = (section: any) => {
    setSelectedSection(section);
    setShowAnnotations(true);
  };

  // Mock interview functions
  const mockStartInterview = (params: any) => {
    // Simulate success
  };

  const mockAnswerInterview = (params: any) => {
    // Simulate success
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">📝 编辑母简历</h2>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-brand-green hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                上传更新
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.png,.jpg,.jpeg,.gif,.bmp,.webp"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* 工作经历 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">💼 工作经历</h3>
              <button className="p-2 bg-brand-green/10 hover:bg-brand-green/20 rounded-lg transition-all">
                <Plus className="w-4 h-4 text-brand-green" />
              </button>
            </div>

            {resume?.workExps?.map((exp: any) => (
              <SectionCard
                key={exp.id}
                title={exp.company}
                subtitle={exp.position}
                description={exp.description}
                onAIInterview={() => startSTAREngine(exp)}
                onShowAnnotations={() => showAnnotation(exp)}
              />
            ))}

            {(!resume.workExps || resume.workExps.length === 0) && (
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">暂无工作经历，点击右上角添加</p>
              </div>
            )}
          </div>

          {/* 项目经历 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">🚀 项目经历</h3>
              <button className="p-2 bg-brand-green/10 hover:bg-brand-green/20 rounded-lg transition-all">
                <Plus className="w-4 h-4 text-brand-green" />
              </button>
            </div>

            {resume?.projects?.map((proj: any) => (
              <SectionCard
                key={proj.id}
                title={proj.name}
                subtitle={proj.role}
                description={proj.description}
                isProject
                onAIInterview={() => startSTAREngine(proj)}
                onShowAnnotations={() => showAnnotation(proj)}
              />
            ))}

            {(!resume.projects || resume.projects.length === 0) && (
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">暂无项目经历，点击右上角添加</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">👁️ 简历预览</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                <Eye className="w-4 h-4" />
                实时预览
              </button>
              <button className="px-4 py-2 bg-brand-green hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出 PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>

      {showInterview && selectedSection && (
        <InterviewModal
          section={selectedSection}
          onClose={() => setShowInterview(false)}
        />
      )}

      {showSTAREngine && starEngineSection && (
        <STAREngineV2
          section={starEngineSection}
          onClose={() => setShowSTAREngine(false)}
        />
      )}

      {showAnnotations && selectedSection?.aiAnnotations && (
        <AnnotationPanel
          annotations={selectedSection.aiAnnotations}
          onClose={() => setShowAnnotations(false)}
        />
      )}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  description,
  isProject = false,
  onAIInterview,
  onShowAnnotations,
}: {
  title: string;
  subtitle: string;
  description?: string;
  isProject?: boolean;
  onAIInterview?: () => void;
  onShowAnnotations?: () => void;
}) {
  const hasAnnotations = false;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4 hover:border-slate-600 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {description && (
            <>
              <button
                onClick={onAIInterview}
                className="p-2 bg-brand-green/10 hover:bg-brand-green/20 rounded-lg transition-all group"
                title="STAR Engine v2.0 - AI 深度访谈"
              >
                <Bolt className="w-4 h-4 text-brand-green group-hover:scale-110 transition-transform" />
              </button>
              {hasAnnotations && (
                <button
                  onClick={onShowAnnotations}
                  className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all group"
                  title="查看 AI 批注"
                >
                  <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </>
          )}
          <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all group">
            <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {description && (
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {isProject ? (
          <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded">
            项目
          </span>
        ) : (
          <span className="px-2 py-1 bg-brand-green/10 text-brand-green rounded">
            工作
          </span>
        )}
        {hasAnnotations && (
          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
            已优化
          </span>
        )}
      </div>
    </div>
  );
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";
  // Use consistent format to avoid hydration mismatch
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}/${month}/${day}`;
}

function ResumePreview({ resume }: { resume: any }) {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {resume.name || "我的简历"}
        </h1>
        <p className="text-sm text-slate-600">
          {resume.workExps?.[0]?.company && (
            <>
              <span className="mr-4">📧 {resume.workExps[0].company}</span>
              <span>📱 {resume.workExps[0].position}</span>
            </>
          )}
        </p>
      </div>

      {resume.workExps && resume.workExps.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            工作经历
          </h2>
          <div className="space-y-4">
            {resume.workExps.map((exp: any) => (
              <div key={exp.id} className="text-sm">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{exp.position}</h3>
                  <span className="text-slate-500" suppressHydrationWarning>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate) || "至今"}
                  </span>
                </div>
                <p className="font-semibold text-slate-700 mb-1">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="text-slate-600 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.projects && resume.projects.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            项目经历
          </h2>
          <div className="space-y-4">
            {resume.projects.map((proj: any) => (
              <div key={proj.id} className="text-sm">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{proj.name}</h3>
                  <span className="text-slate-500" suppressHydrationWarning>
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate) || "进行中"}
                  </span>
                </div>
                <p className="font-semibold text-slate-700 mb-1">{proj.role}</p>
                {proj.description && (
                  <p className="text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.education && resume.education.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            教育背景
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu: any) => (
              <div key={edu.id} className="text-sm">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900">{edu.school}</h3>
                  <span className="text-slate-500" suppressHydrationWarning>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-slate-700">
                  {edu.degree} · {edu.major}
                </p>
                {edu.gpa && <p className="text-slate-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
