'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export const FloatingAIChat: React.FC = () => {
  const { products, language, isRTL } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text:
        language === 'sd'
          ? 'ڀلي ڪري آيا! سنڌ هنر ۾ توهان جو استقبال آهي. توهان اجرڪ، سنڌي ٽوپي، رلي ۽ ٻين هنرن بابت ڇا پڇڻ چاهيو ٿا؟'
          : language === 'ur'
          ? 'السلام علیکم! سندھ ہنر میں خوش آمدید۔ آپ اجرک، سندھی ٹوپی، رلی یا دستکاری کے بارے میں کیا جاننا چاہتے ہیں؟'
          : 'Khush Amdeed! Welcome to Sindh Hunar. How can I assist you with authentic Ajrak, Sindhi Topi, Ralli quilts, or artisan crafts today?',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Knowledge base matching from live products
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let botResponse = '';

      if (lower.includes('ajrak') || lower.includes('اجرڪ') || lower.includes('اجرک')) {
        const item = products.find(p => p.name.toLowerCase().includes('ajrak'));
        botResponse = `Our Authentic Sindhi Ajrak is hand-block printed using natural mineral and vegetable dyes in Bhit Shah. Price: Rs. ${item ? item.price : 3500}. Standard dimensions: 2.5 meters. Delivery is free across Pakistan!`;
      } else if (lower.includes('topi') || lower.includes('cap') || lower.includes('ٽوپي') || lower.includes('ٹوپی')) {
        const item = products.find(p => p.name.toLowerCase().includes('topi'));
        botResponse = `Our Royal Embroidered Sindhi Topi features intricate Aarsie (mirror-work) and gold silk threading. Price: Rs. ${item ? item.price : 2200}. Standard sizes (Medium/Large) available.`;
      } else if (lower.includes('ralli') || lower.includes('quilt') || lower.includes('رلي') || lower.includes('رلی')) {
        const item = products.find(p => p.name.toLowerCase().includes('quilt') || p.name.toLowerCase().includes('ralli'));
        botResponse = `Handcrafted Sindhi Ralli Quilts are 100% hand-stitched by village women in Umerkot and Ghotki. Price: Rs. ${item ? item.price : 8500}. Size: Double bed (approx. 7.5 x 8.5 feet).`;
      } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('پہنچ')) {
        botResponse = 'We offer FREE insured Cash on Delivery (COD) shipping across all cities, towns, and villages of Pakistan via reliable courier services within 2-4 business days.';
      } else if (lower.includes('price') || lower.includes('discount') || lower.includes('قيمت') || lower.includes('قیمت')) {
        botResponse = 'All our crafts are priced directly by the artisans with 0% middleman markups! Key prices: Ajrak (Rs. 3500), Topi (Rs. 2200), Ralli (Rs. 8500), Kurta (Rs. 6500), Tote Bag (Rs. 1800).';
      } else {
        botResponse = language === 'sd'
          ? 'مهرباني! توهان ڪنهن به پراڊڪٽ تي ڪلڪ ڪري ان جي جھولي ۾ رکي سگهو ٿا يا اسان سان سڌو واٽس ايپ تي ڳالهائي سگهو ٿا.'
          : language === 'ur'
          ? 'بہت شکریہ! آپ کسی بھی سندھی ہنر کو جھولی میں شامل کر کے آرڈر دے سکتے ہیں یا براہ راست واٹس ایپ پر رابطہ کر سکتے ہیں۔'
          : 'Thank you for reaching out! You can browse any craft in our Bazaar, add items to your Jholi, or contact our artisan coordinator via WhatsApp.';
      }

      setMessages((prev) => [...prev, { role: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40`}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-[#800000] to-[#500000] text-white shadow-xl hover:shadow-2xl flex items-center justify-center border-2 border-[#C5A059] cursor-pointer group"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C5A059] border-2 border-[#1A1A1A] animate-ping" />
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} z-40 w-80 sm:w-96 h-[460px] bg-white rounded-3xl shadow-2xl border border-[#C5A059]/40 flex flex-col overflow-hidden`}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#800000] to-[#4A0000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#1A1A1A] flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-bebas tracking-wide leading-none">
                    Sindh Hunar Assistant
                  </h4>
                  <span className="text-[10px] text-emerald-300 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Artisan Advisor
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6] text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#800000] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#800000] text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-100 shadow-2xs rounded-tl-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-gray-400 pl-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce delay-300" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Ajrak, Topi, prices..."
                className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#800000] px-4"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#660000] transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
