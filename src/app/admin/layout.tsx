
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import Link from "next/link";
import { Hexagon, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto w-full">
                    <div className="flex gap-6 md:gap-10 items-center">
                        <Link href="/admin" className="flex items-center space-x-2.5 transition-opacity hover:opacity-80">
                            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                                <Hexagon className="h-5 w-5 text-primary" />
                            </div>
                            <span className="font-bold inline-block text-lg tracking-tight">Link-Nexo</span>
                        </Link>

                        <nav className="hidden md:flex gap-6">
                            <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                                <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/admin/profiles" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                                <Users className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span>My Profiles</span>
                            </Link>
                            <Link href="/admin/settings" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span>Settings</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-medium text-foreground hidden sm:inline-block truncate max-w-[200px]" title={session.user?.email || ""}>
                                {session.user?.email}
                            </span>

                            <form
                                action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/login" });
                                }}
                            >
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-destructive/10 text-destructive h-9 px-4 py-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
