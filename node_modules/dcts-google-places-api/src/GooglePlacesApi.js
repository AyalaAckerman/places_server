/*
 * GOOGLE PLACE API, includes
 * place search API (biased and unbiased)
 * place details API
 * place photos API
 */
const axios = require('axios');

class GooglePlacesApi {
  ALL_PLACE_DETAILS_FIELDS = [
    "address_components",
    "adr_address",
    "formatted_address",
    "formatted_phone_number",
    "geometry",
    "icon",
    "international_phone_number",
    "name",
    "opening_hours",
    "photos",
    "place_id",
    "plus_code",
    "price_level",
    "rating",
    "types",
    "url",
    "website",
    "user_ratings_total",
    "vicinity",
    "permanently_closed",
  ];

  constructor(apiKey) {
    this._apiKey = apiKey;
  }

  /*
   * PLACE SEARCH API
   * search textquery, returns only placeId
   * optional location biasing with radius of 1000m per default
   * https://developers.google.com/places/web-service/search
   */
  runPlaceSearch(query, location = false, radius = 1000) {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
    const paramsObj = {
      "key": this._apiKey,
      "input": query,
      "inputtype": "textquery"
    }
    if (location) {
      paramsObj["locationbias"] = `circle:${radius}@${location.lat},${location.lng}`;
    }
    const url = baseUrl + "?" + this.constructParams(paramsObj);
    return axios.get(url).then(this.handlePlaceSearchResult);
  }
  handlePlaceSearchResult(res) {
    const predictions = res.data.candidates;
    if (predictions.length > 0 && predictions[0].place_id !== undefined) {
      return predictions[0].place_id;
    }
    return null;
  }

  /*
   * PLACE DETAILS API
   * specify fields (or leave empty to return all availible fields)
   * get place details by ...
   *   ...place_id: (official) https://developers.google.com/places/web-service/details
   *   ...cid: (undocumented, deprecated?) found here: https://stackoverflow.com/a/49374036/6272061
   */
  runPlaceDetailsGeneral(identifierKey, identifierValue, fields = this.ALL_PLACE_DETAILS_FIELDS) {
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const paramsObj = {
      "key": this._apiKey,
      "fields": fields.join(",")
    }
    paramsObj[identifierKey] = identifierValue;
    const url = baseUrl + "?" + this.constructParams(paramsObj);
    return axios.get(url).then(res => {
      if (res.data.result !== undefined) {
        return res.data.result;
      }
      return null;
    }).catch(e => {
      return null;
    })
  }
  runPlaceDetails(placeId, fields = this.ALL_PLACE_DETAILS_FIELDS) {
    return this.runPlaceDetailsGeneral("place_id", placeId, fields);
  }
  runPlaceDetailsCid(cid, fields = this.ALL_PLACE_DETAILS_FIELDS) {
    if (typeof(cid) !== 'string') {
      throw new Error(`Input must be a string! You inputted a ${typeof(cid)}`);
    }
    return this.runPlaceDetailsGeneral('cid', cid, fields);
  }

  /*
   * PLACE PHOTOS API
   * get url/image from fotoReference
   * https://developers.google.com/places/web-service/photos
   */
  runPlacePhotos(photoReference) {
    if (typeof(photoReference) !== "string") {
      return null;
    }
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const paramsObj = {
      "key": this._apiKey,
      "photoreference": photoReference,
      "maxwidth": 800,
    }
    const url = baseUrl + "?" + this.constructParams(paramsObj);
    return axios.get(url).then(res => {
      return res.request._redirectable._options.href
    }).catch(e => {
      return null;
    })
  }

  /*
   * HELPER METHODS
   */
  constructParams(obj) {
    let paramsArray = [];
    for (let [key, value] of Object.entries(obj)) {
      paramsArray.push(`${key}=${value}`);
    }
    return paramsArray.join("&");
  }
}

// EXPORT CLASS
module.exports = GooglePlacesApi;
