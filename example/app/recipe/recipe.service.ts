import { Service } from 'typedi';

@Service()
export class RecipeService {
  getRecipe() {
    return {
      title: 'hello~*',
      description: 'desc......',
      createdAt: new Date(),
    };
  }
}
