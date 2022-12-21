import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useStoreContext } from "../utils/GlobalState";
import {
	REMOVE_FROM_CART,
	UPDATE_CART_QUANTITY,
	ADD_TO_CART,
	UPDATE_PRODUCTS,
} from '../utils/actions';
import { QUERY_PRODUCTS } from '../utils/queries';
import spinner from '../assets/spinner.gif';
import Cart from '../components/Cart';
import { idbPromise } from '../utils/helpers';


function Detail() {
	// First call useStoreContext to retrieve current state from globalstate and dispatch method to update it
	const [state, dispatch] = useStoreContext();
	// Destructures id from params 
	const { id } = useParams();

	const [currentProduct, setCurrentProduct] = useState({})
	
	const { loading, data } = useQuery(QUERY_PRODUCTS);
	// Only products needed, so it's destructured from state
	const { products, cart } = state;
	
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

	const addToCart = () => {
		const itemInCart = cart.find((cartItem) => cartItem._id === id);
	  
		if (itemInCart) {
			dispatch({
				type: UPDATE_CART_QUANTITY,
				_id: id,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
			});

			// If updating quantity, use existing item data and increment purchaseQuantity by 1
			idbPromise('cart', 'put', {
				...itemInCart,
				purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
			})
		} else {
			dispatch({
				type: ADD_TO_CART,
				product: { ...currentProduct, purchaseQuantity: 1 }
			});
			
			// If product isn't in cart yet, add it to current shopping cart in IndexedDb
			idbPromise('cart','put', { ...currentProduct, purchaseQuantity: 1 });
		}
	};

	const removeFromCart = () => {
		dispatch({
			type: REMOVE_FROM_CART,
			_id: currentProduct._id
		});

		// Upon removal from cart, delete item from IndexedDB using 'currentProduct._id' to locate what to remove
		idbPromise('cart', 'delete', { ...currentProduct });
	};

	return (
		<>
			{currentProduct ? (
				<div className="container my-1">
				<Link to="/">← Back to Products</Link>

				<h2>{currentProduct.name}</h2>

				<p>{currentProduct.description}</p>

				<p>
					<strong>Price:</strong>${currentProduct.price}{' '}
					<button onClick={addToCart}>Add to Cart</button>
					<button 
						disabled={!cart.find(p => p._id === currentProduct._id)} 
						onClick={removeFromCart}
					>
						Remove from Cart
					</button>
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
