import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use - Lockscreen Todo',
  description: 'Terms of Service for Lockscreen Todo',
};

async function getTermsContent() {
  const filePath = path.join(process.cwd(), 'public', 'TERMS_OF_USE.md');
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

export default async function TermsPage() {
  const termsContent = await getTermsContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Use</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{termsContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
