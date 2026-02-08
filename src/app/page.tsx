import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Link-Nexo
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        The premium, open-source link-in-bio solution.
        <br />Fast, accessible, and beautiful by default.
      </p>

      <div className="flex gap-4">
        <Link
          href="/sarah.dev"
          className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          View Demo Profile <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-12 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
        <p>Try accessing any handle: <code>/your-name</code></p>
      </div>
    </div>
  );
}
