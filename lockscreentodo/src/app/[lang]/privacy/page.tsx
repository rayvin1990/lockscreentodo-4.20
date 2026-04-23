import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Lockscreen Todo',
  description: 'Privacy Policy for Lockscreen Todo',
};

async function getPrivacyContent() {
  const filePath = path.join(process.cwd(), 'public', 'PRIVACY_POLICY.md');
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

export default async function PrivacyPage() {
  const privacyContent = await getPrivacyContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{privacyContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
