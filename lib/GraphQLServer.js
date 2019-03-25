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
        this.graphqlConfig = app.config.graphql;
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
        console.log('files:', files);
        try {
            for (const file of files) {
                const resolverPath = path_1.join(baseDir, file);
                const resolver = require(resolverPath).default;
                resolvers.push(resolver);
            }
        }
        catch (e) {
            console.log(e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGhRTFNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkdyYXBoUUxTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBNEI7QUFDNUIsMkJBQWdDO0FBQ2hDLDJDQUFrQztBQUVsQyx5REFBaUQ7QUFDakQsK0NBQTJDO0FBTzNDLE1BQXFCLGFBQWE7SUFJaEMsWUFBWSxHQUFnQjtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDMUMsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDN0IsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkQsTUFBTSxTQUFTLEdBQVUsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxlQUFVLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTyxFQUFFLENBQUM7UUFFdkMseUJBQXlCO1FBQ3pCLE1BQU0sUUFBUSxHQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3BFLE1BQU0sS0FBSyxHQUFHLGlCQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU3QixJQUFJO1lBQ0YsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7Z0JBQ3hCLE1BQU0sWUFBWSxHQUFHLFdBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDMUI7U0FDRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNoQjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFTyxLQUFLLENBQUMsU0FBUztRQUNyQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkMsT0FBTyxNQUFNLDBCQUFXLENBQUM7WUFDdkIsU0FBUztZQUNULGNBQWMsRUFBRSxXQUFXO1lBQzNCLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSztRQUNULE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUksZ0NBQVksQ0FBQztZQUM5QixNQUFNO1lBQ04sT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHO1lBQ3pCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IscUJBQXFCLEVBQUUsU0FBUztpQkFDakM7YUFDSztZQUNSLGFBQWEsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDckIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTTtZQUMvQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7Q0FDRjtBQWhFRCxnQ0FnRUMifQ==