export function setImage(imgname: string, offx: number, offy: number, offwidth: number, offheight: number): Function {
    return () => {
        this.imgname = imgname;
        this.offx = offx;
        this.offy = offy;
        this.offwidth = offwidth;
        this.offheight = offheight;
        this.tags.set('visable');
        this.ecs.pokitOS.renderer.addEntity(this);
    }
}