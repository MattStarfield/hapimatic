import { Hono } from 'hono'
import { VERSION, VERSION_TIMESTAMP } from '../../version.generated'

export interface VersionInfo {
    version: string
    timestamp: string
}

export function createVersionRoutes(): Hono {
    const app = new Hono()

    // No auth required for version endpoint
    app.get('/version', (c) => {
        return c.json({
            version: VERSION,
            timestamp: VERSION_TIMESTAMP
        })
    })

    return app
}
