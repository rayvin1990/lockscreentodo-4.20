export interface AIProvider {
  name: string;
  chat(prompt: string, context?: any): Promise<string>;
  parseResume(file: File): Promise<any>;
  generateQuestions(description: string): Promise<string[]>;
  optimizeContent(
    content: string,
    jd?: string,
  ): Promise<{ optimized: string; annotations: any[] }>;
  analyzeJDMatch(resume: any, jd: string): Promise<any>;
}

class GLM47Service implements AIProvider {
  name = "glm-4" as const;
  private apiKey: string;
  private endpoint: string;
  private useMockData: boolean;

  constructor() {
    this.apiKey = process.env.GLM_API_KEY || "";
    this.endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    this.useMockData = process.env.USE_MOCK_AI === "true";

    if (!this.apiKey) {
      console.warn("GLM-4 API key not configured");
    }

    if (this.useMockData) {
      console.log("🤖 AI Service: Using MOCK DATA mode (set USE_MOCK_AI=false to use real API)");
    } else {
      console.log("✅ AI Service: Using GLM-4 API (compatible with 4.6/4.7)");
    }
  }

  async chat(prompt: string, context?: any): Promise<string> {
    try {
      console.log('[GLM API] Sending request to', this.endpoint);
      console.log('[GLM API] API Key present:', !!this.apiKey);
      console.log('[GLM API] API Key length:', this.apiKey.length);

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "glm-4",  // 使用 glm-4（兼容 4.6/4.7）
          messages: [
            {
              role: "system",
              content:
                "你是一个专业的简历优化助手，擅长使用 STAR 法则帮助求职者挖掘经历价值。",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      console.log('[GLM API] Response status:', response.status);
      const data = await response.json();

      if (data.error) {
        console.error('[GLM API] Error response:', data.error);

        // Special handling for API balance issues
        if (data.error.code === "1113") {
          throw new Error(
            "GLM API 余额不足。请访问 https://open.bigmodel.cn/ 充值后再试。" +
            "\n错误代码: " + data.error.code +
            "\n错误信息: " + data.error.message
          );
        }

        throw new Error(data.error.message);
      }

      console.log('[GLM API] Success! Response length:', data.choices[0].message.content?.length);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("[GLM API] Request failed:", error);
      throw error;
    }
  }

  async parseResume(file: File): Promise<any> {
    console.log('[AI Service] Starting resume parsing...');

    // Use mock data if enabled
    if (this.useMockData) {
      console.log('[AI Service] MOCK MODE: Returning sample resume data');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      return this.getMockResumeData();
    }

    const fileType = file.type || "";
    const fileName = (file.name || "").toLowerCase();
    const isImage = fileType.startsWith("image/") || !!fileName.match(/\.(png|jpg|jpeg|gif|bmp|webp|tiff|tif)$/i);

    if (isImage) {
      // Images will be handled by FastAPI service if configured
      // This is a fallback if FastAPI is not available
      console.log('[AI Service] Image file detected - using OCR (this may be slow)');
      console.warn('[AI Service] For faster image processing, start the FastAPI service: start-resume-parser.bat');

      try {
        const text = await this.extractImageText(file);
        console.log('[AI Service] OCR completed, parsing with GLM-4...');
        return await this.parseResumeFromText(text);
      } catch (error: any) {
        console.error('[AI Service] OCR failed:', error.message);
        // If OCR fails, return mock data
        console.log('[AI Service] OCR failed, returning sample data');
        return this.getMockResumeData();
      }
    } else {
      console.log('[AI Service] Document detected, extracting text...');
      const text = await this.extractTextFromFile(file);
      console.log('[AI Service] Text extracted, length:', text.length);
      return await this.parseResumeFromText(text);
    }
  }

  private getMockResumeData(): any {
    return {
      name: "张三",
      email: "zhangsan@example.com",
      phone: "13800138000",
      workExps: [
        {
          id: "1",
          company: "阿里巴巴集团",
          position: "高级前端工程师",
          startDate: "2021-07",
          endDate: null,
          current: true,
          description: "负责淘宝前端架构优化，使用 React 和 TypeScript 重构核心交易链路。\n- 主导性能优化项目，首屏加载时间减少 40%\n- 设计并实现组件库，覆盖 50+ 业务场景\n- 指导 3 名初级工程师，团队效率提升 30%"
        },
        {
          id: "2",
          company: "字节跳动",
          position: "前端工程师",
          startDate: "2019-06",
          endDate: "2021-06",
          current: false,
          description: "参与抖音电商 Web 端开发\n- 开发商品详情页，支撑日均 PV 1000 万+\n- 实现秒杀倒计时组件，精度达毫秒级\n- 优化图片加载策略，CDN 带宽节省 30%"
        }
      ],
      education: [
        {
          id: "1",
          school: "浙江大学",
          degree: "学士",
          major: "计算机科学与技术",
          startDate: "2015-09",
          endDate: "2019-06",
          gpa: "3.8/4.0"
        }
      ],
      skills: [
        { name: "React", level: "expert", category: "programming" },
        { name: "TypeScript", level: "advanced", category: "language" },
        { name: "Node.js", level: "advanced", category: "programming" },
        { name: "Webpack", level: "intermediate", category: "tool" },
        { name: "团队协作", level: "expert", category: "soft skill" }
      ]
    };
  }

  private async parseResumeFromText(text: string): Promise<any> {
    console.log('[AI Service] parseResumeFromText called, text length:', text.length);

    // Check if text is empty or too short
    if (!text || text.trim().length < 50) {
      console.error('[AI Service] Text too short or empty:', text.length);
      throw new Error("简历文本太短，无法解析。请确保文件包含可提取的文字内容。");
    }

    const prompt = `
请将以下简历文本解析为结构化 JSON 格式。返回格式要求：

{
  "name": "姓名",
  "email": "邮箱",
  "phone": "电话",
  "workExps": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM 或 null（如果是至今）",
      "current": true/false,
      "description": "工作描述"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "角色",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM 或 null",
      "description": "项目描述"
    }
  ],
  "education": [
    {
      "school": "学校",
      "degree": "学位",
      "major": "专业",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "GPA（如果有）"
    }
  ],
  "skills": [
    {
      "name": "技能名称",
      "level": "beginner/intermediate/advanced/expert",
      "category": "programming/language/tool/soft skill"
    }
  ]
}

简历文本：
${text.substring(0, 8000)}

只返回 JSON，不要有其他内容。
    `;

    console.log('[AI Service] Sending request to GLM API...');
    let response: string;
    try {
      response = await this.chat(prompt);
      console.log('[AI Service] GLM API response received, length:', response.length);
      console.log('[AI Service] First 200 chars of response:', response.substring(0, 200));
    } catch (error: any) {
      console.error('[AI Service] GLM API call failed:', error);
      throw new Error(`GLM API 调用失败: ${error.message}`);
    }

    // Try to extract JSON from response
    try {
      // Find JSON in response (sometimes AI adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        console.log('[AI Service] Extracted JSON, length:', jsonStr.length);
        const parsed = JSON.parse(jsonStr);
        console.log('[AI Service] JSON parsing successful');
        return parsed;
      } else {
        console.error('[AI Service] No JSON found in response');
        throw new Error("AI 返回的内容不是有效的 JSON 格式");
      }
    } catch (error: any) {
      console.error('[AI Service] JSON parsing failed:', error);
      console.error('[AI Service] Response was:', response.substring(0, 500));

      // Return mock data as fallback
      console.log('[AI Service] Returning mock data as fallback');
      return this.getMockResumeData();
    }
  }

  async generateQuestions(description: string): Promise<string[]> {
    const prompt = `
你是专业 HR 面试官，擅长通过 STAR 法则（Situation, Task, Action, Result）挖掘候选人的经历价值。

分析以下工作/项目描述，识别其中的模糊、笼统之处，生成 3-5 个有针对性的追问。

追问要求：
1. 要求提供具体数据（数字、百分比、时间）
2. 明确的手段/工具/方法
3. 可量化的结果
4. 个人在其中的角色和贡献

工作/项目描述：
"${description}"

请返回 JSON 数组格式的追问列表，不要有其他内容：
["追问1", "追问2", "追问3"]
    `;

    const response = await this.chat(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", response);
      return ["请描述你具体采取了哪些行动？", "能提供具体的数据支持吗？"];
    }
  }

  async optimizeContent(
    content: string,
    jd?: string,
  ): Promise<{ optimized: string; annotations: any[] }> {
    const jdContext = jd ? `\n目标职位 JD：\n${jd}\n` : "";

    const prompt = `
${jdContext}
你是一个专业的简历优化专家。请优化以下简历内容，使其更专业、更具体、更能体现候选人的价值。

原文：
"${content}"

请返回以下 JSON 格式：
{
  "optimized": "优化后的内容",
  "annotations": [
    {
      "before": "修改前的具体片段",
      "after": "修改后的具体片段",
      "reason": "修改原因（简短、专业）",
      "type": "improvement/correction/suggestion"
    }
  ]
}

要求：
1. 使用更具体的动词（如"主导"、"推动"、"优化"而非"负责"）
2. 量化成果（数字、百分比、时间）
3. 突出个人贡献和影响力
4. 保持内容真实性

只返回 JSON，不要有其他内容。
    `;

    const response = await this.chat(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", response);
      return { optimized: content, annotations: [] };
    }
  }

  async analyzeJDMatch(resume: any, jd: string): Promise<any> {
    const resumeText = JSON.stringify(resume, null, 2);

    const prompt = `
你是专业的 HR 招聘专家，擅长分析简历与 JD 的匹配度。

请分析以下简历与目标 JD 的匹配度，返回：

1. matchScore: 0-100 的匹配度分数
2. keywords: JD 中提取的关键词列表（技能、经验要求等）
3. suggestions: 针对 JD 的优化建议列表（每个建议包含：优化目标、具体建议）

简历：
${resumeText}

目标 JD：
${jd}

请返回以下 JSON 格式：
{
  "matchScore": 85,
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "suggestions": [
    {
      "target": "优化目标",
      "suggestion": "具体建议"
    }
  ]
}

只返回 JSON，不要有其他内容。
    `;

    const response = await this.chat(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", response);
      return { matchScore: 0, keywords: [], suggestions: [] };
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type || "";
    const fileName = (file.name || "").toLowerCase();

    // Log file info for debugging
    console.log(`[File Processing] type="${fileType}", name="${fileName}", size=${file.size}`);

    // Image files (OCR) - check this FIRST to avoid misclassification
    const imageExtensions = /\.(png|jpg|jpeg|gif|bmp|webp|tiff|tif)$/i;
    if (
      fileType.startsWith("image/") ||
      fileName.match(imageExtensions)
    ) {
      console.log(`[File Processing] Detected image file, starting OCR...`);
      return await this.extractImageText(file);
    }

    // PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      console.log(`[File Processing] Detected PDF file`);
      return await this.extractPDFText(file);
    }

    // Word documents
    if (
      fileType.includes("word") ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword" ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc")
    ) {
      console.log(`[File Processing] Detected Word document`);
      return await this.extractWordText(file);
    }

    // Text files
    if (
      fileType === "text/plain" ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".rtf") ||
      fileName.endsWith(".odt") ||
      fileName.endsWith(".md")
    ) {
      console.log(`[File Processing] Detected text file`);
      return await file.text();
    }

    // If we can't determine the type, try to be more permissive
    console.warn(`[File Processing] Unknown file type "${fileType}" for "${fileName}", trying text extraction...`);

    // Last resort: try to read as text
    try {
      const text = await file.text();
      console.log(`[File Processing] Successfully read as text, length: ${text.length}`);
      return text;
    } catch (error) {
      console.error(`[File Processing] Failed to read as text:`, error);
      throw new Error(
        `Unsupported file format: ${fileType || "unknown"} (${fileName}). ` +
        `Please upload a PDF, Word document, text file, or image.`
      );
    }
  }

  private async extractImageText(file: File): Promise<string> {
    console.log(`[OCR] Starting OCR process for image file...`);
    try {
      // Use Tesseract.js for OCR
      const Tesseract = await import("tesseract.js");

      console.log(`[OCR] Tesseract.js loaded, initiating recognition...`);

      // Add timeout to prevent hanging - increased to 120 seconds for large images
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("OCR timeout after 120 seconds")), 120000);
      });

      const ocrPromise = Tesseract.recognize(file, "eng", {
        logger: (m: any) => {
          if (m.status === "recognizing text" || m.status === "loading tesseract core") {
            console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const result = await Promise.race([ocrPromise, timeoutPromise]);

      console.log(`[OCR] Recognition complete! Text length: ${result.data.text.length}`);
      return result.data.text;
    } catch (error) {
      console.error("[OCR] Error:", error);
      if (error instanceof Error && error.message === "OCR timeout after 120 seconds") {
        throw new Error("OCR processing timed out. The image may be too complex or large. Try uploading a PDF or TXT file instead for faster processing.");
      }
      throw new Error("Failed to extract text from image. Please ensure the image contains clear, readable text.");
    }
  }

  private async extractPDFText(file: File): Promise<string> {
    console.log(`[PDF] Starting PDF text extraction for: ${file.name} (size: ${file.size} bytes)`);

    try {
      console.log(`[PDF] Reading file as ArrayBuffer...`);
      // Use arrayBuffer() instead of FileReader (works in Node.js)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!buffer || buffer.length === 0) {
        console.error(`[PDF] Failed to read PDF file`);
        throw new Error("Failed to read PDF file");
      }

      console.log(`[PDF] File read completed, loading pdf2json...`);
      // Use pdf2json - a Node.js native PDF parser (no worker needed)
      const PDFParser = (await import('pdf2json')).default;
      const pdfParser = new PDFParser();

      // Create a promise to wrap the event-based API
      const text = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error(`[PDF] Parsing timeout after 30 seconds`);
          pdfParser.removeAllListeners();
          reject(new Error("PDF parsing timeout - the file might be too large or corrupted"));
        }, 30000);

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          clearTimeout(timeout);
          console.error(`[PDF] Parse error:`, errData);
          reject(new Error(`PDF parsing error: ${errData.parserError || 'Unknown error'}`));
        });

        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          clearTimeout(timeout);
          try {
            // Extract all text from all pages
            let fullText = '';

            if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
              for (const page of pdfData.Pages) {
                if (page.Texts && Array.isArray(page.Texts)) {
                  for (const textItem of page.Texts) {
                    if (textItem.R && Array.isArray(textItem.R)) {
                      for (const r of textItem.R) {
                        if (r.T) {
                          // Decode text (pdf2json stores text as URL-encoded)
                          fullText += decodeURIComponent(r.T) + ' ';
                        }
                      }
                    }
                  }
                }
              }
            }

            console.log(`[PDF] PDF loaded successfully, pages: ${pdfData.Pages?.length || 0}`);
            console.log(`[PDF] Extraction completed, total text length: ${fullText.trim().length}`);

            if (fullText.trim().length < 50) {
              console.warn(`[PDF] WARNING: Extracted text is very short (${fullText.trim().length} chars). The PDF might be:
                1. Image-based (scanned)
                2. Password protected
                3. Corrupted
                Consider using a text-based PDF or converting to TXT format.`);
            }

            resolve(fullText);
          } catch (error) {
            console.error(`[PDF] Error processing parsed data:`, error);
            reject(error);
          }
        });

        // Parse the buffer
        try {
          pdfParser.parseBuffer(buffer);
        } catch (error) {
          clearTimeout(timeout);
          console.error(`[PDF] Error during parseBuffer:`, error);
          reject(error);
        }
      });

      return text;
    } catch (error: any) {
      console.error(`[PDF] Extraction error:`, error);
      console.error(`[PDF] Error message:`, error?.message);
      console.error(`[PDF] Error stack:`, error?.stack);

      // Return helpful error message
      if (error?.message?.includes('timeout')) {
        throw new Error("PDF 解析超时。文件可能太大或已损坏,请尝试上传较小的文件或转换为文本格式。");
      } else if (error?.message?.includes('password')) {
        throw new Error("PDF 文件受密码保护,请移除密码后重试。");
      } else {
        throw new Error(`PDF 解析失败: ${error?.message || '未知错误'}。请确保文件是有效的 PDF 格式。`);
      }
    }
  }

  private async extractWordText(file: File): Promise<string> {
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error("Failed to extract text from Word file");
    }
  }
}


// Fallback AI Service that tries a primary provider first, then switches to a secondary one on failure
class FallbackAIService implements AIProvider {
  name = "fallback";

  constructor(
    private primary: AIProvider,
    private secondary: AIProvider
  ) {
    if (process.env.USE_MOCK_AI === "true") {
      console.log("🤖 AI Service: Using MOCK DATA mode via Fallback (Mock setting detected)");
    } else {
      console.log(`✅ AI Service: Using Fallback Strategy (${primary.name} -> ${secondary.name})`);
    }
  }

  async chat(prompt: string, context?: any): Promise<string> {
    try {
      return await this.primary.chat(prompt, context);
    } catch (error: any) {
      console.warn(`[Fallback] Primary service (${this.primary.name}) failed:`, error.message);
      console.log(`[Fallback] Switching to secondary service (${this.secondary.name})...`);
      return await this.secondary.chat(prompt, context);
    }
  }

  async parseResume(file: File): Promise<any> {
    try {
      return await this.primary.parseResume(file);
    } catch (error: any) {
      console.warn(`[Fallback] Primary service (${this.primary.name}) failed to parse resume:`, error.message);
      console.log(`[Fallback] Switching to secondary service (${this.secondary.name})...`);
      return await this.secondary.parseResume(file);
    }
  }

  async generateQuestions(description: string): Promise<string[]> {
    try {
      return await this.primary.generateQuestions(description);
    } catch (error: any) {
      console.warn(`[Fallback] Primary service (${this.primary.name}) failed to generate questions:`, error.message);
      return await this.secondary.generateQuestions(description);
    }
  }

  async optimizeContent(content: string, jd?: string): Promise<{ optimized: string; annotations: any[] }> {
    try {
      return await this.primary.optimizeContent(content, jd);
    } catch (error: any) {
      console.warn(`[Fallback] Primary service (${this.primary.name}) failed to optimize content:`, error.message);
      return await this.secondary.optimizeContent(content, jd);
    }
  }

  async analyzeJDMatch(resume: any, jd: string): Promise<any> {
    try {
      return await this.primary.analyzeJDMatch(resume, jd);
    } catch (error: any) {
      console.warn(`[Fallback] Primary service (${this.primary.name}) failed to analyze match:`, error.message);
      return await this.secondary.analyzeJDMatch(resume, jd);
    }
  }
}

// Select AI service based on environment variables
// Using GLM-4 API
const hasGLMApiKey = !!process.env.GLM_API_KEY;

export const aiService: AIProvider = new GLM47Service();

console.log(`[AI Service] Selected provider: ${aiService.name}`);
console.log(`[AI Service] GLM API available: ${hasGLMApiKey}`);
