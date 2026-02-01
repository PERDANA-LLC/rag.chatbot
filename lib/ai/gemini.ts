
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!);

export const GeminiService = {
    /**
     * Uploads a file to Gemini Files API
     */
    async uploadFile(file: File): Promise<{ uri: string; name: string; mimeType: string }> {
        // We need to write the File object to a temp path because GoogleAIFileManager reads from path
        // In a real Vercel environment with limited fs, this might need buffer handling or /tmp
        const tempDir = os.tmpdir();
        const tempPath = path.join(tempDir, file.name);

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(tempPath, buffer);

        try {
            const uploadResponse = await fileManager.uploadFile(tempPath, {
                mimeType: file.type,
                displayName: file.name,
            });

            // Poll for active state
            let fileRecord = await fileManager.getFile(uploadResponse.file.name);
            while (fileRecord.state === FileState.PROCESSING) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                fileRecord = await fileManager.getFile(uploadResponse.file.name);
            }

            if (fileRecord.state === FileState.FAILED) {
                throw new Error("Gemini file processing failed");
            }

            return {
                uri: fileRecord.uri,
                name: fileRecord.name,
                mimeType: fileRecord.mimeType,
            };
        } finally {
            // Cleanup temp file
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    },

    /**
     * Deletes a file from Gemini
     */
    async deleteFile(name: string) {
        try {
            await fileManager.deleteFile(name);
        } catch (error) {
            console.error("Error deleting file from Gemini:", error);
            // Suppress error if already deleted or not found
        }
    },

    /**
     * Generates an answer using File Search
     */
    async generateAnswer(query: string, fileUris: string[]) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            tools: [
                {
                    // @ts-ignore - Valid in newer SDK versions
                    fileSearch: {},
                },
            ],
        });

        // Create a chat session with the files
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        ...fileUris.map((uri) => ({
                            fileData: {
                                mimeType: "application/pdf", // Simplified for now, should map
                                fileUri: uri
                            }
                        })),
                        { text: query },
                    ],
                },
            ],
            generationConfig: {
                // @ts-ignore
                temperature: 0.5,
            }
        });

        return result.response.text();
    },
};
