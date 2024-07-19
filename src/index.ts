import { GenkitError, InitializedPlugin, genkitPlugin } from '@genkit-ai/core';
import { defineTool } from '@genkit-ai/ai';
import axios from "axios";
import { z } from "zod";
import { PlaceResponse, PlaceToolsOptions } from './common/types';

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
    // defineTool(
    //     {
    //       name: 'restaurantFinder',
    //       description: `Used when needing to find a restaurant based on a users location.
    //       The location should be used to find nearby restaurants to a place. You can also
    //       selectively find restaurants based on the users preferences, but you should default
    //       to 'Local' if there are no indications of restaurant types in the users request.
    //       `,
    //       inputSchema: z.object({ place: z.string(), typeOfRestaurant: z.string().optional() }),
    //       outputSchema: z.unknown(),
    //     },
    //     async (input) => {
    //         if (input.typeOfRestaurant == undefined) {
    //           input.typeOfRestaurant = "Local";
    //         }
    //         const placesEndpoint = "https://places.googleapis.com/v1/places:searchText";
    //         const textQuery = {textQuery: `${input.typeOfRestaurant} restaurants in ${input.place}`};
      
    //         const  response = await axios.post(
    //           placesEndpoint,
    //           JSON.stringify(textQuery),
    //           {
    //             headers: {
    //               "Content-Type": "application/json",
    //               "X-Goog-Api-Key": `${apiKey}`,
    //               "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.priceLevel,places.photos.name,places.editorialSummary,places.googleMapsUri"
    //             }
    //           }
    //         );
    //         console.log(response.data);
    //         let data = (response.data as PlaceResponse);
    //         for(let i = 0; i < data.places.length; i++) {
    //           if (data.places[i].photos) {
    //             data.places[i].photos = [data.places[i].photos[0]];
    //           }
    //         }
    //         return data as PlaceResponse;
    //     }
    //   );
      return {} as InitializedPlugin;
  }
);

export const rTool = defineTool(
  {
    name: 'rTool',
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
      const placesEndpoint = "https://places.googleapis.com/v1/places:searchText";
      const textQuery = {textQuery: `${input.typeOfRestaurant} restaurants in ${input.place}`};

      const  response = await axios.post(
        placesEndpoint,
        JSON.stringify(textQuery),
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": `${apiKey}`,
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

// const makeGeocode = (apiKey: string) => {

 export const geocode = defineTool(
    {
      name: "geocode",
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

  // return geocode;

// }

// function makeAirQuality(apiKey: string) {
  // return defineTool(
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
// }
