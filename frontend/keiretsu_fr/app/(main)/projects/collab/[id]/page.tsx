'use client';

import { useEffect, useState } from 'react';
import { getProjectByCollaboration } from '@/api/projects';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CollabProjectDetails({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectByCollaboration(Number(params.id));
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
                                <p>{project.skills_required}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Owner</h3>
                                <p>{project.owner.name} ({project.owner.email})</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Status</h3>
                                <p>{project.is_open ? 'Open for collaborations' : 'Closed for collaborations'}</p>
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
