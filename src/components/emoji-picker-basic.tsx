'use client';

import { Smile } from 'lucide-react';

import EmojiPicker from '@/components/shadcnblocks/emoji-picker';
import { Button } from '@/components/ui/button';

export const title = 'Emoji Picker Basic';

const EmojiPickerExample = () => {
  const handleEmojiSelect = (emoji: string) => {
    console.log(emoji);
  };

  return (
    <EmojiPicker
      onEmojiSelect={handleEmojiSelect}
      trigger={
        <Button type="button" variant="outline" size="sm" className="h-8 w-8 rounded-lg p-0">
          <Smile className="h-4 w-4" />
        </Button>
      }
    />
  );
};

export default EmojiPickerExample;
