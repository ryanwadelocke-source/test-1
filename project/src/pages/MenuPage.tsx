import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Upload, Image as ImageIcon, Plus, Trash2, GripVertical } from 'lucide-react';
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

interface MenuItem {
  name: string;
  price: string;
  desc: string;
  tag?: string;
  veg?: boolean;
}

interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

interface ItemImage {
  item_id: string;
  image_url: string;
}

const menuData: MenuCategory[] = [
  {
    id: 'sandwiches',
    label: 'SANDWICHES',
    items: [
      { name: 'The Larkspur Club', price: '$12.95', desc: 'Roast turkey, bacon, havarti, avocado, herb mayo on sourdough', tag: 'STAFF PICK' },
      { name: 'Roast Beef & Horseradish', price: '$13.50', desc: 'Slow-roasted beef, aged cheddar, pickled onion, arugula on rye' },
      { name: 'Caprese Press', price: '$11.00', desc: 'Fresh mozzarella, heirloom tomato, basil oil, balsamic on ciabatta', veg: true, tag: 'POPULAR' },
      { name: 'Tuna Melt', price: '$11.50', desc: 'House albacore tuna, celery, cheddar, toasted on wheat' },
      { name: 'The Reuben', price: '$13.00', desc: 'Corned beef, Swiss, sauerkraut, thousand island on marble rye' },
      { name: 'Grilled Chicken Pesto', price: '$12.50', desc: 'Herb-marinated chicken, sun-dried tomato, pesto, provolone on focaccia', tag: 'POPULAR' },
      { name: 'Egg Salad', price: '$9.50', desc: 'Free-range egg salad, chives, dijon, butter lettuce on whole wheat', veg: true },
      { name: 'BLT Deluxe', price: '$10.95', desc: 'Thick-cut bacon, heirloom tomato, bibb lettuce, garlic aioli on white' },
      { name: 'Veggie Banh Mi', price: '$11.00', desc: 'Pickled daikon, cucumber, jalapeño, tofu pâté, sriracha mayo on baguette', veg: true },
      { name: 'Turkey Cranberry', price: '$12.00', desc: 'Smoked turkey, cranberry chutney, brie, spinach on multigrain' },
    ],
  },
  {
    id: 'salads',
    label: 'SALADS',
    items: [
      { name: 'Market Grain Bowl', price: '$11.50', desc: 'Farro, roasted squash, kale, pepitas, lemon tahini', veg: true, tag: 'POPULAR' },
      { name: 'Classic Caesar', price: '$10.00', desc: 'Romaine, house-made Caesar, Parmesan, sourdough croutons' },
      { name: 'Cobb Salad', price: '$13.50', desc: 'Chicken, bacon, egg, blue cheese, avocado, cherry tomato' },
      { name: 'Greek Village', price: '$11.00', desc: 'Cucumber, tomato, Kalamata olive, feta, red onion, oregano vinaigrette', veg: true },
      { name: 'Nicoise', price: '$13.00', desc: 'Albacore tuna, haricots verts, potato, soft egg, anchovy dressing' },
      { name: 'Arugula & Pear', price: '$11.50', desc: 'Baby arugula, d\'Anjou pear, candied walnut, gorgonzola, champagne vinaigrette', veg: true, tag: 'NEW' },
      { name: 'Kale & Quinoa', price: '$12.00', desc: 'Massaged kale, tri-color quinoa, dried cranberry, sunflower seed, apple cider dressing', veg: true },
      { name: 'Wedge', price: '$10.50', desc: 'Iceberg, thick-cut bacon, blue cheese dressing, pickled tomato, chive' },
    ],
  },
  {
    id: 'soups',
    label: 'SOUPS',
    items: [
      { name: 'French Onion Bisque (cup)', price: '$5.50', desc: 'Caramelized onion, beef broth, gruyère crouton', tag: 'NEW' },
      { name: 'French Onion Bisque (bowl)', price: '$7.75', desc: 'Caramelized onion, beef broth, gruyère crouton', tag: 'NEW' },
      { name: 'Tomato Basil (cup)', price: '$4.75', desc: 'San Marzano tomato, fresh basil, cream', veg: true, tag: 'POPULAR' },
      { name: 'Tomato Basil (bowl)', price: '$6.50', desc: 'San Marzano tomato, fresh basil, cream', veg: true },
      { name: 'Chicken Noodle (bowl)', price: '$7.00', desc: 'Free-range chicken, egg noodle, carrot, celery, dill' },
      { name: 'Lentil & Kale (bowl)', price: '$6.75', desc: 'Red lentil, lacinato kale, smoked paprika, lemon', veg: true },
    ],
  },
  {
    id: 'sides',
    label: 'SIDES',
    items: [
      { name: 'House Kettle Chips', price: '$2.50', desc: 'Sea salt or rosemary', veg: true },
      { name: 'Fresh Fruit Cup', price: '$3.50', desc: 'Seasonal fruit, mint', veg: true },
      { name: 'Half Salad Add-On', price: '$5.00', desc: 'Pair any half salad with your sandwich', veg: true },
      { name: 'Pickle Spear', price: '$1.00', desc: 'House-brined dill' },
      { name: 'Extra Bread', price: '$1.50', desc: 'Sourdough, rye, or wheat', veg: true },
    ],
  },
  {
    id: 'drinks',
    label: 'BEVERAGES',
    items: [
      { name: 'House Lemonade', price: '$3.75', desc: 'Fresh-squeezed, lavender or classic', veg: true, tag: 'POPULAR' },
      { name: 'Iced Tea', price: '$2.75', desc: 'Unsweetened black or peach', veg: true },
      { name: 'Sparkling Water', price: '$2.50', desc: 'San Pellegrino, lemon or plain', veg: true },
      { name: 'Drip Coffee', price: '$2.50', desc: 'Single-origin, light or dark roast', veg: true },
      { name: 'Cold Brew', price: '$4.00', desc: 'Slow-steeped 18 hours, served over ice', veg: true, tag: 'NEW' },
      { name: 'Soft Drinks', price: '$2.00', desc: 'Coke, Diet Coke, Sprite, Ginger Beer' },
    ],
  },
  {
    id: 'desserts',
    label: 'DESSERTS',
    items: [
      { name: 'Brown Butter Shortbread', price: '$4.50', desc: 'House-baked, sea salt finish', veg: true, tag: 'SEASONAL' },
      { name: 'Lemon Tart', price: '$5.50', desc: 'Meyer lemon curd, butter crust, powdered sugar', veg: true, tag: 'POPULAR' },
      { name: 'Chocolate Chunk Cookie', price: '$3.50', desc: 'Dark chocolate, toasted walnut, flaky salt', veg: true },
      { name: 'Seasonal Fruit Crisp', price: '$5.00', desc: 'Rotating seasonal fruit, oat topping, whipped cream', veg: true },
    ],
  },
];

const MENU_ITEM_FIELDS = ['name', 'price', 'desc', 'tag', 'veg', 'gf', 'desc.detail'];

function MenuItemRow({ item, itemIndex, categoryId, itemId, isExpanded, imageUrl, onToggle, onUploadImage, onDelete, isOdd, isDragging, isDropTarget, onDragStart, onDragOver, onDrop, onDragEnd }: {
  item: MenuItem;
  itemIndex: number;
  categoryId: string;
  itemId: string;
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
  const keyPrefix = `menu.${categoryId}.${itemIndex}`;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await onUploadImage(itemId, file);
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
              <DietBadge contentKey={`${keyPrefix}.veg`} defaultValue={item.veg ?? false} label="V" />
              <DietBadge contentKey={`${keyPrefix}.gf`} defaultValue={false} label="GF" />
              <TagEditor contentKey={`${keyPrefix}.tag`} defaultTag={item.tag ?? ''} />
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
            <ChevronDown size={12} className="text-lcd-bg" />
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

function CategorySection({ category, isOpen, onToggle, expandedItems, onToggleItem, itemImages, onUploadImage, onAddItem, onDeleteItem, onDeleteCategory, onReorderItem }: {
  category: MenuCategory;
  isOpen: boolean;
  onToggle: () => void;
  expandedItems: Set<string>;
  onToggleItem: (itemId: string) => void;
  itemImages: Map<string, string>;
  onUploadImage: (itemId: string, file: File) => Promise<void>;
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
  onDeleteCategory: () => void;
  onReorderItem: (fromIndex: number, toIndex: number) => void;
}) {
  const { isEditMode } = useContent();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDeleteCategory();
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div>
      <div className="lcd-section-header w-full flex items-center justify-between">
        <button
          onClick={() => { if (!isEditMode) onToggle(); }}
          className="flex-1 px-3 py-2 flex items-center justify-between text-left hover:opacity-90"
        >
          <EditableField
            contentKey={`menu.${category.id}.label`}
            defaultValue={category.label}
            className="text-sm tracking-widest"
          />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-lcd-text opacity-60">{category.items.length} items</span>
            {isOpen ? <ChevronDown size={12} className="text-lcd-bg" /> : <ChevronRight size={12} className="text-lcd-bg" />}
          </div>
        </button>
        {isEditMode && (
          <div className="flex items-center gap-1 pr-2 flex-shrink-0">
            {confirmDelete ? (
              <>
                <button
                  onClick={handleDeleteClick}
                  className="px-2 py-0.5 font-mono text-xs bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
                >
                  DELETE
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="px-2 py-0.5 font-mono text-xs text-lcd-text-mid hover:text-lcd-text transition-colors"
                >
                  CANCEL
                </button>
              </>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Delete category"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <>
          {category.items.map((item, i) => {
            const itemId = `${category.id}-${i}`;
            const isExpanded = expandedItems.has(itemId);
            const imageUrl = itemImages.get(item.name);

            return (
              <MenuItemRow
                key={i}
                item={item}
                itemIndex={i}
                categoryId={category.id}
                itemId={item.name}
                isExpanded={isExpanded}
                imageUrl={imageUrl}
                onToggle={() => onToggleItem(itemId)}
                onUploadImage={onUploadImage}
                onDelete={() => onDeleteItem(i)}
                isOdd={i % 2 === 1}
                isDragging={dragIndex === i}
                isDropTarget={dropIndex === i && dragIndex !== null && dragIndex !== i}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => { e.preventDefault(); if (dragIndex !== i) setDropIndex(i); }}
                onDrop={() => {
                  if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
                    onReorderItem(dragIndex, dropIndex);
                  }
                  setDragIndex(null);
                  setDropIndex(null);
                }}
                onDragEnd={() => { setDragIndex(null); setDropIndex(null); }}
              />
            );
          })}
          {isEditMode && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddItem(); }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
            >
              <Plus size={12} />
              <span className="font-mono text-xs tracking-wide">ADD ITEM</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}


export default function MenuPage() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['sandwiches', 'salads']));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [itemImages, setItemImages] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { getText, updateText, isEditMode } = useContent();

  const hiddenCategories = getText('menu.hidden_categories', '').split(',').filter(Boolean);

  const dynamicCategories: MenuCategory[] = menuData.map(cat => {
    const count = parseInt(getText(`menu.${cat.id}.count`, String(cat.items.length)), 10);
    const items: MenuItem[] = Array.from({ length: count }, (_, i) => ({
      name: getText(`menu.${cat.id}.${i}.name`, cat.items[i]?.name ?? ''),
      price: getText(`menu.${cat.id}.${i}.price`, cat.items[i]?.price ?? '$0.00'),
      desc: getText(`menu.${cat.id}.${i}.desc`, cat.items[i]?.desc ?? ''),
      tag: getText(`menu.${cat.id}.${i}.tag`, cat.items[i]?.tag ?? '') || undefined,
      veg: cat.items[i]?.veg,
    }));
    return { ...cat, items };
  });

  const customCategoryIds = getText('menu.custom_category_ids', '').split(',').filter(Boolean);
  const customCategories: MenuCategory[] = customCategoryIds.map(id => {
    const label = getText(`menu.${id}.label`, id.toUpperCase());
    const count = parseInt(getText(`menu.${id}.count`, '0'), 10);
    const items: MenuItem[] = Array.from({ length: count }, (_, i) => ({
      name: getText(`menu.${id}.${i}.name`, ''),
      price: getText(`menu.${id}.${i}.price`, '$0.00'),
      desc: getText(`menu.${id}.${i}.desc`, ''),
      tag: getText(`menu.${id}.${i}.tag`, '') || undefined,
      veg: false,
    }));
    return { id, label, items };
  });

  const allCategories = [...dynamicCategories, ...customCategories].filter(
    cat => !hiddenCategories.includes(cat.id)
  );

  useEffect(() => {
    loadItemImages();
  }, []);

  const loadItemImages = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  const handleAddItem = (categoryId: string) => {
    const defaultCount = menuData.find(c => c.id === categoryId)?.items.length ?? 0;
    const currentCount = parseInt(getText(`menu.${categoryId}.count`, String(defaultCount)), 10);
    updateText(`menu.${categoryId}.${currentCount}.name`, 'NEW ITEM');
    updateText(`menu.${categoryId}.${currentCount}.price`, '$0.00');
    updateText(`menu.${categoryId}.${currentCount}.desc`, 'Description');
    updateText(`menu.${categoryId}.count`, String(currentCount + 1));
  };

  const handleDeleteItem = (categoryId: string, deleteIndex: number) => {
    const baseCat = menuData.find(c => c.id === categoryId);
    const defaultCount = baseCat?.items.length ?? 0;
    const currentCount = parseInt(getText(`menu.${categoryId}.count`, String(defaultCount)), 10);
    for (let i = deleteIndex; i < currentCount - 1; i++) {
      for (const field of MENU_ITEM_FIELDS) {
        const nextVal = getText(`menu.${categoryId}.${i + 1}.${field}`, String(baseCat?.items[i + 1]?.[field as keyof MenuItem] ?? ''));
        updateText(`menu.${categoryId}.${i}.${field}`, nextVal);
      }
    }
    for (const field of MENU_ITEM_FIELDS) {
      updateText(`menu.${categoryId}.${currentCount - 1}.${field}`, '');
    }
    updateText(`menu.${categoryId}.count`, String(currentCount - 1));
  };

  const handleDeleteCategory = (categoryId: string) => {
    const list = getText('menu.hidden_categories', '').split(',').filter(Boolean);
    if (!list.includes(categoryId)) {
      updateText('menu.hidden_categories', [...list, categoryId].join(','));
    }
  };

  const handleReorderItem = (categoryId: string, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const baseCat = menuData.find(c => c.id === categoryId);
    const defaultCount = baseCat?.items.length ?? 0;
    const count = parseInt(getText(`menu.${categoryId}.count`, String(defaultCount)), 10);
    const snapshot = Array.from({ length: count }, (_, i) =>
      Object.fromEntries(MENU_ITEM_FIELDS.map(field => [
        field,
        getText(`menu.${categoryId}.${i}.${field}`, String(baseCat?.items[i]?.[field as keyof MenuItem] ?? ''))
      ]))
    );
    const [moved] = snapshot.splice(fromIndex, 1);
    snapshot.splice(toIndex, 0, moved);
    snapshot.forEach((itemData, i) => {
      MENU_ITEM_FIELDS.forEach(field => {
        updateText(`menu.${categoryId}.${i}.${field}`, itemData[field] ?? '');
      });
    });
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const existingIds = getText('menu.custom_category_ids', '').split(',').filter(Boolean);
    if (!existingIds.includes(id)) {
      updateText('menu.custom_category_ids', [...existingIds, id].join(','));
    }
    updateText(`menu.${id}.label`, name.toUpperCase());
    updateText(`menu.${id}.count`, '0');
    setNewCategoryName('');
    setAddingCategory(false);
    setOpenCategories(prev => new Set([...prev, id]));
  };

  return (
    <div className="page-enter flex flex-col">
      <div className="lcd-title-bar px-3 py-2 flex items-center justify-between">
        <EditableField
          contentKey="menu.title"
          defaultValue="MENU"
          className="font-display text-2xl tracking-widest text-lcd-text-light"
        />
        <div className="text-right">
          <div className="font-mono text-xs text-lcd-bg opacity-70">TAP ITEM</div>
          <div className="font-mono text-xs text-lcd-bg opacity-70">TO EXPAND</div>
        </div>
      </div>

      <div className="bg-lcd-highlight border-b border-lcd-border py-1.5 flex items-center overflow-hidden">
        <div className="overflow-hidden flex-1 min-w-0">
          <StatusTicker contentKey="home.status.message" defaultValue="OPEN NOW · ORDERS READY IN ~10 MIN" />
        </div>
      </div>

      <div className="bg-lcd-highlight border-b border-lcd-border px-3 py-1.5">
        <span className="font-mono text-xs text-lcd-text-mid">V = Vegetarian · GF = Gluten Free</span>
      </div>

      <div className="flex-1">
        {!loading && allCategories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            isOpen={openCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
            expandedItems={expandedItems}
            onToggleItem={toggleItem}
            itemImages={itemImages}
            onUploadImage={handleUploadImage}
            onAddItem={() => handleAddItem(category.id)}
            onDeleteItem={(i) => handleDeleteItem(category.id, i)}
            onDeleteCategory={() => handleDeleteCategory(category.id)}
            onReorderItem={(from, to) => handleReorderItem(category.id, from, to)}
          />
        ))}
        {!loading && isEditMode && (
          <div className="border-b border-lcd-border">
            {addingCategory ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-lcd-highlight">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddCategory();
                    if (e.key === 'Escape') { setAddingCategory(false); setNewCategoryName(''); }
                  }}
                  placeholder="CATEGORY NAME"
                  autoFocus
                  className="flex-1 font-mono text-xs bg-transparent text-lcd-text border-b border-lcd-text outline-none placeholder:text-lcd-text-mid uppercase tracking-wide"
                />
                <button
                  onClick={handleAddCategory}
                  className="font-mono text-xs text-lcd-text hover:text-white transition-colors px-1"
                >
                  ADD
                </button>
                <button
                  onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
                  className="font-mono text-xs text-lcd-text-mid hover:text-lcd-text transition-colors"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingCategory(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
              >
                <Plus size={12} />
                <span className="font-mono text-xs tracking-wide">ADD CATEGORY</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-3 py-2 bg-lcd-highlight border-t border-lcd-border">
        <EditableField
          contentKey="menu.footer.line1"
          defaultValue="Prices subject to tax. Menu changes seasonally."
          as="p"
          className="font-mono text-xs text-lcd-text-mid text-center leading-relaxed"
          multiline
        />
        <EditableField
          contentKey="menu.footer.line2"
          defaultValue="Gluten-free bread available +$1.50."
          as="p"
          className="font-mono text-xs text-lcd-text-mid text-center leading-relaxed"
        />
      </div>
    </div>
  );
}
