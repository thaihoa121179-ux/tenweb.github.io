* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

body {
    background: #f5f5f5;
    color: #333;
}

/* HEADER */
header {
    background: #0a3d62;
    color: white;
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

header h1 {
    font-size: 24px;
}

nav a {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    font-weight: bold;
}

nav a:hover {
    text-decoration: underline;
}

/* BANNER */
.banner {
    background: linear-gradient(to right, #1e90ff, #00bcd4);
    color: white;
    padding: 80px 20px;
    text-align: center;
}

.banner h2 {
    font-size: 40px;
    margin-bottom: 15px;
}

/* CONTENT */
.container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 20px;
}

.products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.product {
    background: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.product img {
    max-width: 100%;
    height: 180px;
    object-fit: contain;
}

.product h3 {
    margin: 15px 0;
}

.product button {
    background: #0a3d62;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
}

.product button:hover {
    background: #07406a;
}

/* FOOTER */
footer {
    background: #222;
    color: #aaa;
    text-align: center;
    padding: 20px;
    margin-top: 50px;
}
