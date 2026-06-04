import React, { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { anthropicProvider } from '../../lib/llm/anthropic';
import type { ChatMessage } from '../../lib/llm/types';
import { estimateTokens, TOKEN_WARNING_THRESHOLD } from '../../lib/llm/tokenBudget';
import { embeddingClient, cosineSimilarity } from '../../lib/llm/embeddingClient';
import { DomainPackLoader } from '../../lib/domain-pack/loader';
import { buildDiscoveryChatPrompt, buildDraftGenerationPrompt } from '../../lib/llm/promptMaster';
import type { DomainPack } from '../../lib/domain-pack/parser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { PrimaryBtn } from '../ui/Buttons';

/* --- Output options matching ba3-discovery.jsx --- */
const OUTPUT_OPTIONS = [
  { id: 'user-story', icon: 'book-copy', label: 'User Story' },
  { id: 'brd', icon: 'file-pen-line', label: 'BRD' },
  { id: 'srs', icon: 'scroll-text', label: 'SRS' },
  { id: 'diagram', icon: 'git-branch', label: 'Sơ đồ' },
  { id: 'sprint', icon: 'square-kanban', label: 'Sprint Plan' },
];

interface DiscoveryTabProps {
  projectId: string;
}

export const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<{entities: any[], rules: any[], terms: any[]}>({ entities: [], rules: [], terms: [] });
  const [domainPack, setDomainPack] = useState<DomainPack | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const knowledge = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).toArray(), [projectId]);
  const conversation = useLiveQuery(() => db.conversations.where('projectId').equals(projectId).first(), [projectId]);
  const extractedKnowledge = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).toArray(), [projectId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (project?.domain) {
      DomainPackLoader.loadDomainPack(project.domain)
        .then(pack => setDomainPack(pack))
        .catch(err => console.error("Failed to load domain pack", err));
    }
  }, [project?.domain]);

  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      setMessages(prev => prev.length === 0 ? conversation.messages as ChatMessage[] : prev);
    }
  }, [conversation]);

  useEffect(() => {
    if (extractedKnowledge) {
      setExtractedData({
        entities: extractedKnowledge.filter(k => k.type === 'entity'),
        rules: extractedKnowledge.filter(k => k.type === 'rule'),
        terms: extractedKnowledge.filter(k => k.type === 'term')
      });
    }
  }, [extractedKnowledge]);

  const clearConversation = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ trò chuyện?')) {
      if (conversation) {
        await db.conversations.update(conversation.id, { messages: [], updatedAt: Date.now() });
      }
      setMessages([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteKnowledge = async (id: string) => {
    if (confirm('Xóa tri thức này?')) {
      await db.knowledge.delete(id);
    }
  };

  const startEditKnowledge = (k: any) => {
    setEditingKnowledgeId(k.id);
    setEditContent(k.content);
  };

  const saveKnowledge = async () => {
    if (editingKnowledgeId && editContent.trim()) {
      await db.knowledge.update(editingKnowledgeId, { content: editContent.trim(), updatedAt: Date.now() });
      setEditingKnowledgeId(null);
      setEditContent('');
    }
  };

  const saveConversation = async (newMessages: ChatMessage[]) => {
    if (conversation) {
      await db.conversations.update(conversation.id, { messages: newMessages as any, updatedAt: Date.now() });
    } else {
      await db.conversations.add({
        id: crypto.randomUUID(), projectId,
        messages: newMessages as any,
        createdAt: Date.now(), updatedAt: Date.now()
      });
    }
  };

  const extractEntitiesAndRules = async (text: string) => {
    const entitiesMatch = text.match(/ENTITIES:\n([\s\S]*?)(?:RULES:|TERMS:|$)/);
    const rulesMatch = text.match(/RULES:\n([\s\S]*?)(?:TERMS:|$)/);
    const termsMatch = text.match(/TERMS:\n([\s\S]*?)(?:$)/);
    const entities = entitiesMatch ? entitiesMatch[1].trim().split('\n').map(e => e.replace(/^- /, '').trim()).filter(e => e) : [];
    const rules = rulesMatch ? rulesMatch[1].trim().split('\n').map(r => r.replace(/^- /, '').trim()).filter(r => r) : [];
    const terms = termsMatch ? termsMatch[1].trim().split('\n').map(t => t.replace(/^- /, '').trim()).filter(t => t) : [];
    const newKnowledge: any[] = [];
    const sourceId = conversation?.id || crypto.randomUUID();
    entities.forEach(e => {
      if (!extractedData.entities.find(ex => ex.content === e)) {
        newKnowledge.push({ id: crypto.randomUUID(), projectId, type: 'entity', content: e, sourceId, createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
    rules.forEach(r => {
      if (!extractedData.rules.find(ex => ex.content === r)) {
        newKnowledge.push({ id: crypto.randomUUID(), projectId, type: 'rule', content: r, sourceId, createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
    terms.forEach(t => {
      if (!extractedData.terms.find(ex => ex.content === t)) {
        newKnowledge.push({ id: crypto.randomUUID(), projectId, type: 'term', content: t, sourceId, createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
    if (newKnowledge.length > 0) {
      await db.knowledge.bulkAdd(newKnowledge);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    await saveConversation(updatedMessages);

    try {
      /* ── Build context: prefer full documents if within token budget ── */
      let context = '';
      const allSources = await db.sources.where('projectId').equals(projectId).toArray();
      const allMarkdown = allSources.map(s => `[Source: ${s.name}]:\n${s.markdownContent || s.extractedText}`).join('\n\n---\n\n');

      const sourceTokens = estimateTokens(allMarkdown);
      if (allMarkdown && sourceTokens <= TOKEN_WARNING_THRESHOLD) {
        context = allMarkdown;
      } else if (knowledge && knowledge.length > 0) {
        const queryVector = await embeddingClient.embed(input);
        const scoredKnowledge = knowledge
          .filter(k => k.vector && k.vector.length > 0)
          .map(k => ({ ...k, score: cosineSimilarity(queryVector, k.vector!) }))
          .sort((a, b) => b.score - a.score);
        const matches = scoredKnowledge.slice(0, 10).filter(k => k.score > 0.15);
        if (matches.length > 0) {
          context = matches.map((m, i) => `[Relevant Snippet ${i+1}]: ${m.content}`).join('\n\n');
        }
      }

      const finalTokenCount = estimateTokens(context);
      if (finalTokenCount > TOKEN_WARNING_THRESHOLD) {
        if (!confirm(`Cảnh báo: Context quá lớn (${finalTokenCount} tokens). Tiếp tục?`)) {
          setIsLoading(false);
          return;
        }
      }

      /* ── Build memory block from extracted knowledge ── */
      const memoryBlock = [
        extractedData.entities.length > 0 ? `Entities: ${extractedData.entities.map(e => e.content).join('; ')}` : '',
        extractedData.rules.length > 0 ? `Rules: ${extractedData.rules.map(r => r.content).join('; ')}` : '',
        extractedData.terms.length > 0 ? `Terms: ${extractedData.terms.map(t => t.content).join('; ')}` : '',
      ].filter(Boolean).join('\n');

      /* ── Assemble system prompt via PromptMaster ── */
      const domainOverlay = domainPack ? DomainPackLoader.generatePromptOverlay(domainPack) : undefined;
      const systemPrompt = buildDiscoveryChatPrompt(domainOverlay, memoryBlock || undefined);

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const stream = anthropicProvider.streamResponse(updatedMessages, context, systemPrompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
      await saveConversation([...updatedMessages, { role: 'assistant', content: fullResponse }]);
      await extractEntitiesAndRules(fullResponse);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg = `Error: ${error.message || 'Lỗi kết nối LLM. Kiểm tra API Key trong cài đặt.'}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      await saveConversation([...updatedMessages, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOutput = (id: string) => {
    setSelectedOutputs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleGenerate = async () => {
    if (selectedOutputs.length === 0 || isLoading) return;

    /* ── Gather project documents ── */
    const allSources = await db.sources.where('projectId').equals(projectId).toArray();
    const allMarkdown = allSources.map(s => `[Source: ${s.name}]:\n${s.markdownContent || s.extractedText}`).join('\n\n---\n\n');
    const docTokens = estimateTokens(allMarkdown);
    const projectDocuments = (allMarkdown && docTokens <= TOKEN_WARNING_THRESHOLD) ? allMarkdown : '';

    /* ── Build knowledge block ── */
    const knowledgeBlock = [
      extractedData.entities.length > 0 ? `Entities:\n${extractedData.entities.map(e => '- ' + e.content).join('\n')}` : '',
      extractedData.rules.length > 0 ? `Rules:\n${extractedData.rules.map(r => '- ' + r.content).join('\n')}` : '',
      extractedData.terms.length > 0 ? `Terms:\n${extractedData.terms.map(t => '- ' + t.content).join('\n')}` : '',
    ].filter(Boolean).join('\n\n');

    /* ── Assemble prompt via PromptMaster ── */
    const prompt = buildDraftGenerationPrompt(selectedOutputs, projectDocuments, knowledgeBlock);

    const userMsg: ChatMessage = { role: 'user', content: `Hãy tạo bản nháp cho: ${selectedOutputs.join(', ')} dựa trên tri thức hiện tại.` };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    await saveConversation(updatedMessages);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const stream = anthropicProvider.streamResponse(updatedMessages, '', prompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
      await saveConversation([...updatedMessages, { role: 'assistant', content: fullResponse }]);
      setSelectedOutputs([]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = `Error generating output: ${error.message}`;
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      await saveConversation([...updatedMessages, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalKnowledge = extractedData.entities.length + extractedData.rules.length + extractedData.terms.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top: Q&A Source + Output Picker */}
      <div className="grid grid-cols-2 gap-5">
        {/* Q&A Upload Panel */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="upload" size={18} className="text-primary" />
            <h3 className="text-[14px] font-semibold text-text-primary">Nguồn Q&A</h3>
            {domainPack && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-bg-active text-primary">
                {domainPack.name}
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-secondary mb-3">
            Paste nội dung cuộc họp, Q&A email, hoặc requirement vào chat bên dưới. AI sẽ trích xuất tri thức tự động.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-text-disabled">Đã trích xuất:</span>
            <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#e8f0fe', color: '#1967d2' }}>
              {extractedData.entities.length} entities
            </span>
            <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#fef7e0', color: '#b06000' }}>
              {extractedData.rules.length} rules
            </span>
            <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#e6f4ea', color: '#137333' }}>
              {extractedData.terms.length} terms
            </span>
          </div>
        </Card>

        {/* Output Picker */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="file-text" size={18} className="text-primary" />
            <h3 className="text-[14px] font-semibold text-text-primary">Chọn Output</h3>
          </div>
          <p className="text-[13px] text-text-secondary mb-3">Chọn loại tài liệu BA muốn tạo từ tri thức đã khai phá.</p>
          <div className="flex flex-wrap gap-2">
            {OUTPUT_OPTIONS.map(opt => {
              const isSelected = selectedOutputs.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOutput(opt.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-all ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-secondary border-border-color hover:border-primary hover:text-primary'
                  }`}
                >
                  <Icon name={opt.icon} size={14} strokeWidth={2} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Middle: Chat + Knowledge sidebar */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        {/* Expert Chat */}
        <Card className="flex flex-col" style={{ minHeight: 420 }}>
          <div className="px-5 py-3 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="messages-square" size={18} className="text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">Chuyên gia AI</h3>
              <span className="text-[11px] px-1.5 py-0.5 rounded font-mono font-bold bg-bg-active text-primary">v3</span>
            </div>
            {messages.length > 0 && (
              <button onClick={clearConversation} className="p-1.5 text-text-disabled hover:text-red-500 transition-colors" title="Xóa lịch sử">
                <Icon name="trash-2" size={16} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-secondary py-12">
                <div className="w-14 h-14 rounded-2xl bg-bg-hover flex items-center justify-center mb-3 text-text-disabled">
                  <Icon name="messages-square" size={28} strokeWidth={1.4} />
                </div>
                <p className="text-[14px] font-medium text-text-primary mb-1">Bắt đầu khai phá tri thức</p>
                <p className="text-[13px] max-w-sm text-center">Đặt câu hỏi về yêu cầu, quy trình hoặc nghiệp vụ của dự án.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mr-2 mt-0.5 text-[10px] font-bold">AI</div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-bg-app text-text-primary rounded-bl-sm border border-border-color'
                  }`}>
                    <div className="whitespace-pre-wrap overflow-hidden">
                      {msg.role === 'assistant' ? (
                        <div className="markdown-body text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="absolute -right-8 top-2 p-1.5 text-text-disabled hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy"
                      >
                        <Icon name="copy" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                <Icon name="loader" size={16} className="animate-spin" />
                <span>AI đang phân tích...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {domainPack?.suggested_questions && messages.length === 0 && (
            <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-border-color bg-bg-app">
              {domainPack.suggested_questions.map((q: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white text-[12.5px] text-text-secondary hover:text-primary transition-colors border border-border-color shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-border-color">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI về dự án này..."
                disabled={isLoading}
                className="flex-1 bg-bg-app border border-border-color rounded-full pl-4 pr-4 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-all disabled:opacity-50 placeholder:text-text-disabled"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white disabled:bg-border-color disabled:text-text-disabled transition-colors shrink-0"
              >
                <Icon name={isLoading ? 'loader' : 'send'} size={16} strokeWidth={2} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </form>
        </Card>

        {/* Knowledge Panel */}
        <Card className="p-5 overflow-y-auto" style={{ maxHeight: 520 }}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="brain-circuit" size={18} className="text-primary" />
            <h3 className="text-[14px] font-semibold text-text-primary">Tri thức chiết xuất</h3>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-bg-hover text-text-secondary">
              {totalKnowledge}
            </span>
          </div>

          <div className="space-y-4">
            {/* Entities */}
            <div className="rounded-xl p-4 border border-border-color" style={{ background: '#fcfdff' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="database" size={14} style={{ color: '#1967d2' }} />
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-text-secondary">Entities</h4>
                <span className="text-[11px] font-medium text-primary">{extractedData.entities.length}</span>
              </div>
              {extractedData.entities.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {extractedData.entities.map((e) => (
                    <div key={e.id} className="group relative text-[12px] px-2.5 py-1 rounded-lg border border-border-color bg-white text-text-primary font-medium flex items-center gap-1 hover:border-primary transition-colors">
                      {editingKnowledgeId === e.id ? (
                        <input
                          autoFocus
                          value={editContent}
                          onChange={(ev) => setEditContent(ev.target.value)}
                          onBlur={saveKnowledge}
                          onKeyDown={(ev) => ev.key === 'Enter' && saveKnowledge()}
                          className="outline-none bg-transparent w-full min-w-[100px]"
                        />
                      ) : (
                        <span className="truncate max-w-[200px]" onDoubleClick={() => startEditKnowledge(e)} title={e.content}>
                          {e.content}
                        </span>
                      )}
                      <button onClick={() => deleteKnowledge(e.id)} className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                        <Icon name="x" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-text-disabled italic">Sẽ xuất hiện khi AI phân tích</p>
              )}
            </div>

            {/* Rules */}
            <div className="rounded-xl p-4 border border-border-color" style={{ background: '#fcfdff' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="shield-check" size={14} style={{ color: '#b06000' }} />
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-text-secondary">Business Rules</h4>
                <span className="text-[11px] font-medium" style={{ color: '#b06000' }}>{extractedData.rules.length}</span>
              </div>
              {extractedData.rules.length > 0 ? (
                <div className="space-y-1.5">
                  {extractedData.rules.map((r) => (
                    <div key={r.id} className="group relative text-[12.5px] text-text-primary pl-3 py-1 border-l-2 hover:bg-bg-hover transition-colors pr-6 rounded-r-md" style={{ borderColor: '#fbbf24' }}>
                      {editingKnowledgeId === r.id ? (
                        <textarea
                          autoFocus
                          value={editContent}
                          onChange={(ev) => setEditContent(ev.target.value)}
                          onBlur={saveKnowledge}
                          className="outline-none bg-transparent w-full resize-none min-h-[40px]"
                        />
                      ) : (
                        <div onDoubleClick={() => startEditKnowledge(r)} title={r.content}>{r.content}</div>
                      )}
                      <button onClick={() => deleteKnowledge(r.id)} className="absolute right-1 top-1.5 opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-text-disabled italic">Quy tắc sẽ được trích xuất tự động</p>
              )}
            </div>

            {/* Terms */}
            <div className="rounded-xl p-4 border border-border-color" style={{ background: '#fcfdff' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="book-copy" size={14} style={{ color: '#137333' }} />
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-text-secondary">Glossary</h4>
                <span className="text-[11px] font-medium" style={{ color: '#137333' }}>{extractedData.terms.length}</span>
              </div>
              {extractedData.terms.length > 0 ? (
                <div className="space-y-1.5">
                  {extractedData.terms.map((t) => (
                    <div key={t.id} className="group relative text-[12.5px] text-text-primary pl-3 py-1 border-l-2 border-green-300 hover:bg-bg-hover transition-colors pr-6 rounded-r-md">
                      {editingKnowledgeId === t.id ? (
                        <textarea
                          autoFocus
                          value={editContent}
                          onChange={(ev) => setEditContent(ev.target.value)}
                          onBlur={saveKnowledge}
                          className="outline-none bg-transparent w-full resize-none min-h-[40px]"
                        />
                      ) : (
                        <div onDoubleClick={() => startEditKnowledge(t)} title={t.content}>{t.content}</div>
                      )}
                      <button onClick={() => deleteKnowledge(t.id)} className="absolute right-1 top-1.5 opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-text-disabled italic">Thuật ngữ sẽ xuất hiện khi phát hiện</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom: Sinh nháp action bar */}
      {selectedOutputs.length > 0 && (
        <div
          className="rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(110deg, var(--primary-container) 0%, #e8f0fe 60%, #eef4fe 100%)' }}
        >
          <div className="flex items-center gap-3">
            <Icon name="rocket" size={20} className="text-primary" />
            <div>
              <div className="text-[14px] font-semibold text-on-primary-container">
                Sẵn sàng sinh nháp
              </div>
              <div className="text-[12.5px] text-text-secondary">
                {selectedOutputs.length} loại output đã chọn · {totalKnowledge} tri thức
              </div>
            </div>
          </div>
          <PrimaryBtn icon="sparkles" onClick={handleGenerate} disabled={isLoading}>
            Sinh nháp ({selectedOutputs.length})
          </PrimaryBtn>
        </div>
      )}
    </div>
  );
};
