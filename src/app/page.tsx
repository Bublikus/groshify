import Image from "next/image";
import icon from "./android-chrome-192x192.png";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Groshify</h1>
        <Image src={icon} alt="Groshify" width={192} height={192} priority />
      </main>
    </div>
  );
}
