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

const mysql = require('mysql');
const connection = mysql.createConnection({
  /*
  host: 'localhost',
  user: 'wingman_user',
  password: 'M+51+~W2EH)t',
  database: 'wingman_db'
  */

  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wingman_db'
});

function get_info(query: String, callback: any){
    connection.query(query, function (err: any, result: any, fields: any) {
        result = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(result);

        return callback(result);
    });
}

import { Message, MessageInterface } from '../types/messages.type';


@Resolver()
export class ChatResolver {
    

    private conversations:Array<MessageInterface> = [];

    @Query(returns => [Message])
    allMessages(
        @Arg("conversation", { nullable: false }) conversation: String,
    ) {
        /*
        connection.query("SELECT _id, message, conversation, date, fromu as 'from' FROM messages WHERE conversation = '" + conversation + "'", function (err: any, result: any, fields: any) {
            result = Object.values(JSON.parse(JSON.stringify(result)));
            console.log(result);

            return result;
        });
        */
       /*
        get_info("SELECT _id, message, conversation, date, fromu as 'from' FROM messages WHERE conversation = '" + conversation + "'", function(result: any) {
            conversation
            return result;
        });
        */
        
        console.log(this.conversations.filter(c=>c.conversation==conversation));
        return this.conversations.filter(c=>c.conversation==conversation);
        
        //return this.conversations.filter(c=>c.conversation==conversation);
    }

    @Mutation(returns => Boolean)
    async sendMessage(
        @PubSub() pubSub: PubSubEngine,
        @Arg("message") message: string,
        @Arg("conversation") conversation: String,
        @Arg("from") from: String
    ): Promise<boolean> {
        const payload: MessageInterface = { _id:Math.random().toString(), conversation, message, date: moment().unix(), from};
        this.conversations.push(payload);
        const date = new Date().getTime()
        connection.query("INSERT INTO messages (message, conversation, fromu, date) VALUES ('" + message + "', '" + conversation + "', '" + from + "', '" + date + "')", function (err: any, result: any) {
            console.log(result);
            if (err) throw err; else return result;
            });

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