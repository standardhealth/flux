import request from "request";
import _ from 'lodash';
import IOutcomesService from './IOutcomesService';
import FilterOptions from '../../utils/FilterOptions';

export default class CLQOutcomesService extends IOutcomesService {
    constructor(params) {
        super();
        this.serviceUrl = params.serviceUrl;
        this.timescale = params.timescale || [];
    }

    /*
    Based off of the mcode namespace find the elements that match it in the filter
    */
    findMcodeElements(props, mcodeType, single = false) {
        let found = [];
        _.forIn(props, function (value, key) {
            if (value.mcodeElement === mcodeType && value.selected) {
                found.push(value);
            }
        });
        return single ? found[0] : found;
    }

    /* Build the CLQ demograpchics filter section based off of the Compass filter criteria
     */
    buildDemographicsFilter(filterOptions) {
        let filter = {};
        let gender = filterOptions["shr.core.BirthSex"];
        let race = filterOptions["shr.core.Race"];
        let age = filterOptions["shr.core.DateOfBirth"];
        let age_at_diagnosis = filterOptions["shr.core.DateOfDiagnosis"];
        if (gender) {
            filter.gender = {
                codeSystemName: "AdministrativeGender",
                codeSystem: "2.16.840.1.113883.4.642.2.1",
                code: gender.value
            };
        }
        if (age) {
            filter.age = {
                min: age.minValue,
                max: age.maxValue
            };
        }
        if (age_at_diagnosis) {
            filter.age_at_diagnosis = {
                min: age_at_diagnosis.minValue,
                max: age_at_diagnosis.maxValue
            };
        }
        if (race) {
            filter.race = {
                "codeSystemName": "HL7 v3 Code System Race",
                "codeSystem": "2.16.840.1.113883.5.104",
                "code": race.value
            };
        }
        return filter;
    }

    /* Build the CLQ diagnosis filter based off of the Comapss Filter options
     */
    buildDiagnosisFilter(filterOptions) {
        let filter = {};
        let stage = filterOptions["onco.core.TNMClinicalStageGroup"];
        let t = filterOptions["onco.core.TNMClinicalPrimaryTumorCategory"];
        let n = filterOptions["onco.core.TNMClinicalRegionalNodesCategory"];
        let m = filterOptions["onco.core.TNMClinicalDistantMetastasesCategory"];
        let grade = filterOptions["onco.core.CancerHistologicGrade"];
        if (stage) {
            filter.stage = stage.reference.stage;
        }
        if (grade) {
            filter.grade = grade.reference.getGradeAsSimpleNumber();
        }
        filter.tnm = {};
        if (t) {
            filter.tnm.t = t.value;
        }
        if (n) {
            filter.tnm.n = n.value;
        }
        if (m) {
            filter.tnm.m = m.value;
        }
        return filter;
    }

    /* Build the CLQ tumor markers filter sections based off the tumor makrkers found in the similar
    patient properties
    */
    buildTumorMarkersFilter(filterOptions) {
        let filter = [];
        // loop over options look for tumor markers and add to filter
        let markers = filterOptions["onco.core.TumorMarkerTest"];
        if (markers!==undefined && !Array.isArray(markers)) {
            markers = [markers];
        }
        for (let x in markers) {
            let option = markers[x];
            let code = option.reference.receptorTypeCodeableConcept;
            let value = option.value;
            filter.push({
                code: code.code.code,
                codeSystem: code.codeSystem.uri,
                displayName: code.displayText.string,
                value: value
            });
        }
        return filter;
    }

    /* Process a filter generated by Compass.  This method will map the Compass filter items
    into a filter that is expected by the CLQ service and then call the service and process the
    response into a format that is used by the Compass UI */
    processSimilarPatientOutcomes(similarPatientProps) {
        let filter = {};
        const fOptions = new FilterOptions(similarPatientProps);
        const filterValues = fOptions.getAllActiveValuesByMcodeElement();
        filter.demographics = this.buildDemographicsFilter(filterValues);
        filter.diagnosis = this.buildDiagnosisFilter(filterValues);
        filter.tumorMarkers = this.buildTumorMarkersFilter(filterValues);
        filter.outcomes = {survival: this.timescale.map((ts) => { return {"value": ts*12, "interval": "months" }; })};
        return new Promise((accept, reject) => {
            request({
                url: this.serviceUrl,
                method: "POST",
                json: filter
            }, (err, _response, data) => {
                if (err) {
                    reject(err);
                }
                try {
                    console.log(data);
                    accept(data);
                } catch (ex) {
                    reject(ex);
                }
            });

        });
    }
}
