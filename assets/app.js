
const store={
 products:[],
 cart:JSON.parse(localStorage.getItem('eliteCart')||'[]'),
 fav:JSON.parse(localStorage.getItem('eliteFav')||'[]')
};
const euro=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n);
const toast=t=>{const el=document.querySelector('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1500)};
async function loadProducts(){const r=await fetch('./data/products.json');if(!r.ok)throw new Error('Catalogo non disponibile');store.products=await r.json()}
function urlFor(p){return `product.html?id=${encodeURIComponent(p.id)}`}
function render(items){
 const grid=document.querySelector('#productGrid');if(!grid)return;
 if(!items.length){grid.innerHTML='<div class="empty">Nessun articolo trovato.</div>';return}
 grid.innerHTML=items.map(p=>`<article class="product-card">
 <div class="image-wrap"><a href="${urlFor(p)}"><img src="${p.images[0]}" alt="${p.name}"></a>${p.new?'<span class="tag">NUOVO</span>':''}<button class="heart" onclick="toggleFav('${p.id}')">♡</button></div>
 <div class="product-body"><div class="meta"><span>${p.brand}</span><strong>${euro(p.price)}</strong></div><h3><a href="${urlFor(p)}">${p.name}</a></h3><div class="card-actions"><a class="btn btn-light" href="${urlFor(p)}">Dettagli</a><button class="btn btn-dark" onclick="quickAdd('${p.id}')">Aggiungi</button></div></div></article>`).join('')
}
function apply(){
 const q=(document.querySelector('#search')?.value||'').trim().toLowerCase();
 const cat=document.querySelector('#category')?.value||'';
 const brand=document.querySelector('#brand')?.value||'';
 const sort=document.querySelector('#sort')?.value||'featured';
 let list=store.products.filter(p=>(!q||`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!brand||p.brand===brand));
 if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name));
 render(list)
}
function quickAdd(id){const p=store.products.find(x=>x.id===id);store.cart.push({id,size:p.sizes[0],qty:1});localStorage.setItem('eliteCart',JSON.stringify(store.cart));toast('Prodotto aggiunto al carrello')}
function toggleFav(id){store.fav.includes(id)?store.fav=store.fav.filter(x=>x!==id):store.fav.push(id);localStorage.setItem('eliteFav',JSON.stringify(store.fav));toast('Preferiti aggiornati')}
document.addEventListener('DOMContentLoaded',async()=>{try{await loadProducts();render(store.products);['search','category','brand','sort'].forEach(id=>document.querySelector('#'+id)?.addEventListener('input',apply))}catch(e){document.querySelector('#productGrid').innerHTML='<div class="empty">Errore nel caricamento del catalogo.</div>'}});
