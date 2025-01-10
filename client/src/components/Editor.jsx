import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, List, Heading1, Heading2, Link as LinkIcon } from 'lucide-react';

const RichTextEditor = ({ value = '', onChange, label = 'Content', minHeight = '200px', placeholder = 'Start typing...' }) => {
  const editorRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(!value);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
      setIsEmpty(false);
    }
  }, []);

  const handleEditorChange = () => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      // Check if content is empty or only contains whitespace/breaks
      const isContentEmpty = !content || content.replace(/<[^>]*>/g, '').trim() === '';
      setIsEmpty(isContentEmpty);
      onChange(content);
    }
  };

  const formatDoc = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleEditorChange();
  };

  const addLink = () => {
    const selection = window.getSelection();
    let displayText = selection.toString() || '';
    
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      if (!displayText) {
        displayText = prompt('Enter display text:', url) || url;
      }
      
      if (!selection.toString()) {
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.textContent = displayText;
        linkElement.target = '_blank';
        linkElement.rel = 'noopener noreferrer';
        
        const range = selection.getRangeAt(0);
        range.insertNode(linkElement);
      } else {
        formatDoc('createLink', url);
        const link = selection.anchorNode.parentNode;
        if (link.tagName === 'A') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }
      handleEditorChange();
    }
  };

  const toolbarButtons = [
    { icon: <Bold className="w-4 h-4" />, action: () => formatDoc('bold'), title: 'Bold' },
    { icon: <Italic className="w-4 h-4" />, action: () => formatDoc('italic'), title: 'Italic' },
    { icon: <Heading1 className="w-4 h-4" />, action: () => formatDoc('formatBlock', 'h2'), title: 'Heading 1' },
    { icon: <Heading2 className="w-4 h-4" />, action: () => formatDoc('formatBlock', 'h3'), title: 'Heading 2' },
    { icon: <AlignLeft className="w-4 h-4" />, action: () => formatDoc('justifyLeft'), title: 'Align Left' },
    { icon: <AlignCenter className="w-4 h-4" />, action: () => formatDoc('justifyCenter'), title: 'Align Center' },
    { icon: <AlignRight className="w-4 h-4" />, action: () => formatDoc('justifyRight'), title: 'Align Right' },
    { icon: <LinkIcon className="w-4 h-4" />, action: addLink, title: 'Add Link' },
    { icon: <List className="w-4 h-4" />, action: () => formatDoc('insertUnorderedList'), title: 'Bullet List' },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2 bg-[#001845] p-2 rounded-t-xl border border-b-0 border-[#003875]">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={button.action}
            className="p-2 text-gray-300 hover:text-[#00B4D8] rounded transition-colors"
            title={button.title}
          >
            {button.icon}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable="true"
        onInput={handleEditorChange}
        className={`w-full px-4 py-3 rounded-b-xl bg-[#001845] border border-[#003875] text-white focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none overflow-auto ${isEmpty ? 'empty' : ''}`}
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      <style jsx="true">{`
        [contenteditable=true].empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          position: absolute;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;