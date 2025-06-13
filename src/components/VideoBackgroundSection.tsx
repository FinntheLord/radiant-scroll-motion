import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSimpleChatContext } from "@/contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface VideoBackgroundSectionProps {
  lang: Language;
}

const VideoBackgroundSection: React.FC<VideoBackgroundSectionProps> = ({ lang }) => {
  const { openChat } = useSimpleChatContext();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source
          src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/public/videos/video-bg-2.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute bg-gradient-to-br from-gray-900 to-black opacity-70 inset-0 z-0"></div>
      
      <div className="relative z-10 text-center text-white px-4">
        <div className="max-w-4xl mx-auto reveal-on-scroll">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            {getTranslation('videoTitle1', lang)}<br />
            <span className="connexi-gradient-text">{getTranslation('videoTitle2', lang)}</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            {getTranslation('videoSubtitle', lang)}
          </p>
          
          <Button 
            onClick={openChat}
            size="lg"
            className="contact-button text-lg px-8 py-4 h-auto"
          >
            {getTranslation('getConsultation', lang)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoBackgroundSection;
