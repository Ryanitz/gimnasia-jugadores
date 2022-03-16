import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4">
      <Link href="/jugadores">
        <a className="btn mb-4 w-full md:w-1/2">Jugadores</a>
      </Link>
      <Link href="/deudas">
        <a className="btn mb-4 w-full md:w-1/2">Deudas</a>
      </Link>
      <Link href="/balance">
        <a className="btn w-full mb-4 md:w-1/2">Balance</a>
      </Link>
      <Link href="/admin">
        <a className="btn w-full md:w-1/2">Administrador</a>
      </Link>
    </div>
  );
}
