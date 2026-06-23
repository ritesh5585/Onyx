
const Toast = ({ msg, type = "success", onClose }) => (
  <div className={`onyx-toast onyx-toast-${type}`} role="alert">
    <span>{type === "success" ? "✓" : "✕"}</span>
    <span>{msg}</span>
    <button className="onyx-toast-close" onClick={onClose} aria-label="Dismiss">
      ×
    </button>
  </div>
);

export default Toast;
