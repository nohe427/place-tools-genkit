# Maps Tools for Genkit Agents

This repository is a plugin for Firebase Genkit to help you build your own
custom agents that rely on the Maps API.

[Demo on YouTube](https://youtu.be/zjFTl2qpvUI?si=u6g-B-AGsNfDPzDD)

# Installation

## .npmrc configuration

This project uses GitHub packages for distribution. Add the following contents
to a `.npmrc` file at the root of your project:

```
@nohe427:registry=https://npm.pkg.github.com
```

Then setup your machine to communicate with GitHub packages by setting the 
`.npmrc` located in your home directory to the following contents:

```
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
```

If you have set `$GITHUB_TOKEN` in your `.bashrc` file, you should be good to
go.

## Install the package

```
npm install @nohe427/place-tools-genkit@$VERSION
```

Or to install the latest version call:

```
npm install @nohe427/place-tools-genkit
```

## Install within your Genkit project

Get a Google Maps API key from the 
[Google Cloud Console](https://console.cloud.google.com/google/maps-apis/api-list?project=_)
first. Then set your `MAPS_API_KEY` environment variable. Alternatively, you can
also pass in the API key when initializing the plugin.

```
import { placeToolsPlugin } from '@nohe427/place-tools-genkit'

configureGenkit({
  plugins: [
    googleCloud(),
    googleAI(),
    placeToolsPlugin({ApiKey: "MAPS_API_KEY"})
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
```

# Example Flow

```
export const mapAgent = defineFlow(
  {
    name: 'mapAgent',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
		// Construct a request and send it to the model API.
    const llmResponse = await generate({
      prompt: `${subject}`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
      tools: [currentAirQualilty, currentTimeAtLocation, geocoder],
    });
```

# FAQ

### How do I authenticate to GitHub packages?

See the [GitHub packages documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

### Air Quality and Current Time at Location don't return anything

`currentAirQuality` and `currentTimeAtLocation` both depend heavily on the
geocoding utility to convert a place to latitude and longitude coordinates. When
constructing your flow, just remember to include `geocoder` in the tool list for
your flows. Gemini handles the rest!

# Additional Info

This is not an officially supported Google project.