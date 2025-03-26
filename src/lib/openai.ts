import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

interface AnalysisResult {
	fitScore: number;
	redFlags: string[];
	summary: string;
}

const systemPrompt = `You are an expert HR analyst and resume reviewer. Analyze the resume against the job description and provide a structured analysis. Follow these guidelines:

1. Carefully read both the resume and job description
2. Consider both technical and soft skills
3. Look for:
   - Skills match
   - Experience relevance
   - Education requirements
   - Career progression
   - Gaps in employment
   - Project relevance
   - Industry alignment

Return ONLY a JSON object with this exact structure:
{
  "fitScore": number between 0-100,
  "redFlags": array of strings describing concerns,
  "summary": string summarizing the candidate's profile
}

Guidelines for each field:
- fitScore: Base this on overall match with job requirements
- redFlags: Include any concerning patterns, gaps, or mismatches
- summary: Provide a concise, professional summary of key qualifications

Handle all edge cases:
- If text is unclear/corrupted, extract what's possible and note in summary
- If text is empty, return appropriate error messages
- If format is unusual, adapt and note in summary
- Always return valid JSON even with partial data`;

export const analyzeResume = async (
	resumeText: string,
	jobDescription: string
): Promise<AnalysisResult> => {
	try {
		// Handle empty or invalid inputs
		if (!resumeText?.trim()) {
			return {
				fitScore: 0,
				redFlags: ["Unable to extract text from resume"],
				summary: "Resume text is empty or invalid",
			};
		}

		if (!jobDescription?.trim()) {
			return {
				fitScore: 0,
				redFlags: ["Job description is empty"],
				summary: "Job description is required for analysis",
			};
		}

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
				},
			],
			response_format: { type: "json_object" },
		});

		const result = JSON.parse(response.choices[0].message.content);

		// Validate and sanitize the response
		return {
			fitScore: Math.min(100, Math.max(0, Number(result.fitScore) || 0)),
			redFlags: Array.isArray(result.redFlags) ? result.redFlags : [],
			summary: String(result.summary || "No summary available"),
		};
	} catch (error: any) {
		console.error("Error analyzing resume:", error);
		return {
			fitScore: 0,
			redFlags: ["Error analyzing resume: " + (error.message || "Unknown error")],
			summary: "Failed to analyze resume. Please try again.",
		};
	}
};
