'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "9094aacdae789dccd67fa32109ff1a18",
"main.dart.js_7.part.js": "b411f0dc29ada13f01761b2c971b34af",
"main.dart.js_12.part.js": "3859c27921167007090bb7a1bfbaa1be",
"main.dart.js_6.part.js": "84ee610d244073dcebc23109e64284c1",
"index.html": "3fe1a9e21cea5d4668534f1aa3802ae6",
"/": "3fe1a9e21cea5d4668534f1aa3802ae6",
"main.dart.js_13.part.js": "f4a90ae4c079701b9979aa7d68962bce",
"main.dart.js_11.part.js": "8c85963d6c519f5a389d3f9a4925efa1",
"main.dart.js_4.part.js": "40d7cdd834f94aba44ad87ae095d83b9",
"main.dart.js": "80b7209a31f1e64cab74fa212fc37674",
"main.dart.js_18.part.js": "b381bffa776ec5e41ab687e1f3b1675c",
"main.dart.js_19.part.js": "b283a6ddb2e316aa3206bf08e5daad6e",
"main.dart.js_10.part.js": "e5aab2a4ee50d71e04fd2a475286dce6",
"main.dart.js_5.part.js": "084b61160adcd9ff31a598f6b3058c6f",
"main.dart.js_15.part.js": "14f0cf0268448394a9e5e3ff997aebd4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js_9.part.js": "ddc74e585a24493e99c7ae4fbf7a09b7",
"main.dart.js_8.part.js": "6ba5b73b24ae0e8938506e1cf0d073ee",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "880477bed9550298da335409fed83b3f",
"main.dart.js_14.part.js": "d1058c218dc4b81529a1a3b80071d5da",
"main.dart.js_1.part.js": "b460761b6f290d1eae59a1624436f6c4",
"main.dart.js_3.part.js": "3e70da7d3609bc2ec3130e69b0959223",
"main.dart.js_16.part.js": "dcafb33eda9a4e5c54e3d4d7d5a3642d",
"assets/images/bg_rank1.png": "14b230a66e9d4f72f5b72a8f8bc02f70",
"assets/images/chart.png": "6fdeeea925875ccaabc9968ce9b1699d",
"assets/images/bg_rank3.png": "76004a55c61d60d2160ed6b6b6cb28dd",
"assets/images/bg_rank2.png": "af77fb39d3980b380ef8d505ff4955ee",
"assets/images/main_bg.png": "8d8ba43747c346a664e1d21276cefdf9",
"assets/images/close.png": "a5b29f4638feefed120b53dd7426d3a9",
"assets/AssetManifest.json": "6190321ddadab54da18367eeec4d4d74",
"assets/NOTICES": "540b3d2d2dbd3b3248fcc1721b1edd79",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"main.dart.js_2.part.js": "ad77a4406cda33f34b3d9cef51ef7b87",
"main.dart.js_17.part.js": "7c962be480614fe5d58f1c0bc25e106c",
"canvaskit/canvaskit.js": "43fa9e17039a625450b6aba93baf521e",
"canvaskit/profiling/canvaskit.js": "f3bfccc993a1e0bfdd3440af60d99df4",
"canvaskit/profiling/canvaskit.wasm": "a9610cf39260f60fbe7524a785c66101",
"canvaskit/canvaskit.wasm": "04ed3c745ff1dee16504be01f9623498"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
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
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
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
