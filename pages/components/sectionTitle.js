import Link from "next/link";
import IconOutline from "./iconOutline";

export default function SectionTitle({ title }) {
  return (
    <div className="flex w-full items-center">
      <Link href="/">
        <a>
          <IconOutline svg="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </a>
      </Link>
      <h2 className="w-full my-4 text-2xl font-bold text-center">{title}</h2>
    </div>
  );
}
