/*
 * DEMO FILE
 * you can run this file to see if you setup everythig correctly
 * the examples are the same as provided in README.md
 */

// get apikey
require('dotenv').config();
const apiKey = process.env.GOOGLE_API_KEY; // you can also just input your API key here as string

// initialization
const GooglePlacesApi = require('./src/GooglePlacesApi.js');
const googleapi = new GooglePlacesApi(apiKey);



/*
 * PLACE SEARCH
 */
const searchQuery = "Pizza New York"; // example search
// with promises
googleapi.runPlaceSearch(searchQuery).then(placeId => {
  console.log(placeId); // returns placeId (as string) or null
});
// with async await
(async () => {
  let placeId = await googleapi.runPlaceSearch(searchQuery);
  console.log(placeId);
})();;

/*
 * PLACE DETAILS
 * by placeId
 */
const placeId = "ChIJHegKoJUfyUwRjMxaCcviZDA"; // placeId of "Pizza Chicken New York"
// with promises
googleapi.runPlaceDetails(placeId).then(placeDetails => {
  console.log(`place found: ${placeDetails.name}`);
});
// with async await
(async () => {
  let placeDetails = await googleapi.runPlaceDetails(placeId);
  console.log(`place found: ${placeDetails.name}`);
})();

/*
 * PLACE DETAILS
 * by cid
 */
const cid = "10056734717913051463"; // cid of "Brooklyn Boulders Chicago"
// with promises
googleapi.runPlaceDetailsCid(cid).then(placeDetails => {
  console.log(`place found: ${placeDetails.name} (${placeDetails.place_id})`);
});
// with async await
(async () => {
  let placeDetails = await googleapi.runPlaceDetailsCid(cid);
  console.log(`place found: ${placeDetails.name} (${placeDetails.place_id})`);
})();

/*
 * PLACE PHOTOS
 */
const photoReference = 'CmRaAAAAqYV1efHXXLX3UB1msekeprgOUD362n4-8lxwYI3aSFANLw51oE1_KeNziEgnnbr5WQzJtQo9SbNnZFRfymg594T9h7yRWnLQL8w1n_ekN6BbyJzg1k0hadSJ4N0i63TmEhA3NIzf_JWUEZcW3VgXJ5FqGhRq7ij6D2Vl8DOSF2yHY1iuTYuAKA';
// with promises
googleapi.runPlacePhotos(photoReference).then(photoUrl => {
  console.log(`photo url: ${photoUrl}`);
});
// with async await
(async () => {
  let photoUrl = await googleapi.runPlacePhotos(photoReference);
  console.log(`photo url: ${photoUrl}`);
})();

/*
 * FULL EXAMPLE
 */
const textSearch = "Nolita Pizza New York";
// with promises
googleapi.runPlaceSearch(textSearch).then(placeId => {
  console.log(`place id found: ${placeId}`);
  return googleapi.runPlaceDetails(placeId);
}).then(placeDetails => {
  console.log(`place details fetched for ${placeDetails.name} (${placeDetails.place_id})`);
  const promises = [];
  placeDetails.photos.map(photo => {
    promises.push(googleapi.runPlacePhotos(photo.photo_reference));
  });
  return Promise.all(promises);
}).then(placePhotoUrls => {
  console.log(`${placePhotoUrls.length} photo urls fetched:`);
  console.log(placePhotoUrls);
});

// with async await (WARNING: this will be slower because requests to placePhotosApi queue instead of running in parallel)
(async () => {
  let placeId = await googleapi.runPlaceSearch(textSearch)
  console.log(`place id found: ${placeId}`);

  let placeDetails = await googleapi.runPlaceDetails(placeId);
  console.log(`place details fetched for ${placeDetails.name} (${placeDetails.place_id})`);

  const placePhotoUrls = [];
  for (const photo of placeDetails.photos) {
    placePhotoUrls.push(await googleapi.runPlacePhotos(photo.photo_reference));
  }
  console.log(`${placePhotoUrls.length} photo urls fetched:`);
  console.log(placePhotoUrls);
})();
