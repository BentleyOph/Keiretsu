'use client';

import { useEffect, useState } from 'react';
import { getResources, requestResource } from '@/api/resources';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestingIds, setRequestingIds] = useState<number[]>([]);

    useEffect(() => {
        async function fetchResources() {
            try {
                const data = await getResources();
                setResources(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchResources();
    }, []);

    const handleRequestResource = async (resourceId: number) => {
        setRequestingIds(prev => [...prev, resourceId]);
        try {
            const response = await requestResource(resourceId);
            toast.success(response.message);
        } catch (err) {
            toast.error(err.message || 'Failed to request resource');
        } finally {
            setRequestingIds(prev => prev.filter(id => id !== resourceId));
        }
    };

    if (loading) return <div>Loading resources...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-heading">Available resources</h1>
                <Button asChild>
                    <Link href="/resources/new">
                        List Resource
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <Card key={resource.resource_id}>
                        <CardHeader>
                            <CardTitle>{resource.name}</CardTitle>
                            <CardDescription>
                                {resource.description}
                                <div className="text-sm text-gray-500 mt-2">
                                    Owner: {resource.owner_name}
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button 
                                onClick={() => handleRequestResource(resource.resource_id)}
                                disabled={requestingIds.includes(resource.resource_id)}
                            >
                                {requestingIds.includes(resource.resource_id) 
                                    ? 'Requesting...' 
                                    : 'Request Access'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}