export interface PlaceResponse {
    places: Place[],
  }
  
export interface Place {
    formattedAddress: string,
    googleMapsUri: string,
    priceLevel: string,
    displayName: LocalizedText,
    editorialSummary: LocalizedText,
    photos: [{name:string}],
}

export interface LocalizedText {
    text:string,
    languageCode:string
}

export interface PlaceToolsOptions {
    ApiKey: string,
}
  
export interface GeocodeOptions {
    address: string,
}