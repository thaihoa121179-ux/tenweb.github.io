* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background: #f4f6f8;
    color: #333;
}

/* HEADER */
.header {
    background: #003a8f;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
}

.logo {
    font-size: 22px;
    font-weight: bold;
}

.menu a {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    font-weight: 500;
}

.menu a:hover {
    text-decoration: underline;
}

/* BANNER */
.banner {
    background: linear-gradient(to right, #005bea, #00c6fb);
    color: white;
    text-align: center;
    padding: 80px 20px;
}

.banner h1 {
    font-size: 38px;
    margin-bottom: 10px;
}

/* CONTENT */
.container {
    max-width: 1200px;
    margin: 50px auto;
    padding: 0 20px;
}

.container h2 {
    margin-bottom: 30px;
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
}

.product {
    background: white;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.product img {
    width: 100%;
    height: 180px;
    object-fit: contain;
}

.product h3 {
    margin: 15px 0;
}

.price {
    color: #e74c3c;
    font-weight: bold;
}

.product button {
    background: #003a8f;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
}

.product button:hover {
    background: #002766;
}

/* FOOTER */
.footer {
    background: #222;
    color: #aaa;
    text-align: center;
    padding: 20px;
    margin-top: 50px;
}
