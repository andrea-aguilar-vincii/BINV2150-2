
# Documentation API

## POST auth/register
-Description : Crée un nouveau compte
-Body : Nouveau compte
-Reponse :
    -201 : Compte créée
        -Body : Compte créée avec son ID
    -409 : Une compte avec le même email existe dèjá
    -400 : donnés incomplets

## POST auth/login
-Description : Vérifie les identifiants et renvoie un token
-Body : compte déja existant (son email et pwd)
-Réponses : 
    -200 : vérification reussi
    -401 : mot de passe incorrect

## GET auth/me
-Description : Récupère l'utilisateur correcpondant
-Paramètre : token 
-Réponse : 
    -200 : Succès
    -401 : Non authetifié


## GET categories
-Description : Récupère toutes les categories
-Réponses : 
    -200 : Succès

## GET categories/:id
-Description : Récupère categorie par son ID
-Paramètre : id(path) : ID de la catégorie à trouver
-Réponse :
    -200 : succès
    -404 : catégorie non trouvé

## GET users
-Description : Récupère toutes les users
-Réponses : 
    -200 : Succès


## GET users/me/favorites
-Description : Récupère les recettes favorites de l'utilisateur
-Paramètre : id(path ) ID utilisateur
    -favorites(query): Recettes favorites (optionnel)
-Réponse : 
    -200 : Succès
    -401 : Non authetifié

## PUT users/me/favorites/:recipeId
-Descritpion 


## DELETE users/me/favorites/:recipeId


## GET users/:id


## DELETE users/:id