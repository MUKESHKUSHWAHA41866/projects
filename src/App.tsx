// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' },         // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' },              // red-500
//     { code: 32, color: '#10B981', name: 'Green' },            // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' },             // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' },             // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' },             // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' },             // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' },            // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' },             // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' },         // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' },       // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' },        // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' },        // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' },        // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' },        // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' },       // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const textareaRef = useRef<HTMLDivElement>(null);

//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;

//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();

//     // If no text is selected, return
//     if (!selectedText.trim()) return;

//     // Check if the selected text is already styled with the same code
//     const parentSpan = range.commonAncestorContainer.parentElement;
//     const hasExistingStyle = parentSpan?.classList.contains(`ansi-${code}`);

//     if (code === 0) {
//       // Reset: Remove all styling from the selected text
//       const textNode = document.createTextNode(selectedText);
//       range.deleteContents();
//       range.insertNode(textNode);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     } else if (hasExistingStyle) {
//       // Remove the specific style if it already exists
//       const textNode = document.createTextNode(selectedText);
//       range.deleteContents();
//       range.insertNode(textNode);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     } else {
//       // Apply new style
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   const nodesToANSI = (nodes: NodeListOf<ChildNode>, states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]): string => {
//     let result = '';
//     nodes.forEach(node => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         const ansiCode = Number(element.className.split('-')[1]);
//         const newState = { ...states[states.length - 1] };

//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;

//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(node.childNodes, states);
//         states.pop();
//         result += '\x1b[0m';
        
//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   const copyText = async () => {
//     if (!textareaRef.current) return;
    
//     const formattedText = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes) + '\n```';
    
//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here\'s the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
          
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;





// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' }, // red-500
//     { code: 32, color: '#10B981', name: 'Green' }, // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' }, // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' }, // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' }, // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' }, // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' }, // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' }, // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' }, // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' }, // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' }, // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const textareaRef = useRef<HTMLDivElement>(null);

//   // Revised handleStyle function
//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return; // Nothing selected

//     // When code is 0, remove all styling from the selection.
//     if (code === 0) {
//       // For simplicity, replace selection with plain text.
//       const textNode = document.createTextNode(selectedText);
//       range.deleteContents();
//       range.insertNode(textNode);
//       selection.removeAllRanges();
//       return;
//     }

//     // Check if the selection is entirely within a single span with the target style.
//     let container = range.commonAncestorContainer;
//     // If the common container is a text node, use its parent.
//     if (container.nodeType === Node.TEXT_NODE) {
//       container = container.parentElement;
//     }

//     if (
//       container &&
//       container.tagName === 'SPAN' &&
//       container.classList.contains(`ansi-${code}`) &&
//       container.textContent === selectedText
//     ) {
//       // Unwrap the span (remove style) by replacing it with plain text.
//       const plainTextNode = document.createTextNode(selectedText);
//       container.parentElement.replaceChild(plainTextNode, container);
//       selection.removeAllRanges();
//     } else {
//       // Otherwise, apply the new style by wrapping the selected text in a span.
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       // Adjust selection to the new span (optional)
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   const nodesToANSI = (
//     nodes: NodeListOf<ChildNode>,
//     states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
//   ): string => {
//     let result = '';
//     nodes.forEach((node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         const ansiCode = Number(element.className.split('-')[1]);
//         const newState = { ...states[states.length - 1] };

//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;

//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(node.childNodes, states);
//         states.pop();
//         result += '\x1b[0m';

//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   const copyText = async () => {
//     if (!textareaRef.current) return;

//     const formattedText = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes) + '\n```';

//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here\'s the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' }, // red-500
//     { code: 32, color: '#10B981', name: 'Green' }, // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' }, // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' }, // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' }, // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' }, // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' }, // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' }, // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' }, // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' }, // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' }, // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const textareaRef = useRef<HTMLDivElement>(null);

//   // Updated handleStyle function with improved reset functionality
//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return; // Nothing selected

//     // When code is 0, remove all styling from the selection.
//     if (code === 0) {
//       // Extract the selected content as a DocumentFragment.
//       const fragment = range.extractContents();
//       // Create a plain text node from the fragment's text content.
//       const plainText = document.createTextNode(fragment.textContent || '');
//       // Insert the plain text back into the document.
//       range.insertNode(plainText);
//       // Clear the selection.
//       selection.removeAllRanges();
//       return;
//     }

//     // Check if the selection is entirely within a single span with the target style.
//     let container: Node = range.commonAncestorContainer;
//     // If the container is a text node, use its parent.
//     if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
//       container = container.parentElement;
//     }

//     if (
//       container instanceof Element &&
//       container.tagName === 'SPAN' &&
//       container.classList.contains(`ansi-${code}`) &&
//       container.textContent === selectedText
//     ) {
//       // Unwrap the span (remove style) by replacing it with plain text.
//       const plainTextNode = document.createTextNode(selectedText);
//       if (container.parentElement) {
//         container.parentElement.replaceChild(plainTextNode, container);
//       }
//       selection.removeAllRanges();
//     } else {
//       // Otherwise, apply the new style by wrapping the selected text in a span.
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       // Adjust selection to the new span (optional)
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   const nodesToANSI = (
//     nodes: NodeListOf<ChildNode>,
//     states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
//   ): string => {
//     let result = '';
//     nodes.forEach((node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         const ansiCode = Number(element.className.split('-')[1]);
//         const newState = { ...states[states.length - 1] };

//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;

//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(node.childNodes, states);
//         states.pop();
//         result += '\x1b[0m';

//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   const copyText = async () => {
//     if (!textareaRef.current) return;

//     const formattedText = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes) + '\n```';

//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here\'s the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' }, // red-500
//     { code: 32, color: '#10B981', name: 'Green' }, // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' }, // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' }, // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' }, // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' }, // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' }, // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' }, // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' }, // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' }, // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' }, // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const [customColor, setCustomColor] = useState(''); // New state for custom color
//   const textareaRef = useRef<HTMLDivElement>(null);

//   // Updated handleStyle function with improved reset functionality
//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return; // Nothing selected

//     // When code is 0, remove all styling from the selection.
//     if (code === 0) {
//       // Extract the selected content as a DocumentFragment.
//       const fragment = range.extractContents();
//       // Create a plain text node from the fragment's text content.
//       const plainText = document.createTextNode(fragment.textContent || '');
//       // Insert the plain text back into the document.
//       range.insertNode(plainText);
//       // Clear the selection.
//       selection.removeAllRanges();
//       return;
//     }

//     // Check if the selection is entirely within a single span with the target style.
//     let container: Node = range.commonAncestorContainer;
//     // If the container is a text node, use its parent.
//     if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
//       container = container.parentElement;
//     }

//     if (
//       container instanceof Element &&
//       container.tagName === 'SPAN' &&
//       container.classList.contains(`ansi-${code}`) &&
//       container.textContent === selectedText
//     ) {
//       // Unwrap the span (remove style) by replacing it with plain text.
//       const plainTextNode = document.createTextNode(selectedText);
//       if (container.parentElement) {
//         container.parentElement.replaceChild(plainTextNode, container);
//       }
//       selection.removeAllRanges();
//     } else {
//       // Otherwise, apply the new style by wrapping the selected text in a span.
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       // Adjust selection to the new span (optional)
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   // New function to apply a custom color style using the provided hex value.
//   const applyCustomColor = () => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;
//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return;

//     // Wrap selected text with a span that uses the custom color as inline style.
//     const span = document.createElement('span');
//     span.textContent = selectedText;
//     span.style.color = customColor;
//     range.deleteContents();
//     range.insertNode(span);
//     // Optionally adjust the selection to the new span.
//     range.selectNodeContents(span);
//     selection.removeAllRanges();
//     selection.addRange(range);
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   const nodesToANSI = (
//     nodes: NodeListOf<ChildNode>,
//     states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
//   ): string => {
//     let result = '';
//     nodes.forEach((node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         const ansiCode = Number(element.className.split('-')[1]);
//         const newState = { ...states[states.length - 1] };

//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;

//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(node.childNodes, states);
//         states.pop();
//         result += '\x1b[0m';

//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   const copyText = async () => {
//     if (!textareaRef.current) return;

//     const formattedText = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes) + '\n```';

//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here\'s the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Custom Color</h3>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="#ff00ff"
//                   value={customColor}
//                   onChange={(e) => setCustomColor(e.target.value)}
//                   className="px-2 py-1 rounded text-black"
//                 />
//                 <button
//                   onClick={applyCustomColor}
//                   className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
//                 >
//                   Apply Color
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' }, // red-500
//     { code: 32, color: '#10B981', name: 'Green' }, // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' }, // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' }, // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' }, // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' }, // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' }, // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' }, // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' }, // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' }, // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' }, // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const [customColor, setCustomColor] = useState('#ffffff'); // Default to white
//   const textareaRef = useRef<HTMLDivElement>(null);

//   // Updated handleStyle function with improved reset functionality
//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return; // Nothing selected

//     // When code is 0, remove all styling from the selection.
//     if (code === 0) {
//       // Extract the selected content as a DocumentFragment.
//       const fragment = range.extractContents();
//       // Create a plain text node from the fragment's text content.
//       const plainText = document.createTextNode(fragment.textContent || '');
//       // Insert the plain text back into the document.
//       range.insertNode(plainText);
//       // Clear the selection.
//       selection.removeAllRanges();
//       return;
//     }

//     // Check if the selection is entirely within a single span with the target style.
//     let container: Node = range.commonAncestorContainer;
//     // If the container is a text node, use its parent.
//     if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
//       container = container.parentElement;
//     }

//     if (
//       container instanceof Element &&
//       container.tagName === 'SPAN' &&
//       container.classList.contains(`ansi-${code}`) &&
//       container.textContent === selectedText
//     ) {
//       // Unwrap the span (remove style) by replacing it with plain text.
//       const plainTextNode = document.createTextNode(selectedText);
//       if (container.parentElement) {
//         container.parentElement.replaceChild(plainTextNode, container);
//       }
//       selection.removeAllRanges();
//     } else {
//       // Otherwise, apply the new style by wrapping the selected text in a span.
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       // Adjust selection to the new span (optional)
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   // Function to apply a custom color style using the provided hex value.
//   const applyCustomColor = () => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return;

//     // Wrap selected text with a span that uses the custom color as inline style.
//     const span = document.createElement('span');
//     span.textContent = selectedText;
//     span.style.color = customColor;
//     range.deleteContents();
//     range.insertNode(span);

//     // Optionally adjust the selection to the new span.
//     range.selectNodeContents(span);
//     selection.removeAllRanges();
//     selection.addRange(range);
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   const nodesToANSI = (
//     nodes: NodeListOf<ChildNode>,
//     states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
//   ): string => {
//     let result = '';
//     nodes.forEach((node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         // If we used the "ansi-xx" approach, parse the code.
//         // If it's a custom color with inline style, it won't convert to ANSI properly,
//         // but we can still keep the text.
//         const ansiCode = Number(element.className.split('-')[1]);
//         const newState = { ...states[states.length - 1] };

//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;

//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(node.childNodes, states);
//         states.pop();
//         result += '\x1b[0m';

//         // Re-apply any previous style if needed
//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   const copyText = async () => {
//     if (!textareaRef.current) return;

//     const formattedText = '```ansi\n' + nodesToANSI(textareaRef.current.childNodes) + '\n```';

//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here\'s the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* New: Custom Color Picker + Input */}
//             <div>
//               <h3 className="text-lg font-medium mb-2">Custom Color</h3>
//               <div className="flex items-center gap-2">
//                 {/* Keep the original text input for manual color entry */}
//                 <input
//                   type="text"
//                   placeholder="#ff00ff"
//                   value={customColor}
//                   onChange={(e) => setCustomColor(e.target.value)}
//                   className="px-2 py-1 rounded text-black"
//                   style={{ width: '100px' }}
//                 />
//                 {/* New color picker input */}
//                 <input
//                   type="color"
//                   value={customColor}
//                   onChange={(e) => setCustomColor(e.target.value)}
//                   className="w-10 h-10 p-0 border-none cursor-pointer"
//                 />
//                 <button
//                   onClick={applyCustomColor}
//                   className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
//                 >
//                   Apply Color
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



// import React, { useState, useRef } from 'react';
// import { Copy, AlertCircle } from 'lucide-react';

// // Discord ANSI color codes using Tailwind colors
// const colors = {
//   foreground: [
//     { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
//     { code: 31, color: '#EF4444', name: 'Red' }, // red-500
//     { code: 32, color: '#10B981', name: 'Green' }, // emerald-500
//     { code: 33, color: '#F59E0B', name: 'Gold' }, // amber-500
//     { code: 34, color: '#3B82F6', name: 'Blue' }, // blue-500
//     { code: 35, color: '#EC4899', name: 'Pink' }, // pink-500
//     { code: 36, color: '#14B8A6', name: 'Teal' }, // teal-500
//     { code: 37, color: '#FFFFFF', name: 'White' }, // white
//   ],
//   background: [
//     { code: 40, color: '#111827', name: 'Dark' }, // gray-900
//     { code: 41, color: '#991B1B', name: 'Dark Red' }, // red-800
//     { code: 42, color: '#065F46', name: 'Dark Green' }, // emerald-800
//     { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
//     { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
//     { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
//     { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
//     { code: 47, color: '#F3F4F6', name: 'Light Gray' }, // gray-100
//   ],
// };

// function App() {
//   const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
//   const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
//   const [copyStatus, setCopyStatus] = useState('Copy');
//   const [customColor, setCustomColor] = useState('#ffffff'); // Default to white
//   const textareaRef = useRef<HTMLDivElement>(null);

//   // Updated handleStyle function with reset functionality
//   const handleStyle = (code: number) => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return; // Nothing selected

//     // When code is 0, remove all styling from the selection.
//     if (code === 0) {
//       const fragment = range.extractContents();
//       const plainText = document.createTextNode(fragment.textContent || '');
//       range.insertNode(plainText);
//       selection.removeAllRanges();
//       return;
//     }

//     // Check if the selection is entirely within a span with the target style.
//     let container: Node = range.commonAncestorContainer;
//     if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
//       container = container.parentElement;
//     }

//     if (
//       container instanceof Element &&
//       container.tagName === 'SPAN' &&
//       container.classList.contains(`ansi-${code}`) &&
//       container.textContent === selectedText
//     ) {
//       const plainTextNode = document.createTextNode(selectedText);
//       if (container.parentElement) {
//         container.parentElement.replaceChild(plainTextNode, container);
//       }
//       selection.removeAllRanges();
//     } else {
//       const span = document.createElement('span');
//       span.textContent = selectedText;
//       span.className = `ansi-${code}`;
//       range.deleteContents();
//       range.insertNode(span);
//       range.selectNodeContents(span);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   };

//   // Function to apply a custom color style using the provided hex value.
//   const applyCustomColor = () => {
//     if (!textareaRef.current) return;
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) return;

//     const range = selection.getRangeAt(0);
//     const selectedText = range.toString();
//     if (!selectedText.trim()) return;

//     const span = document.createElement('span');
//     span.textContent = selectedText;
//     span.style.color = customColor;
//     range.deleteContents();
//     range.insertNode(span);
//     range.selectNodeContents(span);
//     selection.removeAllRanges();
//     selection.addRange(range);
//   };

//   const showTooltip = (e: React.MouseEvent, text: string) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setTooltip({
//       show: true,
//       text,
//       x: rect.left + rect.width / 2,
//       y: rect.top - 40,
//     });
//   };

//   const hideTooltip = () => {
//     setTooltip({ ...tooltip, show: false });
//   };

//   // Recursively convert DOM nodes to ANSI escape codes.
//   const nodesToANSI = (
//     nodes: NodeListOf<ChildNode>,
//     states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
//   ): string => {
//     let result = '';
//     nodes.forEach((node) => {
//       if (node.nodeType === Node.TEXT_NODE) {
//         result += node.textContent;
//       } else if (node.nodeName === 'BR') {
//         result += '\n';
//       } else if (node.nodeName === 'SPAN') {
//         const element = node as HTMLSpanElement;
//         // Check for our ANSI classes (e.g. "ansi-1", "ansi-4")
//         const match = element.className.match(/ansi-(\d+)/);
//         const ansiCode = match ? Number(match[1]) : 0;
//         const newState = { ...states[states.length - 1] };
//         if (ansiCode < 30) newState.st = ansiCode;
//         if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
//         if (ansiCode >= 40) newState.bg = ansiCode;
//         states.push(newState);
//         result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
//         result += nodesToANSI(element.childNodes, states);
//         states.pop();
//         result += `\x1b[0m`;
//         if (states[states.length - 1].fg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
//         }
//         if (states[states.length - 1].bg !== 2) {
//           result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
//         }
//       }
//     });
//     return result;
//   };

//   // Updated copy function that converts styled text to ANSI codes and wraps it in an ANSI code block.
//   const copyText = async () => {
//     if (!textareaRef.current) return;
//     const ansiText = nodesToANSI(textareaRef.current.childNodes);
//     const formattedText = `\`\`\`ansi\n${ansiText}\n\`\`\``;
//     try {
//       await navigator.clipboard.writeText(formattedText);
//       setCopyStatus('Copied!');
//       setTimeout(() => setCopyStatus('Copy'), 2000);
//     } catch (err) {
//       alert('Failed to copy. Here is the text to copy manually:\n' + formattedText);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-8 text-center">
//           Discord <span className="text-blue-500">Colored</span> Text Generator
//         </h1>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">About</h2>
//           <p className="mb-4">
//             This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.
//           </p>
//           <p className="mb-4">
//             To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.
//           </p>
//           <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
//           <p>
//             This app runs entirely in your browser and the source code is freely available on GitHub. Shout out to kkrypt0nn for this guide.
//           </p>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium mb-2">Text Style</h3>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleStyle(0)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => handleStyle(1)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
//                 >
//                   Bold
//                 </button>
//                 <button
//                   onClick={() => handleStyle(4)}
//                   className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
//                 >
//                   Underline
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.foreground.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-2">Background Colors</h3>
//               <div className="flex flex-wrap gap-2">
//                 {colors.background.map((color) => (
//                   <button
//                     key={color.code}
//                     onClick={() => handleStyle(color.code)}
//                     onMouseEnter={(e) => showTooltip(e, color.name)}
//                     onMouseLeave={hideTooltip}
//                     className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
//                     style={{ backgroundColor: color.color }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Custom Color Picker */}
//             <div>
//               <h3 className="text-lg font-medium mb-2">Custom Color</h3>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   placeholder="#ff00ff"
//                   value={customColor}
//                   onChange={(e) => setCustomColor(e.target.value)}
//                   className="px-2 py-1 rounded text-black"
//                   style={{ width: '100px' }}
//                 />
//                 <input
//                   type="color"
//                   value={customColor}
//                   onChange={(e) => setCustomColor(e.target.value)}
//                   className="w-10 h-10 p-0 border-none cursor-pointer"
//                 />
//                 <button
//                   onClick={applyCustomColor}
//                   className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
//                 >
//                   Apply Color
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div
//           ref={textareaRef}
//           contentEditable
//           className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onInput={(e) => setText(e.currentTarget.textContent || '')}
//         >
//           {text}
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={copyText}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
//           >
//             <Copy className="w-4 h-4" />
//             {copyStatus}
//           </button>
//         </div>

//         <div className="mt-8 text-center text-sm text-gray-400">
//           <p className="flex items-center justify-center gap-2">
//             <AlertCircle className="w-4 h-4" />
//             This is an unofficial tool, not made or endorsed by Discord.
//           </p>
//         </div>
//       </div>

//       {tooltip.show && (
//         <div
//           className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
//           style={{
//             top: `${tooltip.y}px`,
//             left: `${tooltip.x}px`,
//           }}
//         >
//           {tooltip.text}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;



import React, { useState, useRef } from 'react';
import { Copy, AlertCircle } from 'lucide-react';

// Discord ANSI color codes using Tailwind colors
const colors = {
  foreground: [
    { code: 30, color: '#6B7280', name: 'Dark Gray' }, // gray-500
    { code: 31, color: '#EF4444', name: 'Red' },       // red-500
    { code: 32, color: '#10B981', name: 'Green' },     // emerald-500
    { code: 33, color: '#F59E0B', name: 'Gold' },      // amber-500
    { code: 34, color: '#3B82F6', name: 'Blue' },      // blue-500
    { code: 35, color: '#EC4899', name: 'Pink' },      // pink-500
    { code: 36, color: '#14B8A6', name: 'Teal' },      // teal-500
    { code: 37, color: '#FFFFFF', name: 'White' },     // white
  ],
  background: [
    { code: 40, color: '#111827', name: 'Dark' },      // gray-900
    { code: 41, color: '#991B1B', name: 'Dark Red' },  // red-800
    { code: 42, color: '#065F46', name: 'Dark Green' },// emerald-800
    { code: 43, color: '#92400E', name: 'Dark Gold' }, // amber-800
    { code: 44, color: '#1E40AF', name: 'Dark Blue' }, // blue-800
    { code: 45, color: '#831843', name: 'Dark Pink' }, // pink-800
    { code: 46, color: '#115E59', name: 'Dark Teal' }, // teal-800
    { code: 47, color: '#F3F4F6', name: 'Light Gray' },// gray-100
  ],
};

// Convert a hex color like "#ff00ff" to { r, g, b } (0–255 each)
function parseHexColor(hex: string) {
  // Remove leading "#" if present
  const cleanHex = hex.replace(/^#/, '');
  // If shorthand like #fff => #ffffff
  const normalized =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex;
  const num = parseInt(normalized, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Find the closest ANSI foreground code from colors.foreground
function approximateColorToAnsi(hexColor: string) {
  const target = parseHexColor(hexColor);
  let bestCode = 37; // default White
  let bestDist = Number.MAX_VALUE;

  for (const c of colors.foreground) {
    const fg = parseHexColor(c.color);
    // Euclidean distance in RGB space
    const dist =
      (target.r - fg.r) ** 2 + (target.g - fg.g) ** 2 + (target.b - fg.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      bestCode = c.code;
    }
  }
  return bestCode;
}

function App() {
  const [text, setText] = useState('Welcome to Discord Colored Text Generator!');
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [copyStatus, setCopyStatus] = useState('Copy');
  const [customColor, setCustomColor] = useState('#ffffff'); // Default to white
  const textareaRef = useRef<HTMLDivElement>(null);

  // handleStyle for ANSI-coded styles
  const handleStyle = (code: number) => {
    if (!textareaRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) return; // Nothing selected

    // When code is 0, remove all styling from the selection.
    if (code === 0) {
      const fragment = range.extractContents();
      const plainText = document.createTextNode(fragment.textContent || '');
      range.insertNode(plainText);
      selection.removeAllRanges();
      return;
    }

    // Check if the selection is entirely within a span with the target style.
    let container: Node = range.commonAncestorContainer;
    if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
      container = container.parentElement;
    }

    if (
      container instanceof Element &&
      container.tagName === 'SPAN' &&
      container.classList.contains(`ansi-${code}`) &&
      container.textContent === selectedText
    ) {
      const plainTextNode = document.createTextNode(selectedText);
      if (container.parentElement) {
        container.parentElement.replaceChild(plainTextNode, container);
      }
      selection.removeAllRanges();
    } else {
      const span = document.createElement('span');
      span.textContent = selectedText;
      span.className = `ansi-${code}`;
      range.deleteContents();
      range.insertNode(span);
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Function to apply a custom color style using the provided hex value (inline)
  const applyCustomColor = () => {
    if (!textareaRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) return;

    // Wrap selected text with a span that uses the custom color as inline style
    const span = document.createElement('span');
    span.textContent = selectedText;
    span.style.color = customColor;
    range.deleteContents();
    range.insertNode(span);
    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const showTooltip = (e: React.MouseEvent, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 40,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };

  // Recursively convert DOM nodes to ANSI escape codes.
  // If a <span> has class "ansi-XX", we use that. Otherwise, if it has inline color,
  // we approximate that color to the nearest ANSI color code.
  const nodesToANSI = (
    nodes: NodeListOf<ChildNode>,
    states: Array<{ fg: number; bg: number; st: number }> = [{ fg: 2, bg: 2, st: 2 }]
  ): string => {
    let result = '';
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeName === 'BR') {
        result += '\n';
      } else if (node.nodeName === 'SPAN') {
        const element = node as HTMLSpanElement;

        // 1) Check for an ansi-XX class
        const match = element.className.match(/ansi-(\d+)/);
        let ansiCode = match ? Number(match[1]) : 0;

        // 2) If no ansi class, but there's an inline color, approximate to the nearest code
        if (!ansiCode && element.style.color) {
          ansiCode = approximateColorToAnsi(element.style.color);
        }

        // Build a new state from the parent
        const newState = { ...states[states.length - 1] };
        if (ansiCode < 30) {
          newState.st = ansiCode; // Bold (1), Underline (4), etc.
        } else if (ansiCode >= 30 && ansiCode < 40) {
          newState.fg = ansiCode; // Foreground color
        } else if (ansiCode >= 40) {
          newState.bg = ansiCode; // Background color
        }

        states.push(newState);

        // Output the start ANSI code
        result += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`;
        // Recursively process child nodes
        result += nodesToANSI(element.childNodes, states);
        // Close this span with a reset
        states.pop();
        result += `\x1b[0m`;

        // Re-apply any parent style (if not default) after closing
        if (states[states.length - 1].fg !== 2) {
          result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].fg}m`;
        }
        if (states[states.length - 1].bg !== 2) {
          result += `\x1b[${states[states.length - 1].st};${states[states.length - 1].bg}m`;
        }
      }
    });
    return result;
  };

  // Copy the text as ANSI
  const copyText = async () => {
    if (!textareaRef.current) return;
    const ansiText = nodesToANSI(textareaRef.current.childNodes);
    const formattedText = `\`\`\`ansi\n${ansiText}\n\`\`\``;
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    } catch (err) {
      alert('Failed to copy. Here is the text to copy manually:\n' + formattedText);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Discord <span className="text-blue-500">Colored</span> Text Generator
        </h1>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="mb-4">
            This is a simple app that creates colored Discord messages using the ANSI color codes available
            on the latest Discord desktop versions.
          </p>
          <p className="mb-4">
            To use this, write your text, select parts of it and assign colors to them, then copy it using the
            button below, and send in a Discord message.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Source Code</h2>
          <p>
            This app runs entirely in your browser and the source code is freely available on GitHub. Shout
            out to kkrypt0nn for this guide.
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Styling Options</h2>
          <div className="space-y-6">
            {/* Text Style */}
            <div>
              <h3 className="text-lg font-medium mb-2">Text Style</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStyle(0)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => handleStyle(1)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors font-bold"
                >
                  Bold
                </button>
                <button
                  onClick={() => handleStyle(4)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors underline"
                >
                  Underline
                </button>
              </div>
            </div>

            {/* Foreground Colors */}
            <div>
              <h3 className="text-lg font-medium mb-2">Foreground Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.foreground.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => handleStyle(color.code)}
                    onMouseEnter={(e) => showTooltip(e, color.name)}
                    onMouseLeave={hideTooltip}
                    className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h3 className="text-lg font-medium mb-2">Background Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.background.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => handleStyle(color.code)}
                    onMouseEnter={(e) => showTooltip(e, color.name)}
                    onMouseLeave={hideTooltip}
                    className="w-8 h-8 rounded hover:ring-2 hover:ring-white transition-all"
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            {/* <div>
              <h3 className="text-lg font-medium mb-2">Custom Color</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="#ff00ff"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="px-2 py-1 rounded text-black"
                  style={{ width: '100px' }}
                />
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-10 p-0 border-none cursor-pointer"
                />
                <button
                  onClick={applyCustomColor}
                  className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
                >
                  Apply Color
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Note: Custom colors are approximated to the nearest ANSI color when copied to Discord.
              </p>
            </div> */}
          </div>
        </div>

        {/* Editable Text Area */}
        <div
          ref={textareaRef}
          contentEditable
          className="w-full min-h-[200px] bg-gray-700 text-gray-200 rounded-lg p-4 mb-4 font-mono text-sm whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-blue-500"
          onInput={(e) => setText(e.currentTarget.textContent || '')}
        >
          {text}
        </div>

        {/* Copy Button */}
        <div className="flex justify-center">
          <button
            onClick={copyText}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
          >
            <Copy className="w-4 h-4" />
            {copyStatus}
          </button>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            This is an unofficial tool, not made or endorsed by Discord.
          </p>
        </div>
      </div>

      {/* Tooltip for color name */}
      {tooltip.show && (
        <div
          className="fixed bg-emerald-500 text-white px-4 py-2 rounded pointer-events-none transform -translate-x-1/2"
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

export default App;

