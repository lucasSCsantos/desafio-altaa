/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Smile } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs } from '@/components/ui/tabs';

const emojis = [
  {
    code: ['1F680'],
    emoji: '🚀',
    name: 'rocket',
    category: 'Travel & Places',
    subcategory: 'transport-air',
  },
  {
    code: ['1F3AF'],
    emoji: '🎯',
    name: 'direct hit',
    category: 'Activities',
    subcategory: 'game',
  },
  {
    code: ['1F4A1'],
    emoji: '💡',
    name: 'light bulb',
    category: 'Objects',
    subcategory: 'light & video',
  },
  {
    code: ['1F512'],
    emoji: '🔒',
    name: 'locked',
    category: 'Objects',
    subcategory: 'lock',
  },
  {
    code: ['1F4BB'],
    emoji: '💻',
    name: 'laptop',
    category: 'Objects',
    subcategory: 'computer',
  },
  {
    code: ['1F3C1'],
    emoji: '🏁',
    name: 'chequered flag',
    category: 'Flags',
    subcategory: 'flag',
  },
  {
    code: ['1F5A5'],
    emoji: '🖥️',
    name: 'desktop computer',
    category: 'Objects',
    subcategory: 'computer',
  },
  {
    code: ['1F4D5'],
    emoji: '📕',
    name: 'closed book',
    category: 'Objects',
    subcategory: 'book-paper',
  },
  {
    code: ['1F4C8'],
    emoji: '📈',
    name: 'chart increasing',
    category: 'Objects',
    subcategory: 'office',
  },
  {
    code: ['1F9BE'],
    emoji: '🦾',
    name: 'mechanical arm',
    category: 'People & Body',
    subcategory: 'body-parts',
  },
  {
    code: ['1F4A5'],
    emoji: '💥',
    name: 'collision',
    category: 'Smileys & Emotion',
    subcategory: 'emotion',
  },
  {
    code: ['1F50C'],
    emoji: '🔌',
    name: 'electric plug',
    category: 'Objects',
    subcategory: 'computer',
  },
  {
    code: ['1F527'],
    emoji: '🔧',
    name: 'wrench',
    category: 'Objects',
    subcategory: 'tool',
  },
  {
    code: ['1F9EE'],
    emoji: '🧮',
    name: 'abacus',
    category: 'Objects',
    subcategory: 'office',
  },
  {
    code: ['1F3B5'],
    emoji: '🎵',
    name: 'musical note',
    category: 'Objects',
    subcategory: 'sound',
  },
  {
    code: ['1F3A8'],
    emoji: '🎨',
    name: 'artist palette',
    category: 'Activities',
    subcategory: 'arts & crafts',
  },
  {
    code: ['1F48E'],
    emoji: '💎',
    name: 'gem stone',
    category: 'Objects',
    subcategory: 'other-object',
  },

  {
    code: ['1F6E0'],
    emoji: '🛠️',
    name: 'hammer and wrench',
    category: 'Objects',
    subcategory: 'tool',
  },
  {
    code: ['1F9F0'],
    emoji: '🧰',
    name: 'toolbox',
    category: 'Objects',
    subcategory: 'tool',
  },
  {
    code: ['1F4F0'],
    emoji: '📰',
    name: 'newspaper',
    category: 'Objects',
    subcategory: 'book-paper',
  },
  {
    code: ['1F52C'],
    emoji: '🔬',
    name: 'microscope',
    category: 'Objects',
    subcategory: 'science',
  },
  {
    code: ['1F30C'],
    emoji: '🌌',
    name: 'milky way',
    category: 'Travel & Places',
    subcategory: 'sky & weather',
  },
  {
    code: ['1F3C6'],
    emoji: '🏆',
    name: 'trophy',
    category: 'Activities',
    subcategory: 'award-medal',
  },
  {
    code: ['1F310'],
    emoji: '🌐',
    name: 'globe with meridians',
    category: 'Symbols',
    subcategory: 'geometric',
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
  maxRecentEmojis?: number;
}

export default function EmojiPicker({
  onEmojiSelect,
  trigger,
  maxRecentEmojis = 24,
}: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const emojiGridRef = useRef<HTMLDivElement>(null);

  // Load recent emojis from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recent-emojis');
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch {
        // Ignore invalid JSON in localStorage
      }
    }
  }, []);

  // Get unique categories with better ordering

  // Enhanced search with keywords and fuzzy matching
  const filteredEmojis = useMemo(() => {
    if (!searchTerm) return emojis;

    const searchLower = searchTerm.toLowerCase();
    return emojis.filter((emoji) => {
      const nameMatch = emoji.name.toLowerCase().includes(searchLower);
      const categoryMatch = emoji.category.toLowerCase().includes(searchLower);

      // Add keyword matching if emoji has keywords property
      const emojiKeywords =
        'keywords' in emoji && Array.isArray(emoji.keywords) ? emoji.keywords : [];
      const keywordMatch = emojiKeywords.some((keyword: string) =>
        keyword.toLowerCase().includes(searchLower),
      );

      return nameMatch || categoryMatch || keywordMatch;
    });
  }, [searchTerm]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);

    // Update recent emojis
    const newRecent = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, maxRecentEmojis);

    setRecentEmojis(newRecent);
    localStorage.setItem('recent-emojis', JSON.stringify(newRecent));

    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(-1);
  };

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  const EmojiGrid = ({
    emojis: emojiList,
    showCategory = false,
  }: {
    emojis: typeof emojis;
    showCategory?: boolean;
  }) => (
    <div className="grid grid-cols-8 gap-1 p-2" ref={emojiGridRef}>
      {emojiList.map((emoji, index) => {
        const globalIndex = index;

        return (
          <Button
            key={`${emoji.emoji}-${index}`}
            variant="ghost"
            size="sm"
            className={`hover:bg-accent h-10 w-10 p-0 transition-colors ${
              selectedIndex === globalIndex ? 'bg-accent ring-primary ring-2' : ''
            }`}
            onClick={() => handleEmojiClick(emoji.emoji)}
            title={emoji.name}
            onMouseEnter={() => setSelectedIndex(globalIndex)}
          >
            <span className="text-lg" role="img" aria-label={emoji.name}>
              {emoji.emoji}
            </span>
          </Button>
        );
      })}
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-8 w-8 bg-transparent p-0">
            <Smile className="h-4 w-4" />
            <span className="sr-only">Open emoji picker</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0" align="center">
        {/* Search Results */}
        <Tabs className="w-full">
          {/* Category Tabs */}
          {/* <ScrollArea className="h-64"> */}
          <div className="p-2">
            <EmojiGrid emojis={emojis} />
          </div>
          {/* </ScrollArea> */}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
