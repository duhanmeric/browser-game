export default class Game {
    constructor(ctx, w, h, tiles){
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.char_size = 64;
        this.ROWS = this.h / this.char_size
        this.COLS = this.w / this.char_size
        this.tiles = tiles;
    }

    layers = [
        [
            1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,
        ]
    ]

    draw(){
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            for (let j = 0; j < this.ROWS; j++) {
                for (let k = 0; k < this.COLS; k++) {
                    const imageType = layer[j * this.COLS + k];
                    this.ctx.drawImage(this.tiles[imageType],
                     k * this.char_size, j * this.char_size, this.char_size, this.char_size);
                }
            }
        }
    }

    clearRect = () => {
        this.ctx.clearRect(0, 0, this.w, this.h);
    };
}
