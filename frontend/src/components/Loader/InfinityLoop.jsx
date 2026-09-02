const InfinityLoop = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path
      d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray="205.27 51.32"
      className="infinity-loader-path"
    />
  </svg>
);

export { InfinityLoop };
