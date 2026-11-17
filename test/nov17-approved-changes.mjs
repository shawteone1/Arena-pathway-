// November17 explicitly authorizes lifecycle safety and two SIEM presentation changes.
// Preserve all historical byte guards outside this exact, hash-pinned scope.
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const approved=JSON.parse(readFileSync(new URL('./fixtures/nov17-approved-source.json',import.meta.url)));
export function approvedNov17Copy(file,original){if(!approved.files[file])return original;const actual=readFileSync(new URL('../'+file,import.meta.url));assert.equal(createHash('sha256').update(actual).digest('hex'),approved.files[file].sha256,'Unreviewed change outside the November17 pinned implementation: '+file);return typeof original==='string'?actual.toString():actual;}
export const approvedNov17Files=new Set(Object.keys(approved.files));
