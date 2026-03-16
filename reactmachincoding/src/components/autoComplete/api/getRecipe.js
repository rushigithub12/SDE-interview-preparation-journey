export async function getRecipe(query) {
    const data = await fetch(`https://dummyjson.com/recipes/search?q=${query}`);
    const response = data.json();
    return response
}