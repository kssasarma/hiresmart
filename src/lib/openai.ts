import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeResume = async (resumeText: string, jobDescription: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert HR analyst. Analyze the resume against the job description and provide a detailed analysis including fit score, red flags, and a summary."
      },
      {
        role: "user",
        content: `Resume: ${resumeText}\n\nJob Description: ${jobDescription}`
      }
    ]
  });

  return response.choices[0].message.content;
};