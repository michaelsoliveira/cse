import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import LoginBadge from "@/features/auth/components/login-badge";
import { auth } from "@/lib/auth";
import { Fingerprint } from "lucide-react";
import Link from "next/link";

const Navbar = async () => {
	const session = await auth();
	return (
		<nav className="gap-6 text-lg font-medium flex flex-row min-w-full items-center justify-between md:gap-5 md:text-sm lg:gap-6">
			<div className="flex flex-row w-full gap-4">
				<Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
					<Fingerprint className="h-6 w-6 text-green-500" />
					<span className="sr-only">{"DeveloperDeck101 - Authjs"}</span>
				</Link>
				<Link href="#" className="text-foreground transition-colors hover:text-foreground">
					{"HOME"}
				</Link>
				<Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground min-w-fit z-50">
					{"Dashboard"}
				</Link>
			</div>

			<div className="flex  items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 ">
				<LoginBadge user={session?.user} />
				<ThemeToggle />
			</div>
		</nav>
	);
};

export default Navbar;