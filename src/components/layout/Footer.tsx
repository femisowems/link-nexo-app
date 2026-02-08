export function Footer() {
    return (
        <footer className="w-full text-center py-8 text-xs text-muted-foreground">
            <p>
                &copy; {new Date().getFullYear()} Link-Nexo. Built with Next.js & Tailwind.
            </p>
        </footer>
    );
}
