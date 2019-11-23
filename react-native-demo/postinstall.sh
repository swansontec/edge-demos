#!/bin/sh

# The Edge application uses WebView components extensively.
# These components need various JS files to operate,
# so this script prepares those.

set -e
cd "$(dirname "$0")"

# Install cocoapods native libraries:
if [ `uname` == 'Darwin' ]; then
  ( cd ios; pod install )
fi

# Remove inclusion of c++_shared.so library since we are using jsc-android which already includes it
sed "s/\,[[:space:]]'-DANDROID_STL=c++_shared'//g" ./node_modules/react-native-fast-crypto/android/build.gradle > temp-build.gradle
mv temp-build.gradle ./node_modules/react-native-fast-crypto/android/build.gradle

# Copy edge-core-js WebView contents:
core_assets="./android/app/src/main/assets/edge-core"
if [ -d "$core_assets" ]; then
  rm -r "$core_assets"
fi
mkdir -p "$core_assets"
cp ./node_modules/edge-core-js/lib/react-native/edge-core.js "$core_assets"
cp ./node_modules/edge-currency-bitcoin/lib/react-native/edge-currency-bitcoin.js "$core_assets"
cp ./node_modules/edge-exchange-plugins/lib/react-native/edge-exchange-plugins.js "$core_assets"

# Write out an edge-core-js index.html file:
cat >"$core_assets/index.html" <<HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script src="edge-core.js"></script>
    <script src="edge-currency-bitcoin.js"></script>
    <script src="edge-exchange-plugins.js"></script>
    <script>
      window.lockEdgeCorePlugins()
    </script>
  </body>
</html>
HTML
