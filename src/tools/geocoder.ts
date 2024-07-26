import { defineTool } from "@genkit-ai/ai";
import { z } from "@genkit-ai/core/schema";
import axios from "axios";

export async function loadGeocoder(apiKey: string) {
    await defineTool(
        {
            name: "geocoder",
            description: `Used when needing to convert an address or location to a
            latitude and longitude value. The input to this tool is an address or a place
            and the output contains a lat, lng location`,
            inputSchema: z.object({
            address: z.string(),
            }),
            outputSchema: z.unknown(),
        },
        async (input) => {
            const address = encodeURIComponent(input.address);
            const geocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

            const  response = await axios.get(geocodeEndpoint);
            
            return response.data;
        }
    );
}

export async function loadReverseGeocoder(apiKey: string) {
    await defineTool(
        {
            name: "reverseGeocode",
            description: `Used when needing to convert a latitude (lat) and
            longitude (lng) to a physical address or place. The input to this
            tool is a a latitude (lat) and longitude (lng). The output of the
            tool is a location or a formatted address encapsulated in JSON.`,
            inputSchema: z.object({
                latitude: z.number(),
                longitude: z.number(),
            }),
            outputSchema: z.unknown(),
        },
        async (input) => {
            const reverseGeocodeEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${input.latitude},${input.longitude}&key=${apiKey}`;
            const response = await axios.get(reverseGeocodeEndpoint);

            return response.data;
        }
    )
}