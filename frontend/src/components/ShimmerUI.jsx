import "../assets/styles/ShimmerUI.css";

const ShimmerBar = () => {
  return <div className="shimmer-bar"></div>;
};

const ShimmerGrid = () => {
  return (
    <div className="shimmer-grid">
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
      <div className="shimmer-grid-box"></div>
    </div>
  );
};

export { ShimmerBar, ShimmerGrid };
