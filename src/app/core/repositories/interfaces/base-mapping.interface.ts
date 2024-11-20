import { Paginated } from "../../models/paginated.model";

export interface IBaseMapping<T> {
    getPaginated(page:number, pageSize: number, pages:number, data:any):Paginated<T>;
    getOne(data:any):T;
    getAdded(data:any):T;
    getUpdated(data:any):T;
    getDeleted(data:any):T;
    setAdd(data:T):any;
    setUpdate(data:any):any;
  }