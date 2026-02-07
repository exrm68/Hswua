import React from 'react';
import { BellRing, MessageSquarePlus } from 'lucide-react';

const NoticeBar: React.FC = () => {
  return (
    <div className="w-full mb-6 px-1 relative z-20 overflow-hidden">
      <div className="relative overflow-hidden rounded-xl bg-[#111] border-l-4 border-gold shadow-lg shadow-gold/5 flex items-center py-2.5 px-3 gap-3">
         
         {/* Icon Box */}
         <div className="bg-gold/10 p-2 rounded-full shrink-0 animate-pulse">
           <BellRing size={16} className="text-gold" />
         </div>

         {/* Text Content (Marquee) */}
         <div className="flex-1 overflow-hidden relative h-5 flex items-center mask-image-fade">
            <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex items-center gap-8">
               <p className="text-xs font-medium text-gray-200">
                  ⚠️ আপনার পছন্দের মুভি বা সিরিজ খুঁজে পাচ্ছেন না? চিন্তার কারণ নেই! রিকোয়েস্ট বাটনে ক্লিক করুন।
               </p>
               <p className="text-xs font-medium text-gray-200">
                  🎬 New Content Added Daily! Enjoy High-Speed Streaming on Cineflix.
               </p>
               <p className="text-xs font-medium text-gray-200">
                  ⚠️ আপনার পছন্দের মুভি বা সিরিজ খুঁজে পাচ্ছেন না? চিন্তার কারণ নেই! রিকোয়েস্ট বাটনে ক্লিক করুন।
               </p>
            </div>
         </div>

         {/* Request Button */}
         <button 
           onClick={() => window.open('https://t.me/cineflixrequestcontent', '_blank')}
           className="bg-white/10 text-gold text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center gap-1 shrink-0 border border-gold/20"
         >
           <MessageSquarePlus size={12} />
           REQ
         </button>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .mask-image-fade {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </div>
  );
};

export default NoticeBar;