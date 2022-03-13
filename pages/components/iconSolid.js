export default function IconSolid({ svg }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d={svg} clipRule="evenodd" />
    </svg>
  );
}
