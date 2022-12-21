import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from "../../utils/helpers";
import spinner from '../../assets/spinner.gif';


function ProductList() {
	// First call useStoreContext to retrieve current state from globalstate and dispatch method to update it	
	const [state, dispatch] = useStoreContext();
	// Only currentcCategory needed so it's destructured from state
	const { currentCategory } = state;

	const { loading, data } = useQuery(QUERY_PRODUCTS);

	// Runs immediately on load, passes function to update global state and needed data (data, dispatch)
	// data will be undefined at first but will have useEffect run again since it exists
	useEffect(() => {
		// If data to be stored
		if (data) {
			// execute our dispatch function with our action object indicating the type of action and the data to set our state for products to
			dispatch({
				type: UPDATE_PRODUCTS,
				products: data.products
			});
			
			// Let's also take each product and save it to IndexedDB using helper function
			data.products.forEach((product) => {
				idbPromise('products', 'put', product);
			});
		}
	}, [data, loading, dispatch]);

	// Based on currentCategory value, will filter the products that have the correct currentCategory value
	function filterProducts() {
		if (!currentCategory) {
			return state.products;
		}

		return state.products.filter(product => product.category._id === currentCategory);
	}

	return (
		<div className="my-2">
			<h2>Our Products:</h2>
			{state.products.length ? (
				<div className="flex-row">
					{filterProducts().map((product) => (
						<ProductItem
							key={product._id}
							_id={product._id}
							image={product.image}
							name={product.name}
							price={product.price}
							quantity={product.quantity}
						/>
					))}
				</div>
				) : (
					<h3>You haven't added any products yet!</h3>
			)}
			{loading ? <img src={spinner} alt="loading" /> : null}
		</div>
	);
}

export default ProductList;
