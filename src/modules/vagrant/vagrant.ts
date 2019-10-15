import { VagrantBox } from './vagrant-box';

class Vagrant {
    public box: VagrantBox;
    constructor() {
        this.box = new VagrantBox();
    }

}

export default (new Vagrant());
