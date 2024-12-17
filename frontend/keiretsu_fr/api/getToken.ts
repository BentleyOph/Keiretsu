import { cookies } from 'next/headers';

export async function getToken() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('Authorization')?.value;
        return token;
    } catch (error) {
        console.error('Error getting token from cookie store:', error);
        return null;
    }
}