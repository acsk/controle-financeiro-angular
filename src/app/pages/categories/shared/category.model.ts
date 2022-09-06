import { BaseResourceModel } from '../../../shared/models/base-resource-model';

export class Category extends BaseResourceModel {
    constructor(
        public override id?: Number,
        public name?: String,
        public description?: Number
    ) { super()}

}
