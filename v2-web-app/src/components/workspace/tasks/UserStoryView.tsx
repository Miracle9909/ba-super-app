import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { GhostBtn, PrimaryBtn } from '../../ui/Buttons';
import { anthropicProvider } from '../../../lib/llm/anthropic';
import { buildUserStoryPrompt } from '../../../lib/llm/promptMaster';

interface UserStoryViewProps {
  projectId: string;
  onBack: () => void;
}

export const UserStoryView: React.FC<UserStoryViewProps> = ({ projectId, onBack }) => {
  const [actor, setActor] = useState('');
  const [goal, setGoal] = useState('');
  const [benefit, setBenefit] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch knowledge to use as context
  const knowledgeItems = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).toArray(), [projectId]);
  const userStories = useLiveQuery(() => db.tasks.where('projectId').equals(projectId).filter(t => t.type === 'user-story').toArray(), [projectId]);

  const handleGenerate = async () => {
    if (!actor || !goal) return;
    setIsGenerating(true);

    try {
      const context = knowledgeItems?.map(k => `[${k.type?.toUpperCase()}]: ${k.content}`).join('\n') || '';
      const prompt = buildUserStoryPrompt(actor, goal, benefit, context);

      const response = await anthropicProvider.generateResponse([{ role: 'user', content: prompt }], context, 'You are an expert Agile Business Analyst.');

      await db.tasks.add({
        id: crypto.randomUUID(),
        projectId,
        type: 'user-story',
        title: `US: ${actor} wants to ${goal.substring(0, 30)}...`,
        content: response,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      setActor('');
      setGoal('');
      setBenefit('');
    } catch (error) {
      console.error('Error generating User Story:', error);
      alert('Có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-primary transition-colors mb-3"
        >
          <Icon name="chevron-left" size={16} strokeWidth={2.2} />
          Quay lại danh sách
        </button>
        <h2 className="text-[20px] font-semibold text-text-primary">Trình tạo User Story</h2>
        <p className="text-[13px] text-text-secondary mt-1">Sử dụng tri thức dự án để sinh User Story và Acceptance Criteria tự động.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="text-[14px] font-semibold mb-4">Thông tin đầu vào</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Actor (Vai trò) *</label>
                <input 
                  type="text" 
                  value={actor}
                  onChange={e => setActor(e.target.value)}
                  placeholder="VD: Khách hàng cá nhân"
                  className="w-full px-3 py-2 border border-border-color rounded-lg text-[13px] outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Goal (Mục tiêu) *</label>
                <textarea 
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="VD: Đăng ký khoản vay tín chấp"
                  rows={2}
                  className="w-full px-3 py-2 border border-border-color rounded-lg text-[13px] outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary mb-1">Benefit (Lợi ích)</label>
                <textarea 
                  value={benefit}
                  onChange={e => setBenefit(e.target.value)}
                  placeholder="VD: Không cần ra quầy giao dịch"
                  rows={2}
                  className="w-full px-3 py-2 border border-border-color rounded-lg text-[13px] outline-none focus:border-primary resize-none"
                />
              </div>
              <PrimaryBtn 
                onClick={handleGenerate} 
                disabled={isGenerating || !actor || !goal}
                icon={isGenerating ? "loader-2" : "sparkles"}
                className="w-full justify-center mt-2"
              >
                {isGenerating ? 'Đang sinh...' : 'Sinh User Story'}
              </PrimaryBtn>
            </div>
          </Card>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold text-text-primary mb-2">Danh sách User Story đã tạo</h3>
          {userStories && userStories.length > 0 ? (
            userStories.sort((a, b) => b.createdAt - a.createdAt).map(story => (
              <Card key={story.id} className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-[14px]">{story.title}</h4>
                  <div className="flex gap-2">
                    <GhostBtn icon="trash" onClick={() => db.tasks.delete(story.id)}>Xóa</GhostBtn>
                  </div>
                </div>
                <div className="text-[13px] whitespace-pre-wrap text-text-secondary bg-bg-hover p-4 rounded-lg border border-border-color overflow-auto max-h-[300px]">
                  {story.content}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-[13px] text-text-secondary p-5 border border-dashed border-border-color rounded-xl text-center bg-bg-hover">
              Chưa có User Story nào được tạo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
