import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('no') || i18n.language?.startsWith('nb') ? 'no' : 'en';

  return (
    <div className="flex text-xs border border-gray-200 rounded overflow-hidden">
      <button
        onClick={() => i18n.changeLanguage('no')}
        className={`px-2 py-1 ${current === 'no' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
      >
        NO
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-2 py-1 ${current === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
      >
        EN
      </button>
    </div>
  );
}
