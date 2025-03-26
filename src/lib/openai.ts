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

export const analyzeResume = async (
	resumeText: string,
	jobDescription: string
): Promise<AnalysisResult> => {
	const response = await openai.chat.completions.create({
		model: "gpt-4-turbo-preview",
		messages: [
			{
				role: "system",
				content:
					"You are an expert HR analyst. Analyze the resume against the job description and provide a structured analysis. Return ONLY a JSON object with the following structure: { fitScore: number between 0-100, redFlags: array of strings describing concerns, summary: string summarizing the candidate's profile }",
			},
			{
				role: "user",
				content: `Resume: ${resumeText}\n\nJob Description: ${jobDescription}`,
			},
		],
		response_format: { type: "json_object" },
	});

	return JSON.parse(response.choices[0].message.content) as AnalysisResult;
};
