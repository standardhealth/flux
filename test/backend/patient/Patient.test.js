import PatientRecord from '../../../src/patient/PatientRecord';
import hardCodedPatient from '../../../src/dataaccess/HardCodedPatient.json';
import FakeDataElement from './FakeDataElement';
import AdministrativeGender from '../../../src/model/shr/actor/AdministrativeGender'
import ShrDemographicsObjectFactory from '../../../src/model/ShrDemographicsObjectFactory'
import PersonOfRecord from '../../../src/model/shr/demographics/PersonOfRecord'
import Moment from 'moment';
import {expect} from 'chai';

// The empty PatientRecord.jsx obj
const emptyPatientObj = new PatientRecord(null);
// The empty patient shr object -- an empty array 
const emptyPatient = emptyPatientObj.entries;
// The empty patient record entry -- should be null
const emptyPatientRecord = emptyPatientObj.getPersonOfRecord();

// The hardcoded PatientRecord.jsx obj
const hardCodedPatientObj = new PatientRecord(hardCodedPatient);
// The patient shr object -- an array of entries
const hardCodedPatientEntries = hardCodedPatientObj.entries;
// The patient record entry -- should be an shr object
const hardCodedPatientRecord = hardCodedPatientObj.getPersonOfRecord();

// Helpers
function getValidTypeFrom(patient) { 
    const typeUrl = patient[0]._entryInfo._entryType[0];
    const typeName = typeUrl.substr(typeUrl.lastIndexOf('/')+1);
    return ShrDemographicsObjectFactory.createInstance(typeName);
} 

describe('getMostRecentEntryFromList', function () { 

    it('should return null when the list is empty', function () { 
        expect(PatientRecord.getMostRecentEntryFromList(emptyPatient))
            .to.be.null;
    });

    it('should return an element from non-empty list of entries that have the attribute lastUpdateDate', function () { 
        expect(PatientRecord.getMostRecentEntryFromList(hardCodedPatientEntries))
            .to.not.be.null;
    });

    it('should return the first element from non-empty, sorted list of entries that have the attribute lastUpdateDate', function () { 
        //slice to clone obj
        const sortedList = hardCodedPatientEntries.slice().sort(function (a,b) { 
            const a_lastUpdateDate = new Moment(a._entryInfo._lastUpdateDate, "D MMM YYYY");
            const b_lastUpdateDate = new Moment(b._entryInfo._lastUpdateDate, "D MMM YYYY");
            if (a_lastUpdateDate < b_lastUpdateDate) { return 1; }
            if (a_lastUpdateDate > b_lastUpdateDate) { return -1; }
            return 0;
        });
        const firstElem = sortedList[0];
        expect(PatientRecord.getMostRecentEntryFromList(hardCodedPatientEntries))
            .to.eql(firstElem);
    });
});

describe('getPersonOfRecord', function () { 

    it('should return null when there is no patient', function () { 
        expect(emptyPatientObj.getPersonOfRecord())
            .to.be.null;
    });

    it('should return the patient when there is a patient', function () { 
        const personRecord = hardCodedPatientObj.getMostRecentEntryOfType(PersonOfRecord);
        expect(hardCodedPatientObj.getPersonOfRecord())
            .to.equal(personRecord);
    });
});

describe('getName', function () { 

    it('should return null when there is no patient', function () { 
        expect(emptyPatientObj.getName())
            .to.be.null;
    });

    it('should return valid name on getName', function () { 
        expect(hardCodedPatientRecord)
            .to.not.be.null;
        // Path to name based on SHR record api. 
        const expectedName = hardCodedPatientRecord._humanName;
        expect(hardCodedPatientObj.getName())
            .to.be.a('string')
            .and.to.eql(expectedName);
    });
});

describe('getDateOfBirth', function () { 

    it('should return null when there is no patient record', function () { 
        expect(emptyPatientObj.getDateOfBirth())
            .to.be.null;
    });

    it('should return valid date on getDateOfBirth when there is a person of record', function () { 
        expect(hardCodedPatientObj)
            .to.not.be.null;
        // Path to date based on SHR record api, use to create moment obj. 
        const expectedDate = new Moment(hardCodedPatient[0].dateOfBirth, "D MMM YYYY");
        expect(hardCodedPatientObj.getDateOfBirth())
            .to.be.instanceOf(Moment)
            .and.to.eql(expectedDate);
    });
});

describe('getAge', function () { 

    it('should return null when there is no patient record', function () { 
        expect(emptyPatientObj.getDateOfBirth())
            .to.be.null;
    });

    it('should return number of years from DOB when there is a patient record', function () { 
        const DOB = hardCodedPatientObj.getDateOfBirth();
        const today = new Date();
        const birthDate = new Date(DOB);
        const m = today.getMonth() - birthDate.getMonth();
        let expectedAge = today.getFullYear() - birthDate.getFullYear();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            expectedAge--;
        }
        expect(hardCodedPatientObj.getAge())
            .to.be.a('Number')
            .and.to.equal(expectedAge);
    });
});

describe('getGender', function () { 

    it('should return null when there is no patient record', function () { 
        expect(emptyPatientObj.getGender())
            .to.be.null;
    });

    it('should return patients administrative gender when there is a patient record', function () {
        expect(hardCodedPatientRecord)
            .to.not.be.null;
        const expectedGender = hardCodedPatientRecord.administrativeGender.code;
        expect(hardCodedPatientObj.getGender())
            .to.be.a('string')
            .and.to.equal(expectedGender);
    });
});

describe('getConditions', function () { 
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getConditions())
                .to.be.an('array')
                .that.is.empty;
    });

    const conditions = hardCodedPatientObj.getConditions();
    it('should return a non empty array when there are conditions', function () { 
        expect(conditions)
                .to.be.an('array')
                .that.is.not.empty;
    });
});

// below here havent been examined.
describe('getKeyEventsChronologicalOrder', function () { 
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getKeyEventsChronologicalOrder())
                .to.be.an('array')
                .that.is.empty;
    });
});

describe('getKeyEventsForConditionChronologicalOrder', function () { 
    // get first condition on hardcoded patient to test with
    const condition = hardCodedPatientObj.getConditions()[0];
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getKeyEventsForConditionChronologicalOrder(condition))
                .to.be.an('array')
                .that.is.empty;
    });

    const events = hardCodedPatientObj.getKeyEventsForConditionChronologicalOrder(condition);
    it('should return a non empty array when there are key events', function () { 
        expect(events)
                .to.be.an('array')
                .that.is.not.empty;
    });

    // test that the array is sorted in chronological order
    for (let i = 0; i < events.length - 1; i++) {
        it('should return an array sorted by date.', function () {
            const firstDate = new Moment(events[i].start_time, "D MMM YYYY");
            const secondDate = new Moment(events[i + 1].start_time, "D MMM YYYY");
            expect(firstDate <= secondDate).to.be.true;
        });
    }
});

describe('getMedications', function () { 
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getMedications())
                .to.be.an('array')
                .that.is.empty;
    });

    const medications = hardCodedPatientObj.getMedications();
    it('should return a non empty array on when there are medication entries', function () { 
        expect(medications)
                .to.be.an('array')
                .that.is.not.empty;
    });
});

describe('getProcedures', function () { 
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getProcedures())
                .to.be.an('array')
                .that.is.empty;
    });

    const procedures = hardCodedPatientObj.getProcedures();
    it('should return a non empty array on when there are procedure entries', function () { 
        expect(procedures)
                .to.be.an('array')
                .that.is.not.empty;
    });
});

describe('getProgressions', function () { 
    it('should return an empty array on empty patient object', function () { 
        expect(emptyPatientObj.getProgressions())
                .to.be.an('array')
                .that.is.empty;
    });

    const progressions = hardCodedPatientObj.getProgressions();
    it('should return a non empty array on when there are progression entries', function () { 
        expect(progressions)
                .to.be.an('array')
                .that.is.not.empty;
    });
});

describe('getMRN', function () { 
 
    it('should return the string value for MRN', function () { 
         const expected = "";
         expect(hardCodedPatientObj.getMRN()).to.equal('026-DH-678944');
     });
});

// Because we are checking that all the fields match, checking for deep equality is needed here.
describe('getCurrentHomeAddress', function () { 

    it('should return an object with addressLine, city, state, country', function () { 
        const expected = { addressLine : ['123 Main Street'], city: 'Boston', state: 'MA', country: 'US' };
        expect(hardCodedPatientObj.getCurrentHomeAddress()).to.deep.equal(expected);
    });
});

describe('addEntryToPatient', function () { 
	let testPatient = new Patient(null);
	const today = new Moment().format("D MMM YYYY");
	const procedureEntryToAdd = {
        entryType: [    "http://standardhealthrecord.org/procedure/Procedure",
                        "http://standardhealthrecord.org/base/Intervention",
                        "http://standardhealthrecord.org/base/Action" ],
        originalCreateDate: today,
        asOfDate: today,
        lastUpdateDate: today,
        occurrenceTime: "12 JUL 2005",
        reason: {
                    entryType: "http://standardhealthrecord.org/condition/Condition", 
                    shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d", 
                    entryId: "8" }
    };
    it('should return a Patient with one Entry', function () { 
		testPatient.addEntryToPatient(procedureEntryToAdd);
        expect(testPatient.getEntriesOfType("http://standardhealthrecord.org/procedure/Procedure")[0]).to.deep.equal(procedureEntryToAdd);
    });
});

// This is testing a static function on Patient, so no Patient instance is required, only an Entry
describe('isEntryOfType', function () { 
	const today = new Moment().format("D MMM YYYY");
	const procedureEntryToAdd = {
        entryType: [    "http://standardhealthrecord.org/procedure/Procedure",
                        "http://standardhealthrecord.org/base/Intervention",
                        "http://standardhealthrecord.org/base/Action" ],
        originalCreateDate: today,
        asOfDate: today,
        lastUpdateDate: today,
        occurrenceTime: "12 JUL 2005",
        reason: {
                    entryType: "http://standardhealthrecord.org/condition/Condition", 
                    shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d", 
                    entryId: "8" }
    };
    it('should return a Patient with one Entry of type Procedure', function () { 
        expect(Patient.isEntryOfType(procedureEntryToAdd, "http://standardhealthrecord.org/procedure/Procedure")).to.equal(true);
    });
});

// This is testing a static function on Patient, so no Patient instance is required, only an Entry
describe('isEntryBasedOnType', function () { 
	const today = new Moment().format("D MMM YYYY");
	const procedureEntryToAdd = {
        entryType: [    "http://standardhealthrecord.org/procedure/Procedure",
                        "http://standardhealthrecord.org/base/Intervention",
                        "http://standardhealthrecord.org/base/Action" ],
        originalCreateDate: today,
        asOfDate: today,
        lastUpdateDate: today,
        occurrenceTime: "12 JUL 2005",
        reason: {
                    entryType: "http://standardhealthrecord.org/condition/Condition", 
                    shrId: "788dcbc3-ed18-470c-89ef-35ff91854c7d", 
                    entryId: "8" }
    };
    it('should return a Patient with one Entry of type Procedure', function () { 
        expect(Patient.isEntryBasedOnType(procedureEntryToAdd, "http://standardhealthrecord.org/base/Action")).to.equal(true);
    });
});

// Specific entries don't need tests, e.g.:  getMostRecentPhoto, getNotes
// Patient should not know the details of Entries, including Conditions

// describe('getLastBreastCancerCondition', function () { 

//     it('should return null', function () { 
//         const expected = "";
//         expect(hardCodedPatientObj.getLastBreastCancerCondition()).to.equal();
//     });
// });

// describe('getNotes', function () { 

//     it('should return null', function () { 
//         const expected = "";
//         expect(hardCodedPatientObj.getNotes()).to.equal();
//     });
// });

// describe('getObservationsForCondition', function() { 

//     it('should return null', function () { 
//         getObservationsForCondition(condition, type)
//     });
// });

// describe('getMostRecentStagingForCondition', function() { 

//     it('should return null', function () { 
//         getMostRecentStagingForCondition(condition, sinceDate = null)
//     });
// });

// describe('getReceptorStatus', function() { 

//     it('should return null', function () { 
//         getReceptorStatus(condition, receptorType)
//     });
// });

// describe('getFocalConditionForProgression', function () { 

//     it('should return null', function () { 
//         getFocalConditionForProgression(progression)
//     });
// });

// describe('getMostRecentProgressionForCondition', function () { 

//     it('should return null', function () { 
//         getMostRecentProgressionForCondition(condition, sinceDate = null)
//     });
// });
