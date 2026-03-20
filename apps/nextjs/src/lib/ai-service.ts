import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available and valid
const isValidOpenAIKey = process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY.startsWith('sk-') &&
  process.env.OPENAI_API_KEY.length > 40 &&
  !process.env.OPENAI_API_KEY.includes('your-openai-api-key-here');

const openai = isValidOpenAIKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

interface ImageAnalysisResult {
  prompt: string;
  style?: string;
  subject?: string;
  lighting?: string;
  composition?: string;
  technicalDetails?: {
    camera?: string;
    lens?: string;
    settings?: string;
  };
}

export class ImageAnalysisService {
  /**
   * Analyze an image and generate a detailed AI prompt
   */
  static async analyzeImageAndGeneratePrompt(
    imageData: string | Buffer,
    options: {
      style?: 'photorealistic' | 'artistic' | 'cinematic' | 'digital-art';
      detailLevel?: 'basic' | 'detailed' | 'professional';
      includeTechnicalDetails?: boolean;
    } = {}
  ): Promise<ImageAnalysisResult> {
    const {
      style = 'photorealistic',
      detailLevel = 'detailed',
      includeTechnicalDetails = false
    } = options;

    try {
      // Check if OpenAI client is available
      if (!openai) {
        console.warn('OpenAI API key not configured. Using fallback prompt.');
        return this.generateFallbackPrompt(true);
      }

      // Prepare the image for analysis
      const imageContent = typeof imageData === 'string'
        ? imageData.startsWith('data:')
          ? imageData
          : `data:image/jpeg;base64,${imageData}`
        : `data:image/jpeg;base64,${imageData.toString('base64')}`;

      // Create the analysis prompt
      const systemPrompt = this.createAnalysisPrompt(style, detailLevel, includeTechnicalDetails);

      // Call OpenAI Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and generate a detailed prompt for recreating or enhancing it with AI."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageContent,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const result = response.choices[0].message.content;

      // Parse and structure the result
      return this.parseAnalysisResult(result || "");

    } catch (error) {
      console.error('Error analyzing image:', error);

      // Fallback prompt if API fails
      return this.generateFallbackPrompt();
    }
  }

  /**
   * Generate an enhanced prompt based on a simple text description
   */
  static async generatePromptFromDescription(
    description: string,
    options: {
      style?: 'photorealistic' | 'artistic' | 'cinematic' | 'digital-art';
      mood?: string;
      quality?: 'standard' | 'hd' | 'ultra-hd';
    } = {}
  ): Promise<ImageAnalysisResult> {
    const { style = 'photorealistic', mood = 'neutral', quality = 'hd' } = options;

    try {
      // Check if OpenAI client is available
      if (!openai) {
        console.warn('OpenAI API key not configured. Using fallback prompt.');
        return {
          prompt: `Professional ${style} style image featuring ${description}. High quality, detailed, ${quality} resolution.\n\nNote: OpenAI API key not configured. Please add your API key to .env.local to enable AI-powered prompt generation.`,
          style,
          subject: description,
        };
      }

      const systemPrompt = `You are an expert prompt engineer for AI image generation.
Based on the user's description, create a detailed, professional-grade prompt that will produce high-quality images.

Consider these elements:
- Subject matter and main focus
- Style and artistic direction
- Lighting and atmosphere
- Composition and framing
- Colors and mood
- Technical specifications for quality

Respond with ONLY the prompt text, no explanations or formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Create a detailed AI image generation prompt for: "${description}"

Style: ${style}
Mood: ${mood}
Quality: ${quality}

Make the prompt comprehensive and professional.`
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      });

      const prompt = response.choices[0].message.content || "";

      return {
        prompt: prompt.trim(),
        style,
        subject: description,
      };

    } catch (error) {
      console.error('Error generating prompt:', error);

      return {
        prompt: `Professional ${style} style image featuring ${description}. High quality, detailed, ${quality} resolution.`,
        style,
        subject: description,
      };
    }
  }

  /**
   * Create the system prompt for image analysis
   */
  private static createAnalysisPrompt(
    style: string,
    detailLevel: string,
    includeTechnicalDetails: boolean
  ): string {
    const basePrompt = `You are an expert AI image analyst and prompt engineer. Analyze the provided image and generate a comprehensive prompt that could recreate or enhance this image.

Your analysis should include:
1. Main subject and focal points
2. Artistic style and visual characteristics
3. Lighting conditions and atmosphere
4. Composition and framing
5. Color palette and mood
6. Key details and textures${includeTechnicalDetails ? '\n7. Technical camera specifications' : ''}

Style preference: ${style}
Detail level: ${detailLevel}`;

    if (includeTechnicalDetails) {
      return basePrompt + `

Also include suggested camera settings, lens information, and technical photography details that would help recreate this image.`;
    }

    return basePrompt;
  }

  /**
   * Parse the AI response into a structured result
   */
  private static parseAnalysisResult(result: string): ImageAnalysisResult {
    // Basic parsing - in production, you might want more sophisticated parsing
    const lines = result.split('\n').filter(line => line.trim());

    return {
      prompt: result.trim(),
      style: this.extractField(lines, ['style', 'artistic style']),
      subject: this.extractField(lines, ['subject', 'main subject']),
      lighting: this.extractField(lines, ['lighting', 'light']),
      composition: this.extractField(lines, ['composition', 'framing']),
      technicalDetails: {
        camera: this.extractField(lines, ['camera', 'shot on']),
        lens: this.extractField(lines, ['lens', 'focal length']),
        settings: this.extractField(lines, ['settings', 'aperture', 'shutter speed']),
      }
    };
  }

  /**
   * Extract specific field from text lines
   */
  private static extractField(lines: string[], keywords: string[]): string | undefined {
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of keywords) {
        if (lowerLine.includes(keyword)) {
          return line.replace(/^.*?:/, '').trim();
        }
      }
    }
    return undefined;
  }

  /**
   * Generate a fallback prompt if API fails
   */
  private static generateFallbackPrompt(isApiKeyMissing = false): ImageAnalysisResult {
    const basePrompt = `A professional, high-quality image with excellent composition, dramatic lighting, and vivid colors. Detailed and photorealistic rendering with attention to texture and atmosphere. 8k resolution, masterpiece quality.`;

    return {
      prompt: isApiKeyMissing
        ? `${basePrompt}\n\nNote: OpenAI API key not configured. Please add your API key to .env.local to enable AI-powered image analysis.`
        : basePrompt,
      style: 'photorealistic',
      subject: 'Professional photography',
      lighting: 'Dramatic and well-balanced',
      composition: 'Rule of thirds with leading lines',
    };
  }
}