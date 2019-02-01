import { setPropertiesFromJSON, uuid, FHIRHelper } from '../../json-helper';

import CodedNonLaboratoryObservation from './CodedNonLaboratoryObservation';

/**
 * Generated class for shr.base.SimpleCodedNonLaboratoryObservation.
 * @extends CodedNonLaboratoryObservation
 */
class SimpleCodedNonLaboratoryObservation extends CodedNonLaboratoryObservation {

  /**
   * Get the entry information.
   * @returns {Entry} The shr.base.Entry
   */
  get entryInfo() {
    return this._entryInfo;
  }

  /**
   * Set the entry information.
   * @param {Entry} entryInfo - The shr.base.Entry
   */
  set entryInfo(entryInfo) {
    this._entryInfo = entryInfo;
  }

  /**
   * Set the entry information and return 'this' for chaining.
   * @param {Entry} entryInfo - The shr.base.Entry
   * @returns {SimpleCodedNonLaboratoryObservation} this.
   */
  withEntryInfo(entryInfo) {
    this.entryInfo = entryInfo; return this;
  }

  /**
   * Get the NonIndependentFinding array.
   * @returns {Array<NonIndependentFinding>} The shr.base.NonIndependentFinding array
   */
  get nonIndependentFinding() {
    return this._nonIndependentFinding;
  }

  /**
   * Set the NonIndependentFinding array.
   * @param {Array<NonIndependentFinding>} nonIndependentFinding - The shr.base.NonIndependentFinding array
   */
  set nonIndependentFinding(nonIndependentFinding) {
    this._nonIndependentFinding = nonIndependentFinding;
  }

  /**
   * Set the NonIndependentFinding array and return 'this' for chaining.
   * @param {Array<NonIndependentFinding>} nonIndependentFinding - The shr.base.NonIndependentFinding array
   * @returns {SimpleCodedNonLaboratoryObservation} this.
   */
  withNonIndependentFinding(nonIndependentFinding) {
    this.nonIndependentFinding = nonIndependentFinding; return this;
  }

  /**
   * Get the PanelMembers.
   * @returns {PanelMembers} The shr.base.PanelMembers
   */
  get panelMembers() {
    return this._panelMembers;
  }

  /**
   * Set the PanelMembers.
   * @param {PanelMembers} panelMembers - The shr.base.PanelMembers
   */
  set panelMembers(panelMembers) {
    this._panelMembers = panelMembers;
  }

  /**
   * Set the PanelMembers and return 'this' for chaining.
   * @param {PanelMembers} panelMembers - The shr.base.PanelMembers
   * @returns {SimpleCodedNonLaboratoryObservation} this.
   */
  withPanelMembers(panelMembers) {
    this.panelMembers = panelMembers; return this;
  }

  /**
   * Deserializes JSON data to an instance of the SimpleCodedNonLaboratoryObservation class.
   * The JSON must be valid against the SimpleCodedNonLaboratoryObservation JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {SimpleCodedNonLaboratoryObservation} An instance of SimpleCodedNonLaboratoryObservation populated with the JSON data
   */
  static fromJSON(json={}) {
    const inst = new SimpleCodedNonLaboratoryObservation();
    setPropertiesFromJSON(inst, json);
    return inst;
  }

  /**
   * Serializes an instance of the SimpleCodedNonLaboratoryObservation class to a JSON object.
   * The JSON is expected to be valid against the SimpleCodedNonLaboratoryObservation JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = this._entryInfo.toJSON();
    inst['EntryType'] = { 'Value' : 'http://standardhealthrecord.org/spec/shr/base/SimpleCodedNonLaboratoryObservation' };
    if (this.narrative != null) {
      inst['Narrative'] = typeof this.narrative.toJSON === 'function' ? this.narrative.toJSON() : this.narrative;
    }
    if (this.language != null) {
      inst['Language'] = typeof this.language.toJSON === 'function' ? this.language.toJSON() : this.language;
    }
    if (this.metadata != null) {
      inst['Metadata'] = typeof this.metadata.toJSON === 'function' ? this.metadata.toJSON() : this.metadata;
    }
    if (this.findingResult != null) {
      inst['FindingResult'] = typeof this.findingResult.toJSON === 'function' ? this.findingResult.toJSON() : this.findingResult;
    }
    if (this.findingTopicCode != null) {
      inst['FindingTopicCode'] = typeof this.findingTopicCode.toJSON === 'function' ? this.findingTopicCode.toJSON() : this.findingTopicCode;
    }
    if (this.exceptionValue != null) {
      inst['ExceptionValue'] = typeof this.exceptionValue.toJSON === 'function' ? this.exceptionValue.toJSON() : this.exceptionValue;
    }
    if (this.referenceRange != null) {
      inst['ReferenceRange'] = typeof this.referenceRange.toJSON === 'function' ? this.referenceRange.toJSON() : this.referenceRange;
    }
    if (this.patient != null) {
      inst['Patient'] = typeof this.patient.toJSON === 'function' ? this.patient.toJSON() : this.patient;
    }
    if (this.encounter != null) {
      inst['Encounter'] = typeof this.encounter.toJSON === 'function' ? this.encounter.toJSON() : this.encounter;
    }
    if (this.findingStatus != null) {
      inst['FindingStatus'] = typeof this.findingStatus.toJSON === 'function' ? this.findingStatus.toJSON() : this.findingStatus;
    }
    if (this.specificFocusOfFinding != null) {
      inst['SpecificFocusOfFinding'] = typeof this.specificFocusOfFinding.toJSON === 'function' ? this.specificFocusOfFinding.toJSON() : this.specificFocusOfFinding;
    }
    if (this.findingMethod != null) {
      inst['FindingMethod'] = typeof this.findingMethod.toJSON === 'function' ? this.findingMethod.toJSON() : this.findingMethod;
    }
    if (this.relevantTime != null) {
      inst['RelevantTime'] = typeof this.relevantTime.toJSON === 'function' ? this.relevantTime.toJSON() : this.relevantTime;
    }
    if (this.nonIndependentFinding != null) {
      inst['NonIndependentFinding'] = this.nonIndependentFinding.map(f => f.toJSON());
    }
    if (this.category != null) {
      inst['Category'] = typeof this.category.toJSON === 'function' ? this.category.toJSON() : this.category;
    }
    if (this.anatomicalLocation != null) {
      inst['AnatomicalLocation'] = typeof this.anatomicalLocation.toJSON === 'function' ? this.anatomicalLocation.toJSON() : this.anatomicalLocation;
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
    if (this.panelMembers != null) {
      inst['PanelMembers'] = typeof this.panelMembers.toJSON === 'function' ? this.panelMembers.toJSON() : this.panelMembers;
    }
    return inst;
  }

  /**
   * Deserializes FHIR JSON data to an instance of the SimpleCodedNonLaboratoryObservation class.
   * The FHIR must be valid against the SimpleCodedNonLaboratoryObservation FHIR profile, although this is not validated by the function.
   * @param {object} fhir - the FHIR JSON data to deserialize
   * @param {string} shrId - a unique, persistent, permanent identifier for the overall health record belonging to the Patient; will be auto-generated if not provided
   * @param {Array} allEntries - the list of all entries that references in 'fhir' refer to
   * @param {object} mappedResources - any resources that have already been mapped to SHR objects. Format is { fhir_key: {shr_obj} }
   * @param {Array} referencesOut - list of all SHR ref() targets that were instantiated during this function call
   * @param {boolean} asExtension - Whether the provided instance is an extension
   * @returns {SimpleCodedNonLaboratoryObservation} An instance of SimpleCodedNonLaboratoryObservation populated with the FHIR data
   */
  static fromFHIR(fhir, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
    const inst = new SimpleCodedNonLaboratoryObservation();
    inst.entryInfo = FHIRHelper.createInstanceFromFHIR('shr.base.Entry', {});
    inst.entryInfo.shrId = FHIRHelper.createInstanceFromFHIR('shr.base.ShrId', shrId);
    inst.entryInfo.entryId = FHIRHelper.createInstanceFromFHIR('shr.base.EntryId', fhir['id'] || uuid());
    inst.entryInfo.entryType = FHIRHelper.createInstanceFromFHIR('shr.base.EntryType', 'http://standardhealthrecord.org/spec/shr/base/SimpleCodedNonLaboratoryObservation');
    if (fhir['meta'] != null) {
      if (fhir['meta']['versionId'] != null) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.base.Metadata', {}, shrId);
        inst.metadata.versionId = FHIRHelper.createInstanceFromFHIR('shr.core.VersionId', fhir['meta']['versionId'], shrId, allEntries, mappedResources, referencesOut, false);
      }
      if (fhir['meta']['lastUpdated'] != null) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.base.Metadata', {}, shrId);
        inst.metadata.lastUpdated = FHIRHelper.createInstanceFromFHIR('shr.base.LastUpdated', fhir['meta']['lastUpdated'], shrId, allEntries, mappedResources, referencesOut, false);
      }
      for (const fhir_meta_security of fhir['meta']['security'] || []) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.base.Metadata', {}, shrId);
        inst.metadata.securityLabel = inst.metadata.securityLabel || [];
        const inst_metadata_securityLabel = FHIRHelper.createInstanceFromFHIR('shr.base.SecurityLabel', fhir_meta_security, shrId, allEntries, mappedResources, referencesOut, false);
        inst.metadata.securityLabel.push(inst_metadata_securityLabel);
      }
      for (const fhir_meta_tag of fhir['meta']['tag'] || []) {
        inst.metadata = inst.metadata || FHIRHelper.createInstanceFromFHIR('shr.base.Metadata', {}, shrId);
        inst.metadata.tag = inst.metadata.tag || [];
        const inst_metadata_tag = FHIRHelper.createInstanceFromFHIR('shr.base.Tag', fhir_meta_tag, shrId, allEntries, mappedResources, referencesOut, false);
        inst.metadata.tag.push(inst_metadata_tag);
      }
    }
    if (fhir['language'] != null) {
      inst.language = FHIRHelper.createInstanceFromFHIR('shr.core.Language', fhir['language'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['text'] != null) {
      inst.narrative = FHIRHelper.createInstanceFromFHIR('shr.base.Narrative', fhir['text'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    for (const fhir_extension of fhir['extension'] || []) {
      if (fhir_extension['url'] != null && fhir_extension['url'] === 'http://hl7.org/fhir/StructureDefinition/condition-targetBodySite') {
        inst.anatomicalLocation = inst.anatomicalLocation || FHIRHelper.createInstanceFromFHIR('shr.core.AnatomicalLocation', {}, shrId);
        inst.anatomicalLocation.value = FHIRHelper.createInstanceFromFHIR('shr.core.AnatomicalLocationStructured', fhir_extension, shrId, allEntries, mappedResources, referencesOut, true);
      }
      if (fhir_extension['url'] != null && fhir_extension['url'] === 'http://example.com/fhir/StructureDefinition/shr-base-SpecificFocusOfFinding-extension') {
        inst.specificFocusOfFinding = FHIRHelper.createInstanceFromFHIR('shr.base.SpecificFocusOfFinding', fhir_extension, shrId, allEntries, mappedResources, referencesOut, true);
      }
    }
    if (fhir['status'] != null) {
      inst.findingStatus = FHIRHelper.createInstanceFromFHIR('shr.base.FindingStatus', fhir['status'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['category'] != null && fhir['category'][0] != null) {
      inst.category = FHIRHelper.createInstanceFromFHIR('shr.core.Category', fhir['category'][0], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['code'] != null) {
      inst.findingTopicCode = FHIRHelper.createInstanceFromFHIR('shr.base.FindingTopicCode', fhir['code'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['subject'] != null) {
      const entryId = fhir['subject']['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.entity.Patient', referencedEntry['resource'], shrId, allEntries, mappedResources, referencesOut);
        }
      }
      inst.patient = mappedResources[entryId];
    }
    if (fhir['context'] != null) {
      const entryId = fhir['context']['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.encounter.Encounter', referencedEntry['resource'], shrId, allEntries, mappedResources, referencesOut);
        }
      }
      inst.encounter = mappedResources[entryId];
    }
    if (fhir['effectiveDateTime'] != null) {
      inst.relevantTime = FHIRHelper.createInstanceFromFHIR('shr.base.RelevantTime', fhir['effectiveDateTime'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['effectivePeriod'] != null) {
      inst.relevantTime = FHIRHelper.createInstanceFromFHIR('shr.base.RelevantTime', fhir['effectivePeriod'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['valueCodeableConcept'] != null) {
      inst.findingResult = FHIRHelper.createInstanceFromFHIR('shr.base.FindingResult', fhir['valueCodeableConcept'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['dataAbsentReason'] != null) {
      inst.exceptionValue = FHIRHelper.createInstanceFromFHIR('shr.base.ExceptionValue', fhir['dataAbsentReason'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['interpretation'] != null) {
      inst.interpretation = FHIRHelper.createInstanceFromFHIR('shr.base.Interpretation', fhir['interpretation'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['comment'] != null) {
      inst.commentOrDescription = FHIRHelper.createInstanceFromFHIR('shr.core.CommentOrDescription', fhir['comment'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['bodySite'] != null) {
      inst.anatomicalLocation = inst.anatomicalLocation || FHIRHelper.createInstanceFromFHIR('shr.core.AnatomicalLocation', {}, shrId);
      inst.anatomicalLocation.value = FHIRHelper.createInstanceFromFHIR('shr.core.AnatomicalLocationPrecoordinated', fhir['bodySite'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['method'] != null) {
      inst.findingMethod = FHIRHelper.createInstanceFromFHIR('shr.base.FindingMethod', fhir['method'], shrId, allEntries, mappedResources, referencesOut, false);
    }
    if (fhir['device'] != null) {
      const entryId = fhir['device']['reference'];
      if (!mappedResources[entryId]) {
        const referencedEntry = allEntries.find(e => e.fullUrl === entryId);
        if (referencedEntry) {
          mappedResources[entryId] = FHIRHelper.createInstanceFromFHIR('shr.entity.Device', referencedEntry['resource'], shrId, allEntries, mappedResources, referencesOut);
        }
      }
      inst.device = mappedResources[entryId];
    }
    for (const fhir_related of fhir['related'] || []) {
    }
    return inst;
  }

}
export default SimpleCodedNonLaboratoryObservation;
