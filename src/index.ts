import "reflect-metadata";
require('dotenv').config({path: __dirname + '/env/general.env'});
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { logger } from './helpers/logger.helper';
import { getHeaders } from "./helpers/headers.helper";
import { ChatResolver } from './resolvers/chat.resolver';
import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/chat', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}).then(()=>{
    const init = async (port: any = 4020) => {
        const schema = await buildSchema({
            resolvers: [
                ChatResolver
            ]
        });
    
        const server = new ApolloServer({
            schema,
            subscriptions: "/graphql",
            introspection: true,
            playground: true,
            cacheControl: {
                defaultMaxAge: 0
            },
            context: async ({ req,res }) => {
                if(res){
                    res.setTimeout(600000,()=>{
                        logger.info('Request has timed out.');
                        res.send(408);
                    });
                }
                return await getHeaders(req,res);
            }
        });
        const { url } = await server.listen(port);
        logger.info(`Server is running on ${url}`);
        return server;
    }
    init(process.env.PORT_GRAPHQL||4020);
});