export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}


export function idbPromise(storeName, method, object) {
	return new Promise((resolve, reject) => {
		// Open connectio to database `shop-shop' with verson 1
		const request = window.indexedDB.open('shop-shop', 1);

		// Create vriables to hold reference to database, transaction(tx), and object store
		let db, tx, store;

		// If version ahs changed (or if this is first time using database), run this method and create the three object stores
		request.onupgradeneeded = function(e) {
			const db = request.result;
			// Create object store for each type of data and set 'primary' key index to be the '_id' of the data
			db.createObjectStore('products', { keyPath: '_id'});
			db.createObjectStore('categories', { keyPath: '_id' });
			db.createObjectStore('cart', { keyPath:'_id' }); 
		};

		// Handle any errors with connecting
		request.onerror = function(e) {
			console.log ('There was an error');
		};

		// On database open success
		request.onsuccess = function(e) {
			// Save a reference of the database to the 'db' variable
			db = request.result;
			// Open a transaction do whatever we pass into 'storeName' (must match one of the object store names)
			tx = db.transaction(storeName, 'readwrite');
			// Save a reference to that object store
			store = tx.objectStore(storeName);

			// If any errors, we will now
			db.onerror = function(e) {
				console.log('error', e);
			};

			//Switch statement to check what value of the method is
			switch (method) {
				// Overwrite data with matching _id value from object and adds it if there's no match
				case 'put':
					store.put(object);
					resolve(object);
					break;
				// Gets all data from store and returns it
				case 'get':
					const all = store.getAll();
					all.onsuccess = function() {
						resolve(all.result);
					};
					break;
				// Item with _id value is deleted from the object store
				case 'delete':
					store.delete(object._id);
					break;
				
				default:
					console.log('No valid method');
					break;
			}

			// When tx is complete, close connection
			tx.oncomplete = function() {
				db.close();
			}
		};
	});	
}