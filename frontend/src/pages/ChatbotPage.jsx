import { useEffect, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { chatService } from '../services/chatService';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    chatService
      .history()
      .then(setMessages)
      .catch((err) => setError(err.response?.data?.detail || 'Unable to load chat'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = async (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) return;

    setError('');
    setIsSending(true);
    try {
      const created = await chatService.send(trimmedMessage);
      setMessages((current) => [...current, created]);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <PageHeader title="Chatbot" subtitle="A simple supportive check-in space." />
      <section className="panel flex h-[68vh] min-h-[520px] flex-col rounded-2xl p-4">
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {error ? <p className="rounded-lg bg-coral/20 p-3 text-sm font-medium text-coral">{error}</p> : null}
          {isLoading ? <p className="text-sm font-medium text-slate-500">Loading conversation...</p> : null}
          {messages.map((item, index) => (
            <div key={item.id || `${item.user_message}-${index}`} className="space-y-2">
              <div className="ml-auto max-w-2xl rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm leading-6 text-white shadow-sm">
                {item.user_message}
              </div>
              <div className="max-w-2xl rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm">
                {item.bot_response}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={submit} className="mt-4 flex gap-2 rounded-2xl border border-slate-200/80 bg-white/78 p-2">
          <input
            className="field border-transparent shadow-none"
            placeholder="Share what is on your mind"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={isSending}
          />
          <Button type="submit" aria-label="Send message" disabled={isSending || !message.trim()}>
            {isSending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </Button>
        </form>
      </section>
    </>
  );
}
