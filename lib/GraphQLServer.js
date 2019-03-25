"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const fs_jetpack_1 = require("fs-jetpack");
const apollo_server_koa_1 = require("apollo-server-koa");
const type_graphql_1 = require("type-graphql");
class GraphQLServer {
    constructor(app) {
        this.app = app;
        this.graphqlConfig = app.config.typeGraphQL;
    }
    loadResolvers() {
        const { baseDir } = this.app;
        const graphqlDir = path_1.join(baseDir, 'app', 'graphql');
        const resolvers = [];
        if (!fs_1.existsSync(graphqlDir))
            return [];
        // TODO: handle other env
        const matching = this.app.config.env === 'local' ? '*resolver.ts' : '*resolver.js';
        const files = fs_jetpack_1.find(graphqlDir, { matching });
        try {
            for (const file of files) {
                const resolverPath = path_1.join(baseDir, file);
                const resolver = require(resolverPath).default;
                resolvers.push(resolver);
            }
        }
        catch (e) {
            this.app.logger.error('[egg-type-graphql]', JSON.stringify(e));
        }
        return resolvers;
    }
    async getSchema() {
        const resolvers = this.loadResolvers();
        return await type_graphql_1.buildSchema({
            resolvers,
            dateScalarMode: 'timestamp',
            emitSchemaFile: true,
        });
    }
    async start() {
        const schema = await this.getSchema();
        const server = new apollo_server_koa_1.ApolloServer({
            schema,
            tracing: false,
            context: ({ ctx }) => ctx,
            playground: {
                settings: {
                    'request.credentials': 'include',
                },
            },
            introspection: true,
        });
        server.applyMiddleware({
            app: this.app,
            path: this.graphqlConfig.router,
            cors: false,
        });
        this.app.logger.info('[egg-type-graphql] GraphQL server started');
    }
}
exports.default = GraphQLServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhRTFNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdyYXBoUUxTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBMkI7QUFDM0IsMkJBQStCO0FBQy9CLDJDQUFpQztBQUVqQyx5REFBZ0Q7QUFDaEQsK0NBQTBDO0FBTzFDLE1BQXFCLGFBQWE7SUFJaEMsWUFBWSxHQUFnQjtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUE7SUFDN0MsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7UUFDNUIsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDbEQsTUFBTSxTQUFTLEdBQVUsRUFBRSxDQUFBO1FBRTNCLElBQUksQ0FBQyxlQUFVLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTyxFQUFFLENBQUE7UUFFdEMseUJBQXlCO1FBQ3pCLE1BQU0sUUFBUSxHQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFBO1FBQ25FLE1BQU0sS0FBSyxHQUFHLGlCQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUU1QyxJQUFJO1lBQ0YsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7Z0JBQ3hCLE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ3hDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUE7Z0JBQzlDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7YUFDekI7U0FDRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUMvRDtRQUVELE9BQU8sU0FBUyxDQUFBO0lBQ2xCLENBQUM7SUFFTyxLQUFLLENBQUMsU0FBUztRQUNyQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDdEMsT0FBTyxNQUFNLDBCQUFXLENBQUM7WUFDdkIsU0FBUztZQUNULGNBQWMsRUFBRSxXQUFXO1lBQzNCLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksZ0NBQVksQ0FBQztZQUM5QixNQUFNO1lBQ04sT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHO1lBQ3pCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IscUJBQXFCLEVBQUUsU0FBUztpQkFDakM7YUFDSztZQUNSLGFBQWEsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDckIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUMvQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO0lBQ25FLENBQUM7Q0FDRjtBQS9ERCxnQ0ErREMifQ==