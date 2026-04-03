import { useEffect, useState } from "react";

function App() {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");
	const [products, setProducts] = useState([]);
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		fetch("https://gw21.onrender.com/products")
			.then((res) => res.json())
			.then((data) => setProducts(data));
	}, []);

	const onFinish = (e) => {
		e.preventDefault();
		if (editingId) {
			fetch(`https://gw21.onrender.com/products/${editingId}`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({ title, price }),
			})
				.then((res) => res.json())
				.then((data) => {
					setProducts(
						products.map((p) =>
							p._id === editingId ? data.product : p,
						),
					);
					setEditingId(null);
				})
				.catch((e) => {
					console.log(e);
					alert("Xatolik yuz berdi");
				});
		} else {
			fetch("https://gw21.onrender.com/products", {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({ title, price }),
			})
				.then((res) => res.json())
				.then((data) => {
					setProducts([...products, data.product]);
				})
				.catch((e) => {
					console.log(e);
					alert("Xatolik yuz berdi");
				});
		}
		setTitle("");
		setPrice("");
	};

	const deleteProduct = (id) => {
		fetch(`https://gw21.onrender.com/products/${id}`, {
			method: "DELETE",
		})
			.then(() => {
				setProducts(products.filter((p) => p._id !== id));
			})
			.catch((e) => {
				console.log(e);
				alert("Xatolik yuz berdi");
			});
	};

	return (
		<div>
			<h2>Products</h2>
			<form onSubmit={onFinish}>
				<input
					value={title}
					type="text"
					placeholder="Title kiriting"
					required
					onChange={(e) => setTitle(e.target.value)}
				/>
				<input
					value={price}
					type="text"
					placeholder="Price kiriting"
					required
					onChange={(e) => setPrice(e.target.value)}
				/>
				<button type="submit">submit</button>
			</form>
			<div className="cards">
				{products.map((p) => (
					<div className="card" key={p._id}>
						<h2>{p.title}</h2>
						<p>${p.price}</p>
						<div>
							<button
								onClick={() => deleteProduct(p._id)}
							>
								delete
							</button>
							<button
								onClick={() => {
									setEditingId(p._id);
									setTitle(p.title);
									setPrice(p.price);
								}}
							>
								update
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
