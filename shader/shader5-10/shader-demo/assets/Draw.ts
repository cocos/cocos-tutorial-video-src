
import { _decorator, Component, Node, Graphics, Material, EffectAsset, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draw')
export class Draw extends Component {
    @property(EffectAsset)
    effect: EffectAsset = null!;

    start () {
        // const g = this.getComponent(Graphics);
        // g.fillRect(0, 0, 400, 300);

        const mat = new Material();
        mat.initialize({ effectAsset: this.effect, defines:{ USE_TEXTURE: true } });

        const spComp = this.getComponent(Sprite);
        spComp.customMaterial = mat;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
