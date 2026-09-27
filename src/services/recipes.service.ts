import { RecipesMapper } from "../mappers/recipes.mapper";
import { NewRecipe, Recipe, RecipeDBO, RecipeFilter, UpdateRecipeDTO } from "../models/recipe.model";
import { AbstractService } from "./abstract.service";
import { UsersService } from "./users.service";

export class RecipesService extends AbstractService {
  protected static dbPath: string = "data/recipes.json";

  private static readRecipesDB(): Recipe[] {
    return RecipesService.readDB<RecipeDBO, Recipe>(RecipesMapper.fromDBO);
  }

  private static writeRecipesDB(recipes: Recipe[]): boolean {
    return RecipesService.writeDB<Recipe, RecipeDBO>(recipes, RecipesMapper.toDBO);
  }

  /**
   * Toutes les recettes, éventuellement filtrées.
   * Les filtres sont cumulatifs (ET logique).
   */
  static getAll(filter: RecipeFilter): Recipe[] {
    const recipes = this.readRecipesDB();
    const result: Recipe[] = [];
    //AJOUT
    const {categoryId, authorId, search, ingredient, maxPrepTime}= filter;
    for (const recipe of recipes) {
      //ANCIEN CODE
      //if (filter.categoryId !== undefined && recipe.categoryId !== filter.categoryId)
       if (categoryId !== undefined && recipe.categoryId !== categoryId){
        continue;
      }
      //if (filter.authorId !== undefined && recipe.authorId !== filter.authorId) 
      if (authorId !== undefined && recipe.authorId !== authorId) {
        continue;
      }
      //if (filter.search !== undefined) 
      if (search !== undefined){
        const searc = search.toLowerCase();
        const inTitle = recipe.title.toLowerCase().includes(searc);
        const inDescription = recipe.description.toLowerCase().includes(searc);
        if (!inTitle && !inDescription) {
          continue;
        }
      }
      //if (filter.ingredient !== undefined)
      if (ingredient !== undefined) {
        const ingredien = ingredient.toLowerCase();
        let found = false;
        for (const item of recipe.ingredients) {
          if (item.name.toLowerCase().includes(ingredien)) {
            found = true;
          }
        }
        if (!found) {
          continue;
        }
      }
      //if (filter.maxPrepTime !== undefined && recipe.prepTime + recipe.cookTime > filter.maxPrepTime) 
      if (maxPrepTime !== undefined && recipe.prepTime + recipe.cookTime > maxPrepTime) {
        continue;
      }
      result.push(recipe);
    }

    return result;
  }

  /**
   * Une recette par son id, ou undefined si elle n'existe pas
   */
  static getById(id: number): Recipe | undefined {
    const recipes = this.readRecipesDB();

    return recipes.find(recipe=> recipe.id=== id);
    //ancien code
    /*for (const recipe of recipes) {
      if (recipe.id === id) {
        return recipe;
      }
    }
    return undefined;*/
  }

  /**
   * Les recettes dont les ids sont fournis (ex : favoris d'un utilisateur)
   */
  static getByIds(ids: number[]): Recipe[] {
    const recipes = this.readRecipesDB();


    return recipes.filter(recipe=> ids.includes(recipe.id));
    //ancien code
    /*const result: Recipe[] = [];
    for (const recipe of recipes) {
      if (ids.includes(recipe.id)) {
        result.push(recipe);
      }
    }
    return result;*/
  }

  /**
   * Crée une recette.
   * @returns la recette créée, ou undefined si l'écriture a échoué
   */
  static create(newRecipe: NewRecipe): Recipe | undefined {
    const recipes = this.readRecipesDB();

    const recipe: Recipe = {
      //utilisation du opérateur spread
      ... newRecipe,
      id: RecipesService.getNextId(recipes),// on mets apres pour ecraser des valeurs anciens si jamais il ya un autre id
     //code ancien
      /*title: newRecipe.title,
      description: newRecipe.description,
      imageUrl: newRecipe.imageUrl,
      prepTime: newRecipe.prepTime,
      cookTime: newRecipe.cookTime,
      servings: newRecipe.servings,
      difficulty: newRecipe.difficulty,
      categoryId: newRecipe.categoryId,
      tags: newRecipe.tags,
      ingredients: newRecipe.ingredients,
      steps: newRecipe.steps,
      authorId: newRecipe.authorId,*/
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    recipes.push(recipe);
    if (!this.writeRecipesDB(recipes)) {
      return undefined;
    }
    return recipe;
  }

  /**
   * Remplace le contenu d'une recette existante (l'id, l'auteur et la date de création sont conservés).
   * @returns la recette mise à jour, ou undefined si elle n'existe pas
   */
  static update(id: number, updatedRecipe:NewRecipe): Recipe | undefined {
    const recipes = this.readRecipesDB();
    const index = recipes.findIndex((recipe) => recipe.id === id);
    if (index === -1) return undefined;

    const existing = recipes[index];
    const recipe: Recipe = {
      ...updatedRecipe,
      id: existing.id,
      //modif
      /*title: updatedRecipe.title,
      description: updatedRecipe.description,
      imageUrl: updatedRecipe.imageUrl,
      prepTime: updatedRecipe.prepTime,
      cookTime: updatedRecipe.cookTime,
      servings: updatedRecipe.servings,
      difficulty: updatedRecipe.difficulty,
      categoryId: updatedRecipe.categoryId,
      tags: updatedRecipe.tags,
      ingredients: updatedRecipe.ingredients,
      steps: updatedRecipe.steps,*/
      authorId: existing.authorId,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };

    recipes[index] = recipe;
    if (!this.writeRecipesDB(recipes)) {
      return undefined;
    }
    return recipe;
  }

  /**
   * Supprime une recette (et la retire des favoris de tous les utilisateurs).
   * @returns true si supprimée, false si elle n'existait pas
   */
  static delete(id: number): boolean {
    const recipes = this.readRecipesDB();
    const index = recipes.findIndex((recipe) => recipe.id === id);
    if (index === -1) return false;

    recipes.splice(index, 1);
    if (!this.writeRecipesDB(recipes)) return false;

    UsersService.removeFavoriteForAll(id);
    return true;
  }


  //EXO 2 
  /**
   * 
   * @param id 
   * @param updatedRecipe 
   * @returns recette mise à jour 
   */
  static patch(id: number, updatedRecipe: UpdateRecipeDTO): Recipe |undefined{

    const recipes = this.readRecipesDB();
    const index = recipes.findIndex(recipe=> recipe.id === id);
    if(index===-1) return undefined;

    const existing = recipes[index];

    const recipe : Recipe ={
      ...existing,
      ...updatedRecipe,
      id: existing.id,
      authorId: existing.authorId,
      createdAt:existing.createdAt,
      updatedAt: new Date
    }
    recipes[index] = recipe;
    this.writeRecipesDB(recipes);
    return recipe;
  }
}
