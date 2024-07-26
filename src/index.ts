import { GenkitError, InitializedPlugin, PluginProvider, genkitPlugin } from '@genkit-ai/core';
import { PlaceToolsOptions } from './common/types';
import { Tools, importTools } from './tools/index'
export { Tools }

const pluginName = 'place-tools';
let apiKey: string | undefined = "";

export async function placeToolsPlugin(
  params: PlaceToolsOptions
): Promise<PluginProvider> {
  const plugin = genkitPlugin(
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
      return {} as InitializedPlugin;
    }
  );
  await importTools(params.ApiKey!, params.Tools || []);
  return plugin(params);
}

