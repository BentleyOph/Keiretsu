"use client";

import { useState, useEffect } from 'react';
import { getCollabs } from '../api/all_collabs';

interface Collaborator {
    name: string;
    email: string;
    role: string;
}

export default function Collaborations() {
    const [collabs, setCollabs] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollabs = async () => {
            try {
                const data = await getCollabs();
                setCollabs(data);
            } catch (error) {
                console.error('Error fetching collaborations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollabs();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Collaborations</h2>
            <div className="grid gap-4">
                {collabs.map((collab, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow">
                        <h3 className="font-semibold">{collab.name}</h3>
                        <p>{collab.email}</p>
                        <p className="text-gray-600">{collab.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

