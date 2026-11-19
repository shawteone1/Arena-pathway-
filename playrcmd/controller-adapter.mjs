// PlayRcmd-only composition seam. The AP controller remains byte-identical.
// Fail closed if the expected scenario-loading boundary changes upstream.
const originalLoader="const loadScenario=kind=>kind==='local'?localFamilyCalendar(localStorage,{catalog:localCatalog}):kind==='family'?createFamilyDemo():createScenario(kind);";
const hostedLoader="const loadScenario=kind=>globalThis.siemDemoHost?.loadScenario?.(kind)??(kind==='local'?localFamilyCalendar(localStorage,{catalog:localCatalog}):kind==='family'?createFamilyDemo():createScenario(kind));";
const hostUpdates="\n// Optional host updates only re-project data through the existing renderer and rules.\nif(globalThis.siemDemoHost)window.addEventListener('siem-demo-updated',event=>{const actions=dataset.actions;closeDetails();dataset=loadScenario(dataset.kind);dataset.actions=actions;if(['day','calendar','messages'].includes(event.detail?.section))section=event.detail.section;if(/^\\d{4}-\\d{2}-\\d{2}$/.test(event.detail?.date||'')){calendarAnchor=event.detail.date;calendarSelectedDay=event.detail.date;}render();status(event.detail?.message||'Local demonstration updated. No provider was contacted.');});\n";
export function hostedController(source){
 if(source.split(originalLoader).length!==2)throw Error('SIEM host contract changed: scenario loader must be reviewed');
 return source.replace(originalLoader,hostedLoader)+hostUpdates;
}
