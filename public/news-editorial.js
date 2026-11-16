// Presentation only: discovered RSS images never grant permission to display them.
let photography;
const readPhotography=()=>photography??=fetch('/api/news-photography').then(r=>{if(!r.ok)throw Error('Photography unavailable');return r.json();}).catch(()=>{photography=null;return {};});
const node=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
export function approvedArticleImage(item){
 const image=item.image;
 return image?.permitted===true&&image.articleURL===item.url&&image.credit&&image.license&&/^\/assets\/editorial\/[a-z0-9_-]+\.(webp|jpg|png)$/i.test(image.url)?image:null;
}
export function addEditorialCover(card,item,sport,featured=false){
 card.classList.add('news-story');card.classList.toggle('news-featured',featured);card.dataset.newsSport=sport;
 const figure=node('figure');figure.className='news-cover';card.prepend(figure);
 if(featured){const label=node('span','IN THE SPOTLIGHT');label.className='news-feature-label';card.querySelector('.editorial-body')?.prepend(label);}
 return readPhotography().then(photos=>{
  if(!card.isConnected)return;
  const photo=photos[sport];if(!photo){figure.remove();return;}
  const approved=approvedArticleImage(item),img=node('img');img.width=photo.width;img.height=photo.height;img.decoding='async';img.loading=featured?'eager':'lazy';if(featured)img.fetchPriority='high';
  const caption=node('figcaption');const credit=node('a','Photo credits');credit.href='/credits';
  function illustrate(){
   img.alt=photo.alt;img.srcset='/assets/'+photo.smallAsset+' 640w, /assets/'+photo.asset+' 1280w';img.sizes=featured?'(max-width: 650px) 100vw, 58vw':'(max-width: 650px) 100vw, 40vw';img.src='/assets/'+photo.asset;
   caption.replaceChildren(node('span','Illustrative '+sport+' photography · not article imagery'),credit);figure.dataset.illustrative='true';
  }
  let failed=false;img.addEventListener('error',()=>{if(approved&&!failed){failed=true;illustrate();}else figure.remove();});
  if(approved){img.src=approved.url;img.alt=approved.alt||item.title;caption.append(node('span',approved.credit+' · '+approved.license));}else illustrate();
  const imageLink=node('a');imageLink.href=item.url;imageLink.target='_blank';imageLink.rel='noopener noreferrer';imageLink.setAttribute('aria-label','Read '+item.title+' at '+(item.publisher||item.sourceName));imageLink.append(img);figure.append(imageLink,caption);
 });
}
