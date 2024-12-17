'use client';

import { useState, useEffect } from 'react';
import { getProjects, sendProjectCollaborationRequest } from '@/api/projects';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

interface Project {
    project_id: number;
    title: string;
    description: string;
    required_skills: string;
    owner_info: {
        name: string;
        email: string;
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filters, setFilters] = useState({
        title: '',
        skills: '',
        owner: ''
    });
    const [loading, setLoading] = useState(false);
    const [requestingProject, setRequestingProject] = useState<number | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await getProjects(filters);
            setProjects(results);
        } catch (err) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async (projectId: number) => {
        setRequestingProject(projectId);
        try {
            await sendProjectCollaborationRequest(projectId);
            toast.success('Collaboration request sent successfully!');
        } catch (err) {
            toast.error('Failed to send collaboration request');
        } finally {
            setRequestingProject(null);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-heading">Browse Projects</h1>
                    <Button asChild>
                        <Link href="/projects/new">
                            Create Project
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Project title"
                        value={filters.title}
                        onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="Required skills"
                        value={filters.skills}
                        onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="Owner name"
                        value={filters.owner}
                        onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
                        className="max-w-xs"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.project_id}>
                        <CardHeader>
                            <CardTitle>{project.title}</CardTitle>
                            <CardDescription>
                                <div className="space-y-2">
                                    <p>{project.description}</p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Required Skills:</strong> {project.required_skills}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Owner:</strong> {project.owner_info.name}
                                    </p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={`/projects/${project.project_id}`}>
                                    View Project
                                </Link>
                            </Button>
                            <Button 
                                onClick={() => handleJoinRequest(project.project_id)}
                                disabled={requestingProject === project.project_id}
                            >
                                {requestingProject === project.project_id ? 'Sending...' : 'Ask to Join'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
