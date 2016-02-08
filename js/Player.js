var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function() {
        enchant.Sprite.call(this, 32, 32);
        this.x = 100;
        this.y = 120;
        this.high = this.y,
        this.isJump = false;
        this.frame = 0;
    },
    walk: function() {
        this.frame = this.frame == 2? 0 : this.frame + 1;
    },
    jump: function() {
        if (this.y != this.high) {
            return;
        }
        console.log(this.y);
        this.tl.moveBy(0, -50, 5, enchant.Easing.CUBIC_EASEOUT)
            .moveBy(0, 50, 5, enchant.Easing.CUBIC_EASEIN);
    }
});