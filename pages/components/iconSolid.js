export default function IconSolid({ svg }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fill-rule="evenodd" d={svg} clip-rule="evenodd" />
    </svg>
  );
}
