import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useStoreContext } from "../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../utils/actions";
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';

function Detail() {
	// First call useStoreContext to retrieve current state from globalstate and dispatch method to update it
	const [state, dispatch] = useStoreContext();
	// Destructures id from params 
	const { id } = useParams();

	const [currentProduct, setCurrentProduct] = useState({})
	
	const { loading, data } = useQuery(QUERY_PRODUCTS);
	// Only products needed, so it's destructured from state
	const { products } = state;
	
	// Checks if there is data in global state's products array and displays the one with the matching id
	// If no products in global state are saved yet, uses product data from useQuery to set product data to global state object
	// After the above is complete, it runs over again, but this time with data from products array and then runs setCurrentProduct()
	useEffect(() => {
		if (products.length) {
			setCurrentProduct(products.find(product => product._id === id));
		} else if (data) {
			dispatch({
				type: UPDATE_PRODUCTS,
				products: data.products
			});
		}
	}, [products, data, dispatch, id]);

	return (
		<>
			{currentProduct ? (
				<div className="container my-1">
				<Link to="/">← Back to Products</Link>

				<h2>{currentProduct.name}</h2>

				<p>{currentProduct.description}</p>

				<p>
					<strong>Price:</strong>${currentProduct.price}{' '}
					<button>Add to Cart</button>
					<button>Remove from Cart</button>
				</p>

				<img
					src={`/images/${currentProduct.image}`}
					alt={currentProduct.name}
				/>
				</div>
			) : null}
			{loading ? <img src={spinner} alt="loading" /> : null}
			<Cart />
		</>
	);
}

export default Detail;
