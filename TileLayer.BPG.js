/*
 * L.TileLayer.BPG can be used with normal (TMS) tile layers in the BPG
 * format if the browser doesn't support that format natively.  The
 * javascript decoder is then used, probably quite slow.  bgpdec.js
 * or one of its variants must have been included.
 */
L.TileLayer.BPG = L.TileLayer.extend({
	onbpgload: function (done, tile) {
		var imageData = tile.dec['frames'][0]['img'];

		/* resize the canvas to the image size */
		tile.width = imageData.width;
		tile.height = imageData.height;

		/* draw the image */
		tile.ctx.putImageData(imageData, 0, 0);

		delete tile.ctx;
		delete tile.dec;

		this._tileOnLoad(done, tile);
	},

	onbpgerror: function (done, tile, e) {
		this._tileOnError(done, tile, e);
	},

	createTile: function (coords, done) {
		var tile = document.createElement('canvas');
		tile.ctx = tile.getContext('2d');
		tile.dec = new BPGDecoder(tile.ctx);

		tile.dec.onload = L.bind(this.onbpgload, this, done, tile);
		tile.dec.onerror = L.bind(this.onbpgerror, this, done, tile);

		tile.dec.load(this.getTileUrl(coords));

		return tile;
	},

	_tileOnError: function (done, tile, e) {
		done(e, tile);
	},

	_onTileRemove: function (e) {
		if ('dec' in e.tile) {
			e.tile.dec.onload = null;
			e.tile.dec.onerror = null;
		}
	},

	_abortLoading: function () {
		var i, tile;
		for (i in this._tiles) {
			tile = this._tiles[i].el;

			if (!('dec' in tile))
				continue;

			tile.dec.onload = null;
			tile.dec.onerror = null;
			L.DomUtil.remove(tile);
			/* TODO: actually cancel request */
		}
	}
});

L.tileLayer.bpg = function (url, options) {
	return new L.TileLayer.BPG(url, options);
};
