function LoadingIndicator({ text = "Načítám..." }) {
  return (
    <div
      style={{
        padding: 16,
        textAlign: "center",
        fontSize: 14,
        color: "#4b5563",
      }}
    >
      {text}
    </div>
  );
}

export default LoadingIndicator;