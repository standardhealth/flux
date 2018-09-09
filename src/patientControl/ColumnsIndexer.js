import BaseIndexer from './BaseIndexer';
import Lang from 'lodash';

class ColumnIndexer extends BaseIndexer {
    indexData(section, subsection, data, searchIndex) {
        let list = data.items || [];
        list.forEach(([title, valueObject]) => {
            if(Lang.isObject(valueObject)) {
                searchIndex.addSearchableData({
                    section,
                    subsection,
                    valueTitle: title.value,
                    value: valueObject.value || "Missing Data"
                });
            }
        });
    }
}

export default ColumnIndexer;