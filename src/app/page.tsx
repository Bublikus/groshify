import Image from "next/image";
import icon from "@/public/favicon/android-chrome-192x192.png";
import { ExpensesTable } from "@/components/ExpensesTable";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Image src={icon} alt="Groshify" width={48} height={48} priority />
            <h1 className="text-3xl font-bold">Groshify</h1>
          </div>
          <ThemeToggle />
        </header>
        
        <main className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Personal Finance Management</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take control of your finances with Groshify. Upload your expense files and track your spending with ease.
            </p>
          </div>
          
          <ExpensesTable />
        </main>
      </div>
    </div>
  );
}
