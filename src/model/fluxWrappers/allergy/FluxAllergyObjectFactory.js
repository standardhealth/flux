import { getNamespaceAndName } from '../../json-helper';
import FluxNoKnownAllergy from './FluxNoKnownAllergy';
// import SubstanceCategory from '../shr/allergy/SubstanceCategory';
// import AdverseReaction from '../shr/allergy/AdverseReaction';
// import Manifestation from '../shr/allergy/Manifestation';
// import ShrAllergyObjectFactory from '../shr/allergy/ShrAllergyObjectFactory';

export default class FluxAllergyObjectFactory {
    static createInstance(json, type) {
        const { namespace, elementName } = getNamespaceAndName(json, type);
        if (namespace !== 'shr.allergy') {
            throw new Error(`Unsupported type in ShrAllergyObjectFactory: ${type}`);
        }
        // returns Flux wrapper class if found, otherwise use ShrAllergyObjectFactory
        switch (elementName) {
            case 'NoKnownAllergy': return new FluxNoKnownAllergy(json);
            // case 'SubstanceCategory': return SubstanceCategory.fromJSON(json);
            // case 'AdverseReaction': return AdverseReaction.fromJSON(json);
            // case 'Manifestation': return Manifestation.fromJSON(json);
            // default: return ShrAllergyObjectFactory.createInstance(json);
        }
    }
}