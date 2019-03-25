// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportGraphql from '../../../app/middleware/graphql';

declare module 'egg' {
  interface IMiddleware {
    graphql: typeof ExportGraphql;
  }
}
