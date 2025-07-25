import { useEffect, useRef } from 'preact/hooks';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism.css';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeBlock({ code, language, className = '' }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightElement(preRef.current.querySelector('code')!);
    }
  }, [code, language]);

  return (
    <pre
      ref={preRef}
      className={`text-sm overflow-auto ${className}`}
      style={{ margin: 0, background: 'transparent' }}
    >
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
