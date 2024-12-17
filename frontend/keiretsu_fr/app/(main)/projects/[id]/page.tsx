'use client';

import { useEffect, useState } from 'react';
import { getProjectDetails } from '@/api/projects';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProjectDetails({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectDetails(Number(params.id));
                setProject(data);
            } catch (err) {
                toast.error('Failed to fetch project details');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!project) {
        return <div className="flex justify-center items-center min-h-screen">Project not found</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl mb-4">{project.title}</CardTitle>
                    <CardDescription>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Description</h3>
                                <p>{project.description}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Required Skills</h3>
                                <p>{project.required_skills}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Owner</h3>
                                <p>{project.owner.name} ({project.owner.email})</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Collaborators</h3>
                                {project.collaborators.length > 0 ? (
                                    <div className="space-y-2">
                                        {project.collaborators.map((collaborator: any) => (
                                            <div key={collaborator.user_id} className="flex justify-between items-center p-2 border rounded">
                                                <div>
                                                    <p className="font-medium">{collaborator.name}</p>
                                                    <p className="text-sm text-gray-500">{collaborator.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm">{collaborator.role}</span>
                                                    <span className={`text-sm px-2 py-1 rounded ${
                                                        collaborator.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        collaborator.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {collaborator.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No collaborators yet</p>
                                )}
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
