import { findSP } from "decky-frontend-lib";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ChangeKeyLabelById } from "../keyboard";
import { virtualKeyboardContainerClasses } from '../types/personal-static-classes'
import { CustomKeyBehavior } from "./custom-key-behavior";

export class OrientationKey extends CustomKeyBehavior {

    orientation: boolean = false;

    constructor() {
        super('Orientation');
    }

    public Init() {
        this.UpdateStyle();
    }

    UpdateStyle() {
        let className = virtualKeyboardContainerClasses.VirtualKeyboardContainer;
        let osk = findSP().document.getElementsByClassName(className)[0] as HTMLElement;
    
        let Footer = findSP().document.getElementById('Footer') as HTMLElement;
        let Root = findSP().document.getElementById('root_1_') as HTMLElement;
        let Core = findSP().document.getElementById('MainNavMenu-Rest') as HTMLElement;
        
        if (osk && Footer && Root && Core) {
    
    
            osk.style.backgroundColor = 'black';
            
            if (this.orientation) {
                //osk.style.position = 'absolute';
                //osk.style.width = '100%';
                Core.insertBefore(osk, Root);
                ChangeKeyLabelById(this.keyCode, <FaArrowDown/>)
            }
            else {
                //osk.style.position = '';
                //osk.style.width = '';
                Core.insertBefore(osk, Footer.nextSibling);
                ChangeKeyLabelById(this.keyCode, <FaArrowUp/>)
            }
        }
    }

    public override OnAction(): void
    {
        this.orientation = !this.orientation;
        this.UpdateStyle();
    }
}





