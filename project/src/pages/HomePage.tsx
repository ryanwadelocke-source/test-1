import { MapPin, Clock, Phone, ChevronRight, Upload, Image as ImageIcon, Plus, Trash2, GripVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import EditableField from '../components/EditableField';
import TagEditor from '../components/TagEditor';
import DietBadge from '../components/DietBadge';
import { useContent } from '../contexts/ContentContext';

function StatusTicker({ contentKey, defaultValue }: { contentKey: string; defaultValue: string }) {
  const { getText, isEditMode } = useContent();
  const text = getText(contentKey, defaultValue);
  const separator = '  ·  ';
  const repeated = text + separator + text + separator;

  if (isEditMode) {
    return (
      <EditableField
        contentKey={contentKey}
        defaultValue={defaultValue}
        className="font-mono text-xs text-lcd-text-mid tracking-wide px-3 whitespace-nowrap"
      />
    );
  }

  return (
    <div className="ticker-track font-mono text-xs text-lcd-text-mid tracking-wide">
      <span className="whitespace-nowrap pr-8">{repeated}</span>
      <span className="whitespace-nowrap pr-8" aria-hidden="true">{repeated}</span>
    </div>
  );
}

interface Special {
  name: string;
  price: string;
  tag: string;
  desc: string;
}

interface ItemImage {
  item_id: string;
  image_url: string;
}

const specials: Special[] = [
  { name: 'The Larkspur Club', price: '$12.95', tag: 'STAFF PICK', desc: 'Roast turkey, bacon, havarti, avocado, herb mayo on sourdough' },
  { name: 'Market Grain Bowl', price: '$11.50', tag: 'POPULAR', desc: 'Farro, roasted squash, kale, pepitas, lemon tahini' },
  { name: 'French Onion Bisque', price: '$7.75', tag: 'NEW', desc: 'Caramelized onion, beef broth, gruyère crouton' },
  { name: 'Brown Butter Shortbread', price: '$4.50', tag: 'SEASONAL', desc: 'House-baked, sea salt finish' },
];

const hours = [
  { day: 'Mon - Fri', time: '07:00 - 17:00' },
  { day: 'Saturday', time: '08:00 - 15:00' },
  { day: 'Sunday', time: 'CLOSED' },
];

function SpecialItem({ item, index, isExpanded, imageUrl, onToggle, onUploadImage, onDelete, isOdd, isDragging, isDropTarget, onDragStart, onDragOver, onDrop, onDragEnd }: {
  item: Special;
  index: number;
  isExpanded: boolean;
  imageUrl?: string;
  onToggle: () => void;
  onUploadImage: (itemId: string, file: File) => Promise<void>;
  onDelete: () => void;
  isOdd: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { isEditMode, isAdmin } = useContent();
  const keyPrefix = `home.specials.${index}`;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await onUploadImage(item.name, file);
      } finally {
        setUploading(false);
      }
    }
    e.target.value = '';
  };

  return (
    <div
      className={`lcd-item-row ${isOdd ? 'bg-lcd-stripe' : ''} ${isDragging ? 'opacity-30' : ''} ${isDropTarget ? 'border-t-2 border-lcd-text' : 'border-t-2 border-transparent'} transition-opacity`}
      draggable={isEditMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <button
        onClick={() => { if (!isEditMode) onToggle(); }}
        className="w-full flex items-start justify-between px-3 py-2.5 text-left"
      >
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {isEditMode ? (
            <GripVertical size={12} className="mt-1.5 flex-shrink-0 text-lcd-text-mid cursor-grab active:cursor-grabbing" />
          ) : (
            <span className="lcd-arrow-right mt-1.5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <EditableField
                contentKey={`${keyPrefix}.name`}
                defaultValue={item.name}
                className="font-mono text-sm text-lcd-text"
              />
              <DietBadge contentKey={`${keyPrefix}.veg`} defaultValue={false} label="V" />
              <DietBadge contentKey={`${keyPrefix}.gf`} defaultValue={false} label="GF" />
              <TagEditor contentKey={`${keyPrefix}.tag`} defaultTag={item.tag} />
            </div>
            <EditableField
              contentKey={`${keyPrefix}.desc`}
              defaultValue={item.desc}
              className="font-mono text-xs text-lcd-text-mid mt-0.5 leading-relaxed"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <EditableField
            contentKey={`${keyPrefix}.price`}
            defaultValue={item.price}
            className="font-mono text-sm text-lcd-text-mid"
          />
          {isEditMode ? (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Remove item"
            >
              <Trash2 size={12} />
            </button>
          ) : isExpanded ? (
            <ChevronRight size={12} className="text-lcd-bg rotate-90" />
          ) : (
            <ChevronRight size={12} className="text-lcd-bg" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="flex gap-3">
            <div className="flex-1">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg border border-lcd-border"
                    style={{ imageRendering: 'auto' }}
                  />
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 px-2 py-1 rounded flex items-center gap-1"
                      style={{ background: 'rgba(28,40,16,0.9)', fontSize: '10px' }}
                    >
                      <Upload size={10} className="text-lcd-bg" />
                      <span className="text-lcd-bg font-mono">{uploading ? '...' : 'CHANGE'}</span>
                    </button>
                  )}
                </div>
              ) : isAdmin ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={uploading}
                  className="w-full h-32 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-lcd-border hover:border-lcd-bg transition-colors"
                >
                  <ImageIcon size={20} className="text-lcd-text-mid" />
                  <span className="font-mono text-xs text-lcd-text-mid">
                    {uploading ? 'UPLOADING...' : 'UPLOAD PHOTO'}
                  </span>
                </button>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <EditableField
                contentKey={`${keyPrefix}.desc.detail`}
                defaultValue={item.desc}
                as="p"
                className="font-mono text-xs text-lcd-text-mid leading-relaxed"
                multiline
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage({ onNavigate }: { onNavigate: (page: 'menu') => void }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [itemImages, setItemImages] = useState<Map<string, string>>(new Map());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const { getText, updateText, isEditMode } = useContent();

  const specialCount = parseInt(getText('home.specials.count', String(specials.length)), 10);

  const specialItems: Special[] = Array.from({ length: specialCount }, (_, i) => ({
    name: getText(`home.specials.${i}.name`, specials[i]?.name ?? ''),
    price: getText(`home.specials.${i}.price`, specials[i]?.price ?? '$0.00'),
    tag: getText(`home.specials.${i}.tag`, specials[i]?.tag ?? ''),
    desc: getText(`home.specials.${i}.desc`, specials[i]?.desc ?? ''),
  }));

  const hourCount = parseInt(getText('home.hours.count', String(hours.length)), 10);

  const hourItems = Array.from({ length: hourCount }, (_, i) => ({
    day: getText(`home.hours.${i}.day`, hours[i]?.day ?? ''),
    time: getText(`home.hours.${i}.time`, hours[i]?.time ?? ''),
  }));

  useEffect(() => {
    loadItemImages();
  }, []);

  const loadItemImages = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_item_images')
        .select('item_id, image_url');

      if (error) throw error;

      const imageMap = new Map<string, string>();
      data?.forEach((img: ItemImage) => {
        imageMap.set(img.item_id, img.image_url);
      });
      setItemImages(imageMap);
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleUploadImage = async (itemId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${itemId.replace(/[^a-z0-9]/gi, '_')}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('menu_item_images')
      .upsert(
        { item_id: itemId, image_url: imageUrl, updated_at: new Date().toISOString() },
        { onConflict: 'item_id' }
      );

    if (dbError) throw dbError;

    setItemImages(prev => {
      const next = new Map(prev);
      next.set(itemId, imageUrl);
      return next;
    });
  };

  const ITEM_FIELDS = ['name', 'price', 'tag', 'desc', 'desc.detail', 'veg', 'gf'];

  const handleAddSpecial = () => {
    const newIndex = specialCount;
    updateText(`home.specials.${newIndex}.name`, 'NEW ITEM');
    updateText(`home.specials.${newIndex}.price`, '$0.00');
    updateText(`home.specials.${newIndex}.tag`, '');
    updateText(`home.specials.${newIndex}.desc`, 'Description');
    updateText('home.specials.count', String(newIndex + 1));
  };

  const handleDeleteSpecial = (deleteIndex: number) => {
    for (let i = deleteIndex; i < specialCount - 1; i++) {
      for (const field of ITEM_FIELDS) {
        const nextVal = getText(`home.specials.${i + 1}.${field}`, specials[i + 1]?.[field as keyof Special] ?? '');
        updateText(`home.specials.${i}.${field}`, nextVal);
      }
    }
    for (const field of ITEM_FIELDS) {
      updateText(`home.specials.${specialCount - 1}.${field}`, '');
    }
    updateText('home.specials.count', String(specialCount - 1));
  };

  const handleReorderSpecial = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const snapshot = Array.from({ length: specialCount }, (_, i) =>
      Object.fromEntries(ITEM_FIELDS.map(field => [
        field,
        getText(`home.specials.${i}.${field}`, specials[i]?.[field as keyof Special] ?? '')
      ]))
    );
    const [moved] = snapshot.splice(fromIndex, 1);
    snapshot.splice(toIndex, 0, moved);
    snapshot.forEach((itemData, i) => {
      ITEM_FIELDS.forEach(field => {
        updateText(`home.specials.${i}.${field}`, itemData[field] ?? '');
      });
    });
  };

  const handleAddHour = () => {
    const newIndex = hourCount;
    updateText(`home.hours.${newIndex}.day`, 'Day');
    updateText(`home.hours.${newIndex}.time`, '00:00 - 00:00');
    updateText('home.hours.count', String(newIndex + 1));
  };

  const handleDeleteHour = (deleteIndex: number) => {
    for (let i = deleteIndex; i < hourCount - 1; i++) {
      updateText(`home.hours.${i}.day`, getText(`home.hours.${i + 1}.day`, hours[i + 1]?.day ?? ''));
      updateText(`home.hours.${i}.time`, getText(`home.hours.${i + 1}.time`, hours[i + 1]?.time ?? ''));
    }
    updateText(`home.hours.${hourCount - 1}.day`, '');
    updateText(`home.hours.${hourCount - 1}.time`, '');
    updateText('home.hours.count', String(hourCount - 1));
  };

  return (
    <div className="page-enter flex flex-col">
      {/* Hero section */}
      <div className="lcd-title-bar px-3 py-2">
        <div>
          <EditableField
            contentKey="home.hero.title"
            defaultValue="LARK FINE FOODS"
            className="font-display tracking-widest text-lcd-text-light pixel-shadow whitespace-nowrap"
            style={{ fontSize: 'clamp(0.7rem, 5.5vw, 1.5rem)' }}
            as="div"
          />
          <EditableField
            contentKey="home.hero.subtitle"
            defaultValue="Sandwiches & Salads · Est. 1997"
            className="font-mono text-xs text-lcd-border-light opacity-80 mt-0.5"
            as="div"
          />
        </div>
      </div>

      {/* Status strip */}
      <div className="bg-lcd-highlight border-b border-lcd-border py-1.5 flex items-center overflow-hidden">
        <div className="overflow-hidden flex-1 min-w-0">
          <StatusTicker contentKey="home.status.message" defaultValue="OPEN NOW · ORDERS READY IN ~10 MIN" />
        </div>
      </div>

      {/* Today's Specials */}
      <div className="lcd-section-header px-3 py-1.5 flex items-center justify-between">
        <EditableField
          contentKey="home.specials.header"
          defaultValue="TODAY'S SPECIALS"
          className="text-sm tracking-widest"
        />
        <button
          onClick={() => onNavigate('menu')}
          className="flex items-center gap-1 text-lcd-bg opacity-70 text-xs hover:opacity-100"
        >
          VIEW ALL <ChevronRight size={10} />
        </button>
      </div>

      <div className="flex-1">
        {specialItems.map((item, i) => (
          <SpecialItem
            key={i}
            item={item}
            index={i}
            isExpanded={expandedItems.has(String(i))}
            imageUrl={itemImages.get(item.name)}
            onToggle={() => toggleItem(String(i))}
            onUploadImage={handleUploadImage}
            onDelete={() => handleDeleteSpecial(i)}
            isOdd={i % 2 === 1}
            isDragging={dragIndex === i}
            isDropTarget={dropIndex === i && dragIndex !== null && dragIndex !== i}
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => { e.preventDefault(); if (dragIndex !== i) setDropIndex(i); }}
            onDrop={() => {
              if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
                handleReorderSpecial(dragIndex, dropIndex);
              }
              setDragIndex(null);
              setDropIndex(null);
            }}
            onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
          />
        ))}
        {isEditMode && (
          <button
            onClick={handleAddSpecial}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
          >
            <Plus size={12} />
            <span className="font-mono text-xs tracking-wide">ADD ITEM</span>
          </button>
        )}
      </div>

      {/* Divider */}
      <hr className="lcd-divider" />

      {/* Hours */}
      <div className="lcd-section-header px-3 py-1.5">
        <EditableField
          contentKey="home.hours.header"
          defaultValue="HOURS"
          className="text-sm tracking-widest"
        />
      </div>
      {hourItems.map((h, i) => (
        <div key={i} className={`flex items-center justify-between px-3 py-2 border-b border-lcd-border ${i % 2 === 0 ? '' : 'bg-lcd-stripe'}`}>
          <div className="flex items-center gap-2">
            <Clock size={11} className="text-lcd-text-mid flex-shrink-0" />
            <EditableField
              contentKey={`home.hours.${i}.day`}
              defaultValue={h.day}
              className="font-mono text-xs text-lcd-text"
            />
          </div>
          <div className="flex items-center gap-2">
            <EditableField
              contentKey={`home.hours.${i}.time`}
              defaultValue={h.time}
              className="font-mono text-sm text-lcd-text-mid"
            />
            {isEditMode && (
              <button
                onClick={() => handleDeleteHour(i)}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Remove row"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      ))}
      {isEditMode && (
        <button
          onClick={handleAddHour}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
        >
          <Plus size={12} />
          <span className="font-mono text-xs tracking-wide">ADD ROW</span>
        </button>
      )}

      {/* Contact */}
      <div className="px-3 py-3 flex flex-col gap-2 bg-lcd-highlight border-t border-lcd-border">
        <div className="flex items-center gap-2">
          <Phone size={11} className="text-lcd-text-mid flex-shrink-0" />
          <EditableField
            contentKey="home.contact.phone"
            defaultValue="(415) 555-0197"
            className="font-mono text-xs text-lcd-text"
          />
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={11} className="text-lcd-text-mid flex-shrink-0" />
          <EditableField
            contentKey="home.contact.address"
            defaultValue="214 Lark Lane, San Francisco, CA 94107"
            className="font-mono text-xs text-lcd-text"
          />
        </div>
      </div>
    </div>
  );
}
