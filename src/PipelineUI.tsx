import React, { useState, useRef } from 'react';
import ReactFlow, {
  Background,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FaSearch, FaUtensils } from 'react-icons/fa';
import { PiBowlFoodFill } from "react-icons/pi";
import { IoArrowRedoOutline } from "react-icons/io5";
import CustomNode from './components/CustomNode';
import MealDetails from './components/MealDetails';
import { BiFoodMenu } from "react-icons/bi";
import { getNodeHeight } from './components/getNodeHeight';
import { fetchMeals, fetchMealbyId, fetchCategories } from './services/api';


const nodeTypes = {
  customNode: CustomNode,
};

export const PipelineUI: React.FC = () => {
  const initialNodes: Node[] = [
    {
      id: 'explore',
      type: 'customNode',
      position: { x: 90, y: 300 },
      data: {
        label: 'Explore',
        icon: <FaSearch style={{ marginRight: '7px' }} />,
        onClick: () => {
          // Custom click functionality for the Explore node
          fetchCategories(addCategories);
        },
      },
    },
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [lastClickedNode] = useState<{ id: string; x: number; y: number } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const onNodesChange: OnNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  // Add categories and the "View Meals" node
  const addCategories = (categories: any[]) => {
    const xDistance = 250;

    // Use lastClickedNode or the initial Explore position if no node was clicked
    const baseNodeX = lastClickedNode ? lastClickedNode.x : 90;
    const baseNodeY = lastClickedNode ? lastClickedNode.y : 300;

    const categoryNodes = categories.map((category, index) => ({
      id: `category-${category.strCategory}`,
      type: 'customNode',
      position: { x: baseNodeX + xDistance, y: baseNodeY + (index - 2) * 70 }, // Adjust position based on last clicked node
      data: {
        label: category.strCategory,
        icon: <PiBowlFoodFill style={{ marginRight: '7px', backgroundColor: 'red', color: 'white', borderRadius: '10%', fontSize: '15px' }} />,
        onClick: () => {
          // Custom click functionality for each category node
          addViewMealsNode(category.strCategory, `category-${category.strCategory}`, baseNodeX + xDistance + 250, baseNodeY + (index - 2) * 70);
        },
      },
    }));

    // Create edges from the last clicked node to the new category nodes
    const newEdges = categoryNodes.map((node) => ({
      id: `edge-${lastClickedNode ? lastClickedNode.id : 'explore'}-${node.id}`,
      source: lastClickedNode ? lastClickedNode.id : 'explore',
      target: node.id,
      type: 'default',
      animated: true,
    }));

    setNodes((prevNodes) => [...prevNodes, ...categoryNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  };

  // Add a "View Meals" node and fetch meals
  const addViewMealsNode = (node: string, sourceNodeId: string, x: number, y: number) => {
    const viewMealsNode = {
      id: `view-meals-${sourceNodeId}`,
      type: 'customNode',
      position: { x, y },
      data: {
        label: 'View Meals',
        icon: <IoArrowRedoOutline style={{ marginRight: '7px', color: '#6bfc03', borderRadius: '10%', fontSize: '15px' }} />,
        onClick: () => {
          // Fetch meals when "View Meals" is clicked
          toggleMealNodes(node, x, y, sourceNodeId);
        },
      },
    };

    const newEdge = {
      id: `edge-view-meals-${sourceNodeId}`,
      source: sourceNodeId,
      target: viewMealsNode.id,
      type: 'default',
      animated: true,
    };

    setNodes((prevNodes) => [...prevNodes, viewMealsNode]);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  // Function to add or remove meal nodes
  const toggleMealNodes = async (node: string, baseX: number, baseY: number, sourceNodeId: string) => {

    fetchMeals(node, baseX + 250, baseY, sourceNodeId, addMealNodes);
  };

  const addMealNodes = (meals: any[], sourceNodeId: string, baseX: number, baseY: number) => {
    // Initialize cumulative height for positioning
    let cumulativeHeight = 0;

    const mealNodes = meals.slice(0, 5).map((meal, index) => {
      // Calculate the node height based on meal name
      const nodeHeight = getNodeHeight(meal.strMeal, 100, 14, 1.5); // You can adjust font size and line height as needed

      // Calculate the new Y position based on cumulative height
      const currentY = baseY + cumulativeHeight;

      // Update cumulative height for the next node
      cumulativeHeight += nodeHeight + 10; // Add 10 for spacing

      return {
        id: `meal-${meal.strMeal}-${sourceNodeId}`,
        type: 'customNode',
        position: { x: baseX, y: currentY + (index - 2) * 70 }, // Use the calculated Y position
        data: {
          label: meal.strMeal,
          icon: (
            <FaUtensils
              style={{
                marginRight: '7px',
                backgroundColor: '#03bafc',
                color: 'white',
                borderRadius: '10%',
                fontSize: '15px',
              }}
            />
          ),
          onClick: () => {
            addIngTagsDetailNode(meal, baseX + 350, currentY + (index - 2) * 70, `meal-${meal.strMeal}-${sourceNodeId}`); // Use the current Y position
          },
        },
      };
    });

    const mealEdges = mealNodes.map((mealNode) => ({
      id: `edge-${sourceNodeId}-${mealNode.id}`,
      source: sourceNodeId,
      target: mealNode.id,
      type: 'default',
      animated: true,
    }));

    // Add new meal nodes and edges
    setNodes((prevNodes) => [...prevNodes, ...mealNodes]);
    setEdges((prevEdges) => [...prevEdges, ...mealEdges]);
  };


  // Add a "View Meals" node and fetch meals
  const addIngTagsDetailNode = (meal: any, baseX: number, baseY: number, sourceNodeId: string) => {

    const viewIngNode = {
      id: `view-Ing-${meal.strMeal}-${sourceNodeId}`,
      type: 'customNode',
      position: { x: baseX, y: baseY - 80 },
      data: {
        label: 'View Ingredients',
        icon: <IoArrowRedoOutline style={{ marginRight: '7px', color: '#6bfc03', borderRadius: '10%', fontSize: '15px' }} />,
        onClick: () => {
          fetchMealbyId(`view-Ing-${meal.strMeal}-${sourceNodeId}`, meal.idMeal, baseX + 250, baseY - 80, AddIngNodes);
        },
      },
    };

    const newIngEdge = {
      id: `edge-view-ing-${meal.strMeal}-${sourceNodeId}`,
      source: sourceNodeId,
      target: viewIngNode.id,
      type: 'default',
      animated: true,
    };

    const viewTagsNode = {
      id: `view-Tags-${meal.strMeal}-${sourceNodeId}`,
      type: 'customNode',
      position: { x: baseX, y: baseY },
      data: {
        label: 'View Tags',
        icon: <IoArrowRedoOutline style={{ marginRight: '7px', color: '#6bfc03', borderRadius: '10%', fontSize: '15px' }} />,
        onClick: () => {
          alert(`You clicked on Ing of: ${meal.strMeal}`);
        },
      },
    };

    const newTagsEdge = {
      id: `edge-view-tags-${meal.strMeal}-${sourceNodeId}`,
      source: sourceNodeId,
      target: viewTagsNode.id,
      type: 'default',
      animated: true,
    };

    const viewDetailsNode = {
      id: `view-Details-${meal.strMeal}-${sourceNodeId}`,
      type: 'customNode',
      position: { x: baseX, y: baseY + 80 },
      data: {
        label: 'View Details',
        icon: <IoArrowRedoOutline style={{ marginRight: '7px', color: '#6bfc03', borderRadius: '10%', fontSize: '15px' }} />,
        onClick: () => {
          setSelectedMeal(meal.idMeal);
          setIsPanelOpen(true);
        },
      },
    };

    const newDetailsEdge = {
      id: `edge-view-details-${meal.strMeal}-${sourceNodeId}`,
      source: sourceNodeId,
      target: viewDetailsNode.id,
      type: 'default',
      animated: true,
    };

    setNodes((prevNodes) => [...prevNodes, viewIngNode, viewTagsNode, viewDetailsNode]);
    setEdges((prevEdges) => [...prevEdges, newIngEdge, newTagsEdge, newDetailsEdge]);
  };

  // Function to handle node clicks
  const AddIngNodes = (nodeId: string, meal: any, baseX: number, baseY: number) => {
    const ingredientNodes: any[] = [];
    const ingredientEdges: any[] = [];

    // Create ingredient nodes based on the meal data
    for (let i = 1; i <= 5; i++) {
      const ingredient = meal[0][`strIngredient${i}`];

      if (ingredient) {
        const ingredientNode = {
          id: `ingredient-${meal.idMeal}-${i}-${nodeId}`, // Unique ID for each ingredient
          type: 'customNode', // Custom node type, if needed
          position: { x: baseX, y: baseY + (i - 3) * 70 },
          data: {
            label: ingredient,
            icon: <BiFoodMenu style={{ marginRight: '7px', backgroundColor: '#a83246', color: 'white', borderRadius: '10%', fontSize: '15px' }} />,
            onClick: () => {
              addViewMealsNode(ingredient, `ingredient-${meal.idMeal}-${i}-${nodeId}`, baseX + 250, baseY + (i - 3) * 70);
            },
          },
        };
        ingredientNodes.push(ingredientNode);

        // Create edges from the "View Ingredients" node to each ingredient node
        ingredientEdges.push({
          id: `edge-${nodeId}-${ingredientNode.id}`,
          source: nodeId,
          target: ingredientNode.id,
          type: 'default',
          animated: true,
        });
      }
    }

    // Update the nodes and edges state
    setNodes((prev) => [...prev, ...ingredientNodes]);
    setEdges((prev) => [...prev, ...ingredientEdges]);
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{
        width: '100vw',
        height: '97vh',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#ffffff',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} // Use the defined node types
      >
        <Background color="#aaa" gap={20} />
      </ReactFlow>
      {/* Sidebar for meal details */}
      {isPanelOpen && selectedMeal && (
        <MealDetails mealId={selectedMeal} onClose={() => setIsPanelOpen(false)} />
      )}
    </div>
  );
};

export default PipelineUI;
