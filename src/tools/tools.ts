import { loadRestaurantFinder } from "./restaurantFinder";

interface Tool {
    name: string,
    fn(apiKey: string): Promise<void>,
}

export enum Tools {
    restaurantFinder = "restaurantFinder",
}

export const restaurantFinder = "restaurantFinder";

const restaurantFinderTool = {name: Tools.restaurantFinder, fn: loadRestaurantFinder}

export const allTools: Tool[] = [restaurantFinderTool];