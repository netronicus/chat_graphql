import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Message {
    @Field(type => ID) _id: String;
    @Field() conversation: String;
    @Field() message: String;
    @Field() date: Number;
    @Field() from: String;
}

export interface MessageInterface {
    _id: String;
    conversation: String;
    message: String;
    date: Number;
    from: String;
}