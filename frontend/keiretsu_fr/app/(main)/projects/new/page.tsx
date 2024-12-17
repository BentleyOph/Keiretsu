'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProject } from "@/api/projects";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const projectSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    skills_required: z.string().optional(),
    is_open: z.boolean().default(true),
});

export default function NewProjectPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            description: "",
            skills_required: "",
            is_open: true,
        },
    });

    async function onSubmit(values: z.infer<typeof projectSchema>) {
        try {
            const response = await createProject(values);
            toast.success('Project created successfully');
            router.push(`/projects/${response.project_id}`);
        } catch (error) {
            toast.error('Failed to create project');
        }
    }

    return (
        <div className="container mx-auto p-6 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter project title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Describe your project"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="skills_required"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Required Skills</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="e.g., Python, AI, Data Analysis"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_open"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Open for collaborations
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Project</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
