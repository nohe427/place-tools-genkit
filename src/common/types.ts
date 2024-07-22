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
    ApiKey?: string,
    Tools?: string[],
}
  
export interface GeocodeOptions {
    address: string,
}

export interface TimezoneResponse {
    status: string,
    dstOffset: number,
    errorMessage: string,
    rawOffset: number,
    timeZoneId: string,
    timeZoneName: string,
}

export interface TimezoneOutput {
    humanReadableTime: string,
    timeZoneId: string
}