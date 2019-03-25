import 'reflect-metadata';
import { join } from 'path';
import { Application } from 'egg';

export default async (app: Application) => {
  app.beforeStart(async () => {

    // hack start
    const containerPath = join(
      app.baseDir,
      'node_modules',
      'type-graphql',
      'dist',
      'utils',
      'container.js',
    );

    require(containerPath);
    const customContainer = require('./lib/customize-container.js');
    require.cache[containerPath].exports.IOCContainer = customContainer.IOCContainer;
    // hack end

    const GraphQLServer = require('./lib/GraphQLServer').default;
    const graphQLServer = new GraphQLServer(app);
    graphQLServer.start();
  });
};
