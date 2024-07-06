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
    text:String,
    languageCode:string
  }