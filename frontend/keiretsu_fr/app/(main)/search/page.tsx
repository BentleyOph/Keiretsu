'use client';

import { useState, useEffect } from 'react';
import { searchUsers, sendCollaborationRequest } from '@/api/users';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SearchPage() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        skills: '',
        location: '',
        availability: ''
    });
    const [loading, setLoading] = useState(false);
    const [requestingUser, setRequestingUser] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await searchUsers(filters);
            setUsers(results);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCollaborate = async (userId: string) => {
        setRequestingUser(userId);
        try {
            await sendCollaborationRequest(userId);
            toast.success('Collaboration request sent successfully!');
        } catch (err) {
            toast.error('Failed to send collaboration request');
        } finally {
            setRequestingUser(null);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 space-y-4">
                <h1 className="text-2xl font-heading">Search Users</h1>
                <div className="flex flex-wrap gap-4">
                    <Input
                        placeholder="Skills (e.g., Python, AI)"
                        value={filters.skills}
                        onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        className="max-w-xs"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {users.map((user) => (
                    <Card key={user.user_id}>
                        <CardHeader>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>
                                <div className="space-y-2">
                                    <p>{user.bio}</p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Type:</strong> {user.type}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Location:</strong> {user.location}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <strong>Skills:</strong> {user.skills}
                                    </p>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex gap-2">
                            <Button asChild variant="noShadow">
                                <Link href={`/profile/${user.user_id}`}>
                                    View Profile
                                </Link>
                            </Button>
                            <Button 
                                onClick={() => handleCollaborate(user.user_id)}
                                disabled={requestingUser === user.user_id}
                            >
                                {requestingUser === user.user_id ? 'Sending...' : 'Collaborate'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
