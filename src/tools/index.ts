import { allTools, Tools } from "./tools"
export {Tools}

export async function importTools(apiKey: string, toolsToLoad: string[]) {
    toolsToLoad.map(async (toolName: string) => {
        const loadTool = allTools.find((tool) => tool.name == toolName)
        if (loadTool != undefined) {
            await loadTool.fn(apiKey)
        }
    });
}