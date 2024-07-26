import { loadCurrentAirQualiltyTool } from "./currentAirQuality";
import { loadCurrentTimeAtLocationTool } from "./currentTimeAtLocation";
import { loadGeocoder, loadReverseGeocoder } from "./geocoder";
import { loadRestaurantFinder } from "./restaurantFinder";

interface Tool {
    name: string,
    fn(apiKey: string): Promise<void>,
}

export enum Tools {
    currentAirQualilty = "currentAirQualilty",
    currentTimeAtLocation = "currentTimeAtLocation",
    geocoder = "geocoder",
    restaurantFinder = "restaurantFinder",
    reverseGeocode = "reverseGeocode",
}

export const restaurantFinder = "restaurantFinder";

const restaurantFinderTool = {
    name: Tools.restaurantFinder, fn: loadRestaurantFinder}

const geocoderTool = {
    name: Tools.geocoder, fn: loadGeocoder}

const currentTimeAtLocationTool = {
    name: Tools.currentTimeAtLocation, fn: loadCurrentTimeAtLocationTool}

const currentAirQualiltyTool = {
    name: Tools.currentAirQualilty, fn: loadCurrentAirQualiltyTool}

const reverseGeocode = {
    name: Tools.reverseGeocode, fn: loadReverseGeocoder}

export const allTools: Tool[] = [
    currentAirQualiltyTool,
    currentTimeAtLocationTool,
    geocoderTool,
    restaurantFinderTool,
    reverseGeocode
];