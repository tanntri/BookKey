import { sharedEnv } from "@bookkey/shared/src/env";
import { routeWrapper } from "./routeWrapper";

sharedEnv.WEBAPP_URL = "https://example.com";

describe('routeWrapper', () => {
    it('should return simple route', () => {
        const getSimpleRoute = routeWrapper(() => '/simple');
        expect(getSimpleRoute()).toBe('/simple');
    })

    it('should return route with params', () => {
        const getRouteWithParams = routeWrapper({ param1: true, param2: true }, ({param1, param2}) => `/a/${param1}/b/${param2}/c`)
        expect(getRouteWithParams({param1: 'xxx', param2: 'yyy'})).toBe('/a/xxx/b/yyy/c')
    })

    it('should return route definition', () => {
        const getRouteWithParams = routeWrapper({ param1: true, param2: true }, ({param1, param2}) => `/a/${param1}/b/${param2}/c`)
        expect(getRouteWithParams.definition).toBe('/a/:param1/b/:param2/c')
    })

    it('should return route placeholders', () => {
        const getRouteWithParams = routeWrapper({ param1: true, param2: true }, ({param1, param2}) => `/a/${param1}/b/${param2}/c`)
        expect(getRouteWithParams.placeholders).toMatchObject({param1: ':param1', param2: ':param2'})
    })

    it('should return absolute route', () => {
        const getSimpleRoute = routeWrapper(() => '/simple');
        expect(getSimpleRoute({ abs: true })).toBe('https://example.com/simple');
    })
})