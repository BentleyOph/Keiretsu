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
import { createResource } from "@/api/resources";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const resourceSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.string().min(2, "Type must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function NewResourcePage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof resourceSchema>>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            name: "",
            type: "",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof resourceSchema>) {
        try {
            await createResource(values);
            toast.success('Resource created successfully');
            router.push('/resources');
        } catch (error) {
            toast.error('Failed to create resource');
        }
    }

    return (
        <div className="container mx-auto p-6 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>List a New Resource</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resource Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter resource name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resource Type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter resource type" {...field} />
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
                                                placeholder="Describe your resource"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Resource</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
