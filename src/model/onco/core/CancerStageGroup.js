// GENERATED CODE
// Manual modification is NOT RECOMMENDED as changes will be overwritten the next time the class is generated.

import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import ClassRegistry from '../../ClassRegistry';

import CodedNonLaboratoryObservation from '../../shr/core/CodedNonLaboratoryObservation';

/**
 * Generated class for onco.core.CancerStageGroup.
 * @extends CodedNonLaboratoryObservation
 */
class CancerStageGroup extends CodedNonLaboratoryObservation {

  /**
   * Get the PatientSubjectOfRecord.
   * @returns {PatientSubjectOfRecord} The shr.core.PatientSubjectOfRecord
   */
  get subjectOfRecord() {
    return this._subjectOfRecord;
  }

  /**
   * Set the PatientSubjectOfRecord.
   * This field/value is required.
   * @param {PatientSubjectOfRecord} subjectOfRecord - The shr.core.PatientSubjectOfRecord
   */
  set subjectOfRecord(subjectOfRecord) {
    this._subjectOfRecord = subjectOfRecord;
  }

  /**
   * Set the PatientSubjectOfRecord and return 'this' for chaining.
   * This field/value is required.
   * @param {PatientSubjectOfRecord} subjectOfRecord - The shr.core.PatientSubjectOfRecord
   * @returns {CancerStageGroup} this.
   */
  withSubjectOfRecord(subjectOfRecord) {
    this.subjectOfRecord = subjectOfRecord; return this;
  }

  /**
   * Get the DataValue.
   * @returns {DataValue} The shr.core.DataValue
   */
  get dataValue() {
    return this._dataValue;
  }

  /**
   * Set the DataValue.
   * This field/value is required.
   * @param {DataValue} dataValue - The shr.core.DataValue
   */
  set dataValue(dataValue) {
    this._dataValue = dataValue;
  }

  /**
   * Set the DataValue and return 'this' for chaining.
   * This field/value is required.
   * @param {DataValue} dataValue - The shr.core.DataValue
   * @returns {CancerStageGroup} this.
   */
  withDataValue(dataValue) {
    this.dataValue = dataValue; return this;
  }

  /**
   * Get the DataAbsentReason.
   * @returns {DataAbsentReason} The shr.core.DataAbsentReason
   */
  get dataAbsentReason() {
    return this._dataAbsentReason;
  }

  /**
   * Set the DataAbsentReason.
   * @param {DataAbsentReason} dataAbsentReason - The shr.core.DataAbsentReason
   */
  set dataAbsentReason(dataAbsentReason) {
    this._dataAbsentReason = dataAbsentReason;
  }

  /**
   * Set the DataAbsentReason and return 'this' for chaining.
   * @param {DataAbsentReason} dataAbsentReason - The shr.core.DataAbsentReason
   * @returns {CancerStageGroup} this.
   */
  withDataAbsentReason(dataAbsentReason) {
    this.dataAbsentReason = dataAbsentReason; return this;
  }

  /**
   * Get the CancerStagingSystem.
   * @returns {CancerStagingSystem} The onco.core.CancerStagingSystem
   */
  get method() {
    return this._method;
  }

  /**
   * Set the CancerStagingSystem.
   * @param {CancerStagingSystem} method - The onco.core.CancerStagingSystem
   */
  set method(method) {
    this._method = method;
  }

  /**
   * Set the CancerStagingSystem and return 'this' for chaining.
   * @param {CancerStagingSystem} method - The onco.core.CancerStagingSystem
   * @returns {CancerStageGroup} this.
   */
  withMethod(method) {
    this.method = method; return this;
  }

  /**
   * Get the PractitionerPerformer array.
   * @returns {Array<PractitionerPerformer>} The shr.core.PractitionerPerformer array
   */
  get performer() {
    return this._performer;
  }

  /**
   * Set the PractitionerPerformer array.
   * @param {Array<PractitionerPerformer>} performer - The shr.core.PractitionerPerformer array
   */
  set performer(performer) {
    this._performer = performer;
  }

  /**
   * Set the PractitionerPerformer array and return 'this' for chaining.
   * @param {Array<PractitionerPerformer>} performer - The shr.core.PractitionerPerformer array
   * @returns {CancerStageGroup} this.
   */
  withPerformer(performer) {
    this.performer = performer; return this;
  }

  /**
   * Get the BodyLocation.
   * @returns {BodyLocation} The shr.core.BodyLocation
   */
  get bodyLocation() {
    return this._bodyLocation;
  }

  /**
   * Set the BodyLocation.
   * @param {BodyLocation} bodyLocation - The shr.core.BodyLocation
   */
  set bodyLocation(bodyLocation) {
    this._bodyLocation = bodyLocation;
  }

  /**
   * Set the BodyLocation and return 'this' for chaining.
   * @param {BodyLocation} bodyLocation - The shr.core.BodyLocation
   * @returns {CancerStageGroup} this.
   */
  withBodyLocation(bodyLocation) {
    this.bodyLocation = bodyLocation; return this;
  }

  /**
   * Get the Device.
   * @returns {Device} The shr.core.Device
   */
  get device() {
    return this._device;
  }

  /**
   * Set the Device.
   * @param {Device} device - The shr.core.Device
   */
  set device(device) {
    this._device = device;
  }

  /**
   * Set the Device and return 'this' for chaining.
   * @param {Device} device - The shr.core.Device
   * @returns {CancerStageGroup} this.
   */
  withDevice(device) {
    this.device = device; return this;
  }

  /**
   * Get the Components.
   * @returns {Components} The shr.core.Components
   */
  get components() {
    return this._components;
  }

  /**
   * Set the Components.
   * @param {Components} components - The shr.core.Components
   */
  set components(components) {
    this._components = components;
  }

  /**
   * Set the Components and return 'this' for chaining.
   * @param {Components} components - The shr.core.Components
   * @returns {CancerStageGroup} this.
   */
  withComponents(components) {
    this.components = components; return this;
  }

  /**
   * Get the onco.core.PrimaryCancerCondition reference.
   * @returns {Reference} The onco.core.PrimaryCancerCondition reference
   */
  get primaryCancerCondition() {
    return this._primaryCancerCondition;
  }

  /**
   * Set the onco.core.PrimaryCancerCondition reference.
   * @param {Reference} primaryCancerCondition - The onco.core.PrimaryCancerCondition reference
   */
  set primaryCancerCondition(primaryCancerCondition) {
    this._primaryCancerCondition = primaryCancerCondition;
  }

  /**
   * Set the onco.core.PrimaryCancerCondition reference and return 'this' for chaining.
   * @param {Reference} primaryCancerCondition - The onco.core.PrimaryCancerCondition reference
   * @returns {CancerStageGroup} this.
   */
  withPrimaryCancerCondition(primaryCancerCondition) {
    this.primaryCancerCondition = primaryCancerCondition; return this;
  }

  /**
   * Deserializes JSON data to an instance of the CancerStageGroup class.
   * The JSON must be valid against the CancerStageGroup JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {CancerStageGroup} An instance of CancerStageGroup populated with the JSON data
   */
  static fromJSON(json={}) {
    const klass = ClassRegistry.get('onco.core', 'CancerStageGroup');
    const inst = new klass();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the CancerStageGroup class to a JSON object.
   * The JSON is expected to be valid against the CancerStageGroup JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value' : 'http://standardhealthrecord.org/spec/onco/core/CancerStageGroup' } };
    if (this.metadata != null) {
      inst['Metadata'] = typeof this.metadata.toJSON === 'function' ? this.metadata.toJSON() : this.metadata;
    }
    if (this.language != null) {
      inst['Language'] = typeof this.language.toJSON === 'function' ? this.language.toJSON() : this.language;
    }
    if (this.implicitRules != null) {
      inst['ImplicitRules'] = typeof this.implicitRules.toJSON === 'function' ? this.implicitRules.toJSON() : this.implicitRules;
    }
    if (this.narrative != null) {
      inst['Narrative'] = typeof this.narrative.toJSON === 'function' ? this.narrative.toJSON() : this.narrative;
    }
    if (this.status != null) {
      inst['Status'] = typeof this.status.toJSON === 'function' ? this.status.toJSON() : this.status;
    }
    if (this.identifier != null) {
      inst['Identifier'] = this.identifier.map(f => f.toJSON());
    }
    if (this.subjectOfRecord != null) {
      inst['SubjectOfRecord'] = typeof this.subjectOfRecord.toJSON === 'function' ? this.subjectOfRecord.toJSON() : this.subjectOfRecord;
    }
    if (this.careContext != null) {
      inst['CareContext'] = typeof this.careContext.toJSON === 'function' ? this.careContext.toJSON() : this.careContext;
    }
    if (this.statementDateTime != null) {
      inst['StatementDateTime'] = typeof this.statementDateTime.toJSON === 'function' ? this.statementDateTime.toJSON() : this.statementDateTime;
    }
    if (this.code != null) {
      inst['Code'] = typeof this.code.toJSON === 'function' ? this.code.toJSON() : this.code;
    }
    if (this.dataValue != null) {
      inst['DataValue'] = typeof this.dataValue.toJSON === 'function' ? this.dataValue.toJSON() : this.dataValue;
    }
    if (this.dataAbsentReason != null) {
      inst['DataAbsentReason'] = typeof this.dataAbsentReason.toJSON === 'function' ? this.dataAbsentReason.toJSON() : this.dataAbsentReason;
    }
    if (this.method != null) {
      inst['Method'] = typeof this.method.toJSON === 'function' ? this.method.toJSON() : this.method;
    }
    if (this.relevantTime != null) {
      inst['RelevantTime'] = typeof this.relevantTime.toJSON === 'function' ? this.relevantTime.toJSON() : this.relevantTime;
    }
    if (this.category != null) {
      inst['Category'] = typeof this.category.toJSON === 'function' ? this.category.toJSON() : this.category;
    }
    if (this.performer != null) {
      inst['Performer'] = this.performer.map(f => f.toJSON());
    }
    if (this.bodyLocation != null) {
      inst['BodyLocation'] = typeof this.bodyLocation.toJSON === 'function' ? this.bodyLocation.toJSON() : this.bodyLocation;
    }
    if (this.commentOrDescription != null) {
      inst['CommentOrDescription'] = typeof this.commentOrDescription.toJSON === 'function' ? this.commentOrDescription.toJSON() : this.commentOrDescription;
    }
    if (this.interpretation != null) {
      inst['Interpretation'] = typeof this.interpretation.toJSON === 'function' ? this.interpretation.toJSON() : this.interpretation;
    }
    if (this.device != null) {
      inst['Device'] = typeof this.device.toJSON === 'function' ? this.device.toJSON() : this.device;
    }
    if (this.referenceRange != null) {
      inst['ReferenceRange'] = typeof this.referenceRange.toJSON === 'function' ? this.referenceRange.toJSON() : this.referenceRange;
    }
    if (this.components != null) {
      inst['Components'] = typeof this.components.toJSON === 'function' ? this.components.toJSON() : this.components;
    }
    if (this.panelMembers != null) {
      inst['PanelMembers'] = typeof this.panelMembers.toJSON === 'function' ? this.panelMembers.toJSON() : this.panelMembers;
    }
    if (this.primaryCancerCondition != null) {
      inst['PrimaryCancerCondition'] = typeof this.primaryCancerCondition.toJSON === 'function' ? this.primaryCancerCondition.toJSON() : this.primaryCancerCondition;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the CancerStageGroup class.
   * The FHIR must be valid against the CancerStageGroup FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} fhirType - the type of the FHIR object that was passed in, in case not otherwise identifiable from the object itself
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {CancerStageGroup} An instance of CancerStageGroup populated with the FHIR data
   */
  static fromFHIR(fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const klass = ClassRegistry.get('onco.core', 'CancerStageGroup');
    const inst = new klass();
    if (fhir['meta'] != null) {
      if (fhir['meta']['versionId'] != null) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.core.Metadata', {}, null, shrId);
        inst.metadata.versionId = FHIRHelper.createInstanceFromFHIR('shr.core.VersionId', fhir['meta']['versionId'], 'id', shrId, allEntries, mappedResources, referencesOut, false);
      }
      if (fhir['meta']['lastUpdated'] != null) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.core.Metadata', {}, null, shrId);
        inst.metadata.lastUpdated = FHIRHelper.createInstanceFromFHIR('shr.core.LastUpdated', fhir['meta']['lastUpdated'], 'instant', shrId, allEntries, mappedResources, referencesOut, false);
      }
      for (const fhir_meta_profile of fhir['meta']['profile'] || []) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.core.Metadata', {}, null, shrId);
        inst.metadata.profile = inst.metadata.profile || [];
        const inst_metadata_profile = FHIRHelper.createInstanceFromFHIR('shr.core.Profile', fhir_meta_profile, 'uri', shrId, allEntries, mappedResources, referencesOut, false);
        inst.metadata.profile.push(inst_metadata_profile);
      }
      for (const fhir_meta_security of fhir['meta']['security'] || []) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.core.Metadata', {}, null, shrId);
        inst.metadata.securityLabel = inst.metadata.securityLabel || [];
        const inst_metadata_securityLabel = FHIRHelper.createInstanceFromFHIR('shr.core.SecurityLabel', fhir_meta_security, 'Coding', shrId, allEntries, mappedResources, referencesOut, false);
        inst.metadata.securityLabel.push(inst_metadata_securityLabel);
      }
      for (const fhir_meta_tag of fhir['meta']['tag'] || []) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.core.Metadata', {}, null, shrId);
        inst.metadata.tag = inst.metadata.tag || [];
        const inst_metadata_tag = FHIRHelper.createInstanceFromFHIR('shr.core.Tag', fhir_meta_tag, 'Coding', shrId, allEntries, mappedResources, referencesOut, false);
        inst.metadata.tag.push(inst_metadata_tag);
      }
    }
    if (fhir['implicitRules'] != null) {
      inst.implicitRules = FHIRHelper.createInstanceFromFHIR('shr.core.ImplicitRules', fhir['implicitRules'], 'uri', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['language'] != null) {
      inst.language = FHIRHelper.createInstanceFromFHIR('shr.core.Language', fhir['language'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['text'] != null) {
      inst.narrative = FHIRHelper.createInstanceFromFHIR('shr.core.Narrative', fhir['text'], 'Narrative', shrId, allEntries, mappedResources, referencesOut, false);
    }
    for (const fhir_extension of fhir['extension'] || []) {
      if (fhir_extension['url'] != null && fhir_extension['url'] === 'http://hl7.org/fhir/us/shr/DSTU2/StructureDefinition/onco-core-PrimaryCancerCondition-extension') {
        inst.primaryCancerCondition = FHIRHelper.createReference( FHIRHelper.createInstanceFromFHIR('onco.core.PrimaryCancerCondition', fhir_extension, 'Extension', shrId, allEntries, mappedResources, referencesOut, true), referencesOut);
      }
    }
    for (const fhir_identifier of fhir['identifier'] || []) {
      inst.identifier = inst.identifier || [];
      const inst_identifier = FHIRHelper.createInstanceFromFHIR('shr.core.Identifier', fhir_identifier, 'Identifier', shrId, allEntries, mappedResources, referencesOut, false);
      inst.identifier.push(inst_identifier);
    }
    if (fhir['status'] != null) {
      inst.status = FHIRHelper.createInstanceFromFHIR('shr.core.Status', fhir['status'], 'code', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['category'] != null) {
      inst.category = FHIRHelper.createInstanceFromFHIR('shr.core.Category', fhir['category'], 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['code'] != null) {
      inst.code = FHIRHelper.createInstanceFromFHIR('shr.core.Code', fhir['code'], 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['subject'] != null) {
      const entryId = fhir['subject']['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.core.Patient', referencedEntry['resource'], 'undefined', shrId, allEntries, mappedResources, referencesOut);
        }
      }
      inst.subjectOfRecord = mappedResources[entryId];
    }
    if (fhir['encounter'] != null) {
      const entryId = fhir['encounter']['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.core.Encounter', referencedEntry['resource'], 'undefined', shrId, allEntries, mappedResources, referencesOut);
        }
      }
      inst.careContext = mappedResources[entryId];
    }
    if (fhir['effectiveDateTime'] != null) {
      inst.relevantTime = FHIRHelper.createInstanceFromFHIR('shr.core.RelevantTime', fhir['effectiveDateTime'], 'dateTime', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['issued'] != null) {
      inst.statementDateTime = FHIRHelper.createInstanceFromFHIR('shr.core.StatementDateTime', fhir['issued'], 'instant', shrId, allEntries, mappedResources, referencesOut, false);
    }
    for (const fhir_performer of fhir['performer'] || []) {
      inst.performer = inst.performer || [];
      const entryId = fhir_performer['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.core.Practitioner', referencedEntry['resource'], 'undefined', shrId, allEntries, mappedResources, referencesOut);
        }
      }
      const inst_performer = mappedResources[entryId];
      inst.performer.push(inst_performer);
    }
    if (fhir['valueCodeableConcept'] != null) {
      inst.dataValue = FHIRHelper.createInstanceFromFHIR('shr.core.DataValue', fhir['valueCodeableConcept'], 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['interpretation'] != null) {
      inst.interpretation = FHIRHelper.createInstanceFromFHIR('shr.core.Interpretation', fhir['interpretation'], 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['comments'] != null) {
      inst.commentOrDescription = FHIRHelper.createInstanceFromFHIR('shr.core.CommentOrDescription', fhir['comments'], 'string', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['method'] != null) {
      inst.method = FHIRHelper.createInstanceFromFHIR('onco.core.CancerStagingSystem', fhir['method'], 'CodeableConcept', shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['related'] != null && fhir['related'][0] != null) {
      inst.panelMembers = FHIRHelper.createInstanceFromFHIR('shr.core.PanelMembers', fhir['related'][0], 'BackboneElement', shrId, allEntries, mappedResources, referencesOut, false);
      if (fhir['related'][0]['target'] != null) {
        inst.panelMembers.observation = inst.panelMembers.observation || [];
        const entryId = fhir['related'][0]['target']['reference'];
        if (!mappedResources[entryId]) {
          const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
          if (referencedEntry) {
            mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.core.Observation', referencedEntry['resource'], 'undefined', shrId, allEntries, mappedResources, referencesOut);
          }
        }
        let inst_panelMembers_observation;
        if (mappedResources[entryId]) {
          inst_panelMembers_observation = FHIRHelper.createReference(mappedResources[entryId], referencesOut);
        }
        else {
          const entryType = 'http://standardhealthrecord.org/spec/shr/core/Observation';
          inst_panelMembers_observation = FHIRHelper.createReferenceWithoutObject(shrId, entryId, entryType);
        }
        inst.panelMembers.observation.push(inst_panelMembers_observation);
      }
    }
    return inst;
  }

}
export default CancerStageGroup;
