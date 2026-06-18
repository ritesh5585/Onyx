export const Spinner = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0a0a",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: "3px solid #333",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    <p
      style={{
        color: "#666",
        fontSize: 11,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        margin: 0,
      }}
    >
      Onyx
    </p>
  </div>
);
