'use client';

import { useState, useEffect } from 'react';
import { getUsername } from '../api/username';
import { TypographyH1 } from './TypographyH1';

export default function UserDisplay() {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const result = await getUsername();
      if (result.error) {
        setError(result.error);
      } else {
        setUsername(result.username);
      }
    };

    fetchUsername();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!username) return <div>Loading...</div>;

  return <TypographyH1 text={`Welcome, ${username}!`} />;
}
