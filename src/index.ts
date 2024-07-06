import { GenkitError, genkitPlugin } from '@genkit-ai/core';
import { defineTool } from '@genkit-ai/ai';
import axios from "axios";
import { z } from "zod";
import { PlaceResponse } from './common/types';

interface PlaceToolsOptions {
  ApiKey: String,
}

const pluginName = 'place-tools';

export const placeToolsPlugin = genkitPlugin(
  pluginName,
  async (options: PlaceToolsOptions) => {
    const apiKey = options.ApiKey || process.env.MAPS_API_KEY;
    if (!apiKey) {
        throw new GenkitError({
            source: pluginName,
            status: 'INVALID_ARGUMENT',
            message: 'Must supply either `options.ApiKey` or set `MAPS_API_KEY` environment variable.',
        });
    }
    defineTool(
        {
          name: 'restaurantFinder',
          description: `Used when needing to find a restaurant based on a users location.
          The location should be used to find nearby restaurants to a place. You can also
          selectively find restaurants based on the users preferences, but you should default
          to 'Local' if there are no indications of restaurant types in the users request.
          `,
          inputSchema: z.object({ place: z.string(), typeOfRestaurant: z.string().optional() }),
          outputSchema: z.unknown(),
        },
        async (input) => {
            if (input.typeOfRestaurant == undefined) {
              input.typeOfRestaurant = "Local";
            }
            const geocodeEndpoint = "https://places.googleapis.com/v1/places:searchText";
            const textQuery = {textQuery: `${input.typeOfRestaurant} restaurants in ${input.place}`};
      
            const  response = await axios.post(
              geocodeEndpoint,
              JSON.stringify(textQuery),
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-Goog-Api-Key": "AIzaSyCJIrZkGH04TIXcP2t8hvo97yKwGmwD-1k",
                  "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.photos.name,places.editorialSummary,places.googleMapsUri"
                }
              }
            );
            console.log(response.data);
            let data = (response.data as PlaceResponse);
            for(let i = 0; i < data.places.length; i++) {
              if (data.places[i].photos) {
                data.places[i].photos = [data.places[i].photos[0]];
              }
            }
            return data as PlaceResponse;
        }
      );
  }
);