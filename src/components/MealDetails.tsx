import React from 'react';
import '../MealDetails.css'; // Import custom CSS

// Dummy data for demonstration
interface Meal {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
    strMealThumb: string;
    strTags: string | null;
    strYoutube: string | null;
    strSource: string | null;
  }
  

// SidePanel component
interface MealDetailsProps {
    mealId: string;
    onClose: () => void;
  }
  
  const MealDetails: React.FC<MealDetailsProps> = ({ mealId, onClose }) => {
    const [meal, setMeal] = React.useState<Meal | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
  
    // Fetch the meal data based on mealId
    React.useEffect(() => {
      const fetchMealDetails = async () => {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
          const data = await response.json();
          setMeal(data.meals[0]);
          setLoading(false);
        } catch (err) {
          setError('Error fetching meal data');
          setLoading(false);
        }
      };
  
      fetchMealDetails();
    }, [mealId]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!meal) return null;
  
    // Now render the meal details
    const tags = meal.strTags ? meal.strTags.split(',') : [];
  
    return (
        <div className="side-panel">
          <div className="panel-header">
            <h2>{meal.strMeal}</h2>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
      
          <div className="meal-content">
            {/* Meal Image */}
            <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
      
            {/* Tags */}
            <div className="tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
      
            {/* Category and Area */}
            <p>Category: {meal.strCategory}</p>
            <p>Area: {meal.strArea}</p>
      
            {/* Youtube Link */}
            {meal.strYoutube && (
              <p>
                Youtube: <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">Watch</a>
              </p>
            )}
      
            {/* Recipe Link */}
            {meal.strSource && (
              <p>
                Recipe: <a href={meal.strSource} target="_blank" rel="noopener noreferrer">Read</a>
              </p>
            )}
      
            {/* Instructions Card */}
            <div className="instructions-card">
              <h3>Instructions</h3>
              <p className="instructions-text">{meal.strInstructions}</p>
            </div>
          </div>
        </div>
      );      
  };
  

export default MealDetails;
