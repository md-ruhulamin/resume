'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"manifest.json": "e4a84e7a863fc15bb6a46bfdca624529",
"version.json": "7367c9ca1c69727a8bb09a7d2d21d48c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "ef89d3240903620ba78e69da64abe30f",
"/": "ef89d3240903620ba78e69da64abe30f",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/NOTICES": "53bb7e9df42cf9cc526109f4a9ed0aa1",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "a9c16bc80101533a1cb9ed0677467403",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/AssetManifest.json": "3bc4c9e202977d1c56002e561365019b",
"assets/AssetManifest.bin": "bdd9dab9046d1a48156330580aea6be3",
"assets/AssetManifest.bin.json": "14ba719bb00f20da381a0c82f8a45264",
"assets/assets/images/maxresdefault-3.webp": "302f155bcbf54a10297cd9ab7474ed67",
"assets/assets/images/github2.png": "cade5116bfc8dd80298b7301584337ed",
"assets/assets/images/linkedin2.png": "be6c5ec9a6efaa948b7af2d8210e7efb",
"assets/assets/images/sqlr.png": "27ed940649e1dd5a0f04e486bbdc4606",
"assets/assets/images/dart.png": "7068b181af5c86021b31a6ecf51672b3",
"assets/assets/images/flutterlogo.png": "1ef04636950db02582884d45c796142d",
"assets/assets/images/leetcode.png": "72917c2234a9c41baf796c0b1fcbc200",
"assets/assets/images/flutter.png": "149f3e8d69f98d21151f6693ee171f52",
"assets/assets/images/java.png": "623da67c01822105e5b19506c6c95e4b",
"assets/assets/images/python.jpeg": "ae2887a915f95eea0e1725996cfa2a90",
"assets/assets/images/url.png": "07a0b88b779d184a8ab1db5f0c047b32",
"assets/assets/images/javascript.png": "6e9527fd71d013e60d60c783ec0ededa",
"assets/assets/images/cppr.png": "9f4ed0d24098421d3a032d3d9ad355bb",
"assets/assets/images/github.png": "fc93290eec9e599ace6161dd6eabe7cf",
"assets/assets/images/panjabirbg2.png": "a071e792f6827566f2d9d8fd7dd04f47",
"assets/assets/images/javascript2.png": "94ae2dcd4fa410811cab4e1fbb403340",
"assets/assets/images/short.mp4": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/images/python.png": "95b2fafa1a12d9df3013cf813db64fca",
"assets/assets/images/instagram.png": "8a770507298d728a1e3e039a0507dd8e",
"assets/assets/images/linkedin.png": "5a2ad12f0ae655dc053ecb12810c00d3",
"assets/assets/images/github.webp": "c1a856f0dc1bc39b9962130dfc8b7338",
"assets/assets/images/pc.png": "2ec3c289e2f64ab663c945ff842d9958",
"assets/assets/images/sql.png": "bf0bc470436ed6891f9ca5d084623b1e",
"assets/assets/images/panjabirbg.png": "a071e792f6827566f2d9d8fd7dd04f47",
"assets/assets/images/cpp.png": "e66227d836d29b95b779b610bb345c15",
"assets/assets/files/md.ruhulamin.pdf": "b70720ecfa7395ea956830f939eb93e1",
"main.dart.js": "8fd2ab9b9eb83f270a1a7b348fdb0ca5"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
