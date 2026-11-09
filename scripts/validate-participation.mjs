import{readFileSync}from'node:fs';import{validateParticipation,classificationReport}from'../engine/participation.mjs';import{validateEntities}from'../engine/models.mjs';
const audit=JSON.parse(readFileSync(new URL('../data/engine/approved.json',import.meta.url))),snapshot=JSON.parse(readFileSync(new URL('../data/unified/catalog.json',import.meta.url)));
const core=validateEntities(audit.entities),classification=validateParticipation(snapshot,{entities:audit.entities,evidence:audit.evidence});
const errors=[...core.errors,...classification.errors];if(JSON.stringify(audit.participation?.programs)!==JSON.stringify(snapshot.programs))errors.push('PARTICIPATION_EXPORT_OUT_OF_SYNC');
console.log(JSON.stringify({valid:!errors.length,normalizedRecords:audit.entities.length,programs:snapshot.programs.length,assignedTeams:snapshot.teamAssignments.length,openExceptions:snapshot.exceptions.filter(e=>e.status!=='resolved').length,errors},null,2));if(errors.length)process.exitCode=1;
