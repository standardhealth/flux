import FluxEntry from '../base/FluxEntry';
import MedicationStatement from '../../shr/core/MedicationStatement';
import FluxMedicationStatementAfterChange from './FluxMedicationStatementAfterChange';
import EndDateTime from '../../shr/core/EndDateTime';
import * as codeableConceptUtils from '../../CodeableConceptUtils.jsx';
import Lang from 'lodash';
import moment from 'moment';
import Category from '../../shr/core/Category';

class FluxMedicationStatement extends FluxEntry {
    constructor(json, patientRecord) {
        super(json);
        this._entry = this._medicationStatement = MedicationStatement.fromJSON(json);
        this._patientRecord = patientRecord;
        if (!this._medicationStatement.entryInfo) {
            this._medicationStatement.entryInfo = this._constructEntry('http://standardhealthrecord.org/spec/shr/core/MedicationStatement');
        }
    }
    /**
     * Get the entry information.
     * Returns entryInfo object
     */
    get entryInfo() {
        return this._medicationStatement.entryInfo;
    }

    get metadata() {
        return this._medicationStatement.metadata;
    }

    set metadata(metadata) {
        this._medicationStatement.metadata = metadata;
    }

    /**
     * Get the MedicationStatementAfterChange object.
     * Returns medicationRequested object
     */
    get medicationStatementAfterChange() {
        if (!this._medicationStatement.medicationStatementAfterChange) return null;
        return this._medicationStatement.medicationStatementAfterChange;
    }
    /**
     * Get the type of medication change
     * Returns type as a string
     */
    get type() {
        // Return code
        return this._medicationStatement.category.value.coding[0].codeValue;
    }

    set type(code) {
        if (!this._medicationStatement.category) {
            this._medicationStatement.category = new Category();
        }

        this._medicationChange.category.value = codeableConceptUtils.getCodeableConceptFromTuple({value: code, codeSystem: "http://standardhealthrecord.org/spec/shr/medication/cs/#MedicationChangeTypeCS", displayText: code} );
    }

    /**
     * Getter for when the medicationChange happened, using the creation time of the entry as the time prescribed
     * Returns date as a string
     */
    get lastUpdated() {
        return this._medicationStatement.metadata.lastUpdated.dateTime;
    }

    // Set dosage of medicationStatementAfterChange
    set afterDosage(amount) {
        if (!amount) {
            if (this.medicationStatementAfterChange) {
                this.removeMedicationAfterAndMedicationStopDate();
            } else {
                // Set Stored value to null
                this.medAfterDoseAmount = null;
            }
        } else {
            if (this._medicationChange.medicationStatementAfterChange) {
                const medAfter = this._patientRecord.getEntryFromReference(this.medicationStatementAfterChange.value);
                medAfter.dose = amount;
            } else if (this.stopDate) {
                const medAfter = this.createMedicationAfterFromMedicationStopDate();
                medAfter.dose = amount;
            } else {
                // Store value until medBefore is set
                this.medAfterDoseAmount = amount;
            }
        }
    }

    // Clones medicationBefore and sets medicationAfter to cloned object
    // Sets endDate for medicationBefore and sets startDate for medAfter
    // Adds medicationAfter to patient
    createMedicationAfterFromMedicationStopDate() {
        const medBefore = this._patientRecord.getEntryFromReference(this._medicationStatement);
        const today = new moment().format('D MMM YYYY');
        const medAfter = Lang.cloneDeep(medBefore);

        // set stopDate to today
        medBefore.stopDate = today;

        // set start date for medicationAfter
        medAfter.startDate = today;
        this._patientRecord.addEntryToPatient(medAfter);
        const medAfterChange = new FluxMedicationStatementAfterChange();
        medAfterChange.value = this._patientRecord.createEntryReferenceTo(medAfter);
        this._medicationChange.medicationStatementAfterChange = [medAfterChange];

        return medAfter;
    }

    // Removes medicationAfter from patient record and resets end date 
    removeMedicationAfterAndMedicationStopDate() {
        // Delete medicationAfterChange entry if no amount and reset end date
        const medAfter = this._patientRecord.getEntryFromReference(this.medicationStatementAfterChange.value);
        this._patientRecord.removeEntryFromPatient(medAfter);
        this._medicationChange.medicationStatementAfterChange = null;
        if (this.stopDate) {
            this.stopDate = medAfter.stopDate;
        }
    }

    // Get the stop time for the medication or return null
    get stopDate() {
        return this._medicationStatement.stopDate;

    }

    // Set the end date for medication
    set stopDate(date) {
        const endDateTime = new EndDateTime();
        endDateTime.value = date;
        this._medicationStatement.stopDate = endDateTime;
    }

    /**
     * Return a JSON representation of medicationChange
     */
    toJSON() {
        return this._medicationStatement.toJSON();
    }
}

export default FluxMedicationStatement;