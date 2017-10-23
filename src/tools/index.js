#!/usr/bin/env node

const {schema2js} = require('json-model');
const fs = require('fs');

/*var progressionEntry = {
	shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d",
	entryId: "20",
	entryType:	[	"http://standardhealthrecord.org/oncology/Progression",
					"http://standardhealthrecord.org/assessment/Assessment" ],			
	focalSubject: {entryType: "http://standardhealthrecord.org/demographics/PersonOfRecord", shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d", entryId: "1"},
	value: { coding: { value: "C1272745", codeSystem: "http://ncimeta.nci.nih.gov", displayText: "Improving, responding to treatment"}},
	focalCondition: {entryType: "http://standardhealthrecord.org/condition/Condition", shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d", entryId: "8"},
	clinicallyRelevantTime: "13 JUN 2012",
	Evidence: [ 	{ coding: { value: "C0031809", codeSystem: "http://ncimeta.nci.nih.gov", displayText: "physical examination"}} ],
	assessmentType: { coding: { value: "#disease status"}},
	Category: "TorchCategory",
	Value: "SomeValue",
	AssessmentFocus: "This is the wrong object type, we get a blank object not this string",
	status: "completed",
	originalCreationDate: "13 JUN 2012",
	lastUpdateDate: "13 JUN 2012"
};*/
// Assessment.Status.Value can be String, Coding, or CodeableConcept. I think we use Coding.
var progressionWireFormat = {
	"AssessmentFocus" : "a string",
	"Category" : "a category",
	"Value" : { "coding" : [{"value" : "codableConcepValue", "displayText" : {"value" : "text"}}], "displayType" : "?" },
	"Evidence" : [ 	{ "coding" : { "value" : "C0031809", "codeSystem" : "http://ncimeta.nci.nih.gov", "displayText" : "physical examination"}} ],
	"ShrId" : { "value" : "788dcbc3-ed18-470c-89ef-35ff91854c7d" },
	"EntryId" : { "value" : "20" },
	"EntryType" : [ { "value" : "someUri" } ],
	"FocalSubject" : "q",
	"OriginalCreationDate" : { "value" : "2017-01-01" },
	"LastUpdateDate" : { "value" : "2017-01-02" },
	"Status" : {"Value" : {"Value" : "status value", "CodeSystem" : {"Value" : "http://SomeURI"}, "CodeSystemVersion": {"Value" : "1.0"}, "DisplayText" : {"Value" : "display text"} } }
};
var toxicityWireFormat = {
	"AdverseEvent" : {"ShrId" : "788dcbc3-ed18-470c-89ef-35ff91854c7d", "EntryType" : "http://jstars-linux-1.mitre.org/json-schema/shr/adverse#/definitions/AdverseEvent", "EntryId" : "100" },
	"AdverseReactionAttribution" : "due to medication"
};
var stagingWireFormat = {
	"StagingSystem" : { "Value" : "a staging system"},
	"T-Stage" : {"Value" : {"Coding" : [{"Value" : "codingSystem"}]}, "DisplayText" : {"Value" : "T0"}},
	"N-Stage" : {"Value" : {"Coding" : "codingSystem", "DisplayText" : "N1"}},
	"M-Stage" : {"Value" : {"Coding" : "codingSystem", "DisplayText" : "M0"}},
	"Reason" : "a reason for this observation"
};

/* After you have run the schema2js.Generator() in the block at the bottom of this file,
	comment that block and uncomment this block to make an object with your generated code */
const classDefs = require("./reordered-object-definitions.js"); 	// The file where you stored the output of the block below with schema2js.Generator (this file contains class definitions)		
const hier = new classDefs.makeHierarchy();
var onco = hier.OncologyDefinitionsProgression(progressionWireFormat);
console.log(onco);
console.log("###############");
var toxicity = hier.OncologyDefinitionsToxicReactionToTreatment(toxicityWireFormat);
console.log(toxicity);
console.log("###############");
var staging = hier.OncologyDefinitionsTNMStage(stagingWireFormat);
console.log(staging);																	
																				

/* Example of instantiating a type that does not have a superclass. The Reason is stored but Nonsense is not.

var actionParams = { Reason: "this is a reason", Nonsense: "This is nonsense" };
var action = hier.BaseDefinitionsAction(actionParams);
console.log(action);
console.log(action.Reason);
action.Reason = "A Second Reason!";
console.log(action.Reason);

console.log("----------------"); */


/* 													uncomment block to generate code, needs a .json and a folder as command line params 
const store = new schema2js.SchemaStore();
const dir = fs.readdirSync(process.argv[3]);
for (const fn of dir) {
  const data = fs.readFileSync(process.argv[3] + '/' + fn);
  store.add(JSON.parse(data.toString()));
}
fs.readFile(process.argv[2], (err, data) => {
  if (err) throw err;
  const gen = schema2js.Generator({schemaStore: store, trackMissing: true, validation: true}).addSchema(JSON.parse(data.toString())); // was trackMissing: true and validation: true
  // fix code output
  var codeWithoutModuleName = gen.code();
 /// Removing these next 3 lines means you have to manually fix that one minus sign - breaks if input is SHR base or core schema
 /// var codeWithoutModuleNameAndMinusSign = gen.code();
 /// var indexOfOneMinusSign = codeWithoutModuleNameAndMinusSign.indexOf("validationErrors(value.Ki-67LabelingIndex");
 /// var codeWithoutModuleName = codeWithoutModuleNameAndMinusSign.substr(0, indexOfOneMinusSign) + "validationErrors(value.Ki_67LabelingIndex" + codeWithoutModuleNameAndMinusSign.substr(indexOfOneMinusSign+41);
  
  
  var code = '// WARNING: This is autogenerated code, any changes to this file will be lost.\n var makeHierarchy = ' + codeWithoutModuleName + '\nmodule.exports = { makeHierarchy };';
  console.log(code);
  // 
});  											*/