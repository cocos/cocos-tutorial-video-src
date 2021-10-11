
import { _decorator, Component, Node, Graphics } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Draw
 * DateTime = Thu Sep 30 2021 16:36:00 GMT+0800 (China Standard Time)
 * Author = mywayday
 * FileBasename = Draw.ts
 * FileBasenameNoExtension = Draw
 * URL = db://assets/Draw.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('Draw')
export class Draw extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        const g = this.getComponent(Graphics);
        g.fillRect(0, 0, 400, 300);
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
