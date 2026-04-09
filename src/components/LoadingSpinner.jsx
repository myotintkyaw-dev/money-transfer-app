function LoadingSpinner({
  sizeClass = "h-5 w-5",
  colorClass = "border-white border-t-white/30",
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 ${sizeClass} ${colorClass}`}
    />
  );
}

export default LoadingSpinner;
