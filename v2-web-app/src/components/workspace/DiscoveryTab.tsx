import React, { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import type { Knowledge } from '../../db/db';
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
import { PrimaryBtn, GhostBtn } from '../ui/Buttons';
import { resolveExpert, OUTPUT_OPTIONS, tonePair } from '../../lib/ba/domainExpert';
import type { ExpertProfile } from '../../lib/ba/domainExpert';

/* Tint hexes from the v3 prototype, kept inline where tokens can't express them. */
const TINT = {
  green: '#137333',
  amber: '#b06000',
  blue: '#1967d2',
  red: '#c5221f',
  purple: '#8430ce',
} as const;

interface DiscoveryTabProps {
  projectId: string;
}

/* ────────────────────────── ChatBubble (ported ba2-discovery) ────────────── */
const ChatBubble: React.FC<{
  msg: ChatMessage;
  expert: ExpertProfile;
  onCopy: (text: string) => void;
}> = ({ msg, expert, onCopy }) => {
  const isAI = msg.role === 'assistant';
  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={isAI ? { background: expert.bg, color: expert.fg } : { background: 'var(--primary, #1967d2)', color: '#fff' }}
      >
        {isAI ? <Icon name={expert.icon} size={18} strokeWidth={2} /> : <span className="text-[12px] font-semibold">BA</span>}
      </div>
      <div className={`max-w-[80%] group relative ${isAI ? '' : 'flex flex-col items-end'}`}>
        <div
          className="rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed"
          style={
            isAI
              ? { background: '#fff', color: 'var(--text-primary, #202124)', border: '1px solid var(--border-color, #e2e6eb)' }
              : { background: 'var(--primary-container, #d3e3fd)', color: 'var(--on-primary-container, #001d35)' }
          }
        >
          {isAI ? (
            <div className="markdown-body text-[13.5px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          ) : (
            <span className="whitespace-pre-wrap">{msg.content}</span>
          )}
        </div>
        {isAI && msg.content !== '' && (
          <button
            onClick={() => onCopy(msg.content)}
            title="Sao chép"
            className="absolute -right-7 top-1 p-1.5 text-text-disabled hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon name="copy" size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ────────────────────────── Q&A source item (ported QASourceItem) ────────── */
const QASourceItem: React.FC<{ name: string; status: string }> = ({ name, status }) => {
  const done = status === 'parsed' || status === 'ready';
  const error = status === 'error';
  const statusLabel = error ? '✕ lỗi xử lý' : done ? '✓ phân tích xong' : '⏳ đang phân tích';
  const statusColor = error ? TINT.red : done ? TINT.green : TINT.amber;
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border-color bg-white">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-bg-hover text-text-secondary">
        <Icon name="file-text" size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold truncate text-text-primary">{name}</div>
        <div className="text-[11px] flex items-center gap-1.5 text-text-secondary">
          <Icon name="messages-square" size={10} strokeWidth={2.2} />
          <span style={{ color: statusColor }}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────── Knowledge group card (ported KbCard) ─────────── */
const KbGroup: React.FC<{
  icon: string;
  title: string;
  tintBg: string;
  tintFg: string;
  count: number;
  emptyHint: string;
  children: React.ReactNode;
}> = ({ icon, title, tintBg, tintFg, count, emptyHint, children }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: tintBg, color: tintFg }}>
        <Icon name={icon} size={15} strokeWidth={2} />
      </div>
      <h4 className="text-[13.5px] font-semibold text-text-primary">{title}</h4>
      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-bg-hover text-text-secondary">{count}</span>
    </div>
    {count > 0 ? <div className="flex flex-col gap-2">{children}</div> : <p className="text-[12px] text-text-disabled italic">{emptyHint}</p>}
  </Card>
);

export const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<{ entities: Knowledge[]; rules: Knowledge[]; terms: Knowledge[] }>({
    entities: [],
    rules: [],
    terms: [],
  });
  const [domainPack, setDomainPack] = useState<DomainPack | null>(null);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const knowledge = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).toArray(), [projectId]);
  const conversation = useLiveQuery(() => db.conversations.where('projectId').equals(projectId).first(), [projectId]);
  const extractedKnowledge = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).toArray(), [projectId]);
  const sources = useLiveQuery(() => db.sources.where('projectId').equals(projectId).toArray(), [projectId]);

  const expert = resolveExpert(project?.domain);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (project?.domain) {
      DomainPackLoader.loadDomainPack(project.domain)
        .then((pack) => setDomainPack(pack))
        .catch((err) => console.error('Failed to load domain pack', err));
    }
  }, [project?.domain]);

  useEffect(() => {
    if (conversation && conversation.messages.length > 0) {
      setMessages((prev) => (prev.length === 0 ? (conversation.messages as ChatMessage[]) : prev));
    }
  }, [conversation]);

  useEffect(() => {
    if (extractedKnowledge) {
      setExtractedData({
        entities: extractedKnowledge.filter((k) => k.type === 'entity'),
        rules: extractedKnowledge.filter((k) => k.type === 'rule'),
        terms: extractedKnowledge.filter((k) => k.type === 'term'),
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

  const startEditKnowledge = (k: Knowledge) => {
    setEditingKnowledgeId(k.id);
    setEditContent(k.content);
  };

  const saveKnowledge = async () => {
    if (editingKnowledgeId && editContent.trim()) {
      await db.knowledge.update(editingKnowledgeId, { content: editContent.trim(), updatedAt: Date.now() });
    }
    setEditingKnowledgeId(null);
    setEditContent('');
  };

  const saveConversation = async (newMessages: ChatMessage[]) => {
    if (conversation) {
      await db.conversations.update(conversation.id, { messages: newMessages as any, updatedAt: Date.now() });
    } else {
      await db.conversations.add({
        id: crypto.randomUUID(),
        projectId,
        messages: newMessages as any,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  };

  const extractEntitiesAndRules = async (text: string) => {
    const entitiesMatch = text.match(/ENTITIES:\n([\s\S]*?)(?:RULES:|TERMS:|$)/);
    const rulesMatch = text.match(/RULES:\n([\s\S]*?)(?:TERMS:|$)/);
    const termsMatch = text.match(/TERMS:\n([\s\S]*?)(?:$)/);
    const entities = entitiesMatch ? entitiesMatch[1].trim().split('\n').map((e) => e.replace(/^- /, '').trim()).filter((e) => e) : [];
    const rules = rulesMatch ? rulesMatch[1].trim().split('\n').map((r) => r.replace(/^- /, '').trim()).filter((r) => r) : [];
    const terms = termsMatch ? termsMatch[1].trim().split('\n').map((t) => t.replace(/^- /, '').trim()).filter((t) => t) : [];
    const newKnowledge: Knowledge[] = [];
    const sourceId = conversation?.id || crypto.randomUUID();
    entities.forEach((e) => {
      if (!extractedData.entities.find((ex) => ex.content === e)) {
        newKnowledge.push({ id: crypto.randomUUID(), projectId, type: 'entity', content: e, sourceId, createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
    rules.forEach((r) => {
      if (!extractedData.rules.find((ex) => ex.content === r)) {
        newKnowledge.push({ id: crypto.randomUUID(), projectId, type: 'rule', content: r, sourceId, createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
    terms.forEach((t) => {
      if (!extractedData.terms.find((ex) => ex.content === t)) {
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
      const allMarkdown = allSources.map((s) => `[Source: ${s.name}]:\n${s.markdownContent || s.extractedText}`).join('\n\n---\n\n');

      const sourceTokens = estimateTokens(allMarkdown);
      if (allMarkdown && sourceTokens <= TOKEN_WARNING_THRESHOLD) {
        context = allMarkdown;
      } else if (knowledge && knowledge.length > 0) {
        const queryVector = await embeddingClient.embed(input);
        const scoredKnowledge = knowledge
          .filter((k) => k.vector && k.vector.length > 0)
          .map((k) => ({ ...k, score: cosineSimilarity(queryVector, k.vector!) }))
          .sort((a, b) => b.score - a.score);
        const matches = scoredKnowledge.slice(0, 10).filter((k) => k.score > 0.15);
        if (matches.length > 0) {
          context = matches.map((m, i) => `[Relevant Snippet ${i + 1}]: ${m.content}`).join('\n\n');
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
        extractedData.entities.length > 0 ? `Entities: ${extractedData.entities.map((e) => e.content).join('; ')}` : '',
        extractedData.rules.length > 0 ? `Rules: ${extractedData.rules.map((r) => r.content).join('; ')}` : '',
        extractedData.terms.length > 0 ? `Terms: ${extractedData.terms.map((t) => t.content).join('; ')}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      /* ── Assemble system prompt via PromptMaster ── */
      const domainOverlay = domainPack ? DomainPackLoader.generatePromptOverlay(domainPack) : undefined;
      const systemPrompt = buildDiscoveryChatPrompt(domainOverlay, memoryBlock || undefined);

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      const stream = anthropicProvider.streamResponse(updatedMessages, context, systemPrompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponse;
          return newMessages;
        });
      }
      await saveConversation([...updatedMessages, { role: 'assistant', content: fullResponse }]);
      await extractEntitiesAndRules(fullResponse);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMsg = `Error: ${error.message || 'Lỗi kết nối LLM. Kiểm tra API Key trong cài đặt.'}`;
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      await saveConversation([...updatedMessages, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOutput = (id: string) => {
    setSelectedOutputs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleGenerate = async () => {
    if (selectedOutputs.length === 0 || isLoading) return;

    /* ── Gather project documents ── */
    const allSources = await db.sources.where('projectId').equals(projectId).toArray();
    const allMarkdown = allSources.map((s) => `[Source: ${s.name}]:\n${s.markdownContent || s.extractedText}`).join('\n\n---\n\n');
    const docTokens = estimateTokens(allMarkdown);
    const projectDocuments = allMarkdown && docTokens <= TOKEN_WARNING_THRESHOLD ? allMarkdown : '';

    /* ── Build knowledge block ── */
    const knowledgeBlock = [
      extractedData.entities.length > 0 ? `Entities:\n${extractedData.entities.map((e) => '- ' + e.content).join('\n')}` : '',
      extractedData.rules.length > 0 ? `Rules:\n${extractedData.rules.map((r) => '- ' + r.content).join('\n')}` : '',
      extractedData.terms.length > 0 ? `Terms:\n${extractedData.terms.map((t) => '- ' + t.content).join('\n')}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    /* ── Assemble prompt via PromptMaster ── */
    const prompt = buildDraftGenerationPrompt(selectedOutputs, projectDocuments, knowledgeBlock);

    const userMsg: ChatMessage = { role: 'user', content: `Hãy tạo bản nháp cho: ${selectedOutputs.join(', ')} dựa trên tri thức hiện tại.` };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    await saveConversation(updatedMessages);

    try {
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      const stream = anthropicProvider.streamResponse(updatedMessages, '', prompt);
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages((prev) => {
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
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      await saveConversation([...updatedMessages, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalKnowledge = extractedData.entities.length + extractedData.rules.length + extractedData.terms.length;
  const sourceCount = sources?.length || 0;

  /* Group output options by their `group` for the picker. */
  const outputGroups = OUTPUT_OPTIONS.reduce<Record<string, typeof OUTPUT_OPTIONS>>((acc, o) => {
    (acc[o.group] = acc[o.group] || []).push(o);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* ── Top row: Q&A sources + grouped output picker ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Q&A sources */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="messages-square" size={16} className="text-primary" />
            <h3 className="text-[13.5px] font-semibold text-text-primary">Nguồn Q&amp;A đã nạp</h3>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-bg-hover text-text-secondary">{sourceCount}</span>
            {domainPack && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-bg-active text-primary ml-auto">{domainPack.name}</span>
            )}
          </div>
          <p className="text-[11.5px] mb-3 text-text-secondary">Chuyên gia AI so khớp với knowledge ngành → chỉ hỏi GAP.</p>
          {sourceCount > 0 ? (
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
              {sources!.map((s) => (
                <QASourceItem key={s.id} name={s.name} status={s.status} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-bg-hover flex items-center justify-center mb-2 text-text-disabled">
                <Icon name="upload" size={18} strokeWidth={1.6} />
              </div>
              <p className="text-[12px] text-text-disabled">Chưa có nguồn Q&amp;A. Nạp tài liệu ở tab Nguồn để AI phân tích.</p>
            </div>
          )}
        </Card>

        {/* Output picker (grouped, tone pills) */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="rocket" size={16} className="text-primary" />
            <h3 className="text-[13.5px] font-semibold text-text-primary">Yêu cầu output (cần làm gì?)</h3>
            {selectedOutputs.length > 0 && (
              <span
                className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container"
              >
                {selectedOutputs.length}
              </span>
            )}
          </div>
          <p className="text-[11.5px] mb-3 text-text-secondary">AI hướng câu hỏi vào thông tin cần cho các output này.</p>
          <div className="flex flex-col gap-2.5">
            {Object.entries(outputGroups).map(([group, items]) => (
              <div key={group}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-text-disabled">{group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((o) => {
                    const on = selectedOutputs.includes(o.id);
                    const tone = tonePair(o.tone);
                    return (
                      <button
                        key={o.id}
                        onClick={() => toggleOutput(o.id)}
                        style={on ? { background: tone.bg, color: tone.fg, borderColor: tone.fg } : undefined}
                        className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[12px] font-medium border transition-colors ${
                          on ? '' : 'bg-white text-text-primary border-border-color hover:bg-bg-hover'
                        }`}
                      >
                        <Icon name={o.icon} size={13} strokeWidth={2} />
                        {o.label}
                        {on && <Icon name="check" size={11} strokeWidth={2.6} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Chat + Knowledge ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
        {/* Expert chat */}
        <Card className="overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 420px)', minHeight: 440 }}>
          {/* Header with expert avatar + GAP mode */}
          <div
            className="px-5 py-3.5 flex items-center gap-3 border-b border-border-color"
            style={{ background: 'linear-gradient(180deg,#fcfdff,#fff)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: expert.bg, color: expert.fg }}>
              <Icon name={expert.icon} size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-text-primary">Chuyên gia {expert.short}</span>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: '#e6f4ea', color: TINT.green }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: TINT.green }} />
                  GAP-analysis mode
                </span>
              </div>
              <div className="text-[11.5px] text-text-secondary">
                Đã đọc {sourceCount} nguồn · {totalKnowledge} tri thức · {selectedOutputs.length} output cần sinh
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={clearConversation} title="Xóa lịch sử" className="w-9 h-9 rounded-full flex items-center justify-center text-text-disabled hover:bg-bg-hover hover:text-red-500 transition-colors">
                <Icon name="trash-2" size={16} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4" style={{ background: '#fcfdff' }}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-secondary py-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: expert.bg, color: expert.fg }}>
                  <Icon name={expert.icon} size={28} strokeWidth={1.5} />
                </div>
                <p className="text-[14px] font-medium text-text-primary mb-1">Bắt đầu khai phá tri thức</p>
                <p className="text-[13px] max-w-sm text-center">Chuyên gia {expert.short} sẽ so khớp tài liệu với knowledge ngành và chỉ hỏi những GAP còn thiếu.</p>
              </div>
            ) : (
              messages.map((msg, i) => <ChatBubble key={i} msg={msg} expert={expert} onCopy={copyToClipboard} />)
            )}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                <Icon name="loader" size={16} className="animate-spin" />
                <span>Chuyên gia đang phân tích...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
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
          <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border-color flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 h-11 rounded-full px-4 bg-bg-app border border-transparent focus-within:border-primary transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Trả lời chuyên gia hoặc đặt câu hỏi…"
                disabled={isLoading}
                className="flex-1 bg-transparent outline-none text-[13.5px] text-text-primary disabled:opacity-50 placeholder:text-text-disabled"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-primary text-white disabled:bg-border-color disabled:text-text-disabled transition-colors shrink-0"
            >
              <Icon name={isLoading ? 'loader' : 'send'} size={18} strokeWidth={2.1} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </form>
        </Card>

        {/* Knowledge panel */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1" style={{ height: 'calc(100vh - 420px)', minHeight: 440 }}>
          <div className="flex items-center justify-between sticky top-0 z-10 bg-bg-app -mx-1 px-1 pb-2">
            <div>
              <h3 className="text-[15px] font-semibold leading-tight text-text-primary">Tri thức dự án</h3>
              <p className="text-[11.5px] mt-0.5 text-text-secondary">Tự sinh khi hội thoại tiến triển</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium" style={{ background: '#e6f4ea', color: TINT.green }}>
              <Icon name="sparkles" size={12} strokeWidth={2.2} /> auto
            </span>
          </div>

          {/* Entities */}
          <KbGroup icon="database" title="Entities" tintBg="#e8f0fe" tintFg={TINT.blue} count={extractedData.entities.length} emptyHint="Entities sẽ xuất hiện khi AI phân tích.">
            {extractedData.entities.map((e) => (
              <div key={e.id} className="group relative rounded-xl border border-border-color p-2.5 flex items-center gap-2 hover:border-primary transition-colors bg-white">
                {editingKnowledgeId === e.id ? (
                  <input
                    autoFocus
                    value={editContent}
                    onChange={(ev) => setEditContent(ev.target.value)}
                    onBlur={saveKnowledge}
                    onKeyDown={(ev) => ev.key === 'Enter' && saveKnowledge()}
                    className="flex-1 outline-none bg-transparent text-[13px] text-text-primary"
                  />
                ) : (
                  <span className="flex-1 text-[13px] font-medium text-text-primary truncate" onDoubleClick={() => startEditKnowledge(e)} title={e.content}>
                    {e.content}
                  </span>
                )}
                <button onClick={() => startEditKnowledge(e)} title="Sửa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-primary p-0.5 transition-opacity">
                  <Icon name="pencil" size={13} />
                </button>
                <button onClick={() => deleteKnowledge(e.id)} title="Xóa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                  <Icon name="x" size={13} />
                </button>
              </div>
            ))}
          </KbGroup>

          {/* Rules */}
          <KbGroup icon="list-checks" title="Business Rules" tintBg="#fef7e0" tintFg={TINT.amber} count={extractedData.rules.length} emptyHint="Quy tắc sẽ được trích xuất tự động.">
            {extractedData.rules.map((r) => (
              <div key={r.id} className="group relative rounded-xl border border-border-color p-3 hover:border-primary transition-colors bg-white">
                {editingKnowledgeId === r.id ? (
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(ev) => setEditContent(ev.target.value)}
                    onBlur={saveKnowledge}
                    className="w-full outline-none bg-transparent resize-none text-[12.5px] text-text-primary min-h-[40px]"
                  />
                ) : (
                  <div className="text-[12.5px] leading-snug text-text-primary pr-12" onDoubleClick={() => startEditKnowledge(r)} title={r.content}>
                    {r.content}
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-0.5">
                  <button onClick={() => startEditKnowledge(r)} title="Sửa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-primary p-0.5 transition-opacity">
                    <Icon name="pencil" size={13} />
                  </button>
                  <button onClick={() => deleteKnowledge(r.id)} title="Xóa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                    <Icon name="x" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </KbGroup>

          {/* Terms / Glossary */}
          <KbGroup icon="table" title="Glossary" tintBg="#f3e8fd" tintFg={TINT.purple} count={extractedData.terms.length} emptyHint="Thuật ngữ sẽ xuất hiện khi phát hiện.">
            {extractedData.terms.map((t) => (
              <div key={t.id} className="group relative rounded-xl border border-border-color p-3 hover:border-primary transition-colors bg-white">
                {editingKnowledgeId === t.id ? (
                  <textarea
                    autoFocus
                    value={editContent}
                    onChange={(ev) => setEditContent(ev.target.value)}
                    onBlur={saveKnowledge}
                    className="w-full outline-none bg-transparent resize-none text-[12.5px] text-text-primary min-h-[40px]"
                  />
                ) : (
                  <div className="text-[12.5px] leading-snug text-text-primary pr-12" onDoubleClick={() => startEditKnowledge(t)} title={t.content}>
                    {t.content}
                  </div>
                )}
                <div className="absolute right-2 top-2 flex gap-0.5">
                  <button onClick={() => startEditKnowledge(t)} title="Sửa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-primary p-0.5 transition-opacity">
                    <Icon name="pencil" size={13} />
                  </button>
                  <button onClick={() => deleteKnowledge(t.id)} title="Xóa" className="opacity-0 group-hover:opacity-100 text-text-disabled hover:text-red-500 p-0.5 transition-opacity">
                    <Icon name="x" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </KbGroup>
        </div>
      </div>

      {/* ── Bottom gradient action bar: Sinh nháp ── */}
      <div
        className="rounded-2xl p-4 flex items-center gap-4 border border-border-color"
        style={{ background: 'linear-gradient(110deg, #eef4fe 0%, #f6fdf8 100%)' }}
      >
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-white text-primary">
          <Icon name="rocket" size={22} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-text-primary">
            {selectedOutputs.length > 0 ? `Sinh nháp ${selectedOutputs.length} output đã chọn` : 'Sinh nháp tài liệu BA'}
          </div>
          <div className="text-[12px] mt-0.5 text-text-secondary">
            {selectedOutputs.length === 0 ? (
              <>Chọn ít nhất một loại output ở trên để AI sinh nháp dựa trên {totalKnowledge} tri thức đã khai phá.</>
            ) : (
              <>Đủ thông tin. Bấm để AI sinh nháp đồng thời các output đã chọn (mở Tác vụ để chỉnh sửa).</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedOutputs.length > 0 && (
            <GhostBtn icon="x" onClick={() => setSelectedOutputs([])} disabled={isLoading}>
              Bỏ chọn
            </GhostBtn>
          )}
          <PrimaryBtn icon="sparkles" onClick={handleGenerate} disabled={isLoading || selectedOutputs.length === 0}>
            Sinh nháp ({selectedOutputs.length})
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
};
