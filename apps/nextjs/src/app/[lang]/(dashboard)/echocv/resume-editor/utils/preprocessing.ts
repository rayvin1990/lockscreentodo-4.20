/**
 * Frontend preprocessing utility for quick basic info extraction
 * Runs in parallel with base64 conversion to provide instant feedback
 */

export interface PreprocessedData {
  name?: string;
  email?: string;
  phone?: string;
  confidence: number;
}

/**
 * Extract basic information from file content using lightweight regex patterns
 * This runs immediately while waiting for AI processing
 */
export function extractBasicInfo(text: string): PreprocessedData {
  const result: PreprocessedData = {
    confidence: 0
  };

  // Extract Chinese name (2-4 characters)
  const namePatterns = [
    /(?:姓名|name)[:：]\s*([\\u4e00-\\u9fa5]{2,4})/i,
    /^([\\u4e00-\\u9fa5]{2,4})\\s+$/m,
    /(?:我是|I am)\\s+([\\u4e00-\\u9fa5]{2,4})/i
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.name = match[1];
      result.confidence += 30;
      break;
    }
  }

  // Extract email
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    result.email = emailMatch[0];
    result.confidence += 35;
  }

  // Extract Chinese phone number
  const phonePatterns = [
    /1[3-9]\\d{9}/,
    /(?:电话|手机|phone|tel)[:：]\\s*(1[3-9]\\d{9})/i
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.phone = match[1] || match[0];
      result.confidence += 35;
      break;
    }
  }

  return result;
}

/**
 * Extract text from file before sending to backend
 * Supports text files and basic PDF text extraction
 */
export async function extractTextQuick(file: File): Promise<string> {
  const fileType = file.type || "";
  const fileName = file.name.toLowerCase();

  // Text files - read directly
  if (
    fileType === "text/plain" ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md")
  ) {
    return await file.text();
  }

  // For binary files, return placeholder
  // Actual extraction will happen on backend
  return "";
}
