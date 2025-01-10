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
      className="prose prose-invert max-w-none mb-6"
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
      }}
    />
  );
};

export default HTMLContent;