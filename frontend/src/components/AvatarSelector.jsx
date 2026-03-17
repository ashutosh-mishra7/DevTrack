import { CheckCircle } from 'lucide-react';

const avatars = [1, 2, 3, 4, 5, 6, 7, 8];

const AvatarSelector = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--color-darkslate)]">
        Choose Avatar (Required)
      </label>
      <div className="grid grid-cols-4 gap-4">
        {avatars.map((id) => (
          <div 
            key={id}
            onClick={() => onSelect(id)}
            className={`cursor-pointer rounded-full relative transition-all duration-200 aspect-square flex items-center justify-center p-1
            ${selected === id ? 'ring-4 ring-[var(--color-steelblue)] scale-110' : 'hover:scale-105 hover:bg-[var(--color-softblue)]/30'}
            bg-[var(--color-warmbeige)]`}
          >
            <img 
              src={`/avatars/${id}.png`} 
              alt={`Avatar ${id}`} 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback to beautiful default dicebear bots so the UI never breaks
                e.target.onerror = null; 
                e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=Avatar${id}`;
              }}
            />
            {selected === id && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full text-[var(--color-steelblue)] shadow-sm">
                <CheckCircle size={20} fill="currentColor" className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
