import { Router } from 'express'
import { readdirSync, statSync } from 'fs'
import { join, resolve, sep } from 'path'

type RouterConfig = {
    directory: string
    debug?: boolean
}

export default class DirectoryRouter {
    private config: RouterConfig
    private router: Router

    constructor(config: RouterConfig) {
        this.config = config
        this.router = Router()

        this.log('Initializing routes')

        this.loadRoutes(this.config.directory)
    }

    private log(message: string) {
        if (this.config.debug) {
            console.log('[ROUTER]', message)
        }
    }

    private loadRoutes(path: string) {
        const routes = readdirSync(path)

        routes.forEach((route) => {
            const routePath = join(path, route)
            const stat = statSync(routePath)

            if (stat.isDirectory()) {
                this.loadRoutes(routePath)
                return
            }

            if (!route.endsWith('.js') && !route.endsWith('.ts')) {
                return
            }

            const module = require(routePath).default

            if (Object.getPrototypeOf(module) != Router) {
                this.log(
                    `Skipping route ${routePath} as it does not export a Router`,
                )
                return
            }

            const relativePath = routePath
                .replace(resolve(this.config.directory), '')
                .replace(/\.ts$|\.js$/, '')

            let routeParts = relativePath
                .split(sep)
                .filter((part) => part.length > 0)

            if (
                routeParts.length > 0 &&
                routeParts[routeParts.length - 1] === 'route'
            ) {
                routeParts.pop()
            }

            const routePrefix = '/' + routeParts.join('/').replace(/\\/g, '/')

            this.log(`Registering route ${routePrefix} with module`)
            this.router.use(routePrefix, module as Router)
        })
    }

    public loadRouter(): Router {
        return this.router
    }
}
