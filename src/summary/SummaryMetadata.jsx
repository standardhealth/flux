import Lang from 'lodash'
import moment from 'moment';
import FluxHistologicGrade from '../model/oncology/FluxHistologicGrade';
import FluxTumorSize from '../model/oncology/FluxTumorSize';

class SummaryMetadata {
    constructor() {
        this.hardCodedMetadata = {
            "http://snomed.info/sct/408643008": {
                sections: [
                    {
                        name: "Summary",
                        type: "NameValuePairs",
                        /*eslint no-template-curly-in-string: "off"*/
                        narrative: [
                            {
                                defaultTemplate: "Patient has ${Current Diagnosis.Name} stage ${Current Diagnosis.Stage}"
                            },
                            {
                                defaultTemplate: "As of ${Current Diagnosis.As Of Date}, disease is ${Current Diagnosis.Disease Status} based on ${Current Diagnosis.Rationale}",
                                dataMissingTemplate: "No recent ${disease status}",
                                useDataMissingTemplateCriteria: [
                                    "Current Diagnosis.As Of Date",
                                    "Current Diagnosis.Disease Status",
                                    "Current Diagnosis.Rationale"
                                ]
                            },
                            {
                                defaultTemplate: "Recent lab results include ${Recent Lab Results}",
                                dataMissingTemplate: "No recent ${lab results}",
                                useDataMissingTemplateCriteria: [
                                    "Recent Lab Results"
                                ]
                            }
                        ],
                        data: [
                            {
                                name: "Current Diagnosis",
                                items: [
                                    {
                                        name: "Name",
                                        value: (patient, currentConditionEntry) => {
                                            return currentConditionEntry.type;
                                        },
                                        shortcut: "@condition"
                                    },
                                    {
                                        name: "Stage",
                                        value: (patient, currentConditionEntry) => {
                                            let s = currentConditionEntry.getMostRecentStaging();
                                            if (s && s.stage && s.stage.length > 0) {
                                                return s.stage;
                                            } else {
                                                return null;
                                            }
                                        },
                                        shortcut: "@stage"
                                    },
                                    {
                                        name: "Disease Status",
                                        value: (patient, currentConditionEntry) => {
                                            let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                                            if (Lang.isNull(p) || !p.status) {
                                                return null;
                                            } else {
                                                return p.status;
                                            }
                                        }
                                    },
                                    {
                                        name: "As Of Date",
                                        value: (patient, currentConditionEntry) => {
                                            let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                                            if (Lang.isNull(p) || !p.status) {
                                                return null;
                                            } else {
                                                return p.asOfDate;
                                            }
                                        }
                                    },
                                    {
                                        name: "Rationale",
                                        value: (patient, currentConditionEntry) => {
                                            let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                                            if (Lang.isNull(p) || !p.status) {
                                                return null;
                                            } else {
                                                return p.evidence.map(function (ev) {
                                                    return ev;
                                                }).join(', ');
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                name: "Recent Lab Results",
                                itemsFunction: this.getItemListForLabResults
                            }
                        ]
                    },
                    // {
                    //     name: "Current Diagnosis",
                    //     collections: [
                    //         {
                    //             name: "",
                    //             items:  [
                    //                 {
                    //                     name: "Name",
                    //                     value: (patient, currentConditionEntry) => {
                    //                         return currentConditionEntry.specificType.value.coding[0].displayText.value;
                    //                     },
                    //                     shortcut: "@condition"
                    //                 }, {
                    //                     name: "Stage",
                    //                     value: (patient, currentConditionEntry) => {
                    //                         let s = patient.getMostRecentStagingForCondition(currentConditionEntry);
                    //                         if (s && s.value.coding[0].displayText.value && s.value.coding[0].displayText.value.length > 0) {
                    //                             return s.value.coding[0].displayText.value + " (" + s.t_Stage.value.coding[0].displayText.value + s.n_Stage.value.coding[0].displayText.value + s.m_Stage.value.coding[0].displayText.value + ")";
                    //                         } else {
                    //                             return null;
                    //                         }
                    //                     },
                    //                     shortcut: "@stage"
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // },
                    // {
                    //     name: "Disease Status",
                    //     collections: [
                    //         {
                    //             name: "",
                    //             items:  [
                    //                 {
                    //                     name: "Most Recent Status",
                    //                     value: (patient, currentConditionEntry) => {
                    //                         let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                    //                         if (Lang.isNull(p)) {
                    //                             return null;
                    //                         } else {
                    //                             return p.value.coding[0].displayText.value;
                    //                         }
                    //                     }
                    //                 },
                    //                 {
                    //                     name: "Date of Most Recent Status",
                    //                     value: (patient, currentConditionEntry) => {
                    //                         let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                    //                         if (Lang.isNull(p)) {
                    //                             return null;
                    //                         } else {
                    //                             return p.asOfDate;
                    //                         }
                    //                     }
                    //                 },
                    //                 {
                    //                     name: "Basis for Disease Status",
                    //                     value: (patient, currentConditionEntry) => {
                    //                         let p = patient.getMostRecentProgressionForCondition(currentConditionEntry, moment().subtract(6, 'months'));
                    //                         if (Lang.isNull(p)) {
                    //                             return null;
                    //                         } else {
                    //                             return p.evidence.map(function(ev){
                    //                                 return ev.value.coding[0].displayText.value;
                    //                             }).join();
                    //                         }
                    //                     }
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // },
                    {
                        name: "Key Dates",
                        type: "NameValuePairs",
                        data: [
                            {
                                name: "",
                                items: [
                                    {
                                        name: "Diagnosis",
                                        value: (patient, currentConditionEntry) => {
                                            return currentConditionEntry.diagnosisDate;
                                        }
                                    },
                                    {
                                        name: "Recurrence",
                                        value: (patient, currentConditionEntry) => {
                                            return null;
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Procedures",
                        type: "ListType",
                        data: [
                            {
                                name: "",
                                headings: ["Procedure", "When"],
                                itemsFunction: this.getItemListForProcedures
                            }
                        ]
                    },
                    {
                        name: "Labs",
                        type: "ValueOverTime",
                        data: [
                            {
                                name: "BMIValue",
                                itemsFunction: this.getItemListForWhiteBloodCellCount
                            }
                        ]
                    },
                    {
                        name: "Medications",
                        clinicalEvents: ["pre-encounter"],
                        type: "ListType",
                        data: [
                            {
                                name: "",
                                headings: ["Medication", "Dosage", "Timing", "Start", "End"],
                                itemsFunction: this.getItemListForMedications
                            }
                        ]
                    },
                    {
                        name: "Pathology Results",
                        type: "NameValuePairs",
                        /*eslint no-template-curly-in-string: "off"*/
                        narrative: [
                            {
                                defaultTemplate: "Primary tumor color is ${.Color}, weight is ${.Weight}, and size is ${.Size}"
                            },
                            {
                                defaultTemplate: "Tumor margins are ${.Tumor Margins}. Histological grade is ${.Histological Grade}"
                            },
                            {
                                defaultTemplate: "ER-${.Receptor Status ER} PR-${.Receptor Status PR} HER2-${.Receptor Status HER2}"
                            }
                        ],
                        data: [
                            {
                                name: "",
                                items: [
                                    {
                                        name: "Color",
                                        value: null
                                    },
                                    {
                                        name: "Weight",
                                        value: null
                                    },
                                    {
                                        name: "Size",
                                        value: (patient, currentConditionEntry) => {
                                            let list = currentConditionEntry.getObservationsOfType(FluxTumorSize);
                                            return list[0].quantity.value + " " + list[0].quantity.unit;
                                        }
                                    },
                                    {
                                        name: "Tumor Margins",
                                        value: null
                                    },
                                    {
                                        name: "Histological Grade",
                                        value: (patient, currentConditionEntry) => {
                                            let list = currentConditionEntry.getObservationsOfType(FluxHistologicGrade);
                                            return list[0].grade;
                                        }
                                    },
                                    {
                                        name: "Receptor Status ER",
                                        value: (patient, currentConditionEntry) => {
                                            let er = currentConditionEntry.getERReceptorStatus();
                                            if (Lang.isNull(er)) {
                                                return null;
                                            } else {
                                                //return er.value.coding[0].displayText.value.value;
                                                return er.status;
                                            }
                                        }
                                    },
                                    {
                                        name: "Receptor Status PR",
                                        value: (patient, currentConditionEntry) => {
                                            let pr = currentConditionEntry.getPRReceptorStatus();
                                            if (Lang.isNull(pr)) {
                                                return null;
                                            } else {
                                                //return pr.value.coding[0].displayText.value.value;
                                                return pr.status;
                                            }
                                        }
                                    },
                                    {
                                        name: "Receptor Status HER2",
                                        value: (patient, currentConditionEntry) => {
                                            let her2 = currentConditionEntry.getHER2ReceptorStatus();
                                            if (Lang.isNull(her2)) {
                                                return null;
                                            } else {
                                                //return her2.value.coding[0].displayText.value.value;
                                                return her2.status;
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Genetics",
                        type: "NameValuePairs",
                        /*eslint no-template-curly-in-string: "off"*/
                        narrative: [
                            {
                                defaultTemplate: "Oncotype DX Recurrence Score is ${.Oncotype DX Recurrence Score}"
                            },
                            {
                                defaultTemplate: "Genetic Testing is ${.Genetic Testing}"
                            }
                        ],
                        data: [
                            {
                                name: "",
                                items: [
                                    {
                                        name: "Oncotype DX Recurrence Score",
                                        value: null
                                    },
                                    {
                                        name: "Genetic Testing",
                                        value: null
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Timeline",
                        type: "Events",
                        data: [
                            {
                                name: "Medications",
                                eventsFunction: this.getMedicationItems
                            },
                            {
                                name: "Procedures",
                                eventsFunction: this.getProcedureItems
                            },
                            {
                                name: "Key Events",
                                eventsFunction: this.getEventItems
                            },
                            {
                                name: "Progressions",
                                eventsFunction: this.getProgressionItems
                            }
                        ]
                    }
                ]
            },
            "default": {
                sections: [
                    {
                        name: "Current Diagnosis",
                        type: "NameValuePairs",
                        data: [
                            {
                                name: "",
                                items: [
                                    {
                                        name: "Name",
                                        value: (patient, currentConditionEntry) => {
                                            return currentConditionEntry.specificType.value.coding[0].displayText.value;
                                        },
                                        shortcut: "@condition"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Key Dates",
                        type: "NameValuePairs",
                        data: [
                            {
                                name: "",
                                items: [
                                    {
                                        name: "Diagnosis",
                                        value: (patient, currentConditionEntry) => {
                                            return currentConditionEntry.whenClinicallyRecognized.value.value.value.timePeriodStart.value;
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Procedures",
                        type: "ListType",
                        data: [
                            {
                                name: "",
                                itemsFunction: this.getItemListForProcedures
                            }
                        ]
                    },
                    {
                        name: "Timeline",
                        type: "Events",
                        data: [
                            {
                                name: "Medications",
                                eventsFunction: this.getMedicationItems
                            },
                            {
                                name: "Procedures",
                                eventsFunction: this.getProcedureItems
                            },
                            {
                                name: "Key Events",
                                eventsFunction: this.getEventItems
                            },
                            {
                                name: "Progressions",
                                eventsFunction: this.getProgressionItems
                            }
                        ]
                    }
                ]
            }
        };
    }

    getMetadata = () => {
        return this.hardCodedMetadata;
    }

    getItemListForProcedures = (patient, currentConditionEntry) => {
        const procedures = patient.getProceduresForConditionChronologicalOrder(currentConditionEntry);
        return procedures.map((p, i) => {
            // Ensure that each array for a given data type (e.g. Procedures in this case) contains the same number of elements (e.g. here it is 2 elements).
            // Or add to the end of the array, that looks okay too.
            if (typeof p.occurrenceTime !== 'string') {
                return [p.specificType.value.coding[0].displayText.value, p.occurrenceTime.timePeriodStart + " to " + p.occurrenceTime.timePeriodEnd];
            } else {
                return [p.specificType.value.coding[0].displayText.value, p.occurrenceTime];
            }


        });
    }

    getItemListForMedications = (patient, condition) => {
        if (Lang.isNull(patient) || Lang.isNull(condition)) return [];
        const meds = patient.getMedicationsForConditionChronologicalOrder(condition);

        return meds.map((med, i) => {
            return [
                med.medication,
                `${med.amountPerDose.value} ${med.amountPerDose.units}`,
                `${med.timingOfDoses.value} ${med.timingOfDoses.units}`,
                med.requestedPerformanceTime.timePeriodStart,
                med.requestedPerformanceTime.timePeriodEnd
            ];
        });
    }

    getItemListForLabResults = (patient, currentConditionEntry) => {
        if (Lang.isNull(patient) || Lang.isNull(currentConditionEntry)) return [];

        // Set sinceDate to null to get all results
        const sinceDate = "16 AUG 2010";
        const labResultsInOrder = currentConditionEntry.getLabResultsChronologicalOrder(sinceDate);

        return labResultsInOrder.map((l, i) => {
            const value = `${l.quantity.number} ${l.quantity.unit} (${l.clinicallyRelevantTime})`;
            const name = `${l.specificType.value.coding[0].displayText.value}`;

            return {
                name: name,
                value: value
            };
        });
    }

    getItemListForWhiteBloodCellCount = (patient, currentConditionEntry) => { 
        const data = [
            {
                "startTime": new Date(1513789180617),
                "BMIValue": 25
            },
            {
                "startTime": new Date(1513789180617 + 1000000),
                "BMIValue": 27
            },
            {
                "startTime": new Date(1513789180617 + 2000000),
                "BMIValue": 22
            },
            {
                "startTime": new Date(1513789180617 + 3000000),
                "BMIValue": 23
            },
            {
                "startTime": new Date(1513789180617 + 4000000),
                "BMIValue": 21
            },
            {
                "startTime": new Date(1513789180617 + 5000000),
                "BMIValue": 29
            },
            {
                "startTime": new Date(1513789180617 + 6000000),
                "BMIValue": 31
            },
            {
                "startTime": new Date(1513789180617 + 7000000),
                "BMIValue": 22
            },
            {
                "startTime": new Date(1513789180617 + 8000000),
                "BMIValue": 33
            },
            {
                "startTime": new Date(1513789180617 + 9000000),
                "BMIValue": 21
            },
            {
                "startTime": new Date(1513789180617 + 10000000),
                "BMIValue": 26
            }
        ]
        ;
        return data; 
        // const whiteBloodCellCountLabResults = currentConditionEntry.
    }

    getMedicationItems = (patient, condition) => {
        if (Lang.isNull(patient) || Lang.isNull(condition)) return [];
        const meds = patient.getMedicationsForConditionChronologicalOrder(condition);
        let items = [];

        meds.forEach((med) => {
            const startTime = new moment(med.requestedPerformanceTime.timePeriodStart, "D MMM YYYY");
            const endTime = new moment(med.requestedPerformanceTime.timePeriodEnd, "D MMM YYYY");
            const assignedGroup = this.assignItemToGroup(items, startTime, 1);
            const name = med.medication;
            const dosage = med.amountPerDose.value + " " + med.amountPerDose.units + " " + med.timingOfDoses.value + " " + med.timingOfDoses.units;
            items.push({
                group: assignedGroup,
                title: name,
                details: dosage,
                hoverTitle: name,
                hoverText: dosage,
                className: 'medication-item',
                start_time: startTime,
                end_time: endTime
            });
        });

        return items;
    }

    getProcedureItems = (patient, condition, groupStartIndex) => {
        if (Lang.isNull(patient) || Lang.isNull(condition)) return [];
        const procedures = patient.getProceduresForConditionChronologicalOrder(condition);
        let items = [];

        procedures.forEach((proc) => {
            let startTime = new moment(typeof proc.occurrenceTime === 'string' ? proc.occurrenceTime : proc.occurrenceTime.timePeriodStart, "D MMM YYYY");
            let endTime = proc.occurrenceTime.timePeriodStart ? (!Lang.isNull(proc.occurrenceTime.timePeriodEnd) ? new moment(proc.occurrenceTime.timePeriodEnd, "D MMM YYYY") : null) : null;
            const assignedGroup = this.assignItemToGroup(items, startTime, groupStartIndex);

            let classes = 'event-item';
            //let endDate = proc.endDate;
            let hoverText = '';

            if (!Lang.isNull(endTime)) {
                hoverText = `${startTime.format('MM/DD/YYYY')} ― ${endTime.format('MM/DD/YYYY')}`;
            } else {
                hoverText = `${startTime.format('MM/DD/YYYY')}`;
                endTime = startTime.clone().add(1, 'day');
                classes += ' point-in-time';
            }

            if (proc.specificType.value.coding[0].displayText) {
                hoverText += ` : ${proc.specificType.value.coding[0].displayText.value}`;
            }

            items.push({
                group: assignedGroup,
                icon: 'hospital-o',
                className: classes,
                hoverTitle: proc.specificType.value.coding[0].displayText.value,
                hoverText: hoverText,
                start_time: startTime,
                end_time: endTime
            });
        });

        return items;
    }

    getEventItems = (patient, condition, groupStartIndex) => {
        if (Lang.isNull(patient) || Lang.isNull(condition)) return [];
        const events = patient.getKeyEventsForConditionChronologicalOrder(condition);
        let items = [];

        events.forEach((evt) => {
            const assignedGroup = this.assignItemToGroup(items, evt.start_time, groupStartIndex);

            let classes = 'progression-item';
            let startDate = new moment(evt.start_time, "D MMM YYYY");
            let endDate = null;
            let hoverText = '';
            let hoverTitle = '';

            if (evt.end_time) {
                endDate = new moment(evt.end_time, "D MMM YYYY");
                hoverText = `${startDate.format('MM/DD/YYYY')} ― ${endDate.format('MM/DD/YYYY')}`;
            } else {
                hoverText = `${startDate.format('MM/DD/YYYY')}`;
                endDate = startDate.clone().add(1, 'day');
                classes += ' point-in-time';
            }

            hoverTitle = evt.name;

            items.push({
                group: assignedGroup,
                icon: 'heartbeat',
                className: classes,
                hoverTitle: hoverTitle,
                hoverText: hoverText,
                start_time: startDate,
                end_time: endDate
            });
        });

        return items;
    }

    getProgressionItems = (patient, condition, groupStartIndex) => {
        if (Lang.isNull(patient) || Lang.isNull(condition)) return [];
        const progressions = patient.getProgressionsForConditionChronologicalOrder(condition);
        let items = [];

        progressions.forEach((prog) => {
            const assignedGroup = this.assignItemToGroup(items, prog.clinicallyRelevantTime, groupStartIndex);

            let classes = 'progression-item';
            // Do not include progression on timeline if status not set
            if (!prog.status) return;
            let startDate = new moment(prog.asOfDate, "D MMM YYYY");
            let hoverText = `${startDate.format('MM/DD/YYYY')}`;
            let endDate = startDate.clone().add(1, 'day');
            classes += ' point-in-time';

            let focalCondition = patient.getFocalConditionForProgression(prog);
            let focalConditionName = focalCondition.specificType.value.coding[0].displayText.value;

            let hoverTitle = focalConditionName + " is " + prog.status + " based on " + prog.evidence.join();

            items.push({
                group: assignedGroup,
                icon: 'heartbeat',
                className: classes,
                hoverTitle: hoverTitle,
                hoverText: hoverText,
                start_time: startDate,
                end_time: endDate
            });
        });

        return items;
    }

    // Assigns a new timeline item to a group in the timeline, avoiding conflicts with
    // existing timeline items. If firstAvailableGroup is provided, the group assigned
    // will not be less than the firstAvailableGroup.
    assignItemToGroup = (existingItems, startTime, firstAvailableGroup) => {
        let availableGroup = firstAvailableGroup || 1;
        let assignedGroup = null;

        while (!assignedGroup) {
            const existingItemsInGroup = this.filterItemsByGroup(existingItems, availableGroup);
            let conflict = false;

            for (let i = 0; i < existingItemsInGroup.length; i++) {
                const existingItem = existingItemsInGroup[i];
                // At the current group level, the new item conflicts with an existing item
                if (startTime < existingItem.end_time && startTime >= existingItem.start_time) {
                    conflict = true;
                    break;
                }
            }
            if (conflict) {
                availableGroup += 1;
                conflict = false;
            } else {
                assignedGroup = availableGroup;
            }
        }
        return assignedGroup;
    }

    filterItemsByGroup = (items, group) => {
        let subset = [];

        items.forEach((item) => {
            if (item.group === group) {
                subset.push(item);
            }
        });

        return subset;
    }
}

export default SummaryMetadata;