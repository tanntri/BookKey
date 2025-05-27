import { useParams as useReactRouterParams } from "react-router-dom";
import { sharedEnv } from "@bookkey/shared/src/env";

type getRouteInputBase = {
    abs?: boolean
}

function getRouteFn<T extends Record<string, boolean>>(
    routeParamsDef: T,
    getRoute: (routeParams: Record<keyof T, string>) => string
): {
    (routeParams: Record<keyof T, string> & getRouteInputBase): string
    placeholders: Record<keyof T, string>
    useParams: () => Record<keyof T, string>
    definition: string
}

function getRouteFn(getRoute: () => string): {
    (routeParams?: getRouteInputBase): string
    placeholders: {}
    useParams: () => {}
    definition: string
}

function getRouteFn(routeParamsOrGetRoute?: any, maybeGetRoute?: any) {
    const routeParamsDef = typeof routeParamsOrGetRoute === 'function' ? {} : routeParamsOrGetRoute;
    const getRoute = typeof routeParamsOrGetRoute === 'function' ? routeParamsOrGetRoute : maybeGetRoute;
    const placeholders = Object.keys(routeParamsDef).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {})
    const definition = getRoute(placeholders);
    const toGetRouteFn = (routeParams?: getRouteInputBase) => {
        const route = getRoute(routeParams);
        if (routeParams?.abs) {
            return `${sharedEnv.WEBAPP_URL}${route}`;
        } else {
            return route;
        }
    }
    toGetRouteFn.placeholders = placeholders;
    toGetRouteFn.definition = definition;
    toGetRouteFn.useParams = useReactRouterParams as any;
    return toGetRouteFn;
}

// export type RouteParams<T extends { placeholders: Record<string, string> }> = T['placeholders'];

export const routeWrapper = getRouteFn;