import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function DomainNotVerifiedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
            <div className="p-4 bg-amber-500/10 text-amber-600 rounded-full mb-2">
                <AlertTriangle className="w-10 h-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Domain Not Verified
            </h1>

            <p className="text-muted-foreground max-w-[400px]">
                This custom domain is pointing to Link-Nexo but has not been verified by the owner yet.
            </p>

            <div className="pt-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                    Go to Link-Nexo Home <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </div>
    );
}
