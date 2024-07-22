import { defineTool } from "@genkit-ai/ai/tool";
import { z } from "@genkit-ai/core/schema";
import axios from "axios";
import { PlaceResponse } from "../common/types";

export async function loadRestaurantFinder(apiKey: string) {
  await defineTool(
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
}