import { useState } from "react";
import { AlertTriangle, CheckCircle, FileSearch } from "lucide-react";
import { analyzeResume } from "../lib/openai";
import FileUpload from "../components/FileUpload";
import toast from "react-hot-toast";

interface AnalysisResult {
	fitScore: number;
	redFlags: string[];
	summary: string;
}

interface Analysis {
	fileName: string;
	result: AnalysisResult;
}

const RecruiterDashboard = () => {
	const [resumes, setResumes] = useState<File[]>([]);
	const [jobDescription, setJobDescription] = useState("");
	const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
	const [analyses, setAnalyses] = useState<Analysis[]>([]);
	const [loading, setLoading] = useState(false);

	const handleAnalyze = async () => {
		if (resumes.length === 0) {
			toast.error("Please upload at least one resume");
			return;
		}

		if (!jobDescription && !jobDescriptionFile) {
			toast.error("Please provide a job description");
			return;
		}

		setLoading(true);
		try {
			const jdText = jobDescriptionFile
				? await extractTextFromFile(jobDescriptionFile)
				: jobDescription;

			const results: Analysis[] = [];
			for (const resume of resumes) {
				const resumeText = await extractTextFromFile(resume);
				const analysis = await analyzeResume(resumeText, jdText);
				results.push({
					fileName: resume.name,
					result: analysis,
				});
			}
			setAnalyses(results.sort((a, b) => b.result.fitScore - a.result.fitScore));
		} catch (error: any) {
			toast.error(error.message || "Error analyzing resumes");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-6xl space-y-8">
			<div className="rounded-lg bg-white p-6 shadow-lg">
				<h1 className="mb-6 text-2xl font-bold text-gray-900">Bulk Resume Analysis</h1>

				<div className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Upload Resumes
						</label>
						<FileUpload onFileAccepted={setResumes} multiple value={resumes} />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Job Description
						</label>
						<div className="space-y-4">
							<FileUpload
								onFileAccepted={([file]) => {
									setJobDescriptionFile(file);
									setJobDescription("");
								}}
								value={jobDescriptionFile}
							/>
							<div className="relative">
								<div
									className="absolute inset-0 flex items-center"
									aria-hidden="true"
								>
									<div className="w-full border-t border-gray-300" />
								</div>
								<div className="relative flex justify-center">
									<span className="bg-white px-2 text-sm text-gray-500">
										or paste job description
									</span>
								</div>
							</div>
							<textarea
								value={jobDescription}
								onChange={(e) => {
									setJobDescription(e.target.value);
									setJobDescriptionFile(null);
								}}
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
								rows={6}
								placeholder="Paste job description here..."
								disabled={!!jobDescriptionFile}
							/>
						</div>
					</div>
				</div>

				<button
					onClick={handleAnalyze}
					disabled={loading}
					className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{loading ? "Analyzing..." : "Analyze Resumes"}
				</button>
			</div>

			{analyses.length > 0 && (
				<div className="space-y-8">
					{analyses.map((analysis, index) => (
						<div key={index} className="overflow-hidden rounded-lg bg-white shadow-lg">
							<div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-bold text-gray-900">
										{analysis.fileName}
									</h2>
									<span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
										Rank #{index + 1}
									</span>
								</div>
							</div>

							<div className="grid gap-6 p-6 md:grid-cols-3">
								<div className="rounded-lg bg-gray-50 p-6">
									<div className="flex items-center space-x-2">
										<CheckCircle className="h-6 w-6 text-blue-600" />
										<h3 className="text-lg font-semibold text-gray-900">
											Fit Score
										</h3>
									</div>
									<div className="mt-4">
										<div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
											<div
												className="absolute h-4 rounded-full bg-blue-600 transition-all duration-500 ease-in-out"
												style={{ width: `${analysis.result.fitScore}%` }}
											/>
										</div>
										<p className="mt-2 text-center text-2xl font-bold text-blue-600">
											{analysis.result.fitScore}%
										</p>
									</div>
								</div>

								<div className="rounded-lg bg-gray-50 p-6">
									<div className="flex items-center space-x-2">
										<AlertTriangle className="h-6 w-6 text-red-500" />
										<h3 className="text-lg font-semibold text-gray-900">
											Red Flags
										</h3>
									</div>
									<ul className="mt-4 list-inside list-disc space-y-2 text-sm">
										{analysis.result.redFlags.map((flag, flagIndex) => (
											<li key={flagIndex} className="text-gray-700">
												{flag}
											</li>
										))}
										{analysis.result.redFlags.length === 0 && (
											<li className="text-green-600">No red flags found</li>
										)}
									</ul>
								</div>

								<div className="rounded-lg bg-gray-50 p-6">
									<div className="flex items-center space-x-2">
										<FileSearch className="h-6 w-6 text-green-600" />
										<h3 className="text-lg font-semibold text-gray-900">
											Summary
										</h3>
									</div>
									<p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
										{analysis.result.summary}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default RecruiterDashboard;
