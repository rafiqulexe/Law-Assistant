import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { legal } from '@/api/client';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
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

const suggestedQuestions = ['chat.q1', 'chat.q2', 'chat.q3', 'chat.q4'];

// Rendered from the current language, so switching language also changes the greeting.
const welcomeMessage = { role: 'assistant', welcome: true, citations: [] };

export default function LegalChat() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const { t, tError } = useI18n();

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
      toast.error(tError(error.message));
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
      setMessages(prev => [...prev, { role: 'assistant', content: tError(error.message), citations: [] }]);
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
              <span className="text-amber-400 text-sm font-medium">{t('chat.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">{t('chat.title1')}</span>
              <span className="gradient-text">{t('chat.title2')}</span>
            </h1>
            <p className="text-lg text-slate-400">
              {t('chat.intro')}
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
                <Plus className="h-4 w-4 mr-2" /> {t('chat.newChat')}
              </Button>
              <p className="text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1 pt-2">
                <History className="h-3 w-3" /> {t('chat.history')}
              </p>
              <div className="space-y-1 max-h-[420px] overflow-y-auto">
                {history.length === 0 && (
                  <p className="text-sm text-slate-500">{t('chat.noHistory')}</p>
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
                    <h3 className="text-white font-semibold">{t('chat.assistantName')}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-slate-400 text-sm">{t('chat.online')}</span>
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
                            <ReactMarkdown>{message.welcome ? t('chat.welcome') : message.content}</ReactMarkdown>
                          </div>
                        )}
                        {message.citations?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                            <p className="text-xs text-amber-400 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> {t('chat.sources')}
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
                          <span className="text-slate-400">{t('chat.thinking')}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 1 && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-500 text-sm mb-3">{t('chat.suggested')}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((key, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-amber-900/30 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 cursor-pointer transition-colors"
                          onClick={() => sendMessage(t(key))}
                        >
                          <HelpCircle className="h-3 w-3 mr-1" />
                          {t(key)}
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
                      placeholder={t('chat.placeholder')}
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
                    {t('chat.disclaimer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { icon: FileText, title: t('chat.card1Title'), desc: t('chat.card1Text') },
              { icon: Shield, title: t('chat.card2Title'), desc: t('chat.card2Text') },
              { icon: Scale, title: t('chat.card3Title'), desc: t('chat.card3Text') }
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