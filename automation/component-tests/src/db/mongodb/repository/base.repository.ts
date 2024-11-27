import { FilterQuery, HydratedDocument, Model, QueryOptions } from "mongoose";


export abstract class MongoBaseRepository<
TDocument extends HydratedDocument<TEntity>,
TEntity extends object>
{

    protected constructor(protected model: Model<TDocument>){}

    async findById(id: string): Promise<TEntity | null> {
        return this.model.findById<TDocument>(id);
    }

    async create(data: Partial<TEntity>): Promise<TEntity> {
        const entity = new this.model(data);
        await entity.save();
        return entity.toObject();
    }

    async update(finder: FilterQuery<TDocument>, data: TEntity): Promise<TEntity> {
        const user = await this.model.findOneAndUpdate(
            {finder, data},
            { new: true}
        )
        return user;
    }

    async deleteById(ids: string[]): Promise<boolean>{
        const doc = await this.model.deleteMany({ _id: { $in: ids } });
        return !!doc
    }
}