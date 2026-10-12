import { useMemo, useState } from 'react';

const products = [
  { id: 1, name: 'Stoneware Pour-Over', category: 'Kitchen', price: 38, tone: 'clay', tag: 'BESTSELLER', image: 'photo-1495474472287-4d71bcdd2085' },
  { id: 2, name: 'Everyday Tote', category: 'Accessories', price: 24, tone: 'olive', tag: '', image: 'photo-1553062407-98eeb64c6a62' },
  { id: 3, name: 'Ribbed Glass Set', category: 'Kitchen', price: 32, tone: 'blue', tag: 'SET OF 4', image: 'photo-1513558161293-cdaf765edfd4' },
  { id: 4, name: 'Soft Cotton Throw', category: 'Home', price: 68, tone: 'sand', tag: '', image: 'photo-1600210492486-724fe5c67fb0' },
];

const categories = ['All', 'Home', 'Kitchen', 'Accessories'];

function Storefront() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [notice, setNotice] = useState('');
  const visibleProducts = useMemo(
    () => activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  function addToCart(name) {
    setCartCount((count) => count + 1);
    setNotice(`${name} added to your bag`);
    window.setTimeout(() => setNotice(''), 2200);
  }

  return (
    <div className="site-shell">
      <div className="announcement">A little something for you: free shipping on orders over $75</div>
      <header className="header">
        <a className="wordmark" href="#top" aria-label="Form and Field home">form <span>&</span> field</a>
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a><a href="#story">Our story</a><a href="#newsletter">Journal</a>
        </nav>
        <button className="bag-button" type="button" aria-label={`Shopping bag, ${cartCount} items`}>
          Bag <span className="bag-count">{cartCount}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero" id="story">
          <div className="hero-copy">
            <p className="eyebrow">GOOD THINGS, MADE TO LAST</p>
            <h1>Everyday,<br /><em>considered.</em></h1>
            <p className="hero-description">Useful objects for slower mornings, softer spaces, and all the little moments in between.</p>
            <a className="dark-button" href="#shop">Explore the collection <span aria-hidden="true">↗</span></a>
            <div className="hero-note"><span className="note-mark">✳</span><span>Thoughtfully sourced.<br />Made for the everyday.</span></div>
          </div>
          <div className="hero-image" role="img" aria-label="Warm, sunlit home interior with thoughtfully chosen decor">
            <div className="image-caption">Objects for a life well lived <span>01 / 04</span></div>
          </div>
        </section>

        <section className="collection" id="shop">
          <div className="section-heading">
            <div><p className="eyebrow">THE GOOD STUFF</p><h2>Small things, <em>big feeling.</em></h2></div>
            <a className="text-link" href="#shop">View all products <span aria-hidden="true">↗</span></a>
          </div>
          <div className="filters" aria-label="Filter products by category">
            {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}</button>)}
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className={`product-image ${product.tone}`}>
                  <img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=800&q=80`} alt={product.name} loading="lazy" />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <button className="quick-add" type="button" onClick={() => addToCart(product.name)}>+ Add to bag</button>
                </div>
                <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><span>${product.price}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="promise" id="newsletter">
          <span className="promise-star">✳</span><p>Less, but better.<br /><em>Always.</em></p><span className="promise-detail">Good design should feel at home<br />in your home.</span>
        </section>
      </main>
      <footer><a className="wordmark" href="#top">form <span>&</span> field</a><p>Made for your every day.</p><span>© 2025 form & field</span></footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default Storefront;
