
const euro=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n);
let product,selectedSize='',qty=1,current=0;
const toast=t=>{const e=document.querySelector('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500)};
async function init(){
 const id=new URLSearchParams(location.search).get('id');
 const data=await (await fetch('./data/products.json')).json();
 product=data.find(x=>x.id===id)||data[0];
 document.title=`${product.name} | ÉLITE LC BRAND`;
 main.src=product.images[0];title.textContent=product.name;brand.textContent=product.brand;price.textContent=euro(product.price);desc.textContent=product.description;material.textContent=product.material;shipping.textContent=product.shipping||'';care.textContent=product.care||'';
 thumbs.innerHTML=product.images.map((s,i)=>`<button class="${i===0?'active':''}" onclick="show(${i})"><img src="${s}" alt="Foto prodotto ${i+1}"></button>`).join('');
 sizes.innerHTML=product.sizes.map(s=>`<button onclick="pick(this,'${s}')">${s}</button>`).join('');
}
function show(i){current=(i+product.images.length)%product.images.length;main.src=product.images[current];[...thumbs.children].forEach((x,n)=>x.classList.toggle('active',n===current))}
function pick(el,s){selectedSize=s;document.querySelectorAll('#sizes button').forEach(x=>x.classList.remove('active'));el.classList.add('active')}
function changeQty(n){qty=Math.max(1,qty+n);qtyValue.textContent=qty}
function add(){if(!selectedSize){toast('Seleziona una taglia');return}const c=JSON.parse(localStorage.getItem('eliteCart')||'[]');c.push({id:product.id,size:selectedSize,qty});localStorage.setItem('eliteCart',JSON.stringify(c));toast('Prodotto aggiunto al carrello')}
document.addEventListener('DOMContentLoaded',init);
