export const fetchCategories = async (addCategories: Function) => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    addCategories(data.categories.slice(0, 5));
  };
  
  export const fetchMeals = async (node: string, x: number, y: number, sourceNodeId: string, addMealNodes: Function) => {
    let response;
    if (sourceNodeId.startsWith('category-')) {
      response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${node}`);
    } else if (sourceNodeId.startsWith('ingredient-')) {
      response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${node}`);
    } else {
      console.error("Invalid sourceNodeId format");
      return;
    }
    const data = await response.json();
    addMealNodes(data.meals, `view-meals-${sourceNodeId}`, x, y);
  };

  // Fetch meals from the API and add nodes for each meal
  export const fetchMealbyId = async (nodeId: string, mealID: string, baseX: number, baseY: number,AddIngNodes:Function) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await response.json();
    AddIngNodes(nodeId,data.meals,  baseX, baseY); // Pass meal data and the view-meals node ID as the source
  };
  