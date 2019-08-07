import { getNamespaceAndName, uuid } from './json-helper';
import ObjectFactory from './ObjectFactory';
import FluxOncocoreObjectFactory from './fluxWrappers/onco/core/FluxOncocoreObjectFactory';
import FluxAdverseObjectFactory from './fluxWrappers/adverse/FluxAdverseObjectFactory';
import FluxAllergyObjectFactory from './fluxWrappers/allergy/FluxAllergyObjectFactory';
import FluxBaseObjectFactory from './fluxWrappers/base/FluxBaseObjectFactory';
import FluxCoreObjectFactory from './fluxWrappers/core/FluxCoreObjectFactory';
import FluxFindingObjectFactory from './fluxWrappers/finding/FluxFindingObjectFactory';
import FluxMedicationObjectFactory from './fluxWrappers/medication/FluxMedicationObjectFactory';
import FluxOncologyObjectFactory from './fluxWrappers/oncology/FluxOncologyObjectFactory';
import FluxTumorObjectFactory from './fluxWrappers/tumor/FluxTumorObjectFactory';

/*
 *  FluxObjectFactory class returns instances of Flux model classes
 *  Default case will return SHR model classes if no Flux wrapper class is found
 */
export default class FluxObjectFactory {
    static createInstance(json, type, patientRecord) {
        const { namespace } = getNamespaceAndName(json, type);
        switch (namespace) {
            case 'shr.adverse': return FluxAdverseObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.allergy': return FluxAllergyObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.base': return FluxBaseObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.core': return FluxCoreObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.finding': return FluxFindingObjectFactory.createInstance(json, type, patientRecord);
            case 'oncocore': return FluxOncocoreObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.medication': return FluxMedicationObjectFactory.createInstance(json, type, patientRecord);
            case 'shr.oncology': return FluxOncologyObjectFactory.createInstance(json, type, patientRecord);
            case 'tumor': return FluxTumorObjectFactory.createInstance(json, type, patientRecord);
            default: return ObjectFactory.createInstance(json, type, patientRecord);
        }
    }

    static createInstanceFromFHIR(shrType, fhir, fhirType, shrId=uuid(), allEntries=[], mappedResources={}, referencesOut=[], asExtension=false) {
        return ObjectFactory.createInstanceFromFHIR(shrType, fhir, fhirType, shrId, allEntries, mappedResources, referencesOut, asExtension);
    }
}
