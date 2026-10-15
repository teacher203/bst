import JSZip from 'jszip';
import exporterSource from './projectZipExporter.ts?raw';

// Include only project files, never local credentials, dependencies, or student data.
const sources = import.meta.glob<string>(
  ['./*.tsx', './*.ts', './*.css', './index.html', './package.json',
    './tsconfig.json', './README.md', './metadata.json', './.gitignore',
    './.github/workflows/*.yml'],
  { query: '?raw', import: 'default', eager: true },
);

export async function downloadProjectZip(): Promise<void> {
  try {
    const zip = new JSZip();
    for (const [path, content] of Object.entries(sources)) {
      zip.file(path.replace(/^\.\//, ''), content);
    }
    zip.file('projectZipExporter.ts', exporterSource);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bst-project.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('Project ZIP export failed:', error);
    window.alert('소스 ZIP 다운로드에 실패했습니다. 다시 시도해 주세요.');
  }
}
