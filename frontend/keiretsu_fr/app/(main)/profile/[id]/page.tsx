'use client';

import { useState, useEffect } from 'react';
import { getUserDetails } from '@/api/users';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserDetails {
    user_id: number;
    name: string;
    email: string;
    type: string;
    location: string;
    skills: string;
    availability: string;
    bio: string;
}

export default function UserProfile({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const data = await getUserDetails(params.id);
                setUser(data);
            } catch (err) {
                toast.error('Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [params.id]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center min-h-screen">User not found</div>;
    }

    return (
        <div className="container mx-auto p-6 flex justify-center items-center min-h-screen">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl mb-4">{user.name}</CardTitle>
                    <CardDescription>
                        <div className="space-y-4 text-left">
                            <p className="text-lg">{user.bio}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold">Type</h3>
                                    <p>{user.type}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Location</h3>
                                    <p>{user.location}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Availability</h3>
                                    <p>{user.availability}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Contact</h3>
                                    <p>{user.email}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold">Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {user.skills.split(',').map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
