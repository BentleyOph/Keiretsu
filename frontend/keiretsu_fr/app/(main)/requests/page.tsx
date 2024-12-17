'use client';

import { useEffect, useState } from 'react';
import { getIncomingRequests, getOutgoingRequests, updateResourceRequest } from '@/api/resources';
import { getIncomingCollabRequests, getOutgoingCollabRequests, updateCollabRequest } from '@/api/collaborations';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ResourceRequest {
    request_id: number;
    resource_name: string;
    requester_name: string;
    status: string;
}

interface CollabRequest {
    request_id: number;
    from_user?: string;
    target_type: string;
    target_name: string;
    status: string;
}

export default function RequestsPage() {
    const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>([]);
    const [collabRequests, setCollabRequests] = useState<CollabRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState<'incoming' | 'outgoing' | 'accepted'>('incoming');
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        fetchRequests();
    }, [viewType]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Fetch resource requests
            let resourceData;
            if (viewType === 'incoming') {
                resourceData = await getIncomingRequests();
            } else if (viewType === 'outgoing') {
                resourceData = await getOutgoingRequests();
            } else {
                const [incoming, outgoing] = await Promise.all([
                    getIncomingRequests(),
                    getOutgoingRequests()
                ]);
                resourceData = [...incoming, ...outgoing].filter(req => req.status === 'accepted');
            }
            setResourceRequests(resourceData);

            // Fetch collaboration requests
            let collabData;
            if (viewType === 'incoming') {
                collabData = await getIncomingCollabRequests();
            } else if (viewType === 'outgoing') {
                collabData = await getOutgoingCollabRequests();
            } else {
                const [incoming, outgoing] = await Promise.all([
                    getIncomingCollabRequests(),
                    getOutgoingCollabRequests()
                ]);
                collabData = [...incoming, ...outgoing].filter(req => req.status === 'accepted');
            }
            setCollabRequests(collabData);
        } catch (err) {
            toast.error(`Failed to fetch ${viewType} requests`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
        setUpdating(requestId);
        try {
            await updateResourceRequest(requestId, status);
            toast.success(`Request ${status} successfully`);
            fetchRequests();
        } catch (err) {
            toast.error('Failed to update request');
        } finally {
            setUpdating(null);
        }
    };

    const handleUpdateCollabRequest = async (requestId: number, status: 'accepted' | 'declined') => {
        setUpdating(requestId);
        try {
            await updateCollabRequest(requestId, status);
            toast.success(`Collaboration request ${status} successfully`);
            fetchRequests();
        } catch (err) {
            toast.error('Failed to update collaboration request');
        } finally {
            setUpdating(null);
        }
    };

    const renderRequests = (requests: any[], type: 'resource' | 'collab') => (
        <div className="grid gap-4">
            {requests.map((request) => (
                <Card key={request.request_id}>
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div>
                            <CardTitle className="text-xl">
                                {type === 'resource' ? request.resource_name : request.target_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {viewType === 'outgoing' ? 'Requested from' : 'Requested by'}: {
                                    type === 'resource' ? request.requester_name : request.from_user || 'You'
                                }
                            </p>
                            {type === 'collab' && (
                                <p className="text-sm text-muted-foreground">
                                    Type: {request.target_type}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                Status: <span className={
                                    request.status === 'accepted' 
                                        ? 'text-green-600' 
                                        : request.status === 'rejected'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                }>
                                    {request.status}
                                </span>
                            </p>
                        </div>
                        {viewType === 'incoming' && request.status === 'pending' && (
                            <div className="flex gap-2">
                                {type === 'resource' ? (
                                    <>
                                        <Button
                                            onClick={() => handleUpdateRequest(request.request_id, 'accepted')}
                                            disabled={updating === request.request_id}
                                            variant="outline"
                                            className="bg-green-500 text-white hover:bg-green-600"
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateRequest(request.request_id, 'rejected')}
                                            disabled={updating === request.request_id}
                                            variant="outline"
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        >
                                            Reject
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => handleUpdateCollabRequest(request.request_id, 'accepted')}
                                            disabled={updating === request.request_id}
                                            variant="outline"
                                            className="bg-green-500 text-white hover:bg-green-600"
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleUpdateCollabRequest(request.request_id, 'declined')}
                                            disabled={updating === request.request_id}
                                            variant="outline"
                                            className="bg-red-500 text-white hover:bg-red-600"
                                        >
                                            Decline
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </CardHeader>
                </Card>
            ))}
            {requests.length === 0 && (
                <p className="text-center text-muted-foreground">
                    No {viewType} requests found
                </p>
            )}
        </div>
    );

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <Tabs defaultValue="resources" className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="resources">Resource Requests</TabsTrigger>
                            <TabsTrigger value="collaborations">Collaboration Requests</TabsTrigger>
                        </TabsList>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-[200px] justify-between">
                                    {viewType === 'incoming' 
                                        ? 'Incoming Requests' 
                                        : viewType === 'outgoing'
                                        ? 'Outgoing Requests'
                                        : 'Accepted Requests'}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setViewType('incoming')}>
                                    Incoming Requests
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewType('outgoing')}>
                                    Outgoing Requests
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setViewType('accepted')}>
                                    Accepted Requests
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <TabsContent value="resources">
                        {renderRequests(resourceRequests, 'resource')}
                    </TabsContent>
                    <TabsContent value="collaborations">
                        {renderRequests(collabRequests, 'collab')}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
