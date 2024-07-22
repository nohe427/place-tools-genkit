import { GenkitError, InitializedPlugin, genkitPlugin } from '@genkit-ai/core';
import { PlaceToolsOptions } from './common/types';
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