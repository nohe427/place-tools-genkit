import { defineTool } from "@genkit-ai/ai/tool";
import { TimezoneResponse } from "../common/types";
import axios from "axios";
import { z } from "@genkit-ai/core/schema";

export async function loadCurrentTimeAtLocationTool(apiKey: string) {
    defineTool(
        {
        name:'currentTimeAtLocation',
        description: 'Used to get the current time at a location based off of a lat, lng location as well as the time zone id that the location is in.',
        inputSchema: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
        outputSchema: z.unknown(),
        },
        async (input) => {
        const timeZoneEndpoint = `https://maps.googleapis.com/maps/api/timezone/json?key=${apiKey}&location=${input.lat}%2C${input.lng}&timestamp=${Math.floor(Date.now()/1000)}`
        const  response = await axios.get(timeZoneEndpoint);
        const tzr = response.data as TimezoneResponse;
        const timeAtLocation = tzr.dstOffset + tzr.rawOffset + Math.floor(Date.now()/1000);
        const out = new Date(timeAtLocation*1000).toLocaleString("en-US", {timeZone: 'UTC'});
        return {humanReadableTime: out, timeZoneId: tzr.timeZoneId}
        });
    }