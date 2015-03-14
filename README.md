This Leaflet plugin adds the `L.TileLayer.BPG` class, a simple `L.TileLayer` subclass for .bpg-formatted tiles.  It uses a javascript decoder for this image format.  This is needed because browsers don't generally support the format natively (as of 2015).  The original [decoder provided by Fabrice Bellard](http://bellard.org/bpg/) is used.

# [Better Portable Graphics (BPG)](http://bellard.org/bpg/)

This is a compressed image format created by Fabrice Bellard in later 2014 as a "better JPEG".  It supports lossless and lossy compression.  However, due to the different nature of lossy-compression artifacts it seems to also do a good job in places where you'd normally use the lossless PNG format, such as with digital map tiles.

In my tests with OpenStreetMap tiles using a custom mapnik stylesheet, .bpg-compressed tiles gave me an average 50-60% space saving without noticeable image deterioration (bpgenc -q parameter between 28 - the default - and 32).  Interestingly even at 90% space saving linear features and labels were readable, only small and low-contrast features had disappeared, yet no problems at tile boundaries.

Tiles bigger than 256x256 would probably work even better but at 512x512 a metatile of 8x8 becomes quite heavy.

# Usage

Same as L.TileLayer, same constructor arguments, only add the .BPG suffix.

Would it be possible to instead modify the L.TileLayer class to transparently support .bpg? Probably.

Alternatively you can use [my GitHub fork of libbpg](https://github.com/balrog-kun/libbpg) which has an improved browser _polyfill_ to transparently support .bpg image decoding -- this makes L.TileLayer work transparently but likely adds even more overhead than L.TileLayer.BPG already does by using the decoder written in JavaScript.

# Requirements

* Canvas support in the browser.
* The bpgdec.js file or one of its variants from libbpg.  A version of bpgdec8.js is included with this plugin excluding the unneeded polyfill code.

# Example

```js
<script type="application/javascript" src="leaflet.bpg/bpgdec.js"></script>
<script type="application/javascript" src="leaflet/dist/leaflet.js"></script>
<script type="application/javascript" src="leaflet.bpg/TileLayer.BPG.js"></script>
<script type="application/javascript"><![CDATA[
  function init() {
    new L.Map('mapcontainer').setView(new L.LatLng(52, 21), 16).addLayer(
      new L.TileLayer.BPG('/osmapa.pl.bpg/{z}/{x}/{y}.bpg', {
        maxZoom: 19,
        attribution: 'Data by <a href="http://osm.org/">OpenStreetMap</a>',
      }));
  }
]]></script>
```

# License

TileLayer.BPG.js: 2-clause BSD.

bpgdec.js: BSD+LGPL-2.1 - see [Licensing](http://bellard.org/bpg/).
