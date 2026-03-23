import { useTranslation } from 'react-i18next';

export default function ErrorBanner({ message, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2">
      <span className="text-red-700">{message || t('common.error')}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 font-medium text-xs whitespace-nowrap"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
