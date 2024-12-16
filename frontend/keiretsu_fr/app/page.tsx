import Link from "next/link";
import {
	Activity,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { TypographyH1 } from "@/components/TypographyH1";

export const description =
	"An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export default function Dashboard() {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				<div className="grid gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-4">
					<TypographyH1 text={`Welcome,  Bentley`}></TypographyH1>
					<Card x-chunk="dashboard-01-chunk-3" className="col-start-3">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Ongoing Projects
							</CardTitle>
							<Activity className="text- h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">5</div>
							<p className="text- text-xs">+2 since last month</p>
						</CardContent>
					</Card>
					<Card x-chunk="dashboard-01-chunk-1" className="col-start-4">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Pending Requests
							</CardTitle>
							<Users className="text- h-4 w-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">12</div>
							<p className="text- text-xs">+3 since yesterday</p>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
					<Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
						<CardHeader className="flex flex-row items-center">
							<div className="grid gap-2">
								<CardTitle>Collaborations</CardTitle>
								<CardDescription>Recent collaborations.</CardDescription>
							</div>
							<Button asChild size="sm" className="ml-auto gap-1">
								<Link href="#">
									View All
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							</Button>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-lg text-black">Name</TableHead>
										<TableHead className="hidden xl:table-column">
											Type
										</TableHead>
										<TableHead className="hidden xl:table-column">
											Status
										</TableHead>
										<TableHead className="hidden xl:table-column">
											Date
										</TableHead>
										<TableHead className="text-right text-lg text-text">
											Type
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>
											<div className="font-medium">Liam Johnson</div>
											<div className="text- hidden text-sm md:inline">
												liam@example.com
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											Sale
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												Approved
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											2023-06-23
										</TableCell>
										<TableCell className="text-right">project</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="font-medium">Olivia Smith</div>
											<div className="text- hidden text-sm md:inline">
												olivia@example.com
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											Refund
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												Declined
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											2023-06-24
										</TableCell>
										<TableCell className="text-right">collaborator</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="font-medium">Noah Williams</div>
											<div className="text- hidden text-sm md:inline">
												noah@example.com
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											Subscription
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												Approved
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											2023-06-25
										</TableCell>
										<TableCell className="text-right">project</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="font-medium">Emma Brown</div>
											<div className="text- hidden text-sm md:inline">
												emma@example.com
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											Sale
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												Approved
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											2023-06-26
										</TableCell>
										<TableCell className="text-right">collaborator</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<div className="font-medium">Liam Johnson</div>
											<div className="text- hidden text-sm md:inline">
												liam@example.com
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											Sale
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												Approved
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											2023-06-27
										</TableCell>
										<TableCell className="text-right">project</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
					<Card x-chunk="dashboard-01-chunk-5">
						<CardHeader className="flex flex-row items-center">
							<div className="grid gap-2">
								<CardTitle>Resources</CardTitle>
								<CardDescription>Accessed resources.</CardDescription>
							</div>

							<Button asChild size="sm" className="ml-auto gap-1">
								<Link href="#">
									View All
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							</Button>
						</CardHeader>

						<CardContent className="grid gap-8">
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/01.png" alt="Avatar" />
									<AvatarFallback>OM</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Olivia Martin
									</p>
									<p className="text- text-sm">olivia.martin@email.com</p>
								</div>
								<div className="ml-auto font-medium">$1,999.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/02.png" alt="Avatar" />
									<AvatarFallback>JL</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Jackson Lee
									</p>
									<p className="text- text-sm">jackson.lee@email.com</p>
								</div>
								<div className="ml-auto font-medium">$39.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/03.png" alt="Avatar" />
									<AvatarFallback>IN</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Isabella Nguyen
									</p>
									<p className="text- text-sm">isabella.nguyen@email.com</p>
								</div>
								<div className="ml-auto font-medium">$299.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/04.png" alt="Avatar" />
									<AvatarFallback>WK</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										William Kim
									</p>
									<p className="text- text-sm">will@email.com</p>
								</div>
								<div className="ml-auto font-medium">$99.00</div>
							</div>
							<div className="flex items-center gap-4">
								<Avatar className="hidden h-9 w-9 sm:flex">
									<AvatarImage src="/avatars/05.png" alt="Avatar" />
									<AvatarFallback>SD</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<p className="text-sm font-medium leading-none">
										Sofia Davis
									</p>
									<p className="text- text-sm">sofia.davis@email.com</p>
								</div>
								<div className="ml-auto font-medium">$39.00</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
