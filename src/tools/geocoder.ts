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