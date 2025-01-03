import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from 'sonner';


const fontSans = FontSans({
	subsets:["latin"],
	variable: "--font-sans",
})


export const metadata: Metadata = {
	title: "Keiretsu",
	description: "An open collaboration platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning >
			<body
			className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}
			>
				<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange
				>
				{children}
				<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
