import {readSetup,saveSetup,addSetupPerson,addSetupTeam,updateSetupPerson,removeSetupPerson,loadConfiguredRole,providers,fields,fieldLabels,sampleProfile,currentProfile,destinationExamples,previewTransfer,approveTransfer,exchangeStatus,rollbackTransfer,resetGuidedSetup} from '/assets/playrcmd-onboarding.js';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const button=(label,fn,cls='ap-control')=>{const b=el('button',label,cls);b.type='button';b.onclick=fn;return b;};
const json=x=>Array.isArray(x)?x.map(e=>e.title+' · '+new Date(e.start).toLocaleString('en-US',{timeZone:'America/Denver'})+' – '+new Date(e.end).toLocaleTimeString('en-US',{timeZone:'America/Denver'})+' MT').join('\n'):typeof x==='string'?x:JSON.stringify(x,null,2);
function profileCard(parent,title,data){parent.replaceChildren(el('h3',title));const list=el('dl');for(const field of fields){const value=data[field];if(value!==undefined&&value!==''&&(!Array.isArray(value)||value.length))list.append(el('dt',fieldLabels[field]),el('dd',json(value)));}parent.append(list);}
export function installOnboarding(kind,storage){
 const css=el('link');css.rel='stylesheet';css.href='/playrcmd/onboarding.css';document.head.append(css);
 const panel=el('section',undefined,'pr-onboarding-bar');panel.setAttribute('aria-label','Setup and portfolio connections');
 const status=el('p','','pr-setup-status');status.setAttribute('role','status');const summary=el('div',undefined,'pr-setup-summary');
 const actions=el('div',undefined,'pr-setup-actions');panel.append(el('strong','Your command center, configured by you'),status,actions,summary);document.querySelector('.pr-tools-bar').after(panel);
 const refresh=message=>{window.dispatchEvent(new CustomEvent('siem-demo-updated',{detail:{message}}));drawSummary();};
 const wizard=el('dialog',undefined,'pr-setup-dialog');wizard.id='pr-setup-dialog';wizard.setAttribute('aria-labelledby','pr-setup-title');document.body.append(wizard);
 const transfer=el('dialog',undefined,'pr-setup-dialog');transfer.id='pr-transfer-dialog';transfer.setAttribute('aria-labelledby','pr-transfer-title');document.body.append(transfer);
 let step=readSetup(storage,kind).step,returnWizard=false;
 function closeWizard(statusValue){saveSetup(storage,kind,{status:statusValue,step});wizard.close();const url=new URL(location.href);url.searchParams.delete('setup');history.replaceState(null,'',url);refresh('Setup '+statusValue+'. No provider is connected.');actions.querySelector('button')?.focus();}
 function launchWizard(){step=readSetup(storage,kind).step;drawWizard();if(!wizard.open)wizard.showModal();wizard.querySelector('h2').focus();}
 function field(parent,label,type='text',value='',name=''){
  const l=el('label',label),input=el('input');input.type=type;input.value=value;input.name=name;input.maxLength=100;l.append(input);parent.append(l);return input;
 }
 function check(parent,label,checked=false){const l=el('label',undefined,'pr-setup-check'),input=el('input');input.type='checkbox';input.checked=checked;l.append(input,el('span',label));parent.append(l);return input;}
 function targetChoice(parent){
  const d=loadConfiguredRole(kind,storage),label=el('label','Authorized athlete / team association'),select=el('select');select.id='pr-transfer-target';
  for(const t of d.teams.filter(t=>d.ctx.memberships.some(m=>m.role===d.ctx.role&&m.organizationId===t.organizationId&&m.teamIds.includes(t.id)))){
   const id=t.participantId||(kind==='coach'?t.id:d.participants[0].id);if(!d.ctx.participantIds.includes(id))continue;
   const o=new Option((d.participants.find(p=>p.id===id)?.name||id)+' · '+t.name,t.id);o.dataset.subject=id;select.add(o);
  }label.append(select);parent.append(label);return ()=>({teamId:select.value,subjectId:select.selectedOptions[0].dataset.subject});
 }
 function drawSummary(){
  const setup=readSetup(storage,kind),d=loadConfiguredRole(kind,storage),x=exchangeStatus(storage,kind);status.textContent='Setup: '+setup.status+' · Fictional demonstration';summary.replaceChildren();
  summary.append(el('p',d.participants.length+' athlete/team associations · '+d.teams.filter(t=>d.ctx.memberships.some(m=>m.teamIds.includes(t.id))).length+' authorized teams · '+d.activities.length+' scoped activities'));
  summary.append(el('p','Connected / synchronized: none. Existing provider fixtures are fictional, not live accounts.','pr-setup-note'));
  for(const l of x.links)summary.append(el('p',providers[l.provider]+' · '+(l.status==='imported-snapshot'?'Imported snapshot':'Linked external system · simulated only')+' · '+(d.participants.find(p=>p.id===l.subjectId)?.name||l.subjectId)));
  const receipt=x.receipts.at(-1);if(receipt)summary.append(el('p',receipt.status,'pr-setup-note'));
 }
 function drawWizard(){
  wizard.replaceChildren();const setup=readSetup(storage,kind);wizard.append(el('p','FICTIONAL SETUP · Saved only in this role on this browser','pr-eyebrow'));
  const title=el('h2','Set up your command center');title.id='pr-setup-title';title.tabIndex=-1;wizard.append(title);
  const steps=['Choose your role','Athletes, sports & teams','Calendars & commitments','Notifications & opportunities','Review your command center'];
  const progress=el('progress');progress.max=5;progress.value=step+1;progress.setAttribute('aria-label','Setup progress');wizard.append(el('p','Step '+(step+1)+' of 5 · '+steps[step]),progress);
  const body=el('section',undefined,'pr-setup-body');wizard.append(body);
  if(step===0){
   body.append(el('p','The Athlete example is an adult. A minor or age-unconfirmed local athlete needs a parent-managed workspace for profile sharing.'));
   body.append(el('p','Choose the perspective that fits your day. Each role has its own fictional people, organization scope and browser storage.'));
   for(const [role,name] of [['family','Parent & Family'],['college','Athlete'],['coach','Coach']])body.append(button(name,()=>{if(role!==kind){saveSetup(storage,kind,{status:'draft',step:0});location.assign('/demo?scenario='+role+'&setup=1');}else{step=1;saveSetup(storage,kind,{status:'draft',step});drawWizard();}},'pr-button'));
  }
  if(step===1){
   body.append(el('p','Reuse an approved fictional portfolio example, or add a lightweight local association. No detailed recruiting profile is required. Do not enter real personal information.'));
   body.append(button('Pull from Soccer Center',()=>openTransfer('pull','soccer-center')),button('Pull from Arena Pathway',()=>openTransfer('pull','arena-pathway')));
   let editing=null;const d=loadConfiguredRole(kind,storage);for(const p of d.participants.filter(p=>d.ctx.participantIds.includes(p.id)))body.append(el('p',p.name+' · '+(p.sports||[p.label]).join(', ')));
   const form=el('form');form.id='pr-setup-person-form';form.append(el('h3',kind==='coach'?'Add a fictional coaching team':'Add a fictional athlete / self association'));
   const name=field(form,kind==='coach'?'Fictional team / association label':'Fictional display name');name.required=true;
   const sportLabel=el('label','Sport'),sport=el('select');for(const s of ['soccer','volleyball','basketball','lacrosse','swimming','other'])sport.add(new Option(s,s));sportLabel.append(sport);form.append(sportLabel);
   const team=field(form,'Fictional team name');team.required=true;const minor=kind==='coach'?null:check(form,'Under 18 or age unconfirmed (parent-managed transfers required)',true);
   for(const person of setup.people){const row=el('div',undefined,'pr-setup-actions');row.append(button('Edit '+person.name,()=>{editing=person.id;name.value=person.name;sport.value=person.sport;team.value=person.teamName;if(minor)minor.checked=person.minor;add.textContent='Save association changes';name.focus();}),button('Remove '+person.name,()=>{if(confirm('Remove only this local association and its local commitments? No provider record is deleted.')){removeSetupPerson(storage,kind,person.id);refresh('Local association removed.');drawWizard();}}));body.append(row);}
   const add=el('button','Add local association','pr-button');add.type='submit';form.append(add);const feedback=el('p');feedback.setAttribute('role','status');form.append(feedback);
   form.onsubmit=e=>{e.preventDefault();try{const data={name:name.value,sport:sport.value,teamName:team.value,minor:minor?.checked??false};if(editing)updateSetupPerson(storage,kind,editing,data);else addSetupPerson(storage,kind,data);refresh('Fictional association added.');drawWizard();}catch(e){feedback.textContent=e.message;}};body.append(form);
   if(kind!=='coach'){const details=el('details');details.append(el('summary','Add another sport or team to an existing athlete'));const teamForm=el('form');teamForm.id='pr-setup-team-form';const label=el('label','Existing athlete'),who=el('select');for(const p of d.participants.filter(p=>d.ctx.participantIds.includes(p.id)&&!p.id.startsWith('builder-')))who.add(new Option(p.name,p.id));label.append(who);teamForm.append(label);const teamName=field(teamForm,'Fictional additional team');teamName.required=true;const sportLabel=el('label','Additional sport'),sport=el('select');for(const value of ['soccer','volleyball','basketball','lacrosse','swimming','other'])sport.add(new Option(value,value));sportLabel.append(sport);teamForm.append(sportLabel);const add=el('button','Add team without duplicating athlete','pr-button');add.type='submit';const message=el('p');message.setAttribute('role','status');teamForm.append(add,message);teamForm.onsubmit=e=>{e.preventDefault();try{addSetupTeam(storage,kind,{participantId:who.value,name:teamName.value,sport:sport.value});refresh('Team added to the existing athlete identity.');drawWizard();}catch(e){message.textContent=e.message;}};details.append(teamForm);for(const t of setup.extraTeams)details.append(el('p',(d.participants.find(p=>p.id===t.participantId)?.name||t.participantId)+' · '+t.name+' · '+t.sport));body.append(details);}
   if(kind==='family'){const use=check(body,'Include my existing fictional setup-builder people and schedules (read-only projection)',setup.useBuilder);use.onchange=()=>{saveSetup(storage,kind,{useBuilder:use.checked,status:'draft',step});refresh('Existing builder preference updated. Original records are unchanged.');drawWizard();};const a=el('a','Open the existing family setup builder (new tab)');a.href='/setup';a.target='_blank';a.rel='noopener noreferrer';body.append(a,el('p','The original builder opens separately. Return to this tab and continue or reopen Edit My Setup; its own records remain in place.','pr-setup-note'));}
  }
  if(step===2){
   body.append(el('p','Use the existing planner to add manual activities, weekly repeats or an ICS snapshot. Choose an authorized team; no subscription or provider connection is created.'));
   body.append(button('Add calendars / import schedules / recurring activities',()=>{saveSetup(storage,kind,{step,status:'draft'});wizard.close();document.querySelector('[data-tool=entry]').click();}));
   body.append(el('p','Close the planner and choose Edit My Setup to return to this step. Saved commitments immediately appear in the existing calendar.','pr-setup-note'));
  }
  if(step===3){
   body.append(el('p','Choose which fictional notices and reviewed opportunity categories to focus on. These preferences do not authorize a mailbox or subscribe to a provider.'));
   for(const [group,opts] of [['notifications',[['changes','Schedule changes'],['reminders','Event reminders']]],['opportunities',[['clubs','Clubs & programs'],['camps','Camps & clinics'],['education','Coaching education'],['jobs','Coaching vacancies']]]]){
    body.append(el('h3',group==='notifications'?'Notifications':'Opportunity interests'));
    for(const [value,label] of opts){const input=check(body,label,setup.preferences[group].includes(value));input.onchange=()=>{const next=readSetup(storage,kind).preferences;next[group]=input.checked?[...new Set([...next[group],value])]:next[group].filter(x=>x!==value);saveSetup(storage,kind,{preferences:next,status:'draft',step});};}
   }
  }
  if(step===4){
   const d=loadConfiguredRole(kind,storage);body.append(el('h3','Your configured '+({family:'family',college:'athlete',coach:'coaching'}[kind])+' view'));
   for(const p of d.participants.filter(p=>d.ctx.participantIds.includes(p.id)))body.append(el('p',p.name));
   body.append(el('p',d.activities.length+' scoped activities. Notification interests: '+(setup.preferences.notifications.join(', ')||'none selected')+'. Opportunities: '+(setup.preferences.opportunities.join(', ')||'none selected')+'.'));
   body.append(el('p','Original systems remain authoritative. Setup and transfers are local fictional demonstrations. Start Tour and Edit My Setup remain available at any time.'));
  }
  const controls=el('div',undefined,'pr-setup-actions'),back=button('Back',()=>{step--;saveSetup(storage,kind,{step,status:'draft'});drawWizard();});back.disabled=step===0;
  controls.append(back,button(step===4?'Save setup & open command center':'Save & continue',()=>{if(step===4)closeWizard('saved');else{step++;saveSetup(storage,kind,{step,status:'draft'});drawWizard();}}),button('Skip this step',()=>{if(step===4)closeWizard('saved');else{step++;saveSetup(storage,kind,{step,status:'draft'});drawWizard();}}),button('Save & exit',()=>closeWizard('draft')),button('Skip setup',()=>closeWizard('skipped')),button('Reset guided setup',()=>{if(confirm('Reset only this role’s guided setup and simulated portfolio transfers? Other roles and original demo records remain.')){resetGuidedSetup(storage,kind);step=0;refresh('Guided setup reset.');drawWizard();}}));wizard.append(controls);
 }
 wizard.addEventListener('cancel',e=>{e.preventDefault();closeWizard('skipped');});
 function openTransfer(direction,provider){
  returnWizard=wizard.open;if(wizard.open)wizard.close();transfer.replaceChildren();
  const heading=el('h2',(direction==='pull'?'Pull from ':'Push to ')+providers[provider]);heading.id='pr-transfer-title';transfer.append(heading,el('p','FICTIONAL DEMONSTRATION · No account link, external write or live synchronization.','pr-eyebrow'));
  const form=el('form');form.id='pr-transfer-form';const getTarget=targetChoice(form);
  const operationLabel=el('label','Destination action'),operation=el('select');
  for(const [v,n]of [['create','Create new profile'],['link','Link an existing profile'],['update','Update selected profile fields']])operation.add(new Option(n,v));
  const destLabel=el('label','Existing fictional destination'),dest=el('select');for(const p of destinationExamples(storage,kind,provider))dest.add(new Option(p.fields.displayName+' · '+p.id,p.id));destLabel.append(dest);
  if(direction==='push'){operationLabel.append(operation);form.append(operationLabel,destLabel,el('p','Match identity explicitly before linking. Names alone never merge records; update requires a prior approved link.','pr-setup-note'));}
  const fieldset=el('fieldset');fieldset.append(el('legend','Select fields — nothing is selected automatically'));const picks={};
  for(const f of fields.filter(f=>(kind==='family'||f!=='parentDisplayName')&&(kind!=='coach'||f!=='position')))picks[f]=check(fieldset,fieldLabels[f]);form.append(fieldset);
  const before=el('section',undefined,'pr-transfer-existing');before.append(el('h3','Current local profile and incoming fictional example'));const current=el('div'),incoming=el('div');before.append(current,incoming);form.append(before);
  function show(){try{const t=getTarget();profileCard(current,'Existing PlayRcmd information',currentProfile(storage,kind,t.subjectId,t.teamId));if(direction==='pull')profileCard(incoming,'Incoming fictional '+providers[provider]+' example',sampleProfile(provider,kind).data);else{incoming.replaceChildren();for(const record of destinationExamples(storage,kind,provider)){const card=el('article');profileCard(card,'Destination example · '+record.id,record.fields);incoming.append(card);}}}catch(e){current.textContent=e.message;}}
  form.querySelector('select').onchange=show;operation.onchange=()=>{dest.disabled=operation.value==='create';};operation.onchange();show();
  const preview=el('button','Preview selected changes','pr-button');preview.type='submit';form.append(preview);transfer.append(form);
  const review=el('section');review.id='pr-transfer-review';const feedback=el('p');feedback.setAttribute('role','status');transfer.append(review,feedback);
  let plan,resolutions={};
  function drawPlan(){
   review.replaceChildren(el('h3','Review and approve — simulated transfer'));
   for(const r of plan.rows){const card=el('article',undefined,'pr-transfer-row');if(r.field==='schedules'&&direction==='pull')card.append(el('p','Apply incoming stable-UID schedule records; preserve all unrelated existing commitments.','pr-setup-note'));card.append(el('h4',fieldLabels[r.field]),el('p','Before'),el('pre',json(r.before)),el('p','Proposed'),el('pre',json(r.after)));
    if(r.conflict){const label=el('label','Conflict resolution'),choice=el('select');choice.add(new Option('Keep existing value','keep'));choice.add(new Option('Apply selected proposed value (upsert for snapshots)','replace'));choice.value=r.resolution;choice.onchange=()=>{resolutions[r.field]=choice.value;makePlan();};label.append(choice);card.append(label);}review.append(card);}
   if(plan.operation==='link')review.append(el('p','Link only: no profile fields are written. You can preview an update separately after linking.'));
   const approved=check(review,'I authorize this selected fictional transfer for the stated subject and destination');const parent=kind==='family'?check(review,'I am the parent/guardian in this fictional parent-managed workspace'):null;
   review.append(button('Approve simulated transfer',()=>{try{const receipt=approveTransfer(storage,kind,plan.id,{authorized:approved.checked,parentApproved:parent?.checked===true});feedback.textContent=receipt.status;dest.replaceChildren();for(const item of destinationExamples(storage,kind,provider))dest.add(new Option(item.fields.displayName+' · '+item.id,item.id));if(direction==='push')dest.value=plan.destinationId;review.replaceChildren(el('h3',receipt.status),el('p','Selected fields: '+(receipt.fields.map(f=>fieldLabels[f]).join(', ')||'link only')));refresh('Simulated portfolio transfer completed. No provider changed.');}catch(e){feedback.textContent=e.message;}},'pr-button'));
  }
  function makePlan(){try{plan=previewTransfer(storage,kind,{...getTarget(),provider,direction,operation:direction==='pull'?'update':operation.value,destinationId:dest.value,selected:Object.keys(picks).filter(k=>picks[k].checked),resolutions});feedback.textContent='';drawPlan();}catch(e){review.replaceChildren();feedback.textContent=e.message;}}
  form.onsubmit=e=>{e.preventDefault();resolutions={};makePlan();};
  transfer.append(button('Undo last simulated transfer',()=>{try{rollbackTransfer(storage,kind);feedback.textContent='Rolled back locally. Nothing changed in an external system.';review.replaceChildren();refresh('Portfolio transfer rolled back.');show();}catch(e){feedback.textContent=e.message;}}),button('Close',closeTransfer));
  transfer.showModal();heading.tabIndex=-1;heading.focus();
 }
 function closeTransfer(){transfer.close();drawSummary();if(returnWizard){drawWizard();wizard.showModal();}else actions.querySelector('button')?.focus();}
 transfer.addEventListener('cancel',e=>{e.preventDefault();closeTransfer();});
 actions.append(button('Edit My Setup',launchWizard),button('Start Tour',()=>{const start=document.querySelector('.ap-tour-start');if(start)start.click();else status.textContent='Tour is unavailable; reload the demonstration.';}),button('Pull from Soccer Center',()=>openTransfer('pull','soccer-center')),button('Pull from Arena Pathway',()=>openTransfer('pull','arena-pathway')),button('Push to Soccer Center',()=>openTransfer('push','soccer-center')),button('Push to Arena Pathway',()=>openTransfer('push','arena-pathway')));
 drawSummary();const setup=readSetup(storage,kind);if(['new','draft'].includes(setup.status)||new URLSearchParams(location.search).get('setup')==='1')launchWizard();
}
