'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { logout } from "@/api/login";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await logout();
			toast.success('Logged out successfully');
			router.push('/auth');
			router.refresh();
		} catch (error) {
			toast.error('Failed to logout');
		}
	};

	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link
					href="#"
					className="flex items-center gap-2 text-lg font-semibold md:text-base"
				>
					<Package2 className="h-6 w-6" />
					<span className="sr-only">Acme Inc</span>
				</Link>
				<Link
					href="/"
					className="text-foreground transition-colors hover:text-foreground"
				>
					Dashboard
				</Link>
				<Link
					href="/collaborations"
					className="text- transition-colors hover:text-foreground"
				>
					Collaborations
				</Link>
				<Link
					href="/resources"
					className="text- transition-colors hover:text-foreground"
				>
					Resources
				</Link>
				<Link
					href="/requests"
					className="text- transition-colors hover:text-foreground"
				>
					Requests
				</Link>
				
				<Link
					href="/projects"
					className="text- transition-colors hover:text-foreground"
				>
					Projects
				</Link>
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<Link
							href="#"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<Package2 className="h-6 w-6" />
							<span className="sr-only">Acme Inc</span>
						</Link>
						<Link href="/" className="hover:text-foreground">
							Dashboard
						</Link>
						<Link href="/collaborations" className="text- hover:text-foreground">
							Collaborators
						</Link>
						<Link href="/resources" className="text- hover:text-foreground">
							Resources
						</Link>
						<Link href="/requests" className="text- hover:text-foreground">
							Requests
						</Link>
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<Button asChild className="ml-auto flex-1 sm:flex-initial">
					<Link href="/search" className="gap-2 items-center inline-flex">
						<Search className="h-4 w-4" />
						Look for collaborators
					</Link>
				</Button>
				<ModeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon" className="rounded-full">
							<CircleUser className="h-5 w-5" />
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link href="/me">Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
