# Google Places API (for node)
Node client to run the basic google places API requests (using axios). Published on [NPM](https://www.npmjs.com/package/dcts-google-places-api).
- [**Place Search**](https://developers.google.com/places/web-service/search)
- [**Place Details**](https://developers.google.com/places/web-service/details)
- [**Place Photos**](https://developers.google.com/places/web-service/photos)


## Installing
```bash
$ npm install dcts-google-places-api
```

## Examples
### Initialzation
```js
const apiKey = "INSERT_YOUR_API_KEY"; // define API key
const GooglePlacesApi = require('dcts-google-places-api');
const googleapi = new GooglePlacesApi(apiKey); // initialize
```
### Place Search
```js
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
```

### Place Details
Get place details by `place_id`.
```js
const placeId = "ChIJHegKoJUfyUwRjMxaCcviZDA"; // placeId of "Pizza Chicken New York"

// with promises
googleapi.runPlaceDetails(placeId).then(placeDetails => {
  console.log(`place found: ${placeDetails.name}`);
})

// with async await
(async () => {
  let placeDetails = await googleapi.runPlaceDetails(placeId);
  console.log(`place found: ${placeDetails.name}`);
})();
```
Get place details by `cid`. This is a deprecated endpoint and not documented in the official google api documentation, but it still works. See also this [answer on stackoverflow](https://stackoverflow.com/a/49374036/6272061)
```js
const cid = "10056734717913051463"; // cid of "Brooklyn Boulders Chicago"

// with promises
googleapi.runPlaceDetailsCid(cid).then(placeDetails => {
  console.log(`place found: ${placeDetails.name} (${placeDetails.cid})`);
});

// with async await
(async () => {
  let placeDetails = await googleapi.runPlaceDetailsCid(cid);
  console.log(`place found: ${placeDetails.name} (${placeDetails.cid})`);
})();
```

### Place Photos
⚠️ **Be Aware**: this function returns only the photoUrl, not the image itself.
```js
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
```

### Full Example
1. Search for a place by textquery
2. get place details from that place
3. fetch all photo urls from that place

```js
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

// with async await
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
```
## Run Tests (written with AVA js)
```js
npm run test
```

## ToDo's
- [ ] run `npm run test` to see missing tests.

# Credits
Written by [dcts](www.github.com/dcts) for personal use only. Check my [portfolio website](https://dcts.github.io/CV/). Or go play [tetris](https://dcts-tetris-spheres.firebaseapp.com/).
