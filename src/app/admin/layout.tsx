
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth"; // Use server action for signout? No, import from auth config

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b p-4 flex justify-between items-center bg-background/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex gap-4 items-center">
                    <div className="font-bold text-lg">Link-Nexo Admin</div>
                    <nav className="ml-4 border-l pl-4 hidden md:flex gap-4">
                        <a href="/admin" className="text-sm font-medium hover:text-primary">Dashboard</a>
                        <a href="/admin/profiles" className="text-sm font-medium hover:text-primary">My Profiles</a>
                    </nav>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{session.user?.email}</span>

                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/login" });
                        }}
                    >
                        <button
                            type="submit"
                            className="text-sm font-medium hover:underline text-destructive"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
