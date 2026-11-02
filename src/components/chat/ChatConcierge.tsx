'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  Truck,
  ArrowRight,
  Package,
} from 'lucide-react';
import { formatBDT } from '@/lib/utils/currency';
import { ChatMessageMarkdown } from './ChatMessageMarkdown';
import { useStore } from '@/context/StoreContext';

interface ChatProductCard {
  id: string;
  name: string;
  slug: string;
  price: number;
  collection: string;
  image: string;
  colours: string[];
}

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  products?: ChatProductCard[];
  orderCard?: {
    orderNumber: string;
    productName: string;
    quantity: number;
    price: number;
    delivery: number;
    total: number;
    name: string;
    phone: string;
    address: string;
    status: 'pending_confirmation' | 'confirmed';
  };
  trackingCard?: {
    orderNumber: string;
    status: string;
    currentMilestone: string;
  };
}

interface ChatConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: any) => void;
}

export function ChatConcierge({ isOpen, onClose, onAddToCart }: ChatConciergeProps) {
  let store: ReturnType<typeof useStore> | null = null;
  try {
    store = useStore();
  } catch { }

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Greetings! I am your **Stellify Style Concierge**. How may I guide you today? I can help you **find handcrafted bangles**, check **store policies & sizing**, **track an existing order**, or **place a Cash on Delivery order** directly for you.',
      timestamp: 'Now',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Now',
    };

    // Prepare full conversation history for multi-turn context
    const conversationPayload = [
      ...messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userText },
    ];

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationPayload,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Every bangle at Stellify is handcrafted with soul.',
          timestamp: 'Now',
          products: data.products,
          orderCard: data.orderCard,
          trackingCard: data.trackingCard,
        },
      ]);
    } catch {
      // Graceful fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Our atelier in Mirpur-11 is ready to assist. You can reach our artisans directly via phone/WhatsApp at **01644-711161**.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConfirmOrder = (orderNum: string) => {
    // Clear items from cart upon confirmed order
    store?.clearCart();

    setMessages((prev) =>
      prev.map((m) => {
        if (m.orderCard && m.orderCard.orderNumber === orderNum) {
          return {
            ...m,
            orderCard: {
              ...m.orderCard,
              status: 'confirmed',
            },
          };
        }
        return m;
      })
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `🎉 Wonderful! Your order **#${orderNum}** is recorded for dispatch. You will pay in cash upon courier arrival. You can track this journey anytime!`,
          timestamp: 'Now',
        },
      ]);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] sm:max-h-[660px] h-full sm:h-[85vh] bg-[#071326] border border-[#C5A059]/40 sm:rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Concierge Header */}
      <div className="bg-[#0B1C36] px-5 py-4 border-b border-[#162B4C] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-lg text-[#FAF7F2] font-normal leading-tight">
              Stellify Style Concierge
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#C5A059]">
                Live Artisanal Advisor &amp; Booking
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'msg-reset',
                  sender: 'assistant',
                  text: 'Conversation restarted. How may I guide your styling today?',
                  timestamp: 'Now',
                },
              ])
            }
            className="p-1 text-[#FAF7F2]/50 hover:text-[#C5A059] transition-colors"
            title="Restart conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#FAF7F2]/70 hover:text-[#C5A059] transition-colors"
            aria-label="Close concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Bubble */}
            <div
              className={`max-w-[88%] p-3.5 rounded-sm text-xs leading-relaxed font-sans ${msg.sender === 'user'
                  ? 'bg-[#C5A059] text-[#071326] font-medium'
                  : 'bg-[#0B1C36] text-[#FAF7F2] border border-[#162B4C]'
                }`}
            >
              {msg.sender === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <ChatMessageMarkdown content={msg.text} />
              )}
            </div>

            {/* Horizontal Product Carousel Widget */}
            {msg.products && msg.products.length > 0 && (
              <div className="w-full mt-3 overflow-x-auto flex gap-3 pb-2 pt-1 no-scrollbar">
                {msg.products.map((p) => (
                  <div
                    key={p.id}
                    className="shrink-0 w-48 bg-[#0B1C36] border border-[#C5A059]/30 rounded-sm overflow-hidden flex flex-col"
                  >
                    <div className="relative h-28 w-full bg-[#071326]">
                      <Image src={p.image} alt={p.name} fill sizes="192px" className="object-cover" />
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] block">
                          {p.collection}
                        </span>
                        <h5 className="font-serif text-sm text-[#FAF7F2] truncate mt-0.5">
                          {p.name}
                        </h5>
                        <span className="text-xs font-semibold text-[#E5C378] block mt-1">
                          {formatBDT(p.price)}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-1.5">
                        <Link
                          href={`/products/${p.slug}`}
                          onClick={onClose}
                          className="flex-1 text-[10px] text-center uppercase tracking-[0.15em] bg-[#071326] border border-[#162B4C] hover:border-[#C5A059] py-1.5 text-[#FAF7F2] rounded-sm transition-colors"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            onAddToCart?.(p);
                            setMessages((prev) => [
                              ...prev,
                              {
                                id: `msg-${Date.now()}`,
                                sender: 'assistant',
                                text: `Added **${p.name}** to your shopping bag! You can proceed to checkout or ask me to place the order for you directly.`,
                                timestamp: 'Now',
                              },
                            ]);
                          }}
                          className="px-2.5 text-[10px] bg-[#C5A059] hover:bg-[#E5C378] text-[#071326] font-medium py-1.5 rounded-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* In-Chat Order Confirmation Widget */}
            {msg.orderCard && (
              <div className="w-full mt-3 bg-[#0B1C36] border border-[#C5A059] p-4 rounded-sm text-xs font-sans text-[#FAF7F2] shadow-lg animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#162B4C] mb-3">
                  <div className="flex items-center gap-1.5 text-[#C5A059]">
                    <Package className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                      Cash on Delivery Booking
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#E5C378]">
                    {msg.orderCard.orderNumber}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#FAF7F2]/80 mb-3">
                  <div className="flex justify-between">
                    <span>Item:</span>
                    <span className="font-medium text-[#FAF7F2] truncate max-w-[200px]">
                      {msg.orderCard.productName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="text-[#FAF7F2]">{msg.orderCard.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-[#FAF7F2]/80 truncate max-w-[200px]">{msg.orderCard.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Item Subtotal:</span>
                    <span>{formatBDT(msg.orderCard.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>{formatBDT(msg.orderCard.delivery)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#162B4C] font-semibold text-[#E5C378]">
                    <span>Total Due on Arrival:</span>
                    <span>{formatBDT(msg.orderCard.total)}</span>
                  </div>
                </div>

                {msg.orderCard.status === 'pending_confirmation' ? (
                  <button
                    onClick={() => handleConfirmOrder(msg.orderCard!.orderNumber)}
                    className="w-full bg-[#C5A059] hover:bg-[#E5C378] text-[#071326] font-semibold text-xs py-2 rounded-sm uppercase tracking-[0.18em] transition-all shadow-[0_0_15px_rgba(197,160,89,0.3)]"
                  >
                    Confirm Order (Cash on Delivery)
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-[#071326] p-2 rounded-sm border border-emerald-500/40 text-emerald-400 text-center font-medium flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Order Confirmed in Atelier Database</span>
                    </div>
                    <Link
                      href={`/order-tracking?id=${msg.orderCard.orderNumber}&phone=${encodeURIComponent(
                        msg.orderCard.phone
                      )}`}
                      onClick={onClose}
                      className="block text-center w-full py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] rounded-sm text-[11px] font-sans transition-all"
                    >
                      Track Order Live on Website →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tracking Widget */}
            {msg.trackingCard && (
              <div className="w-full mt-3 bg-[#0B1C36] border border-[#162B4C] p-4 rounded-sm text-xs font-sans">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[#C5A059]">
                    <Truck className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                      Order Tracking
                    </span>
                  </div>
                  <span className="text-emerald-400 font-semibold">{msg.trackingCard.status}</span>
                </div>
                <p className="text-xs text-[#FAF7F2]/80 mt-1">{msg.trackingCard.currentMilestone}</p>
                <Link
                  href={`/order-tracking?id=${msg.trackingCard.orderNumber}`}
                  onClick={onClose}
                  className="mt-2 text-[11px] text-[#C5A059] hover:underline inline-flex items-center gap-1 font-sans"
                >
                  <span>Open Full Tracking Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-sm bg-[#0B1C36] border border-[#162B4C] w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#050C18] border-t border-[#162B4C] flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['Red bangles for wedding', 'Show me Indra set', 'Track my order', 'Bangle sizing?'].map(
          (prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInput(prompt);
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0B1C36] hover:bg-[#C5A059]/20 border border-[#162B4C] text-[10px] text-[#FAF7F2]/70 hover:text-[#C5A059] transition-all"
            >
              {prompt}
            </button>
          )
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-[#0B1C36] border-t border-[#162B4C] flex gap-2">
        <input
          type="text"
          placeholder="Ask in English or বাংলা..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#071326] border border-[#162B4C] rounded-sm px-3.5 py-2.5 text-xs text-[#FAF7F2] placeholder-[#FAF7F2]/40 focus:outline-none focus:border-[#C5A059]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-sm bg-[#C5A059] text-[#071326] hover:bg-[#E5C378] disabled:opacity-40 transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
export default ChatConcierge;
