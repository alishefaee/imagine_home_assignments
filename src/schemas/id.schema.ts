import {IsMongoId} from "class-validator";

export class IdSchema {
@IsMongoId()
    id!:string
}

export class _IdSchema {
    @IsMongoId()
    _id!:string
}
