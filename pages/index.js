export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center px-4">
      <a href="/jugadores" className="btn mb-4 w-full md:w-1/2">
        Jugadores
      </a>
      <a href="/admin" className="btn w-full md:w-1/2">
        Administrador
      </a>
    </div>
  );
}
