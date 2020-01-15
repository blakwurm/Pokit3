export function setImage(imgname, offx, offy, offwidth, offheight) {
    return () => {
        this.imgname = imgname;
        this.offx = offx;
        this.offy = offy;
        this.offwidth = offwidth;
        this.offheight = offheight;
        this.tags.set('visable');
        this.ecs.pokitOS.renderer.addEntity(this);
    };
}
