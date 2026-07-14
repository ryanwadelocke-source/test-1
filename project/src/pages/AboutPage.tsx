import { Award, Heart, Leaf, Users, Star, Zap, Shield, Globe, Coffee, Truck, Plus, Trash2 } from 'lucide-react';
import EditableField from '../components/EditableField';
import { useContent } from '../contexts/ContentContext';

const ICONS: Record<string, React.ElementType> = {
  Leaf, Heart, Users, Award, Star, Zap, Shield, Globe, Coffee, Truck,
};

const defaultTeam = [
  { name: 'Claire Whitmore', role: 'Founder & Head Chef', since: "SINCE '97", notes: 'CIA grad · Chez Panisse alum' },
  { name: 'Thomas Abernathy', role: 'Sandwich Program Lead', since: "SINCE '00", notes: 'Baker · bread obsessive' },
  { name: 'Rosa Delgado', role: 'Salads & Seasonal Menu', since: "SINCE '03", notes: 'Farmers market devotee' },
  { name: 'James Park', role: 'Catering & Operations', since: "SINCE '99", notes: 'Keeps the whole thing running' },
];

const defaultMilestones = [
  { year: '1997', text: 'Opened as a 4-table sandwich counter on Lark Lane.' },
  { year: '1999', text: 'SF Chronicle names us "Best Lunch Spot in SoMa"' },
  { year: '2001', text: 'Launched catering — first client: a 300-person tech IPO' },
  { year: '2004', text: 'Added seasonal salad menu; sourcing from 6 local farms' },
  { year: '2008', text: 'Survived the downturn — loyal regulars kept us going' },
  { year: '2015', text: 'Opened weekday breakfast service, house-made pastries' },
  { year: '2024', text: 'Voted Best Takeout Sandwich by SF Eater readers' },
];

const defaultValues = [
  { icon: 'Leaf', label: 'SEASONAL FIRST', text: 'Menu rotates with the farmers market. If it\'s not in season, it\'s not on the menu.' },
  { icon: 'Heart', label: 'MADE IN-HOUSE', text: 'Breads baked daily. Dressings, spreads, and cured meats all made from scratch.' },
  { icon: 'Users', label: 'LOCAL SOURCING', text: 'Partnered with 9 Bay Area farms. Meat and dairy are humanely raised, always.' },
  { icon: 'Award', label: 'RECOGNIZED', text: '5-time SF Chronicle Top 100, Zagat "Neighborhood Gem" 2019 & 2022.' },
];

const storyParagraphs = [
  'In the spring of 1997, Claire Whitmore left her line cook position at Chez Panisse, rented a narrow space on Lark Lane, and opened a sandwich counter with four stools and a chalkboard menu.',
  'The idea was simple: take the same care given to a fine dining plate and apply it to a sandwich. Source good bread. Find the best local ingredients. Change the menu when the season changes.',
  'Nearly three decades later, Lark Fine Foods still operates from that same narrow space — a little bigger now, a lot busier, but the chalkboard is still there.',
];

const VALUE_FIELDS = ['label', 'text', 'icon'];
const TEAM_FIELDS = ['name', 'role', 'since', 'notes'];
const MILESTONE_FIELDS = ['year', 'text'];
const ICON_NAMES = Object.keys(ICONS);

export default function AboutPage() {
  const { getText, updateText, isEditMode } = useContent();

  // Values
  const valueCount = parseInt(getText('about.values.count', String(defaultValues.length)), 10);
  const dynamicValues = Array.from({ length: valueCount }, (_, i) => ({
    icon: getText(`about.values.${i}.icon`, defaultValues[i]?.icon ?? 'Star'),
    label: getText(`about.values.${i}.label`, defaultValues[i]?.label ?? ''),
    text: getText(`about.values.${i}.text`, defaultValues[i]?.text ?? ''),
  }));

  const handleAddValue = () => {
    updateText(`about.values.${valueCount}.icon`, 'Star');
    updateText(`about.values.${valueCount}.label`, 'NEW VALUE');
    updateText(`about.values.${valueCount}.text`, 'Describe this value.');
    updateText('about.values.count', String(valueCount + 1));
  };

  const handleDeleteValue = (deleteIndex: number) => {
    for (let i = deleteIndex; i < valueCount - 1; i++) {
      for (const field of VALUE_FIELDS) {
        updateText(`about.values.${i}.${field}`, getText(`about.values.${i + 1}.${field}`, defaultValues[i + 1]?.[field as keyof typeof defaultValues[0]] ?? ''));
      }
    }
    for (const field of VALUE_FIELDS) updateText(`about.values.${valueCount - 1}.${field}`, '');
    updateText('about.values.count', String(valueCount - 1));
  };

  const cycleIcon = (index: number, currentIcon: string) => {
    const nextIcon = ICON_NAMES[(ICON_NAMES.indexOf(currentIcon) + 1) % ICON_NAMES.length];
    updateText(`about.values.${index}.icon`, nextIcon);
  };

  // Team
  const teamCount = parseInt(getText('about.team.count', String(defaultTeam.length)), 10);
  const dynamicTeam = Array.from({ length: teamCount }, (_, i) => ({
    name: getText(`about.team.${i}.name`, defaultTeam[i]?.name ?? ''),
    role: getText(`about.team.${i}.role`, defaultTeam[i]?.role ?? ''),
    since: getText(`about.team.${i}.since`, defaultTeam[i]?.since ?? "SINCE '00"),
    notes: getText(`about.team.${i}.notes`, defaultTeam[i]?.notes ?? ''),
  }));

  const handleAddTeamMember = () => {
    updateText(`about.team.${teamCount}.name`, 'NEW MEMBER');
    updateText(`about.team.${teamCount}.role`, 'Role');
    updateText(`about.team.${teamCount}.since`, "SINCE '25");
    updateText(`about.team.${teamCount}.notes`, 'Notes');
    updateText('about.team.count', String(teamCount + 1));
  };

  const handleDeleteTeamMember = (deleteIndex: number) => {
    for (let i = deleteIndex; i < teamCount - 1; i++) {
      for (const field of TEAM_FIELDS) {
        updateText(`about.team.${i}.${field}`, getText(`about.team.${i + 1}.${field}`, defaultTeam[i + 1]?.[field as keyof typeof defaultTeam[0]] ?? ''));
      }
    }
    for (const field of TEAM_FIELDS) updateText(`about.team.${teamCount - 1}.${field}`, '');
    updateText('about.team.count', String(teamCount - 1));
  };

  // Milestones
  const milestoneCount = parseInt(getText('about.milestones.count', String(defaultMilestones.length)), 10);
  const dynamicMilestones = Array.from({ length: milestoneCount }, (_, i) => ({
    year: getText(`about.milestones.${i}.year`, defaultMilestones[i]?.year ?? ''),
    text: getText(`about.milestones.${i}.text`, defaultMilestones[i]?.text ?? ''),
  }));

  const handleAddMilestone = () => {
    updateText(`about.milestones.${milestoneCount}.year`, '2025');
    updateText(`about.milestones.${milestoneCount}.text`, 'Describe this milestone.');
    updateText('about.milestones.count', String(milestoneCount + 1));
  };

  const handleDeleteMilestone = (deleteIndex: number) => {
    for (let i = deleteIndex; i < milestoneCount - 1; i++) {
      for (const field of MILESTONE_FIELDS) {
        updateText(`about.milestones.${i}.${field}`, getText(`about.milestones.${i + 1}.${field}`, defaultMilestones[i + 1]?.[field as keyof typeof defaultMilestones[0]] ?? ''));
      }
    }
    for (const field of MILESTONE_FIELDS) updateText(`about.milestones.${milestoneCount - 1}.${field}`, '');
    updateText('about.milestones.count', String(milestoneCount - 1));
  };

  return (
    <div className="page-enter flex flex-col">
      <div className="lcd-title-bar px-3 py-2">
        <EditableField
          contentKey="about.title"
          defaultValue="ABOUT US"
          as="div"
          className="font-display text-2xl tracking-widest text-lcd-text-light"
        />
        <EditableField
          contentKey="about.header.subtitle"
          defaultValue="Est. 1997 · San Francisco"
          as="div"
          className="font-mono text-xs text-lcd-bg opacity-70 mt-0.5"
        />
      </div>

      {/* Story */}
      <div className="lcd-section-header px-3 py-1.5">
        <EditableField
          contentKey="about.story.header"
          defaultValue="OUR STORY"
          className="text-sm tracking-widest"
        />
      </div>
      <div className="px-3 py-3 border-b border-lcd-border space-y-2">
        {storyParagraphs.map((para, i) => (
          <EditableField
            key={i}
            contentKey={`about.story.${i}`}
            defaultValue={para}
            as="p"
            className="font-mono text-xs text-lcd-text leading-relaxed"
            multiline
          />
        ))}
      </div>

      {/* Values */}
      <div className="lcd-section-header px-3 py-1.5">
        <EditableField
          contentKey="about.values.header"
          defaultValue="OUR VALUES"
          className="text-sm tracking-widest"
        />
      </div>
      {dynamicValues.map(({ icon, label, text }, i) => {
        const Icon = ICONS[icon] ?? Star;
        return (
          <div key={i} className={`lcd-item-row flex items-start gap-3 px-3 py-2.5 ${i % 2 === 0 ? '' : 'bg-lcd-stripe'}`}>
            <button
              onClick={() => isEditMode && cycleIcon(i, icon)}
              className={`flex-shrink-0 w-7 h-7 flex items-center justify-center mt-0.5 ${isEditMode ? 'ring-1 ring-lcd-border hover:ring-lcd-bg cursor-pointer' : 'cursor-default'}`}
              style={{ background: '#1c2810' }}
              title={isEditMode ? `Icon: ${icon} (click to cycle)` : undefined}
            >
              <Icon size={13} className="text-lcd-bg" />
            </button>
            <div className="flex-1 min-w-0">
              <EditableField
                contentKey={`about.values.${i}.label`}
                defaultValue={label}
                as="div"
                className="font-mono text-xs font-bold text-lcd-text tracking-wider"
              />
              <EditableField
                contentKey={`about.values.${i}.text`}
                defaultValue={text}
                as="div"
                className="font-mono text-xs text-lcd-text-mid mt-0.5 leading-relaxed"
                multiline
              />
            </div>
            {isEditMode && (
              <button
                onClick={() => handleDeleteValue(i)}
                className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 transition-colors mt-0.5"
                title="Remove value"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        );
      })}
      {isEditMode && (
        <button
          onClick={handleAddValue}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
        >
          <Plus size={12} />
          <span className="font-mono text-xs tracking-wide">ADD VALUE</span>
        </button>
      )}

      {/* Team */}
      <div className="lcd-section-header px-3 py-1.5">
        <EditableField
          contentKey="about.team.header"
          defaultValue="THE TEAM"
          className="text-sm tracking-widest"
        />
      </div>
      {dynamicTeam.map((member, i) => (
        <div key={i} className={`lcd-item-row flex items-center justify-between px-3 py-2.5 ${i % 2 === 0 ? '' : 'bg-lcd-stripe'}`}>
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="lcd-arrow-right mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <EditableField
                contentKey={`about.team.${i}.name`}
                defaultValue={member.name}
                as="div"
                className="font-mono text-sm text-lcd-text"
              />
              <EditableField
                contentKey={`about.team.${i}.role`}
                defaultValue={member.role}
                as="div"
                className="font-mono text-xs text-lcd-text-mid"
              />
              <EditableField
                contentKey={`about.team.${i}.notes`}
                defaultValue={member.notes}
                as="div"
                className="font-mono text-lcd-text-mid"
                style={{ fontSize: '10px' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <EditableField
              contentKey={`about.team.${i}.since`}
              defaultValue={member.since}
              className="px-1.5"
              style={{ background: '#1c2810', color: '#cdd9a4', fontFamily: "'VT323', monospace", fontSize: '14px', letterSpacing: '0.08em', lineHeight: '1.4' }}
            />
            {isEditMode && (
              <button
                onClick={() => handleDeleteTeamMember(i)}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Remove member"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      ))}
      {isEditMode && (
        <button
          onClick={handleAddTeamMember}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
        >
          <Plus size={12} />
          <span className="font-mono text-xs tracking-wide">ADD MEMBER</span>
        </button>
      )}

      {/* Milestones */}
      <div className="lcd-section-header px-3 py-1.5">
        <EditableField
          contentKey="about.milestones.header"
          defaultValue="MILESTONES"
          className="text-sm tracking-widest"
        />
      </div>
      {dynamicMilestones.map((m, i) => (
        <div key={i} className={`lcd-item-row flex items-start gap-3 px-3 py-2 ${i % 2 === 0 ? '' : 'bg-lcd-stripe'}`}>
          <EditableField
            contentKey={`about.milestones.${i}.year`}
            defaultValue={m.year}
            className="font-display text-base text-lcd-text-light flex-shrink-0 px-1"
            style={{ background: '#1c2810' }}
          />
          <EditableField
            contentKey={`about.milestones.${i}.text`}
            defaultValue={m.text}
            className="font-mono text-xs text-lcd-text leading-relaxed flex-1"
          />
          {isEditMode && (
            <button
              onClick={() => handleDeleteMilestone(i)}
              className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Remove milestone"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
      {isEditMode && (
        <button
          onClick={handleAddMilestone}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border-b border-lcd-border text-lcd-text-mid hover:text-lcd-text hover:bg-lcd-highlight transition-colors"
        >
          <Plus size={12} />
          <span className="font-mono text-xs tracking-wide">ADD MILESTONE</span>
        </button>
      )}

      <div className="px-3 py-3 bg-lcd-highlight border-t border-lcd-border text-center">
        <EditableField
          contentKey="about.footer.quote"
          defaultValue="Good food. Good bread. No shortcuts."
          as="p"
          className="font-mono text-xs text-lcd-text-mid leading-relaxed"
          multiline
        />
        <EditableField
          contentKey="about.footer.attribution"
          defaultValue="— Claire Whitmore"
          className="font-display text-base text-lcd-text"
        />
      </div>
    </div>
  );
}
