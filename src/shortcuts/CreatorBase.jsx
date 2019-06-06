import EntryShortcut from './EntryShortcut';

export default class CreatorBase extends EntryShortcut {
    constructor(onUpdate, metadata, patient, shortcutData) {
        super(metadata);
        this.isSetByLabel = {};
        this.onUpdate = onUpdate;
        this.patient = patient;
        this._initializeValueObject(metadata, patient, shortcutData);
        this._initializeValueObjectAttributes(metadata);
        this.setAttributeValue = this.setAttributeValue.bind(this);
    }

    getAttributeIsSetByLabel(name) {
        return this.isSetByLabel[name];
    }

    setAttributeIsSetByLabel(name, val) {
        this.isSetByLabel[name] = val;
    }

    get isComplete() {
        return this.parentContext && this.hasChildren();
    }
}
