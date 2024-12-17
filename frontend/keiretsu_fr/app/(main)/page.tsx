import Link from "next/link";
import {
	Activity,
	ArrowUpRight,
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



//my imports
import UserDisplay from "@/components/UserDisplay";
import { getCollabs } from "@/api/all_collabs";
import { getOwnedResources, getSharedResources } from "@/api/resources";

interface Resource {
    resource_id: number;
    name: string;
    description: string;
    resource_type: string;
    created_at: string;
}

export const description =
	"An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export default async function Dashboard() {
	const collaborations = await getCollabs();
    const ownedResources = await getOwnedResources();
    const sharedResources = await getSharedResources();
    const allResources = [...ownedResources, ...sharedResources].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, 5); // Get only the 5 most recent resources

	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				<div className="grid gap-4 md:grid-cols-4 md:gap-8 lg:grid-cols-4">
					<UserDisplay />
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
								<Link href="/collaborations">
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
										<TableHead className="hidden xl:table-column">Email</TableHead>
										<TableHead className="text-right text-lg text-text">Type</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{collaborations.map((collab) => (
										<TableRow key={collab.collaboration_id}>
											<TableCell>
												<div className="font-medium">{collab.collaborator.name}</div>
											</TableCell>
											<TableCell className="hidden xl:table-cell">
												{collab.collaborator.email}
											</TableCell>
											<TableCell className="text-right">
												{collab.collaborator.role}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
					<Card x-chunk="dashboard-01-chunk-5">
						<CardHeader className="flex flex-row items-center">
							<div className="grid gap-2">
								<CardTitle>Resources</CardTitle>
								<CardDescription>Owned resources</CardDescription>
							</div>
							<Button asChild size="sm" className="ml-auto gap-1">
								<Link href="/resources">
									View More
									<ArrowUpRight className="h-4 w-4" />
								</Link>
							</Button>
						</CardHeader>

						<CardContent className="grid gap-6">
                            {allResources.map((resource) => (
                                <div key={resource.resource_id} className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarFallback>
                                            {resource.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            {resource.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {resource.description}
                                        </p>
                                    </div>
                                    <Badge className="ml-auto" variant="outline">
                                        {resource.resource_type}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
