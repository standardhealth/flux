import { setPropertiesFromJSON } from '../../json-helper';

/**
 * Generated class for shr.base.Subject.
 */
class Subject {

  /**
   * Get the choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference.
   * @returns {Reference} The choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference
   */
  get value() {
    return this._value;
  }

  /**
   * Set the choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference.
   * This field/value is required.
   * @param {Reference} value - The choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference
   */
  set value(value) {
    this._value = value;
  }

  /**
   * Set the choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference and return 'this' for chaining.
   * This field/value is required.
   * @param {Reference} value - The choice value; one of: shr.entity.Patient reference, shr.entity.Group reference, shr.device.Device reference, shr.core.Location reference, shr.entity.RelatedPerson reference, shr.entity.Organization reference
   * @returns {Subject} this.
   */
  withValue(value) {
    this.value = value; return this;
  }

  /**
   * Deserializes JSON data to an instance of the Subject class.
   * The JSON must be valid against the Subject JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {Subject} An instance of Subject populated with the JSON data
   */
  static fromJSON(json = {}) {
    const inst = new Subject();
    setPropertiesFromJSON(inst, json);
    return inst;
  }
  /**
   * Serializes an instance of the Subject class to a JSON object.
   * The JSON is expected to be valid against the Subject JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value': 'http://standardhealthrecord.org/spec/shr/base/Subject' } };
    if (this.value != null) {
      inst['Value'] = typeof this.value.toJSON === 'function' ? this.value.toJSON() : this.value;
    }
    return inst;
  }
  /**
   * Serializes an instance of the Subject class to a FHIR object.
   * The FHIR is expected to be valid against the Subject FHIR profile, but no validation checks are performed.
   * @param {asExtension=false} Render this instance as an extension
   * @returns {object} a FHIR object populated with the data from the element
   */
  toFHIR(asExtension = false) {
    let inst = {};
    if (asExtension) {
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.patient.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.group.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.device.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.location.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.relatedPerson.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.organization.toFHIR(true));
      inst['url'] = 'http://standardhealthrecord.org/fhir/StructureDefinition/shr-base-Subject-extension';
    }
    if (!asExtension && this.value != null) {
      if (this.value != null) {
        inst = typeof this.value.toFHIR === 'function' ? this.value.toFHIR() : this.value;
      }
    }
    return inst;
  }
}
export default Subject;
