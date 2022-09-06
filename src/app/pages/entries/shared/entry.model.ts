import { BaseResourceModel } from './../../../shared/models/base-resource-model';
import { Category } from "../../categories/shared/category.model";

export class Entry  extends BaseResourceModel{
    constructor(
        public override id?: Number,
        public name?: string,
        public description?: string,
        public type?: string,
        public amount?: string,
        public date?: string,
        public paid?: boolean,
        public categoryId?: Number,
        public category?: Category,
    ) { super() }

    static types = {
        expense: 'Despesa',
        revenue: 'Receita'
    }

    get paidText(): string {
        return this.paid ? 'Pago' : 'Pendente'
    }
}