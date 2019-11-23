function GetViewPort ()
{
    return viewPort;
}

var viewPort = {
    screanSize: [0, 0], // this will be set to the size of the canvase.
    startTile: [0, 0], // pixle pos of the top left most tile.
    endTile: [0, 0], // pixle pos of the bottom right most tile.
    offset: [0, 0], // offset in pixles of the camera to the middle of the canvase.
    update: function (px, py) {
        this.offset[0] = Math.floor((this.screanSize[0] / 2) - px);
        this.offset[1] = Math.floor((this.screanSize[1] / 2) - py);

        // find the that will be in the middle of the screan, THIS SHOULD BE THE PLAER.
        var tile = [
            Math.floor(px / tileW),
            Math.floor(py / tileH)
        ];

        // get the pixle pos of starting tile.
        this.startTile[0] = tile[0] - 1 - Math.ceil((this.screanSize[0] / 2) / tileW);
        this.startTile[1] = tile[1] - 1 - Math.ceil((this.screanSize[1] / 2) / tileH);

        if (this.startTile[0] < 0)
            this.startTile[0] = 0;
        if (this.startTile[1] < 0)
            this.startTile[1] = 0;

        this.endTile[0] = tile[0] + 1 + Math.ceil((this.screanSize[0] / 2) / tileW);
        this.endTile[1] = tile[1] + 1 + Math.ceil((this.screanSize[1] / 2) / tileH);

        if (this.endTile[0] >= mapW)
            this.endTile[0] = mapW - 1;
        if (this.endTile[1] >= mapH)
            this.endTile[1] = mapH - 1;
    }
}