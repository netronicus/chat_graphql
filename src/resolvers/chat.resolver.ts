import { PubSubEngine } from 'graphql-subscriptions';
import {
    Resolver,
    Query,
    Mutation,
    Arg,
    PubSub,
    Subscription,
} from "type-graphql";

import moment from 'moment';

import { Message, MessageInterface } from '../types/messages.type';

@Resolver()
export class ChatResolver {
    private conversations:Array<MessageInterface> = [];

    @Query(returns => [Message])
    allMessages(
        @Arg("conversation", { nullable: false }) conversation: String,
    ) {
        return this.conversations.filter(c=>c.conversation==conversation);
    }

    @Mutation(returns => Boolean)
    async sendMessage(
        @PubSub() pubSub: PubSubEngine,
        @Arg("message") message: string,
        @Arg("conversation") conversation: String,
        @Arg("from") from: String,
        @Arg("usuario") usuario: String
    ): Promise<boolean> {
        const payload: MessageInterface = { _id:Math.random().toString(), conversation, message, date: moment().unix(), from, usuario};
        this.conversations.push(payload);
        console.log(payload);
        await pubSub.publish("NEWMESSAGE", payload);
        return true;
    }

    @Subscription(returns => [Message], {
        topics: "NEWMESSAGE"
    })
    subscriptionMessage(
        @Arg("conversation", { nullable: false }) conversation: String,
    ) {
        return this.conversations.filter(c=>c.conversation==conversation);
    }
}