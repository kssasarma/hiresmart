import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import libre from "libreoffice-convert";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

export async function extractTextFromFile(file: File): Promise<string> {
	try {
		const fileType = file.type.toLowerCase();
		const arrayBuffer = await file.arrayBuffer();

		// Handle PDF files
		if (fileType === "application/pdf") {
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
			let fullText = "";

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const textContent = await page.getTextContent();
				const pageText = textContent.items.map((item: any) => item.str).join(" ");
				fullText += pageText + "\n";
			}

			return fullText.trim();
		}

		// Handle Word documents
		if (
			fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			const arrayBuffer = await file.arrayBuffer();
			const result = await mammoth.extractRawText({ arrayBuffer });
			return result.value.trim();
		}

		// // Handle DOC files using LibreOffice conversion
		// if (fileType === "application/msword") {
		// 	const buffer = Buffer.from(arrayBuffer);
		// 	return new Promise((resolve, reject) => {
		// 		libre.convert(buffer, ".txt", undefined, (err, done) => {
		// 			if (err) {
		// 				reject(`Error converting .doc file: ${err}`);
		// 				return;
		// 			}
		// 			resolve(done.toString().trim());
		// 		});
		// 	});
		// }

		// Handle text files
		if (fileType === "text/plain") {
			return await file.text();
		}

		throw new Error("Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.");
	} catch (error: any) {
		throw new Error(`Error extracting text from file: ${error.message}`);
	}
}
