/**
 * Unified AI Service Layer
 * Handles both game AI (opponents, goalkeepers) and generative AI features
 */

import { GoogleGenAI } from "@google/genai";

class AIService {
  private genAI: GoogleGenAI | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the AI service with API key
   */
  initialize(apiKey: string) {
    if (!apiKey) {
      console.warn('AI Service: No API key provided, generative AI features will be disabled');
      return;
    }
    
    try {
      this.genAI = new GoogleGenAI({ apiKey });
      this.isInitialized = true;
      console.log('AI Service: Initialized successfully');
    } catch (error) {
      console.error('AI Service: Initialization failed', error);
    }
  }

  /**
   * Check if generative AI is available
   */
  isAvailable(): boolean {
    return this.isInitialized && this.genAI !== null;
  }

  /**
   * Generate content using Google GenAI
   */
  async generateContent(prompt: string, model: string = "gemini-2.5-flash"): Promise<string | null> {
    if (!this.isAvailable()) {
      console.warn('AI Service: Generative AI not available');
      return null;
    }

    try {
      const response = await this.genAI!.models.generateContent({
        model,
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('AI Service: Content generation failed', error);
      return null;
    }
  }

  /**
   * Generate audio using Google GenAI TTS
   */
  async generateAudio(text: string, voiceName: string = "Charon"): Promise<string | null> {
    if (!this.isAvailable()) {
      console.warn('AI Service: Audio generation not available');
      return null;
    }

    try {
      const response = await this.genAI!.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
      console.error('AI Service: Audio generation failed', error);
      return null;
    }
  }

  /**
   * Get tactical suggestions for gameplay
   */
  async getTacticalAdvice(matchSituation: string): Promise<string | null> {
    const prompt = `As a football tactical expert, provide brief tactical advice for this situation: "${matchSituation}". 
    Keep it concise (2-3 sentences) and actionable.`;
    
    return this.generateContent(prompt);
  }

  /**
   * Generate player commentary
   */
  async generateCommentary(event: string): Promise<string | null> {
    const prompt = `As an enthusiastic football commentator, provide a brief exciting commentary for this event: "${event}". 
    Make it dramatic and engaging (1-2 sentences).`;
    
    return this.generateContent(prompt);
  }
}

// Export singleton instance
export const aiService = new AIService();

// Auto-initialize with environment variable if available
if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
  aiService.initialize(process.env.GEMINI_API_KEY);
}