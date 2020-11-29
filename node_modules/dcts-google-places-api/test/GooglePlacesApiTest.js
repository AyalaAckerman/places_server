// load .env for api key
require('dotenv').config();
const test = require('ava');
const GooglePlacesApi = require('../src/GooglePlacesApi.js');
const googleapi = new GooglePlacesApi(process.env.GOOGLE_API_KEY);
const photoReference = 'CmRaAAAAqYV1efHXXLX3UB1msekeprgOUD362n4-8lxwYI3aSFANLw51oE1_KeNziEgnnbr5WQzJtQo9SbNnZFRfymg594T9h7yRWnLQL8w1n_ekN6BbyJzg1k0hadSJ4N0i63TmEhA3NIzf_JWUEZcW3VgXJ5FqGhRq7ij6D2Vl8DOSF2yHY1iuTYuAKA';

const isUrl = (str) => {
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return regexp.test(str) === true
}

test(`GoogleApi object should store api key`, t => {
  t.is(googleapi._apiKey, process.env.GOOGLE_API_KEY);
});

test('runPlaceSearch() should return a place_id', async t => {
  const result = await googleapi.runPlaceSearch("Pizza New York");
  t.true(result.startsWith("ChIJ"));
});

test('runPlaceSearch() for nonsense should return null', async t => {
  const result = await googleapi.runPlaceSearch("asd asd asd hae jh adj aeuh 12d");
  t.is(result, null);
});

test('runPlaceSearch() should return correct place_id', async t => {
  const result = await googleapi.runPlaceSearch("HASHTAG Coffee Shop");
  t.is(result, 'ChIJ-39HlNdRqEcRxaZdllY7fUg');
});

test('isUrl() helper function should work', async t => {
  t.is(isUrl('http://www.example.com'), true);
  t.is(isUrl('https://www.example.com'), true);
  t.is(isUrl('www.example.com'), true);
  t.is(isUrl('thomas@example.com'), false);
});

test('runPlaceSearch() with locationbias should return different results for different locations', async t => {
  const resultNyc = await googleapi.runPlaceSearch('Pizza', { lat: 40.730610, lng: -73.935242 });
  const resultBasel = await googleapi.runPlaceSearch('Pizza', { lat: 47.559601, lng: 7.588576 });
  const resultIndia = await googleapi.runPlaceSearch('Pizza', { lat: 28.644800, lng: 77.216721 });
  t.true(resultNyc !== resultBasel);
  t.true(resultNyc !== resultIndia);
  t.true(resultBasel !== resultIndia);
});

test('runPlaceSearch() with locationbias should return correct result', async t => {
  const result = await googleapi.runPlaceSearch('Pizza', { lat: 40.7452778, lng: -73.9880556 }, 10);
  t.is(result, 'ChIJsaYZEKZZwokRxICmrKSu8Pw');
});

test('runPlaceDetails() should return null for nonsense or invalid placeIds', async t => {
  const result = await googleapi.runPlaceDetails('asdasd asd asd asd asd sd');
  t.is(result, null);
});

test('runPlaceDetails() should return an object (with at least "name" and "place_id") if successfull', async t => {
  const result = await googleapi.runPlaceDetails("ChIJsaYZEKZZwokRxICmrKSu8Pw");
  t.true(result.name !== undefined && result.place_id !== undefined);
});

test('runPlaceDetails() with fields specified should work', async t => {
  const result = await googleapi.runPlaceDetails("ChIJsaYZEKZZwokRxICmrKSu8Pw", ["place_id", "name"]);
  t.is(Object.keys(result).length, 2);
});

test('runPlaceDetailsCid() should return null for nonsense or invalid cid', async t => {
  const result = await googleapi.runPlaceDetailsCid('asdasd asd asd asd asd sd');
  t.is(result, null);
});

test('runPlaceDetailsCid() should work only for strings and throw error if number is inputted', async t => {
  t.is((await googleapi.runPlaceDetailsCid("10029775272822189018")).place_id, "ChIJF6tIb6SMGGAR2iuQeXjrMIs");
  await t.notThrowsAsync(async function () {
    await googleapi.runPlaceDetailsCid("10029775272822189018");
  });
  await t.throwsAsync(async function () {
    await googleapi.runPlaceDetailsCid(10029775272822189018);
  });
});

test.todo('runPlaceDetailsCid() should return all fields as default');
test.todo('runPlaceDetailsCid() with fields specified should work');
test.todo('runPlaceDetailsCid() and runPlaceDetails() should get same results');

test('runPlacePhoto() should return null if not photo found', async t => {
  t.is(await googleapi.runPlacePhotos(photoReference + "asd"), null);
});

test('runPlacePhoto() should return null for invalid input parameters', async t => {
  t.is(await googleapi.runPlacePhotos([]), null);
  t.is(await googleapi.runPlacePhotos(1234), null);
  t.is(await googleapi.runPlacePhotos({a: 1, b: 2}), null);
});

test('runPlacePhoto() should return a url', async t => {
  const result = await googleapi.runPlacePhotos(photoReference);
  t.true(isUrl(result));
});
test('runPlacePhoto() should work', async t => {
  const result = await googleapi.runPlacePhotos(photoReference);
  t.true(result.startsWith("https://lh3.googleusercontent.com/p/AF1QipOjvIrK09YNkFN0yOp1XPMKhvEEw7cDrzIveTvf"));
});
