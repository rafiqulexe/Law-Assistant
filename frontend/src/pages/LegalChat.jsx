import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { legal } from '@/api/client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Send, 
  Loader2,
  Bot,
  User,
  Sparkles,
  Scale,
  FileText,
  Shield,
  HelpCircle,
  History,
  Plus,
  BookOpen
} from 'lucide-react';

const suggestedQuestions = [
  "What is the punishment for theft under the Penal Code?",
  "How do I file a case under the Dowry Prohibition Act?",
  "What happens if a cheque bounces under the Negotiable Instruments Act?",
  "যৌতুক নিরোধ আইনে শাস্তি কী?",
  "What is bail under the Code of Criminal Procedure?",
  "How does the Artha Rin Adalat Ain work?"
];

const welcomeMessage = {
  role: 'assistant',
  content: "Assalamu Alaikum! I'm LexAI, your legal information assistant for Bangladesh law. Ask me about the Penal Code, CrPC, Evidence Act and other laws in English or Bangla.",
  citations: []
};

export default function LegalChat() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async () => {
    try {
      setHistory(await legal.conversations());
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const openConversation = async (id) => {
    try {
      const rows = await legal.conversation(id);
      setConversationId(id);
      setMessages(rows.map((row) => ({
        role: row.role,
        content: row.content,
        citations: row.citations ? row.citations.split('\n') : []
      })));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startNewChat = () => {
    setConversationId(null);
    setMessages([welcomeMessage]);
  };

  const sendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await legal.chat(messageText, conversationId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, citations: data.citations }]);
      if (!conversationId) {
        setConversationId(data.conversation_id);
        loadHistory();
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: error.message, citations: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">AI Legal Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Your AI </span>
              <span className="gradient-text">Legal Guide</span>
            </h1>
            <p className="text-lg text-slate-400">
              Answers grounded in Bangladesh law, with the source of every answer shown.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-6">
          <Card className="bg-slate-900/80 border-amber-900/30 h-fit">
            <CardContent className="p-4 space-y-3">
              <Button
                onClick={startNewChat}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
              >
                <Plus className="h-4 w-4 mr-2" /> New chat
              </Button>
              <p className="text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1 pt-2">
                <History className="h-3 w-3" /> History
              </p>
              <div className="space-y-1 max-h-[420px] overflow-y-auto">
                {history.length === 0 && (
                  <p className="text-sm text-slate-500">No conversations yet.</p>
                )}
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openConversation(item.id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg truncate transition-colors ${
                      item.id === conversationId
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-900/80 border-amber-900/30 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-slate-800/50 border-b border-amber-900/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">LexAI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-slate-400 text-sm">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-6 space-y-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-amber-500/20' 
                          : 'bg-gradient-to-br from-amber-500 to-amber-700'
                      }`}>
                        {message.role === 'user' 
                          ? <User className="h-4 w-4 text-amber-400" />
                          : <Bot className="h-4 w-4 text-white" />
                        }
                      </div>
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-amber-500/20 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {message.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                        {message.citations?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                            <p className="text-xs text-amber-400 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> Sources
                            </p>
                            {message.citations.map((citation) => (
                              <p key={citation} className="text-xs text-slate-400">{citation}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-slate-800 rounded-2xl p-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                          <span className="text-slate-400">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-500 text-sm mb-3">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.slice(0, 4).map((question, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-amber-900/30 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 cursor-pointer transition-colors"
                          onClick={() => sendMessage(question)}
                        >
                          <HelpCircle className="h-3 w-3 mr-1" />
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-amber-900/20">
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask a legal question..."
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isLoading}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-slate-500 text-xs mt-3 text-center">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    This AI provides general information only and does not constitute legal advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: FileText, title: "Contract Questions", desc: "Get help understanding contract terms" },
              { icon: Shield, title: "Compliance Guidance", desc: "Learn about legal requirements" },
              { icon: Scale, title: "Legal Concepts", desc: "Understand complex legal topics" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-amber-900/20">
                  <CardContent className="p-6 text-center">
                    <item.icon className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}