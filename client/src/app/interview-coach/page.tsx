'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Briefcase, RefreshCw, ArrowLeft, Target, Send, ChevronRight, MessageSquare } from 'lucide-react';
import { useAIStore } from '@/store/aiStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/layout/PageHeader';
import SectionHeader from '@/components/layout/SectionHeader';
import { getInterviewQuestionsAction, submitInterviewAnswerAction } from '@/lib/actions/ai';
import toast from 'react-hot-toast';

export default function InterviewCoachPage() {
  const { interviewMessages, addMessage: addInterviewMsg, clearMessages } = useAIStore();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [topic, setTopic] = useState('');

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const { data } = await getInterviewQuestionsAction(experienceLevel, topic || 'General IoT');
      const qs = data.split('\n').filter((l: string) => l.match(/^Q\d/i));
      setQuestions(qs);
      setCurrentQ(0);
      setFeedback('');
      setAnswer('');
      clearMessages('interview');
    } catch {
      toast.error('Failed to generate questions');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!questions[currentQ] || !answer.trim()) return;
    setFeedbackLoading(true);
    addInterviewMsg([{ id: Date.now().toString(), role: 'user', content: `Q: ${questions[currentQ]}\nA: ${answer}`, timestamp: new Date() }], 'interview');
    try {
      const { data } = await submitInterviewAnswerAction(questions[currentQ], answer, experienceLevel);
      setFeedback(data);
      addInterviewMsg([{ id: (Date.now() + 1).toString(), role: 'assistant', content: data, timestamp: new Date() }], 'interview');
    } catch {
      toast.error('Failed to get feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setAnswer(''); setFeedback(''); }
  };

  return (
    <div className="min-h-screen dashboard-bg space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-20 lg:pb-10 pt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader icon={Briefcase} title="Interview Coach" subtitle="Practice with real IoT interview questions" />
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors shrink-0">
          <ArrowLeft size={13} /> Dashboard
        </Link>
      </div>

      <div className="dashboard-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-lg bg-accent-light flex items-center justify-center">
            <Target size={13} className="text-accent" />
          </div>
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Practice Setup</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="space-y-1.5">
            <label htmlFor="experience-level" className="text-sm font-bold text-text-secondary">Experience Level</label>
            <select id="experience-level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/40 transition-all duration-200 shadow-elevation-low">
              <option value="fresher">Fresher / Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <Input label="Topic Focus (optional)" placeholder="e.g., Sensors, MQTT, ESP32" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>

        <Button onClick={generateQuestions} isLoading={isLoading}>
          <RefreshCw size={15} className="mr-2" />
          Generate Questions
        </Button>
      </div>

      {questions.length > 0 && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-accent-light flex items-center justify-center">
                  <MessageSquare size={12} className="text-accent" />
                </div>
                <span className="text-sm font-bold text-text-tertiary">Question {currentQ + 1} of {questions.length}</span>
              </div>
              <span className="text-xs font-bold text-text-muted capitalize px-2.5 py-1 rounded-full bg-bg-surface border border-border-default">{experienceLevel} Level</span>
            </div>
            <p className="text-base font-bold text-text-primary mb-5">{questions[currentQ]}</p>

            <div className="space-y-1.5 mb-4">
              <label htmlFor="answer" className="text-sm font-bold text-text-secondary">Your Answer</label>
              <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Type your answer here..." className="w-full rounded-xl border border-border-default bg-bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-200 shadow-elevation-low" />
            </div>

            <div className="flex gap-3">
              <Button onClick={submitAnswer} isLoading={feedbackLoading} disabled={!answer.trim()}>
                <Send size={14} className="mr-1.5" />Submit Answer
              </Button>
              {currentQ < questions.length - 1 && <Button variant="ghost" onClick={nextQuestion}><ChevronRight size={14} className="mr-1" />Skip</Button>}
            </div>
          </Card>

          {feedback && (
            <Card>
              <SectionHeader icon={MessageSquare} title="Feedback" tone="success" />
              <div className="text-sm font-semibold text-text-secondary whitespace-pre-line leading-relaxed">{feedback}</div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
