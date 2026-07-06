const Toast = ({ msg, type = "success", onClose }) => (
  <div
    className={`onyx-toast onyx-toast-${type}`}
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    {/* Icon */}
    <span className="flex-shrink-0 text-base leading-none" aria-hidden="true">
      {type === "success" ? "✓" : "✕"}
    </span>
    <span className="flex-1 min-w-0">{msg}</span>
    <button
      className="onyx-toast-close"
      onClick={onClose}
      aria-label="Dismiss notification"
      type="button"
    >
      ×
    </button>
  </div>
);

export default Toast;
