import { GenkitError, InitializedPlugin, genkitPlugin } from '@genkit-ai/core';
import { defineTool } from '@genkit-ai/ai';
import axios from "axios";
import { z } from "zod";
import { PlaceToolsOptions, TimezoneResponse } from './common/types';
import { Tools, importTools } from './tools/index'
export { Tools }

const pluginName = 'place-tools';
let apiKey: string | undefined = "";

export const placeToolsPlugin = genkitPlugin(
  pluginName,
  async (options: PlaceToolsOptions) => {
    apiKey = options.ApiKey || process.env.MAPS_API_KEY;
    if (!apiKey) {
        throw new GenkitError({
            source: pluginName,
            status: 'INVALID_ARGUMENT',
            message: 'Must supply either `options.ApiKey` or set `MAPS_API_KEY` environment variable.',
        });
    }

    importTools(apiKey, options.Tools || []);
    
    return {} as InitializedPlugin;
  }
);

 export const geocoder = defineTool(
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

export const currentTimeAtLocation = defineTool(
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

export const currentAirQualilty = defineTool(
    {
      name: 'currentAirQualilty',
      description: `Used to get the current air quality based off a lat, lng
      location`,
      inputSchema: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      outputSchema: z.unknown(),
    },
    async (input) => {
      const caqiEndpoint = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;
      const basicRequest = {
        "location": {
          "latitude": input.lat,
          "longitude": input.lng,
        }
      }
  
      const  response = await axios.post(
        caqiEndpoint,
        JSON.stringify(basicRequest),
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      return response.data;
    }
  );