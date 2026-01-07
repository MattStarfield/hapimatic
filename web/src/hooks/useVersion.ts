import { useQuery } from '@tanstack/react-query'

export interface VersionInfo {
    version: string
    timestamp: string
}

export function useVersion() {
    return useQuery<VersionInfo>({
        queryKey: ['version'],
        queryFn: async () => {
            const res = await fetch('/api/version')
            if (!res.ok) {
                return { version: '?.?.?', timestamp: '' }
            }
            return res.json()
        },
        staleTime: Infinity, // Never refetch during session
        retry: false
    })
}
