function ErrorMessage({ message, detail, onRetry }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: "1px solid #fecaca",
        backgroundColor: "#fee2e2",
        margin: "16px 0",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{message}</div>
      {detail && (
        <div style={{ fontSize: 13, marginBottom: 8 }}>{detail}</div>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #b91c1c",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Zkusit znovu
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;