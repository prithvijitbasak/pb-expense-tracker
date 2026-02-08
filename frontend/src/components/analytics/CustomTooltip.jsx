const CustomTooltip = ({ active, payload, label }) => {
  // Tooltip should render only when hovered and payload exists
  if (!active || !payload || payload.length === 0) return null;

  // Filter out categories with value <= 0
  const filteredPayload = payload.filter((entry) => entry.value > 0);

  // If after filtering nothing remains, don't show tooltip at all
  if (filteredPayload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        padding: "10px 12px",
      }}
    >
      {/* Day label */}
      <p style={{ fontWeight: 600, marginBottom: 6 }}>{label}</p>

      {/* Only categories with value > 0 */}
      {filteredPayload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            color: entry.color,
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <span>{entry.name}</span>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;