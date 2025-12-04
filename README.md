[metadata.json](https://github.com/user-attachments/files/23921356/metadata.json)# zela-
app de limpeza urbana
[README.md](https://github.com/user-attachments/files/23920561/README.md)
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
[CitizenView.tsx](https://github.com/user-attachments/files/23921377/CitizenView.tsx)[CityHallView.tsx](https://github.com/user-attachments/files/23921378/CityHallView.tsx)[Button.tsx](https://github.com/user-attachments/files/23921385/Button.tsx)
[AdminView.tsx](https://github.com/user-attachments/files/23921384/AdminView.tsx)
[Toast.tsx](https://github.com/user-attachments/files/23921383/Toast.tsx)
[TeamView.tsx](https://github.com/user-attachments/files/23921382/TeamView.tsx)
[ShareButton.tsx](https://github.com/user-attachments/files/23921381/ShareButton.tsx)
[LandingView.tsx](https://github.com/user-attachments/files/23921380/LandingView.tsx)


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1LtlNOAGPAP_lhqeRAoobaRAw7Oog1gpB

## Run Locally

**Prerequisites:**  Node.js
[Uploading meta[package.json](https://github.com/user-attachments/files/23921357/package.json)[index.tsx](https://github.com/user-attachments/files/23921362/index.tsx)
[index.html](https://github.com/user-attachments/files/23921361/index.html)
[App.tsx](https://github.com/user-attachments/files/23921360/App.tsx)
[tsconfig.json](https://github.com/user-attachments/files/23921359/tsconfig.json)
[pnpm-lock.yaml](https://github.com/user-attachments/files/23921358/pnpm-lock.yaml)
data.json…]()


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   [metadata.json](https://github.com/user-attachments/files/23921337/metadata.json)[package.json](https://github.com/user-attachments/files/23921338/package.json)[tsconfig.json](https://github.com/user-attachments/files/23921340/tsconfig.json)
[pnpm-lock.yaml](https://github.com/user-attachments/files/23921339/pnpm-lock.yaml)

GEMINI_API_KEY=PLACEHOLDER_API_KEY

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SystemConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  summary: string;
}

// Helper to robustly extract JSON from Markdown code blocks or raw text
const cleanJson = (text: string): string => {
  // 1. Try to find a code block with 'json' language identifier
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) return jsonBlockMatch[1].trim();

  // 2. Try to find any code block
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // 3. Fallback: try to find the first '{' and the last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  return text.trim();
};

export const analyzeReport = async (description: string): Promise<AnalysisResult> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        description: "The best category for the urban issue (e.g., Limpeza Urbana, Infraestrutura, Iluminação, Jardinagem).",
      },
      priority: {
        type: Type.STRING,
        enum: ["Low", "Medium", "High"],
        description: "The urgency of the issue based on safety and sanitation risks.",
      },
      summary: {
        type: Type.STRING,
        description: "A very short, professional title for the issue (max 5 words).",
      },
    },
    required: ["category", "priority", "summary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this urban maintenance report from a citizen: "${description}". Classify it responsibly.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an AI assistant for a smart city management platform called CleanConnect. Your job is to categorize urban issues."
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJson(text)) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      category: "Geral",
      priority: "Medium",
      summary: "Novo Relato",
    };
  }
};

// New function to handle System Updates via AI
export const generateSystemUpdate = async (command: string, currentConfig: SystemConfig): Promise<SystemConfig> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      appName: { type: Type.STRING },
      appSlogan: { type: Type.STRING },
      version: { type: Type.STRING },
      maintenanceMode: { type: Type.BOOLEAN },
      allowRegistrations: { type: Type.BOOLEAN },
      primaryColorName: { type: Type.STRING },
    },
    required: ["appName", "appSlogan", "version", "maintenanceMode", "allowRegistrations", "primaryColorName"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Current System State: ${JSON.stringify(currentConfig)}. 
      User Command: "${command}". 
      Update the configuration based on the user's command. Keep values unchanged if not mentioned. Return the full config object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are the Core System Controller AI (DevOps Bot). You interpret natural language commands to update system configuration flags."
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJson(text)) as SystemConfig;
  } catch (error) {
    console.error("Gemini DevOps Error:", error);
    return currentConfig; // Return original config on error
  }
};
# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

