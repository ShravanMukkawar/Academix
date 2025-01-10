import React from 'react';
import DOMPurify from 'dompurify';

const HTMLContent = ({ content }) => {
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  return (
    <div 
      className="prose prose-invert max-w-none mb-6 prose-p:whitespace-pre-wrap prose-p:break-words prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-headings:leading-normal prose-li:my-1 prose-ul:space-y-2 prose-ol:space-y-2"
      dangerouslySetInnerHTML={createMarkup(content)}
      style={{
        '--tw-prose-body': 'var(--tw-prose-invert-body)',
        '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
        '--tw-prose-links': '#00B4D8',
        '--tw-prose-bold': 'white',
        '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
        '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
        '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
        '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
        '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
        '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
        '--tw-prose-code': 'var(--tw-prose-invert-code)',
        '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
        '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
        maxWidth: '100%',
        overflowWrap: 'break-word',
        wordBreak: 'break-word'
      }}
    />
  );
};

export default HTMLContent;