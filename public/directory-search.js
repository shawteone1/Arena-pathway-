// One reviewed searchable-choice interaction, reused by discovery and focused editors.
export function installDirectoryChoices(input,options){
 const rows=[...options.querySelectorAll('[data-club-choice]')];let index=-1;
 const close=()=>{options.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');index=-1;};
 const draw=()=>{const q=input.value.toLowerCase();for(const [i,row] of rows.entries()){row.hidden=!row.dataset.clubChoice.toLowerCase().includes(q);row.id=options.id+'-option-'+i;row.setAttribute('aria-selected','false');}options.hidden=!rows.some(r=>!r.hidden);input.setAttribute('aria-expanded',String(!options.hidden));input.removeAttribute('aria-activedescendant');index=-1;};
 const handlers=rows.map(row=>{const choose=()=>{input.value=row.dataset.clubChoice;input.dispatchEvent(new Event('input',{bubbles:true}));input.focus({preventScroll:true});close();};row.addEventListener('click',choose);return [row,choose];});
 const keydown=e=>{
  if(e.key==='Escape'&&!options.hidden){e.preventDefault();e.stopPropagation();close();return;}
  if(e.key==='Tab'){close();return;}
  if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();if(options.hidden)draw();const visible=rows.filter(r=>!r.hidden);if(!visible.length){close();return;}index=index<0?(e.key==='ArrowDown'?0:visible.length-1):(index+(e.key==='ArrowDown'?1:-1)+visible.length)%visible.length;for(const r of rows)r.setAttribute('aria-selected','false');const row=visible[index];row.setAttribute('aria-selected','true');input.setAttribute('aria-activedescendant',row.id);row.scrollIntoView({block:'nearest'});}
  if(e.key==='Enter'&&!options.hidden&&index>=0){e.preventDefault();rows.filter(r=>!r.hidden)[index]?.click();}
 };
 const outside=e=>{if(e.target!==input&&!options.contains(e.target))close();};input.addEventListener('focus',draw);input.addEventListener('input',draw);input.addEventListener('keydown',keydown);document.addEventListener('click',outside);
 return ()=>{input.removeEventListener('focus',draw);input.removeEventListener('input',draw);input.removeEventListener('keydown',keydown);document.removeEventListener('click',outside);for(const [row,fn] of handlers)row.removeEventListener('click',fn);close();};
}
const input=document.querySelector('.directory-combobox input'),options=document.getElementById('club-search-options');if(input&&options)installDirectoryChoices(input,options);
