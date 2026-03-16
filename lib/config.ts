export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.11:5000/api/v1";
export const API_BASE_URL = API_URL.split('/api/v1')[0].replace(/\/$/, '');

export const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
};
