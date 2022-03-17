export default function IconSolid({ svg }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path fillRule="evenodd" d={svg} clipRule="evenodd" />
    </svg>
  );
}
