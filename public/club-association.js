// Explicit affiliation uses the existing athlete and reviewed organization IDs.
export function associateClub(profile,organization){
 if(!organization||!(organization.sport===profile.sport||organization.sports?.includes(profile.sport)))throw Error('Choose a club for this athlete’s sport.');
 if(profile.programTeam&&(profile.clubId!==organization.id||profile.clubTeam!==organization.name))profile.clubTeamNeedsReview=true;
 profile.clubId=organization.id;profile.clubTeam=organization.name;
 profile.saved=[...new Set([...(profile.saved||[]),organization.id])];
 if(profile.recruiting?.parentApproved)profile.recruiting.parentApproved=false;
 return profile;
}
export function installClubAssociation({catalog,getState,save}){
 const action=document.querySelector('[data-my-club]');if(!action)return;
 const organization=[...(catalog.organizations||[]),...(catalog.schools||[])].find(o=>o.id===action.dataset.myClub);if(!organization){action.disabled=true;const notice=document.createElement('p');notice.textContent='Club association needs source review. You can still save this opportunity.';action.after(notice);return;}
 if(!(organization.sport===action.dataset.sport||organization.sports?.includes(action.dataset.sport))){action.hidden=true;return;}
 const state=getState(),athletes=state.profiles.filter(p=>p.sport===action.dataset.sport);
 const block=document.createElement('section');block.className='my-club-association';action.before(block);
 const label=document.createElement('label');label.textContent='Choose athlete';const select=document.createElement('select');select.setAttribute('aria-label','Choose athlete for My Club');label.append(select);
 for(const p of athletes)select.add(new Option(p.nickname||p.sport,p.id));if(athletes.some(p=>p.id===state.active))select.value=state.active;
 const status=document.createElement('p');status.setAttribute('role','status');
 block.append(label,action,status);
 const profileLink=document.createElement('a');profileLink.className='text-link';profileLink.textContent='View athlete and My Club →';
 const explain=()=>{const p=getState().profiles.find(p=>p.id===select.value);action.disabled=!p;action.hidden=!p;action.setAttribute('aria-pressed',String(p?.clubId===organization.id));status.textContent=p?.clubId===organization.id?'My Club: '+organization.name+' · '+p.nickname+'. Affiliation is family-entered; membership is not verified.':!p?'Create an athlete for this sport to associate My Club.':'';profileLink.href='/my-pathway?athlete='+encodeURIComponent(select.value);profileLink.hidden=!p;};select.onchange=explain;
 if(!athletes.length){label.hidden=true;const create=document.createElement('a');create.className='button';create.href='/build?new=1&guided=1&sport='+encodeURIComponent(action.dataset.sport)+'&club='+encodeURIComponent(organization.id);create.textContent='Create athlete with this club';block.append(create);status.textContent='Create an athlete for this sport to associate My Club.';}
 block.append(profileLink);explain();
 action.onclick=()=>{const next=structuredClone(getState()),p=next.profiles.find(p=>p.id===select.value);if(!p)return;try{associateClub(p,organization);if(save(next)){explain();status.textContent='Saved as My Club for '+p.nickname+'. Family-entered affiliation; membership is not verified.'+(p.clubTeamNeedsReview?' Existing team details are retained; review them in Edit club / team.':'');}}catch(error){status.textContent=error.message;}};
}
