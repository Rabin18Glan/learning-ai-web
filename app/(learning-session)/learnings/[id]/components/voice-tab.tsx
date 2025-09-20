// import React, { useState, useEffect, useRef } from 'react';
// import { Mic, MicOff, Volume2, Play, Pause, StopCircle } from 'lucide-react';
// import useChat from '../hooks/useChat';

// // Types
// interface SpeechRecognition extends EventTarget {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   onresult: ((event: any) => void) | null;
//   onerror: ((event: any) => void) | null;
//   onend: (() => void) | null;
//   start(): void;
//   stop(): void;
// }

// declare global {
//   interface Window {
//     SpeechRecognition: { new(): SpeechRecognition };
//     webkitSpeechRecognition: { new(): SpeechRecognition };
//   }
// }

// interface UseSpeechRecognitionReturn {
//   transcript: string;
//   isListening: boolean;
//   isSupported: boolean;
//   startListening: () => void;
//   stopListening: () => void;
//   resetTranscript: () => void;
// }

// interface UseTextToSpeechReturn {
//   speak: (text: string) => void;
//   stop: () => void;
//   isSpeaking: boolean;
//   isPaused: boolean;
//   pause: () => void;
//   resume: () => void;
// }

// interface VoiceChatProps {

//   learningPathId: string;
// }

// // Speech Recognition Hook
// const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState('');
//   const [isSupported, setIsSupported] = useState(false);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

//       if (SpeechRecognition) {
//         setIsSupported(true);
//         recognitionRef.current = new SpeechRecognition();

//         const recognition = recognitionRef.current;
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = 'en-US';

//         recognition.onresult = (event: any) => {
//           let finalTranscript = '';
//           let interimTranscript = '';

//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//               finalTranscript += transcript + ' ';
//             } else {
//               interimTranscript += transcript;
//             }
//           }
//           setTranscript(finalTranscript + interimTranscript);
//         };

//         recognition.onerror = () => setIsListening(false);
//         recognition.onend = () => setIsListening(false);
//       }
//     }

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && isSupported) {
//       setTranscript('');
//       setIsListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     }
//   };

//   const resetTranscript = () => setTranscript('');

//   return { transcript, isListening, isSupported, startListening, stopListening, resetTranscript };
// };

// // Text-to-Speech Hook
// const useTextToSpeech = (): UseTextToSpeechReturn => {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   const speak = (text: string) => {
//     if ('speechSynthesis' in window) {
//       speechSynthesis.cancel();

//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1;
//       utterance.volume = 1;

//       utterance.onstart = () => {
//         setIsSpeaking(true);
//         setIsPaused(false);
//       };

//       utterance.onend = () => {
//         setIsSpeaking(false);
//         setIsPaused(false);
//       };

//       utterance.onerror = () => {
//         setIsSpeaking(false);
//         setIsPaused(false);
//       };

//       speechSynthesis.speak(utterance);
//     }
//   };

//   const pause = () => {
//     if (speechSynthesis.speaking && !speechSynthesis.paused) {
//       speechSynthesis.pause();
//       setIsPaused(true);
//     }
//   };

//   const resume = () => {
//     if (speechSynthesis.paused) {
//       speechSynthesis.resume();
//       setIsPaused(false);
//     }
//   };

//   const stop = () => {
//     speechSynthesis.cancel();
//     setIsSpeaking(false);
//     setIsPaused(false);
//   };

//   return { speak, stop, isSpeaking, isPaused, pause, resume };
// };

// // Main Voice Chat Component
// const VoiceChat: React.FC<VoiceChatProps> = ({ learningPathId }) => {
//  const { messages, input, setInput, handleSubmit, isLoading, selectedChatId }  = useChat(learningPathId);
 
//   const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useSpeechRecognition();
//   const { speak, stop, isSpeaking, isPaused, pause, resume } = useTextToSpeech();

//   // Update input with voice transcript
//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript);
//     }
//   }, [transcript, setInput]);

//   // Auto-send message when user stops talking
//   useEffect(() => {
//     if (transcript && !isListening && transcript.trim().length > 3) {
//       const timer = setTimeout(() => {
//         handleVoiceSubmit();
//       }, 5000);

//       return () => clearTimeout(timer);
//     }
//   }, [transcript, isListening]);

//   // Auto-speak new AI messages
//   useEffect(() => {
//     const lastMessage = messages[messages.length - 1];
//     if (lastMessage && lastMessage.role === 'assistant' && !isLoading) {
//       setTimeout(() => {
//         speak(lastMessage.content);
//       }, 500);
//     }
//   }, [messages, isLoading, speak]);

//   const handleVoiceSubmit = async () => {
//     if (!transcript.trim() || isLoading || !selectedChatId) return;

//     stopListening();
//     resetTranscript();

//     // Create synthetic form event
//     const syntheticEvent = {
//       preventDefault: () => { }
//     } as React.FormEvent;

//     await handleSubmit(syntheticEvent);
//   };

//   const toggleListening = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       if (isSpeaking) stop();
//       startListening();
//     }
//   };

//   const toggleSpeaking = () => {
//     if (isSpeaking) {
//       if (isPaused) {
//         resume();
//       } else {
//         pause();
//       }
//     }
//   };

//   if (!selectedChatId) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-gray-500">Loading chat...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
//       <div className="max-w-2xl w-full text-center">

//         {/* Status */}
//         <div className="mb-8">
//           <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium ${isListening ? 'bg-red-100 text-red-800' :
//               isSpeaking ? 'bg-blue-100 text-blue-800' :
//                 'bg-gray-100 text-gray-800'
//             }`}>
//             <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' :
//                 isSpeaking ? 'bg-blue-500 animate-pulse' :
//                   'bg-gray-500'
//               }`}></div>
//             {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
//           </div>
//         </div>

//         {/* Voice Visualizer */}
//         <div className="relative w-48 h-48 mx-auto mb-8">
//           <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${isListening ? 'border-red-400 animate-pulse' :
//               isSpeaking ? 'border-blue-400 animate-pulse' :
//                 'border-gray-300'
//             }`}>
//             {isListening && (
//               <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping opacity-30"></div>
//             )}
//             {isSpeaking && (
//               <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30"></div>
//             )}
//           </div>

//           <div className={`absolute inset-6 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500' :
//               isSpeaking ? 'bg-blue-500' :
//                 'bg-gray-400'
//             }`}>
//             {isListening ? (
//               <Mic className="w-12 h-12 text-white animate-pulse" />
//             ) : isSpeaking ? (
//               <Volume2 className="w-12 h-12 text-white animate-pulse" />
//             ) : (
//               <Mic className="w-12 h-12 text-white" />
//             )}
//           </div>
//         </div>

//         {/* Current transcript */}
//         {transcript && (
//           <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
//             <p className="text-gray-600 text-sm mb-1">You're saying:</p>
//             <p className="text-gray-800">{transcript}</p>
//           </div>
//         )}

//         {/* Last AI response */}
//         {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
//           <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md">
//             <p className="text-blue-600 text-sm mb-1">AI said:</p>
//             <p className="text-blue-800">{messages[messages.length - 1].content}</p>
//           </div>
//         )}

//         {/* Controls */}
//         <div className="flex justify-center items-center gap-4 mb-6">
//           {/* Main voice button */}
//           {isSupported ? (
//             <button
//               onClick={toggleListening}
//               disabled={isLoading}
//               className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 scale-110' :
//                   'bg-white hover:bg-gray-50 border-4 border-blue-200'
//                 } ${isLoading ? 'opacity-50' : ''}`}
//               title={isListening ? 'Stop listening' : 'Start voice input'}
//             >
//               {isListening ? (
//                 <MicOff size={24} className="text-white" />
//               ) : (
//                 <Mic size={24} className="text-blue-600" />
//               )}
//             </button>
//           ) : (
//             <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//               <MicOff size={24} className="text-gray-400" />
//             </div>
//           )}

//           {/* Speech controls */}
//           {isSpeaking && (
//             <>
//               <button
//                 onClick={toggleSpeaking}
//                 className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg"
//                 title={isPaused ? 'Resume' : 'Pause'}
//               >
//                 {isPaused ? <Play size={16} /> : <Pause size={16} />}
//               </button>
//               <button
//                 onClick={stop}
//                 className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg"
//                 title="Stop"
//               >
//                 <StopCircle size={16} />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Instructions */}
//         <div className="text-sm text-gray-600 max-w-md mx-auto">
//           {!isSupported ? (
//             <p className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
//               Voice not supported. Please use Chrome, Edge, or Safari.
//             </p>
//           ) : (
//             <p>
//               Click the microphone and speak naturally. I'll respond automatically when you finish talking.
//             </p>
//           )}
//         </div>

//         {/* Loading indicator */}
//         {isLoading && (
//           <div className="mt-4 text-blue-600">
//             <div className="inline-flex items-center gap-2">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//               Processing...
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VoiceChat;