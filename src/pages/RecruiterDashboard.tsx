import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { analyzeResume } from '../lib/openai';
import toast from 'react-hot-toast';

interface Analysis {
  fileName: string;
  result: string;
}

const RecruiterDashboard = () => {
  const [resumes, setResumes] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDrop: (acceptedFiles) => {
      setResumes(acceptedFiles);
    },
  });

  const handleAnalyze = async () => {
    if (resumes.length === 0 || !jobDescription) {
      toast.error('Please upload resumes and enter a job description');
      return;
    }

    setLoading(true);
    try {
      const results: Analysis[] = [];
      for (const resume of resumes) {
        const reader = new FileReader();
        const result = await new Promise((resolve) => {
          reader.onload = async (e) => {
            const text = e.target?.result as string;
            const analysis = await analyzeResume(text, jobDescription);
            resolve({
              fileName: resume.name,
              result: analysis,
            });
          };
          reader.readAsText(resume);
        });
        results.push(result as Analysis);
      }
      setAnalyses(results);
    } catch (error) {
      toast.error('Error analyzing resumes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Bulk Resume Analysis</h1>
        
        <div {...getRootProps()} className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop multiple resumes here, or click to select
          </p>
          {resumes.length > 0 && (
            <div className="mt-4 space-y-2">
              {resumes.map((file, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            rows={6}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Resumes'}
        </button>
      </div>

      {analyses.length > 0 && (
        <div className="space-y-6">
          {analyses.map((analysis, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Analysis for {analysis.fileName}
              </h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {analysis.result}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;