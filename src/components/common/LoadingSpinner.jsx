export default function LoadingSpinner({ text, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      {text && <span>{text}</span>}
    </div>
  );
}
