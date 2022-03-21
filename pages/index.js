import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4 bg-custom">
      <img src="/escudo.jpeg" className="mb-4" />
      <Link href="/jugadores">
        <a className="btn mb-4 w-full md:w-3/4 lg:w-1/2 transition-all">
          Jugadores
        </a>
      </Link>
      <Link href="/deudas">
        <a className="btn mb-4 w-full md:w-3/4 lg:w-1/2 transition-all">
          Deudas
        </a>
      </Link>
      <Link href="/balance">
        <a className="btn w-full mb-4 md:w-3/4 lg:w-1/2 transition-all">
          Balance
        </a>
      </Link>
      <Link href="/admin">
        <a className="btn w-full md:w-3/4 lg:w-1/2 transition-all">
          Administrador
        </a>
      </Link>
    </div>
  );
}
