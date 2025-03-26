import React from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
interface FileUploadProps {
	onFileAccepted: (files: File[]) => void;
	multiple?: boolean;
	value?: File | File[];
	className?: string;
}
const FileUpload: React.FC<FileUploadProps> = ({
	onFileAccepted,
	multiple = false,
	value,
	className = "",
}) => {
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"application/pdf": [".pdf"],
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx", ".doc"],
			"text/plain": [".txt"],
		},
		multiple,
		onDrop: onFileAccepted,
	});
	const files = Array.isArray(value) ? value : value ? [value] : [];
	return (
		<div
			{...getRootProps()}
			className={`cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 ${className}`}
		>
			{" "}
			<input
				{...getInputProps()}
			/> <Upload className="mx-auto h-12 w-12 text-gray-400" />{" "}
			<p className="mt-2 text-sm text-gray-600">
				{" "}
				Drag & drop {multiple ? "files" : "a file"} here, or click to select{" "}
			</p>{" "}
			<p className="text-xs text-gray-500"> Supported formats: PDF, DOC, DOCX, TXT </p>{" "}
			{files.length > 0 && (
				<div className="mt-4 space-y-2">
					{" "}
					{files.map((file, index) => (
						<div
							key={index}
							className="flex items-center justify-center space-x-2 text-sm text-gray-600"
						>
							{" "}
							<FileText className="h-4 w-4" /> <span>{file.name}</span>{" "}
						</div>
					))}{" "}
				</div>
			)}{" "}
		</div>
	);
};
export default FileUpload;
