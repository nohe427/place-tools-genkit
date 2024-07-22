import { defineTool } from "@genkit-ai/ai";
import { z } from "@genkit-ai/core/schema";
import axios from "axios";

export async function loadCurrentAirQualiltyTool(apiKey: string) {
    defineTool(
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
}