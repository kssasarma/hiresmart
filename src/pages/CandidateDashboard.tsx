import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { analyzeResume } from '../lib/openai';
import toast from 'react-hot-toast';

const CandidateDashboard = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setResume(acceptedFiles[0]);
    },
  });

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) {
      toast.error('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const result = await analyzeResume(text, jobDescription);
        setAnalysis(result);
      };
      reader.readAsText(resume);
    } catch (error) {
      toast.error('Error analyzing resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Resume Analysis</h1>
        
        <div {...getRootProps()} className="mb-6 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500">
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop your resume here, or click to select
          </p>
          {resume && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{resume.name}</span>
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
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {analysis && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Analysis Results</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-600">{analysis}</pre>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;