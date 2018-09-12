import { setPropertiesFromJSON } from '../../json-helper';

/**
 * Generated class for shr.fhir.ComplexExtension.
 */
class ComplexExtension {

  /**
   * Get the StringValue.
   * @returns {StringValue} The shr.simple.StringValue
   */
  get stringValue() {
    return this._stringValue;
  }

  /**
   * Set the StringValue.
   * This field/value is required.
   * @param {StringValue} stringValue - The shr.simple.StringValue
   */
  set stringValue(stringValue) {
    this._stringValue = stringValue;
  }

  /**
   * Set the StringValue and return 'this' for chaining.
   * This field/value is required.
   * @param {StringValue} stringValue - The shr.simple.StringValue
   * @returns {ComplexExtension} this.
   */
  withStringValue(stringValue) {
    this.stringValue = stringValue; return this;
  }

  /**
   * Get the BooleanValue.
   * @returns {BooleanValue} The shr.simple.BooleanValue
   */
  get booleanValue() {
    return this._booleanValue;
  }

  /**
   * Set the BooleanValue.
   * This field/value is required.
   * @param {BooleanValue} booleanValue - The shr.simple.BooleanValue
   */
  set booleanValue(booleanValue) {
    this._booleanValue = booleanValue;
  }

  /**
   * Set the BooleanValue and return 'this' for chaining.
   * This field/value is required.
   * @param {BooleanValue} booleanValue - The shr.simple.BooleanValue
   * @returns {ComplexExtension} this.
   */
  withBooleanValue(booleanValue) {
    this.booleanValue = booleanValue; return this;
  }

  /**
   * Deserializes JSON data to an instance of the ComplexExtension class.
   * The JSON must be valid against the ComplexExtension JSON schema, although this is not validated by the function.
   * @param {object} json - the JSON data to deserialize
   * @returns {ComplexExtension} An instance of ComplexExtension populated with the JSON data
   */
  static fromJSON(json = {}) {
    const inst = new ComplexExtension();
    setPropertiesFromJSON(inst, json);
    return inst;
  }
  /**
   * Serializes an instance of the ComplexExtension class to a JSON object.
   * The JSON is expected to be valid against the ComplexExtension JSON schema, but no validation checks are performed.
   * @returns {object} a JSON object populated with the data from the element
   */
  toJSON() {
    const inst = { 'EntryType': { 'Value': 'http://standardhealthrecord.org/spec/shr/fhir/ComplexExtension' } };
    if (this.stringValue != null) {
      inst['StringValue'] = typeof this.stringValue.toJSON === 'function' ? this.stringValue.toJSON() : this.stringValue;
    }
    if (this.booleanValue != null) {
      inst['BooleanValue'] = typeof this.booleanValue.toJSON === 'function' ? this.booleanValue.toJSON() : this.booleanValue;
    }
    return inst;
  }
  /**
   * Serializes an instance of the ComplexExtension class to a FHIR object.
   * The FHIR is expected to be valid against the ComplexExtension FHIR profile, but no validation checks are performed.
   * @param {asExtension=false} Render this instance as an extension
   * @returns {object} a FHIR object populated with the data from the element
   */
  toFHIR(asExtension = false) {
    let inst = {};
    if (asExtension) {
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.stringValue.toFHIR(true));
      inst['extension'] = inst['extension'] || [];
      inst['extension'].push(this.booleanValue.toFHIR(true));
      inst['url'] = 'http://example.com/fhir/StructureDefinition/shr-fhir-ComplexExtension-extension';
    }
    return inst;
  }
}
export default ComplexExtension;
