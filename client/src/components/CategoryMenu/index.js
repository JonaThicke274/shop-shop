import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from "../../utils/GlobalState";

function CategoryMenu() {
	// First call useStoreContext to retrieve current state from globalstate and dispatch method to update it
	const [state, dispatch] = useStoreContext();
	// Only categories is needed so it's destructured from state
	const { categories } = state;

	const { data: categoryData } = useQuery(QUERY_CATEGORIES);

	// Runs immediately on load and then passes function to update global state and data we're dependent on(categoryData & dispatch)
	// categoryData is undefined on load but useEffect sees  that categoryData exists and the nruns dispatch function
	useEffect(() => {
		// if categoryData exists or has changed from the response of useQuery, then run dispatch()
		if (categoryData) {
			// execute our dispatch function with our action object indicating the type of action and the data to set our state for categories to
			dispatch({
				type: UPDATE_CATEGORIES,
				categories: categoryData.categories
			});
		}
	}, [categoryData, dispatch])

	// Runs dispatch to update current category
	const handleClick = id => {
		dispatch({
			type: UPDATE_CURRENT_CATEGORY,
			currentCategory: id
		});
	};

	return (
		<div>
			<h2>Choose a Category:</h2>
			{categories.map((item) => (
				<button
					key={item._id}
					onClick={() => {
						handleClick(item._id);
					}}
				>
					{item.name}
				</button>
			))}
		</div>
	);
}

export default CategoryMenu;
