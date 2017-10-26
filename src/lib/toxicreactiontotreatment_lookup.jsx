const Lang = require('lodash/lang');
const codeableConcept = require('./codeable_concept.jsx');

// These options came from the values of CauseCategory, which is a CodeableConcept from AttributionCategoryVS
const attributionOptions = [
    {name: 'Treatment', description: "Adverse event is attributed to a treatment."},
    {name: 'Disease',  description: "Adverse event is attributed to the course of the disease"},
    {name: 'Error', description: "Adverse event is attributed to a medical error"},
    {name: 'Unrelated', description: "Adverse event is attributed to an cause unrelated to the treatment, disease, or medical error."},
    {name: 'Unknown', description: "The causal category of the adverse event is unknown"}
]

const gradeOptions = [
    {
        name: 'Grade 1', 
        description: "Mild; asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated.",
        code: "C1513302"
    },
    {
        name: 'Grade 2', 
        description: "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental activities of daily life.",
        code: "C1513374"
    },
    {
        name: 'Grade 3', 
        description: "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of hospitalization indicated; disabling; limiting self care ADL",
        code: "C1519275"
    },
    {
        name: 'Grade 4', 
        description: "Life-threatening consequences; urgent intervention indicated. ",
        code: "C1517874"
    },
    {
        name: 'Grade 5', 
        description: "Death related to adverse effect",
        code: "C1559081"
    }
]

// V4.0 CTCAE info from CTCAE_4.03_2010-06-14.xls
const adverseEventOptions = [
    {
        "MedDRA v12.0 Code": 10002272,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Anemia",
        "Grade 1": "Hemoglobin (Hgb) <LLN - 10.0 g/dL; <LLN - 6.2 mmol/L; <LLN - 100 g/L",
        "Grade 2": "Hgb <10.0 - 8.0 g/dL; <6.2 - 4.9 mmol/L;  <100 - 80g/L",
        "Grade 3": "Hgb <8.0 g/dL; <4.9 mmol/L; <80 g/L; transfusion indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an reduction in the amount of hemoglobin in 100 ml of blood. Signs and symptoms of anemia may include pallor of the skin and mucous membranes, shortness of breath, palpitations of the heart, soft systolic murmurs, lethargy, and fatigability."
    },
    {
        "MedDRA v12.0 Code": 10048580,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Bone marrow hypocellular",
        "Grade 1": "Mildly hypocellular or <=25% reduction from normal cellularity for age",
        "Grade 2": "Moderately hypocellular or >25 - <50% reduction from normal cellularity for age",
        "Grade 3": "Severely hypocellular or >50 - <=75% reduction cellularity from normal for age",
        "Grade 4": "Aplastic persistent for longer than 2 weeks",
        "Grade 5": "Death",
        "description": "A disorder characterized by the inability of the bone marrow to produce hematopoietic elements."
    },
    {
        "MedDRA v12.0 Code": 10013442,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Disseminated intravascular coagulation",
        "Grade 1": null,
        "Grade 2": "Laboratory findings with no bleeding", 
        "Grade 3": "Laboratory findings and bleeding",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by systemic pathological activation of blood clotting mechanisms which results in clot formation throughout the body. There is an increase in the risk of hemorrhage as the body is depleted of platelets and coagulation factors."
    },
    {
        "MedDRA v12.0 Code": 10016288,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Febrile neutropenia",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "ANC <1000/mm3 with a single temperature of >38.3 degrees C (101 degrees F) or a sustained temperature of >=38 degrees C (100.4 degrees F) for more than one hour",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an ANC <1000/mm3 and a single temperature of >38.3 degrees C (101 degrees F) or a sustained temperature of >=38 degrees C (100.4 degrees F) for more than one hour"
    },
    {
        "MedDRA v12.0 Code": 10019491,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Hemolysis",
        "Grade 1": "Laboratory evidence of hemolysis only (e.g., direct antiglobulin test; DAT; Coombs'; schistocytes; decreased haptoglobin)",
        "Grade 2": "Evidence of hemolysis and >=2 gm decrease in hemoglobin",
        "Grade 3": "Transfusion or medical intervention indicated (e.g., steroids)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate widespread erythrocyte cell membrane destruction."
    },
    {
        "MedDRA v12.0 Code": 10019515,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Hemolytic uremic syndrome",
        "Grade 1": "Evidence of RBC destruction (schistocytosis) without clinical consequences",
        "Grade 2": null,
        "Grade 3": "Laboratory findings with clinical consequences (e.g., renal insufficiency, petechiae)",
        "Grade 4": "Life-threatening consequences, (e.g., CNS hemorrhage or thrombosis/embolism or renal failure)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a form of thrombotic microangiopathy with renal failure, hemolytic anemia, and severe thrombocytopenia."
    },
    {
        "MedDRA v12.0 Code": 10024378,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Leukocytosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": ">100,000/mm3",
        "Grade 4": "Clinical manifestations of leucostasis; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an increased number of white blood cells in the blood."
    },
    {
        "MedDRA v12.0 Code": 10025182,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Lymph node pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in a lymph node."
    },
    {
        "MedDRA v12.0 Code": 10041633,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Spleen disorder",
        "Grade 1": "Incidental findings (e.g., Howell-Jolly bodies); mild degree of thrombocytosis and leukocytosis",
        "Grade 2": "Prophylactic antibiotics indicated",
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder of the spleen."
    },
    {
        "MedDRA v12.0 Code": 10043648,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Thrombotic thrombocytopenic purpura",
        "Grade 1": "Evidence of RBC destruction (schistocytosis) without clinical consequences",
        "Grade 2": null,
        "Grade 3": "Laboratory findings with clinical consequences (e.g., renal insufficiency, petechiae)",
        "Grade 4": "Life-threatening consequences, (e.g., CNS hemorrhage or thrombosis/embolism or renal failure)",
        "Grade 5": "Death",
        "description": "A disorder characterized by the presence of microangiopathic hemolytic anemia, thrombocytopenic purpura, fever, renal abnormalities and neurological abnormalities such as seizures, hemiplegia, and visual disturbances. It is an acute or subacute condition."
    },
    {
        "MedDRA v12.0 Code": 10005329,
        "SOC": "Blood and lymphatic system disorders",
        "name": "Blood and lymphatic system disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10051592,
        "SOC": "Cardiac disorders",
        "name": "Acute coronary syndrome",
        "Grade 1": null,
        "Grade 2": "Symptomatic, progressive angina; cardiac enzymes normal; hemodynamically stable",
        "Grade 3": "Symptomatic, unstable angina and/or acute myocardial infarction, cardiac enzymes abnormal, hemodynamically stable",
        "Grade 4": "Symptomatic, unstable angina and/or acute myocardial infarction, cardiac enzymes abnormal, hemodynamically unstable",
        "Grade 5": "Death",
        "description": "A disorder characterized by signs and symptoms related to acute ischemia of the myocardium secondary to coronary artery disease. The clinical presentation covers a spectrum of heart diseases from unstable angina to myocardial infarction."
    },
    {
        "MedDRA v12.0 Code": 10061589,
        "SOC": "Cardiac disorders",
        "name": "Aortic valve disease",
        "Grade 1": "Asymptomatic valvular thickening with or without mild valvular regurgitation or stenosis by imaging",
        "Grade 2": "Asymptomatic; moderate regurgitation or stenosis by imaging",
        "Grade 3": "Symptomatic; severe regurgitation or stenosis by imaging; symptoms controlled with medical intervention",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., valve replacement, valvuloplasty)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a defect in aortic valve function or structure."
    },
    {
        "MedDRA v12.0 Code": 10003586,
        "SOC": "Cardiac disorders",
        "name": "Asystole",
        "Grade 1": "Periods of asystole; non-urgent medical management indicated",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia without cardiac electrical activity. Typically, this is accompanied by cessation of the pumping function of the heart."
    },
    {
        "MedDRA v12.0 Code": 10003658,
        "SOC": "Cardiac disorders",
        "name": "Atrial fibrillation",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically, or controlled with device (e.g., pacemaker), or ablation",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia without discernible P waves and an irregular ventricular response due to multiple reentry circuits. The rhythm disturbance originates above the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10003662,
        "SOC": "Cardiac disorders",
        "name": "Atrial flutter",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically, or controlled with device (e.g., pacemaker), or ablation",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with organized rhythmic atrial contractions with a rate of 200-300 beats per minute. The rhythm disturbance originates in the atria."
    },
    {
        "MedDRA v12.0 Code": 10003673,
        "SOC": "Cardiac disorders",
        "name": "Atrioventricular block complete",
        "Grade 1": null,
        "Grade 2": "Non-urgent intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically, or controlled with device (e.g., pacemaker)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with complete failure of atrial electrical impulse conduction through the AV node to the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10003674,
        "SOC": "Cardiac disorders",
        "name": "Atrioventricular block first degree",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a dysrhythmia with a delay in the time required for the conduction of an electrical impulse through the atrioventricular (AV) node beyond 0.2 seconds; prolongation of the PR interval greater than 200 milliseconds."
    },
    {
        "MedDRA v12.0 Code": 10007515,
        "SOC": "Cardiac disorders",
        "name": "Cardiac arrest",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by cessation of the pumping function of the heart."
    },
    {
        "MedDRA v12.0 Code": 10008481,
        "SOC": "Cardiac disorders",
        "name": "Chest pain - cardiac",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Pain at rest; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by substernal discomfort due to insufficient myocardial oxygenation."
    },
    {
        "MedDRA v12.0 Code": 10010276,
        "SOC": "Cardiac disorders",
        "name": "Conduction disorder",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms",
        "Grade 3": "Severe symptoms; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by pathological irregularities in the cardiac conduction system."
    },
    {
        "MedDRA v12.0 Code": 10010783,
        "SOC": "Cardiac disorders",
        "name": "Constrictive pericarditis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic heart failure or other cardiac symptoms, responsive to intervention",
        "Grade 4": "Refractory heart failure or other poorly controlled cardiac symptoms",
        "Grade 5": "Death",
        "description": "A disorder characterized by a thickened and fibrotic pericardial sac; these fibrotic changes impede normal myocardial function by restricting myocardial muscle action."
    },
    {
        "MedDRA v12.0 Code": 10019279,
        "SOC": "Cardiac disorders",
        "name": "Heart failure",
        "Grade 1": "Asymptomatic with laboratory (e.g., BNP [B-Natriuretic Peptide ]) or cardiac imaging abnormalities",
        "Grade 2": "Symptoms with mild to moderate activity or exertion",
        "Grade 3": "Severe with symptoms at rest or with minimal activity or exertion; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., continuous IV therapy or mechanical hemodynamic support)",
        "Grade 5": "Death",
        "description": "A disorder characterized by the inability of the heart to pump blood at an adequate volume to meet tissue metabolic requirements, or, the ability to do so only at an elevation in the filling pressure."
    },
    {
        "MedDRA v12.0 Code": 10069501,
        "SOC": "Cardiac disorders",
        "name": "Left ventricular systolic dysfunction",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic due to drop in ejection fraction responsive to intervention",
        "Grade 4": "Refractory or poorly controlled heart failure due to drop in ejection fraction; intervention such as ventricular assist device, intravenous vasopressor support, or heart transplant indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by failure of the left ventricle to produce adequate output despite an increase in distending pressure and in end-diastolic volume. Clinical manifestations may include dyspnea, orthopnea, and other signs and symptoms of pulmonary congestion and edema."
    },
    {
        "MedDRA v12.0 Code": 10061532,
        "SOC": "Cardiac disorders",
        "name": "Mitral valve disease",
        "Grade 1": "Asymptomatic valvular thickening with or without mild valvular regurgitation or stenosis by imaging",
        "Grade 2": "Asymptomatic; moderate regurgitation or stenosis by imaging",
        "Grade 3": "Symptomatic; severe regurgitation or stenosis by imaging; symptoms controlled with medical intervention",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., valve replacement, valvuloplasty)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a defect in mitral valve function or structure."
    },
    {
        "MedDRA v12.0 Code": 10027786,
        "SOC": "Cardiac disorders",
        "name": "Mobitz (type) II atrioventricular block",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically, or controlled with device (e.g., pacemaker)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with relatively constant PR interval prior to the block of an atrial impulse. This is the result of intermittent failure of atrial electrical impulse conduction through the atrioventricular (AV) node to the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10027787,
        "SOC": "Cardiac disorders",
        "name": "Mobitz type I",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically, or controlled with device (e.g., pacemaker)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with a progressively lengthening PR interval prior to the blocking of an atrial impulse. This is the result of intermittent failure of atrial electrical impulse conduction through the atrioventricular (AV) node to the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10028596,
        "SOC": "Cardiac disorders",
        "name": "Myocardial infarction",
        "Grade 1": null,
        "Grade 2": "Asymptomatic and cardiac enzymes minimally abnormal and no evidence of ischemic ECG changes",
        "Grade 3": "Severe symptoms; cardiac enzymes abnormal; hemodynamically stable; ECG changes consistent with infarction",
        "Grade 4": "Life-threatening consequences; hemodynamically unstable",
        "Grade 5": "Death",
        "description": "A disorder characterized by gross necrosis of the myocardium; this is due to an interruption of blood supply to the area."
    },
    {
        "MedDRA v12.0 Code": 10028606,
        "SOC": "Cardiac disorders",
        "name": "Myocarditis",
        "Grade 1": "Asymptomatic with laboratory (e.g., BNP [B-Natriuretic Peptide ]) or cardiac imaging abnormalities",
        "Grade 2": "Symptoms with mild to moderate activity or exertion",
        "Grade 3": "Severe with symptoms at rest or with minimal activity or exertion; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., continuous IV therapy or mechanical hemodynamic support)",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the muscle tissue of the heart."
    },
    {
        "MedDRA v12.0 Code": 10033557,
        "SOC": "Cardiac disorders",
        "name": "Palpitations",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an unpleasant sensation of irregular and/or forceful beating of the heart."
    },
    {
        "MedDRA v12.0 Code": 10034040,
        "SOC": "Cardiac disorders",
        "name": "Paroxysmal atrial tachycardia",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Symptomatic; medical management indicated",
        "Grade 3": "IV medication indicated",
        "Grade 4": "Life-threatening consequences; incompletely controlled medically; cardioversion indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with abrupt onset and sudden termination of atrial contractions with a rate of 150-250 beats per minute. The rhythm disturbance originates in the atria."
    },
    {
        "MedDRA v12.0 Code": 10034474,
        "SOC": "Cardiac disorders",
        "name": "Pericardial effusion",
        "Grade 1": null,
        "Grade 2": "Asymptomatic effusion size small to moderate",
        "Grade 3": "Effusion with physiologic consequences",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by fluid collection within the pericardial sac, usually due to inflammation."
    },
    {
        "MedDRA v12.0 Code": 10053565,
        "SOC": "Cardiac disorders",
        "name": "Pericardial tamponade",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in intrapericardial pressure due to the collection of blood or fluid in the pericardium."
    },
    {
        "MedDRA v12.0 Code": 10034484,
        "SOC": "Cardiac disorders",
        "name": "Pericarditis",
        "Grade 1": "Asymptomatic, ECG or physical findings (e.g., rub) consistent with pericarditis",
        "Grade 2": "Symptomatic pericarditis (e.g., chest pain)",
        "Grade 3": "Pericarditis with physiologic consequences (e.g., pericardial constriction)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by irritation to the layers of the pericardium (the protective sac around the heart)."
    },
    {
        "MedDRA v12.0 Code": 10061541,
        "SOC": "Cardiac disorders",
        "name": "Pulmonary valve disease",
        "Grade 1": "Asymptomatic valvular thickening with or without mild valvular regurgitation or stenosis by imaging",
        "Grade 2": "Asymptomatic; moderate regurgitation or stenosis by imaging",
        "Grade 3": "Symptomatic; severe regurgitation or stenosis by imaging; symptoms controlled with medical intervention",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., valve replacement, valvuloplasty)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a defect in pulmonary valve function or structure."
    },
    {
        "MedDRA v12.0 Code": 10038748,
        "SOC": "Cardiac disorders",
        "name": "Restrictive cardiomyopathy",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic heart failure or other cardiac symptoms, responsive to intervention",
        "Grade 4": "Refractory heart failure or other poorly controlled cardiac symptoms",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inability of the ventricles to fill with blood because the myocardium (heart muscle) stiffens and loses its flexibility."
    },
    {
        "MedDRA v12.0 Code": 10058597,
        "SOC": "Cardiac disorders",
        "name": "Right ventricular dysfunction",
        "Grade 1": "Asymptomatic with laboratory (e.g., BNP [B-Natriuretic Peptide ]) or cardiac imaging abnormalities",
        "Grade 2": "Symptoms with mild to moderate activity or exertion",
        "Grade 3": "Severe symptoms, associated with hypoxemia, right heart failure; oxygen indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., ventricular assist device); heart transplant indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by impairment of right ventricular function associated with low ejection fraction and a decrease in motility of the right ventricular wall."
    },
    {
        "MedDRA v12.0 Code": 10040639,
        "SOC": "Cardiac disorders",
        "name": "Sick sinus syndrome",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent intervention indicated",
        "Grade 3": "Severe, medically significant; medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with alternating periods of bradycardia and atrial tachycardia accompanied by syncope, fatigue and dizziness."
    },
    {
        "MedDRA v12.0 Code": 10040741,
        "SOC": "Cardiac disorders",
        "name": "Sinus bradycardia",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Symptomatic, medical intervention indicated",
        "Grade 3": "Severe, medically significant, medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with a heart rate less than 60 beats per minute that originates in the sinus node."
    },
    {
        "MedDRA v12.0 Code": 10040752,
        "SOC": "Cardiac disorders",
        "name": "Sinus tachycardia",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Symptomatic; non-urgent medical intervention indicated",
        "Grade 3": "Urgent medical intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a dysrhythmia with a heart rate greater than 100 beats per minute that originates in the sinus node."
    },
    {
        "MedDRA v12.0 Code": 10042604,
        "SOC": "Cardiac disorders",
        "name": "Supraventricular tachycardia",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with a heart rate greater than 100 beats per minute that originates above the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10061389,
        "SOC": "Cardiac disorders",
        "name": "Tricuspid valve disease",
        "Grade 1": "Asymptomatic valvular thickening with or without mild valvular regurgitation or stenosis",
        "Grade 2": "Asymptomatic; moderate regurgitation or stenosis by imaging",
        "Grade 3": "Symptomatic; severe regurgitation or stenosis; symptoms controlled with medical intervention",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated (e.g., valve replacement, valvuloplasty)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a defect in tricuspid valve function or structure."
    },
    {
        "MedDRA v12.0 Code": 10047281,
        "SOC": "Cardiac disorders",
        "name": "Ventricular arrhythmia",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Medical intervention indicated",
        "Grade 4": "Life-threatening consequences; hemodynamic compromise; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia that originates in the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10047290,
        "SOC": "Cardiac disorders",
        "name": "Ventricular fibrillation",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; hemodynamic compromise; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia without discernible QRS complexes due to rapid repetitive excitation of myocardial fibers without coordinated contraction of the ventricles."
    },
    {
        "MedDRA v12.0 Code": 10047302,
        "SOC": "Cardiac disorders",
        "name": "Ventricular tachycardia",
        "Grade 1": null,
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Medical intervention indicated",
        "Grade 4": "Life-threatening consequences; hemodynamic compromise; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a dysrhythmia with a heart rate greater than 100 beats per minute that originates distal to the bundle of His."
    },
    {
        "MedDRA v12.0 Code": 10048015,
        "SOC": "Cardiac disorders",
        "name": "Wolff-Parkinson-White syndrome",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Symptomatic and incompletely controlled medically or controlled with procedure",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the presence of an accessory conductive pathway between the atria and the ventricles that causes premature ventricular activation."
    },
    {
        "MedDRA v12.0 Code": 10007541,
        "SOC": "Cardiac disorders",
        "name": "Cardiac disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10010331,
        "SOC": "Congenital, familial and genetic disorders",
        "name": "Congenital, familial and genetic disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10014020,
        "SOC": "Ear and labyrinth disorders",
        "name": "Ear pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the ear."
    },
    {
        "MedDRA v12.0 Code": 10065837,
        "SOC": "Ear and labyrinth disorders",
        "name": "External ear inflammation",
        "Grade 1": "External otitis with erythema or dry desquamation",
        "Grade 2": "External otitis with moist desquamation, edema, enhanced cerumen or discharge; tympanic membrane perforation; tympanostomy",
        "Grade 3": "External otitis with mastoiditis; stenosis or osteomyelitis; necrosis of soft tissue or bone",
        "Grade 4": "Urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation, swelling and redness to the outer ear and ear canal."
    },
    {
        "MedDRA v12.0 Code": 10065785,
        "SOC": "Ear and labyrinth disorders",
        "name": "External ear pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the external ear region."
    },
    {
        "MedDRA v12.0 Code": 10019245,
        "SOC": "Ear and labyrinth disorders",
        "name": "Hearing impaired",
        "Grade 1": "Adults Enrolled on a Monitoring Program  (on a 1, 2, 4, 3,  6 and 8 kHz audiogram):  Threshold shift of 15 - 25 dB  averaged at 2 contiguous test frequencies in at least one ear or subjective change in the absence of a Grade 1 Threshold shift. \nPediatric (on a 1, 2, 4, 3,  6 and 8  kHz audiogram):   Threshold shift >20  dB at 8 kHz in at least one ear.\n",
        "Grade 2": "Adult enrolled in monitoring  program (on a 1, 2, 3, 4, 6 and 8 kHz  audiogram):  Threshold shift  of >25 dB averaged at 2 contiguous test frequencies in at least one  ear.\nAdult not enrolled in monitoring program:  hearing loss but hearing aid or intervention not indicated;  limiting instrumental  ADL. \nPediatric (on a 1, 2, 3, 4, 6 and 8 kHz  audiogram):   Threshold shift  >20 dB at  4 kHz and above in at least one ear. \n",
        "Grade 3": "Adult enrolled in monitoring  program (on a 1, 2, 3, 4, 6 and 8 kHz audiogram): Threshold shift of >25 dB  averaged at 3 contiguous test frequencies in at least one ear;  therapeutic intervention indicated.\n Adult:  Not enrolled in monitoring program:  Hearing loss with hearing aid or intervention indicated; limiting self care ADL. \nPediatric (on a 1, 2, 3, 4, 6 and 8kHz audiogram): hearing loss sufficient to indicate therapeutic  intervention, including hearing aids):   Threshold shift  >20 dB at 3 kHz and above in at least one ear ;   additional speech-language related services indicated. \n",
        "Grade 4": "Adults: Profound bilateral hearing  loss (Threshold  >80 dB HL at 2 kHz and above); nonservicable hearing\nPediatric:  Audiologic indication for cochlear implant and additional speech-language related services indicated.                                                            \n",
        "Grade 5": null,
        "description": "A disorder characterized by partial or complete loss of the ability to detect or understand sounds resulting from damage to ear structures."
    },
    {
        "MedDRA v12.0 Code": 10065838,
        "SOC": "Ear and labyrinth disorders",
        "name": "Middle ear inflammation",
        "Grade 1": "Serous otitis",
        "Grade 2": "Serous otitis, medical intervention indicated",
        "Grade 3": "Mastoiditis; necrosis of canal soft tissue or bone",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation (physiologic response to irritation), swelling and redness to the middle ear."
    },
    {
        "MedDRA v12.0 Code": 10043882,
        "SOC": "Ear and labyrinth disorders",
        "name": "Tinnitus",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by noise in the ears, such as ringing, buzzing, roaring or clicking."
    },
    {
        "MedDRA v12.0 Code": 10047340,
        "SOC": "Ear and labyrinth disorders",
        "name": "Vertigo",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation as if the external world were revolving around the patient (objective vertigo) or as if he himself were revolving in space (subjective vertigo)."
    },
    {
        "MedDRA v12.0 Code": 10047386,
        "SOC": "Ear and labyrinth disorders",
        "name": "Vestibular disorder",
        "Grade 1": null,
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by dizziness, imbalance, nausea, and vision problems."
    },
    {
        "MedDRA v12.0 Code": 10013993,
        "SOC": "Ear and labyrinth disorders",
        "name": "Ear and labyrinth disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10001367,
        "SOC": "Endocrine disorders",
        "name": "Adrenal insufficiency",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Severe symptoms; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder that occurs when the adrenal cortex does not produce enough of the hormone cortisol and in some cases, the hormone aldosterone. It may be due to a disorder of the adrenal cortex as in Addison's disease or primary adrenal insufficiency."
    },
    {
        "MedDRA v12.0 Code": 10011655,
        "SOC": "Endocrine disorders",
        "name": "Cushingoid",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Severe symptoms, medical intervention or hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by signs and symptoms that resemble Cushing's disease or syndrome: buffalo hump obesity, striations, adiposity, hypertension, diabetes, and osteoporosis, usually due to exogenous corticosteroids."
    },
    {
        "MedDRA v12.0 Code": 10012205,
        "SOC": "Endocrine disorders",
        "name": "Delayed puberty",
        "Grade 1": null,
        "Grade 2": "No breast development by age 13 yrs for females; testes volume of <3 cc or no Tanner Stage 2 development by age 14.5 yrs for males",
        "Grade 3": "No breast development by age 14 yrs for females; no increase in testes volume or no Tanner Stage 2 by age 16 yrs for males; hormone replacement indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by unusually late sexual maturity."
    },
    {
        "MedDRA v12.0 Code": 10018746,
        "SOC": "Endocrine disorders",
        "name": "Growth accelerated",
        "Grade 1": null,
        "Grade 2": ">= +2 SD (standard deviation) above mid parental height or target height",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by greater growth than expected for age."
    },
    {
        "MedDRA v12.0 Code": 10020705,
        "SOC": "Endocrine disorders",
        "name": "Hyperparathyroidism",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an increase in production of parathyroid hormone by the parathyroid glands. This results in hypercalcemia (abnormally high levels of calcium in the blood)."
    },
    {
        "MedDRA v12.0 Code": 10020850,
        "SOC": "Endocrine disorders",
        "name": "Hyperthyroidism",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; thyroid suppression therapy indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by excessive levels of thyroid hormone in the body. Common causes include an overactive thyroid gland or thyroid hormone overdose."
    },
    {
        "MedDRA v12.0 Code": 10021041,
        "SOC": "Endocrine disorders",
        "name": "Hypoparathyroidism",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Severe symptoms; medical intervention or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a decrease in production of parathyroid hormone by the parathyroid glands."
    },
    {
        "MedDRA v12.0 Code": 10021114,
        "SOC": "Endocrine disorders",
        "name": "Hypothyroidism",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; thyroid replacement indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a decrease in production of thyroid hormone by the thyroid gland."
    },
    {
        "MedDRA v12.0 Code": 10058084,
        "SOC": "Endocrine disorders",
        "name": "Precocious puberty",
        "Grade 1": "Physical signs of puberty with no biochemical markers for females <8 years and males <9 years",
        "Grade 2": "Physical signs and biochemical markers of puberty for females <8 years and males <9 years",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by unusually early development of secondary sexual features; the onset of sexual maturation begins usually before age 8 for girls and before age 9 for boys."
    },
    {
        "MedDRA v12.0 Code": 10047488,
        "SOC": "Endocrine disorders",
        "name": "Virilization",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inappropriate masculinization occurring in a female or prepubertal male."
    },
    {
        "MedDRA v12.0 Code": 10014698,
        "SOC": "Endocrine disorders",
        "name": "Endocrine disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10005886,
        "SOC": "Eye disorders",
        "name": "Blurred vision",
        "Grade 1": "Intervention not indicated",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by visual perception of unclear or fuzzy images."
    },
    {
        "MedDRA v12.0 Code": 10007739,
        "SOC": "Eye disorders",
        "name": "Cataract",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; moderate decrease in visual acuity (20/40 or better)",
        "Grade 3": "Symptomatic with marked decrease in visual acuity (worse than 20/40 but better than 20/200); operative intervention indicated (e.g., cataract surgery)",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by partial or complete opacity of the crystalline lens of one or both eyes. This results in a decrease in visual acuity and eventual blindness if untreated."
    },
    {
        "MedDRA v12.0 Code": 10010741,
        "SOC": "Eye disorders",
        "name": "Conjunctivitis",
        "Grade 1": "Asymptomatic or mild symptoms; intervention not indicated",
        "Grade 2": "Symptomatic; topical intervention indicated (e.g., antibiotics); limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inflammation, swelling and redness to the conjunctiva of the eye."
    },
    {
        "MedDRA v12.0 Code": 10048492,
        "SOC": "Eye disorders",
        "name": "Corneal ulcer",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated (e.g., topical agents); limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; declining vision (worse than 20/40 but better than 20/200)",
        "Grade 4": "Perforation or blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by an area of epithelial tissue loss on the surface of the cornea. It is associated with inflammatory cells in the cornea and anterior chamber."
    },
    {
        "MedDRA v12.0 Code": 10013774,
        "SOC": "Eye disorders",
        "name": "Dry eye",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; mild symptoms relieved by lubricants",
        "Grade 2": "Symptomatic; multiple agents indicated; limiting instrumental ADL",
        "Grade 3": "Decrease in visual acuity (<20/40); limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by dryness of the cornea and conjunctiva."
    },
    {
        "MedDRA v12.0 Code": 10015829,
        "SOC": "Eye disorders",
        "name": "Extraocular muscle paresis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by incomplete paralysis of an extraocular muscle."
    },
    {
        "MedDRA v12.0 Code": 10015958,
        "SOC": "Eye disorders",
        "name": "Eye pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the eye."
    },
    {
        "MedDRA v12.0 Code": 10061145,
        "SOC": "Eye disorders",
        "name": "Eyelid function disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; nonoperative intervention indicated; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by impaired eyelid function."
    },
    {
        "MedDRA v12.0 Code": 10016757,
        "SOC": "Eye disorders",
        "name": "Flashing lights",
        "Grade 1": "Symptomatic but not limiting ADL",
        "Grade 2": "Limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sudden or brief burst of light."
    },
    {
        "MedDRA v12.0 Code": 10016778,
        "SOC": "Eye disorders",
        "name": "Floaters",
        "Grade 1": "Symptomatic but not limiting ADL",
        "Grade 2": "Limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an individual seeing spots before their eyes. The spots are shadows of opaque cell fragments in the vitreous humor or lens."
    },
    {
        "MedDRA v12.0 Code": 10018304,
        "SOC": "Eye disorders",
        "name": "Glaucoma",
        "Grade 1": "Elevated intraocular pressure (EIOP) with single topical agent for intervention; no visual field deficit",
        "Grade 2": "EIOP causing early visual field deficits; multiple topical or oral agents indicated; limiting instrumental ADL",
        "Grade 3": "EIOP causing marked visual field deficits (e.g., involving both superior and inferior visual fields); operative intervention indicated; limiting self care ADL",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by an increase in pressure in the eyeball due to obstruction of the aqueous humor outflow."
    },
    {
        "MedDRA v12.0 Code": 10023332,
        "SOC": "Eye disorders",
        "name": "Keratitis",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated (e.g., topical agents); limiting instrumental ADL",
        "Grade 3": "Decline in vision (worse than 20/40 but better than 20/200); limiting self care ADL",
        "Grade 4": "Perforation or blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by inflammation to the cornea of the eye."
    },
    {
        "MedDRA v12.0 Code": 10029404,
        "SOC": "Eye disorders",
        "name": "Night blindness",
        "Grade 1": "Symptomatic but not limiting ADL",
        "Grade 2": "Limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by an inability to see clearly in dim light."
    },
    {
        "MedDRA v12.0 Code": 10061322,
        "SOC": "Eye disorders",
        "name": "Optic nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Limiting vision of the affected eye (20/40 or better)",
        "Grade 3": "Limiting vision in the affected eye (worse than 20/40 but better than 20/200)",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the optic nerve (second cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10033703,
        "SOC": "Eye disorders",
        "name": "Papilledema",
        "Grade 1": "Asymptomatic; no visual field defects",
        "Grade 2": "Symptomatic decline in vision; visual field defect present sparing the central 20 degrees",
        "Grade 3": "Marked visual field defect (worse than 20/40 but better than 20/200)",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by swelling around the optic disc."
    },
    {
        "MedDRA v12.0 Code": 10034960,
        "SOC": "Eye disorders",
        "name": "Photophobia",
        "Grade 1": "Symptomatic but not limiting ADL",
        "Grade 2": "Limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by fear and avoidance of light."
    },
    {
        "MedDRA v12.0 Code": 10038848,
        "SOC": "Eye disorders",
        "name": "Retinal detachment",
        "Grade 1": "Asymptomatic",
        "Grade 2": "Exudative and visual acuity 20/40 or better",
        "Grade 3": "Rhegmatogenous or exudative detachment; operative intervention indicated; decline in vision (worse than 20/40 but better than 20/200)",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by the separation of the inner retina layers from the underlying pigment epithelium."
    },
    {
        "MedDRA v12.0 Code": 10038897,
        "SOC": "Eye disorders",
        "name": "Retinal tear",
        "Grade 1": null,
        "Grade 2": "Laser therapy or pneumopexy indicated",
        "Grade 3": "Vitroretinal surgical repair indicated",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by a small laceration of the retina, this occurs when the vitreous separates from the retina. Symptoms include flashes and floaters."
    },
    {
        "MedDRA v12.0 Code": 10038901,
        "SOC": "Eye disorders",
        "name": "Retinal vascular disorder",
        "Grade 1": null,
        "Grade 2": "Topical medication indicated",
        "Grade 3": "Intravitreal medication; operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by pathological retinal blood vessels that adversely affects vision."
    },
    {
        "MedDRA v12.0 Code": 10038923,
        "SOC": "Eye disorders",
        "name": "Retinopathy",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Symptomatic with moderate decrease in visual acuity (20/40 or better); limiting instrumental ADL",
        "Grade 3": "Symptomatic with marked decrease in visual acuity (worse than 20/40); disabling; limiting self care ADL",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder involving the retina."
    },
    {
        "MedDRA v12.0 Code": 10061510,
        "SOC": "Eye disorders",
        "name": "Scleral disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Symptomatic, limiting instrumental ADL; moderate decrease in visual acuity (20/40 or better)",
        "Grade 3": "Symptomatic, limiting self care ADL; marked decrease in visual acuity (worse than 20/40)",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the sclera of the eye."
    },
    {
        "MedDRA v12.0 Code": 10046851,
        "SOC": "Eye disorders",
        "name": "Uveitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Anterior uveitis; medical intervention indicated",
        "Grade 3": "Posterior or pan-uveitis",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by inflammation to the uvea of the eye."
    },
    {
        "MedDRA v12.0 Code": 10047656,
        "SOC": "Eye disorders",
        "name": "Vitreous hemorrhage",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; vitrectomy indicated",
        "Grade 4": "Blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": "A disorder characterized by blood extravasation into the vitreous humor."
    },
    {
        "MedDRA v12.0 Code": 10047848,
        "SOC": "Eye disorders",
        "name": "Watering eyes",
        "Grade 1": "Intervention not indicated",
        "Grade 2": "Intervention indicated",
        "Grade 3": "Operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder of excessive tearing in the eyes; it can be caused by overproduction of tears or impaired drainage of the tear duct."
    },
    {
        "MedDRA v12.0 Code": 10015919,
        "SOC": "Eye disorders",
        "name": "Eye disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately sight-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Sight-threatening consequences; urgent intervention indicated; blindness (20/200 or worse) in the affected eye",
        "Grade 5": null,
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10000060,
        "SOC": "Gastrointestinal disorders",
        "name": "Abdominal distension",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Severe discomfort; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling of the abdomen."
    },
    {
        "MedDRA v12.0 Code": 10000081,
        "SOC": "Gastrointestinal disorders",
        "name": "Abdominal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the abdominal region."
    },
    {
        "MedDRA v12.0 Code": 10002156,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the opening in the anal canal to the perianal skin."
    },
    {
        "MedDRA v12.0 Code": 10055226,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the anal region."
    },
    {
        "MedDRA v12.0 Code": 10065721,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal mucositis",
        "Grade 1": "Asymptomatic or mild symptoms; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the mucous membrane of the anus."
    },
    {
        "MedDRA v12.0 Code": 10065722,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "TPN or hospitalization indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the anal region."
    },
    {
        "MedDRA v12.0 Code": 10002167,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the anal region."
    },
    {
        "MedDRA v12.0 Code": 10002176,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Symptomatic and severely altered GI function; non-emergent operative intervention indicated; TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the anal canal."
    },
    {
        "MedDRA v12.0 Code": 10002180,
        "SOC": "Gastrointestinal disorders",
        "name": "Anal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the anal canal."
    },
    {
        "MedDRA v12.0 Code": 10003445,
        "SOC": "Gastrointestinal disorders",
        "name": "Ascites",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; invasive intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by accumulation of serous or hemorrhagic fluid in the peritoneal cavity."
    },
    {
        "MedDRA v12.0 Code": 10005265,
        "SOC": "Gastrointestinal disorders",
        "name": "Bloating",
        "Grade 1": "No change in bowel function or oral intake",
        "Grade 2": "Symptomatic, decreased oral intake; change in bowel function",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by subject-reported feeling of uncomfortable fullness of the abdomen."
    },
    {
        "MedDRA v12.0 Code": 10065747,
        "SOC": "Gastrointestinal disorders",
        "name": "Cecal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the cecum."
    },
    {
        "MedDRA v12.0 Code": 10008417,
        "SOC": "Gastrointestinal disorders",
        "name": "Cheilitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inflammation of the lip."
    },
    {
        "MedDRA v12.0 Code": 10009887,
        "SOC": "Gastrointestinal disorders",
        "name": "Colitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Abdominal pain; mucus or blood in stool",
        "Grade 3": "Severe abdominal pain; change in bowel habits; medical intervention indicated; peritoneal signs",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the colon."
    },
    {
        "MedDRA v12.0 Code": 10009995,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; bowel rest, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the large intestine and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10009998,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the colon."
    },
    {
        "MedDRA v12.0 Code": 10010000,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the intestinal contents in the colon."
    },
    {
        "MedDRA v12.0 Code": 10010001,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the colonic wall."
    },
    {
        "MedDRA v12.0 Code": 10010004,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the colon."
    },
    {
        "MedDRA v12.0 Code": 10010006,
        "SOC": "Gastrointestinal disorders",
        "name": "Colonic ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the colon."
    },
    {
        "MedDRA v12.0 Code": 10010774,
        "SOC": "Gastrointestinal disorders",
        "name": "Constipation",
        "Grade 1": "Occasional or intermittent symptoms; occasional use of stool softeners, laxatives, dietary modification, or enema",
        "Grade 2": "Persistent symptoms with regular use of laxatives or enemas; limiting instrumental ADL",
        "Grade 3": "Obstipation with manual evacuation indicated; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by irregular and infrequent or difficult evacuation of the bowels."
    },
    {
        "MedDRA v12.0 Code": 10012318,
        "SOC": "Gastrointestinal disorders",
        "name": "Dental caries",
        "Grade 1": "One or more dental caries, not involving the root",
        "Grade 2": "Dental caries involving the root",
        "Grade 3": "Dental caries resulting in pulpitis or periapical abscess or resulting in tooth loss",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the decay of a tooth, in which it becomes softened, discolored and/or porous."
    },
    {
        "MedDRA v12.0 Code": 10012727,
        "SOC": "Gastrointestinal disorders",
        "name": "Diarrhea",
        "Grade 1": "Increase of <4 stools per day over baseline; mild increase in ostomy output compared to baseline",
        "Grade 2": "Increase of 4 - 6 stools per day over baseline; moderate increase in ostomy output compared to baseline",
        "Grade 3": "Increase of >=7 stools per day over baseline; incontinence; hospitalization indicated; severe increase in ostomy output compared to baseline; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by frequent and watery bowel movements."
    },
    {
        "MedDRA v12.0 Code": 10013781,
        "SOC": "Gastrointestinal disorders",
        "name": "Dry mouth",
        "Grade 1": "Symptomatic (e.g., dry or thick saliva) without significant dietary alteration; unstimulated saliva flow >0.2 ml/min",
        "Grade 2": "Moderate symptoms; oral intake alterations (e.g., copious water, other lubricants, diet limited to purees and/or soft, moist foods); unstimulated saliva 0.1 to 0.2 ml/min",
        "Grade 3": "Inability to adequately aliment orally; tube feeding or TPN indicated; unstimulated saliva <0.1 ml/min",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by reduced salivary flow in the oral cavity."
    },
    {
        "MedDRA v12.0 Code": 10013828,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the duodenum and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10055242,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the duodenum."
    },
    {
        "MedDRA v12.0 Code": 10013830,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Hospitalization or elective operative intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of stomach contents through the duodenum."
    },
    {
        "MedDRA v12.0 Code": 10013832,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the duodenal wall."
    },
    {
        "MedDRA v12.0 Code": 10050094,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding; hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the duodenum."
    },
    {
        "MedDRA v12.0 Code": 10013836,
        "SOC": "Gastrointestinal disorders",
        "name": "Duodenal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the duodenal wall."
    },
    {
        "MedDRA v12.0 Code": 10013946,
        "SOC": "Gastrointestinal disorders",
        "name": "Dyspepsia",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Severe symptoms; surgical intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an uncomfortable, often painful feeling in the stomach, resulting from impaired digestion. Symptoms include burning stomach, bloating, heartburn, nausea and vomiting."
    },
    {
        "MedDRA v12.0 Code": 10013950,
        "SOC": "Gastrointestinal disorders",
        "name": "Dysphagia",
        "Grade 1": "Symptomatic, able to eat regular diet",
        "Grade 2": "Symptomatic and altered eating/swallowing",
        "Grade 3": "Severely altered eating/swallowing; tube feeding or TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by difficulty in swallowing."
    },
    {
        "MedDRA v12.0 Code": 10014893,
        "SOC": "Gastrointestinal disorders",
        "name": "Enterocolitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Abdominal pain; mucus or blood in stool",
        "Grade 3": "Severe or persistent abdominal pain; fever; ileus; peritoneal signs",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the small and large intestines."
    },
    {
        "MedDRA v12.0 Code": 10062570,
        "SOC": "Gastrointestinal disorders",
        "name": "Enterovesical fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; noninvasive intervention indicated",
        "Grade 3": "Severe, medically significant; medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the urinary bladder and the intestine."
    },
    {
        "MedDRA v12.0 Code": 10065851,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the esophagus and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10015384,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the esophagus."
    },
    {
        "MedDRA v12.0 Code": 10065727,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Inability to aliment adequately by GI tract; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the esophageal wall."
    },
    {
        "MedDRA v12.0 Code": 10015387,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the contents in the esophagus."
    },
    {
        "MedDRA v12.0 Code": 10015388,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the esophageal region."
    },
    {
        "MedDRA v12.0 Code": 10055472,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the wall of the esophagus."
    },
    {
        "MedDRA v12.0 Code": 10015448,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding; hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the esophagus."
    },
    {
        "MedDRA v12.0 Code": 10015451,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the esophageal wall."
    },
    {
        "MedDRA v12.0 Code": 10015453,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophageal varices hemorrhage",
        "Grade 1": null,
        "Grade 2": "Self-limited; intervention not indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from esophageal varices."
    },
    {
        "MedDRA v12.0 Code": 10015461,
        "SOC": "Gastrointestinal disorders",
        "name": "Esophagitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered eating/swallowing;  oral supplements indicated",
        "Grade 3": "Severely altered eating/swallowing; tube feeding, TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the esophageal wall."
    },
    {
        "MedDRA v12.0 Code": 10016296,
        "SOC": "Gastrointestinal disorders",
        "name": "Fecal incontinence",
        "Grade 1": "Occasional use of pads required",
        "Grade 2": "Daily use of pads required",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inability to control the escape of stool from the rectum."
    },
    {
        "MedDRA v12.0 Code": 10016766,
        "SOC": "Gastrointestinal disorders",
        "name": "Flatulence",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate; persistent; psychosocial sequelae",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a state of excessive gas in the alimentary canal."
    },
    {
        "MedDRA v12.0 Code": 10065713,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; bowel rest; tube feeding, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the stomach and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10017789,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the gastric wall."
    },
    {
        "MedDRA v12.0 Code": 10051886,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Inability to aliment adequately by GI tract; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the gastric wall."
    },
    {
        "MedDRA v12.0 Code": 10017815,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the stomach wall."
    },
    {
        "MedDRA v12.0 Code": 10061970,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding; hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the stomach."
    },
    {
        "MedDRA v12.0 Code": 10017822,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastric ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the stomach."
    },
    {
        "MedDRA v12.0 Code": 10017853,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastritis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; medical intervention indicated",
        "Grade 3": "Severely altered eating or gastric function; TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the stomach."
    },
    {
        "MedDRA v12.0 Code": 10066874,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastroesophageal reflux disease",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Severe symptoms; surgical intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by reflux of the gastric and/or duodenal contents into the distal esophagus. It is chronic in nature and usually caused by incompetence of the lower esophageal sphincter, and may result in injury to the esophageal mucosal. Symptoms include heartburn and acid indigestion."
    },
    {
        "MedDRA v12.0 Code": 10017877,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastrointestinal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding, TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between any part of the gastrointestinal system and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10017999,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastrointestinal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the gastrointestinal region."
    },
    {
        "MedDRA v12.0 Code": 10018043,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastroparesis",
        "Grade 1": "Mild nausea, early satiety and bloating, able to maintain caloric intake on regular diet",
        "Grade 2": "Moderate symptoms; able to maintain nutrition with dietary and lifestyle modifications; may need pharmacologic intervention",
        "Grade 3": "Weight loss; refractory to medical intervention; unable to maintain nutrition orally",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an incomplete paralysis of the muscles of the stomach wall resulting in delayed emptying of the gastric contents into the small intestine."
    },
    {
        "MedDRA v12.0 Code": 10018286,
        "SOC": "Gastrointestinal disorders",
        "name": "Gingival pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain interfering with oral intake",
        "Grade 3": "Severe pain; inability to aliment orally",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the gingival region."
    },
    {
        "MedDRA v12.0 Code": 10060640,
        "SOC": "Gastrointestinal disorders",
        "name": "Hemorrhoidal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the hemorrhoids."
    },
    {
        "MedDRA v12.0 Code": 10019611,
        "SOC": "Gastrointestinal disorders",
        "name": "Hemorrhoids",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; banding or medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the presence of dilated veins in the rectum and surrounding area."
    },
    {
        "MedDRA v12.0 Code": 10065728,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the ileum and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10055287,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the ileal wall."
    },
    {
        "MedDRA v12.0 Code": 10065730,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the intestinal contents in the ileum."
    },
    {
        "MedDRA v12.0 Code": 10021305,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the ileal wall."
    },
    {
        "MedDRA v12.0 Code": 10021307,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the ileum."
    },
    {
        "MedDRA v12.0 Code": 10021309,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the ileum."
    },
    {
        "MedDRA v12.0 Code": 10021328,
        "SOC": "Gastrointestinal disorders",
        "name": "Ileus",
        "Grade 1": null,
        "Grade 2": "Symptomatic; altered GI function; bowel rest indicated",
        "Grade 3": "Severely altered GI function; TPN indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by failure of the ileum to transport intestinal contents."
    },
    {
        "MedDRA v12.0 Code": 10055291,
        "SOC": "Gastrointestinal disorders",
        "name": "Intra-abdominal hemorrhage",
        "Grade 1": null,
        "Grade 2": "Medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding in the abdominal cavity."
    },
    {
        "MedDRA v12.0 Code": 10065719,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the jejunum and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10055300,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the jejunal wall."
    },
    {
        "MedDRA v12.0 Code": 10065732,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the intestinal contents in the jejunum."
    },
    {
        "MedDRA v12.0 Code": 10023174,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the jejunal wall."
    },
    {
        "MedDRA v12.0 Code": 10023176,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the jejunum."
    },
    {
        "MedDRA v12.0 Code": 10023177,
        "SOC": "Gastrointestinal disorders",
        "name": "Jejunal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the jejunum."
    },
    {
        "MedDRA v12.0 Code": 10024561,
        "SOC": "Gastrointestinal disorders",
        "name": "Lip pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort of the lip."
    },
    {
        "MedDRA v12.0 Code": 10051746,
        "SOC": "Gastrointestinal disorders",
        "name": "Lower gastrointestinal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the lower gastrointestinal tract (small intestine, large intestine, and anus)."
    },
    {
        "MedDRA v12.0 Code": 10025476,
        "SOC": "Gastrointestinal disorders",
        "name": "Malabsorption",
        "Grade 1": null,
        "Grade 2": "Altered diet; oral intervention indicated",
        "Grade 3": "Inability to aliment adequately; TPN indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inadequate absorption of nutrients in the small intestine. Symptoms include abdominal marked discomfort, bloating and diarrhea."
    },
    {
        "MedDRA v12.0 Code": 10028130,
        "SOC": "Gastrointestinal disorders",
        "name": "Mucositis oral",
        "Grade 1": "Asymptomatic or mild symptoms; intervention not indicated",
        "Grade 2": "Moderate pain; not interfering with oral intake; modified diet indicated",
        "Grade 3": "Severe pain; interfering with oral intake",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the oral mucosal."
    },
    {
        "MedDRA v12.0 Code": 10028813,
        "SOC": "Gastrointestinal disorders",
        "name": "Nausea",
        "Grade 1": "Loss of appetite without alteration in eating habits",
        "Grade 2": "Oral intake decreased without significant weight loss, dehydration or malnutrition",
        "Grade 3": "Inadequate oral caloric or fluid intake; tube feeding, TPN, or hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a queasy sensation and/or the urge to vomit."
    },
    {
        "MedDRA v12.0 Code": 10029957,
        "SOC": "Gastrointestinal disorders",
        "name": "Obstruction gastric",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the contents in the stomach."
    },
    {
        "MedDRA v12.0 Code": 10065720,
        "SOC": "Gastrointestinal disorders",
        "name": "Oral cavity fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the oral cavity and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10054520,
        "SOC": "Gastrointestinal disorders",
        "name": "Oral dysesthesia",
        "Grade 1": "Mild discomfort; not interfering with oral intake",
        "Grade 2": "Moderate pain; interfering with oral intake",
        "Grade 3": "Disabling pain; tube feeding or TPN indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a burning or tingling sensation on the lips, tongue or entire mouth."
    },
    {
        "MedDRA v12.0 Code": 10030980,
        "SOC": "Gastrointestinal disorders",
        "name": "Oral hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the mouth."
    },
    {
        "MedDRA v12.0 Code": 10031009,
        "SOC": "Gastrointestinal disorders",
        "name": "Oral pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the mouth, tongue or lips."
    },
    {
        "MedDRA v12.0 Code": 10065703,
        "SOC": "Gastrointestinal disorders",
        "name": "Pancreatic duct stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the pancreatic duct."
    },
    {
        "MedDRA v12.0 Code": 10049192,
        "SOC": "Gastrointestinal disorders",
        "name": "Pancreatic fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the pancreas and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10033626,
        "SOC": "Gastrointestinal disorders",
        "name": "Pancreatic hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the pancreas."
    },
    {
        "MedDRA v12.0 Code": 10058096,
        "SOC": "Gastrointestinal disorders",
        "name": "Pancreatic necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Tube feeding or TPN indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the pancreas."
    },
    {
        "MedDRA v12.0 Code": 10033645,
        "SOC": "Gastrointestinal disorders",
        "name": "Pancreatitis",
        "Grade 1": null,
        "Grade 2": "Enzyme elevation or radiologic findings only",
        "Grade 3": "Severe pain; vomiting; medical intervention indicated (e.g., analgesia, nutritional support)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the pancreas."
    },
    {
        "MedDRA v12.0 Code": 10034536,
        "SOC": "Gastrointestinal disorders",
        "name": "Periodontal disease",
        "Grade 1": "Gingival recession or gingivitis; limited bleeding on probing; mild local bone loss",
        "Grade 2": "Moderate gingival recession or gingivitis; multiple sites of bleeding on probing; moderate bone loss",
        "Grade 3": "Spontaneous bleeding; severe bone loss with or without tooth loss; osteonecrosis of maxilla or mandible",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder in the gingival tissue around the teeth."
    },
    {
        "MedDRA v12.0 Code": 10065704,
        "SOC": "Gastrointestinal disorders",
        "name": "Peritoneal necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Tube feeding or TPN  indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the peritoneum."
    },
    {
        "MedDRA v12.0 Code": 10036774,
        "SOC": "Gastrointestinal disorders",
        "name": "Proctitis",
        "Grade 1": "Rectal discomfort, intervention not indicated",
        "Grade 2": "Symptoms (e.g., rectal discomfort, passing blood or mucus); medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; fecal urgency or stool incontinence; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the rectum."
    },
    {
        "MedDRA v12.0 Code": 10038062,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the rectum and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10038064,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the rectal wall and discharged from the anus."
    },
    {
        "MedDRA v12.0 Code": 10063190,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal mucositis",
        "Grade 1": "Asymptomatic or mild symptoms; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the mucous membrane of the rectum."
    },
    {
        "MedDRA v12.0 Code": 10065709,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Tube feeding or TPN indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the rectal wall."
    },
    {
        "MedDRA v12.0 Code": 10065707,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the intestinal contents in the rectum."
    },
    {
        "MedDRA v12.0 Code": 10038072,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the rectal region."
    },
    {
        "MedDRA v12.0 Code": 10038073,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the rectal wall."
    },
    {
        "MedDRA v12.0 Code": 10038079,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Severely altered GI function; tube feeding or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the rectum."
    },
    {
        "MedDRA v12.0 Code": 10038080,
        "SOC": "Gastrointestinal disorders",
        "name": "Rectal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function (e.g. altered dietary habits, vomiting, diarrhea)",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the rectum."
    },
    {
        "MedDRA v12.0 Code": 10038981,
        "SOC": "Gastrointestinal disorders",
        "name": "Retroperitoneal hemorrhage",
        "Grade 1": null,
        "Grade 2": "Self-limited; intervention indicated",
        "Grade 3": "Transfusion, medical, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the retroperitoneal area."
    },
    {
        "MedDRA v12.0 Code": 10056681,
        "SOC": "Gastrointestinal disorders",
        "name": "Salivary duct inflammation",
        "Grade 1": "Slightly thickened saliva; slightly altered taste (e.g., metallic)",
        "Grade 2": "Thick, ropy, sticky saliva; markedly altered taste; alteration in diet indicated; secretion-induced symptoms; limiting instrumental ADL",
        "Grade 3": "Acute salivary gland necrosis; severe secretion-induced symptoms (e.g., thick saliva/oral secretions or gagging);  tube feeding or TPN indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the salivary duct."
    },
    {
        "MedDRA v12.0 Code": 10039411,
        "SOC": "Gastrointestinal disorders",
        "name": "Salivary gland fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; tube feeding indicated",
        "Grade 3": "Severely altered GI function; hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between a salivary gland and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10065710,
        "SOC": "Gastrointestinal disorders",
        "name": "Small intestinal mucositis",
        "Grade 1": "Asymptomatic or mild symptoms; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe pain; interfering with oral intake; tube feeding, TPN or hospitalization indicated; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the mucous membrane of the small intestine."
    },
    {
        "MedDRA v12.0 Code": 10041101,
        "SOC": "Gastrointestinal disorders",
        "name": "Small intestinal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Hospitalization indicated; elective operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the intestinal contents."
    },
    {
        "MedDRA v12.0 Code": 10041103,
        "SOC": "Gastrointestinal disorders",
        "name": "Small intestinal perforation",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the small intestine wall."
    },
    {
        "MedDRA v12.0 Code": 10062263,
        "SOC": "Gastrointestinal disorders",
        "name": "Small intestinal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function",
        "Grade 3": "Symptomatic and severely altered GI function; tube feeding, TPN or hospitalization indicated; non-emergent operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the small intestine."
    },
    {
        "MedDRA v12.0 Code": 10041133,
        "SOC": "Gastrointestinal disorders",
        "name": "Small intestine ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; limiting instrumental ADL",
        "Grade 3": "Severely altered GI function; TPN indicated; elective operative or endoscopic intervention indicated; limiting self care ADL; disabling",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the mucosal surface of the small intestine."
    },
    {
        "MedDRA v12.0 Code": 10042112,
        "SOC": "Gastrointestinal disorders",
        "name": "Stomach pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the stomach."
    },
    {
        "MedDRA v12.0 Code": 10044030,
        "SOC": "Gastrointestinal disorders",
        "name": "Tooth development disorder",
        "Grade 1": "Asymptomatic; hypoplasia of tooth or enamel",
        "Grade 2": "Impairment correctable with oral surgery",
        "Grade 3": "Maldevelopment with impairment not surgically correctable; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a pathological process of the teeth occurring during tooth development."
    },
    {
        "MedDRA v12.0 Code": 10044031,
        "SOC": "Gastrointestinal disorders",
        "name": "Tooth discoloration",
        "Grade 1": "Surface stains",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a change in tooth hue or tint."
    },
    {
        "MedDRA v12.0 Code": 10044055,
        "SOC": "Gastrointestinal disorders",
        "name": "Toothache",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the tooth."
    },
    {
        "MedDRA v12.0 Code": 10045271,
        "SOC": "Gastrointestinal disorders",
        "name": "Typhlitis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic (e.g., abdominal pain, fever, change in bowel habits with ileus); peritoneal signs",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the cecum."
    },
    {
        "MedDRA v12.0 Code": 10055356,
        "SOC": "Gastrointestinal disorders",
        "name": "Upper gastrointestinal hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention or minor cauterization indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the upper gastrointestinal tract (oral cavity, pharynx, esophagus, and stomach)."
    },
    {
        "MedDRA v12.0 Code": 10047700,
        "SOC": "Gastrointestinal disorders",
        "name": "Vomiting",
        "Grade 1": "1 - 2 episodes (separated by 5 minutes) in 24 hrs",
        "Grade 2": "3 - 5 episodes (separated by 5 minutes) in 24 hrs",
        "Grade 3": ">=6 episodes (separated by 5 minutes) in 24 hrs; tube feeding, TPN or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the reflexive act of ejecting the contents of the stomach through the mouth."
    },
    {
        "MedDRA v12.0 Code": 10017947,
        "SOC": "Gastrointestinal disorders",
        "name": "Gastrointestinal disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10008531,
        "SOC": "General disorders and administration site conditions",
        "name": "Chills",
        "Grade 1": "Mild sensation of cold; shivering; chattering of teeth",
        "Grade 2": "Moderate tremor of the entire body; narcotics indicated",
        "Grade 3": "Severe or prolonged, not responsive to narcotics",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of cold that often marks a physiologic response to sweating after a fever."
    },
    {
        "MedDRA v12.0 Code": 10011912,
        "SOC": "General disorders and administration site conditions",
        "name": "Death neonatal",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": "Death",
        "description": "A disorder characterized by cessation of life occurring during the first 28 days of life."
    },
    {
        "MedDRA v12.0 Code": 10011914,
        "SOC": "General disorders and administration site conditions",
        "name": "Death NOS",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": "Death",
        "description": "A cessation of life that cannot be attributed to a CTCAE term associated with Grade 5."
    },
    {
        "MedDRA v12.0 Code": 10014222,
        "SOC": "General disorders and administration site conditions",
        "name": "Edema face",
        "Grade 1": "Localized facial edema",
        "Grade 2": "Moderate localized facial edema; limiting instrumental ADL",
        "Grade 3": "Severe swelling; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to excessive fluid accumulation in facial tissues."
    },
    {
        "MedDRA v12.0 Code": 10050068,
        "SOC": "General disorders and administration site conditions",
        "name": "Edema limbs",
        "Grade 1": "5 - 10% inter-limb discrepancy in volume or circumference at point of greatest visible difference; swelling or obscuration of anatomic architecture on close inspection",
        "Grade 2": ">10 - 30% inter-limb discrepancy in volume or circumference at point of greatest visible difference; readily apparent obscuration of anatomic architecture; obliteration of skin folds; readily apparent deviation from normal anatomic contour; limiting instrumental ADL",
        "Grade 3": ">30% inter-limb discrepancy in volume; gross deviation from normal anatomic contour; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to excessive fluid accumulation in the upper or lower extremities."
    },
    {
        "MedDRA v12.0 Code": 10058720,
        "SOC": "General disorders and administration site conditions",
        "name": "Edema trunk",
        "Grade 1": "Swelling or obscuration of anatomic architecture on close inspection",
        "Grade 2": "Readily apparent obscuration of anatomic architecture; obliteration of skin folds; readily apparent deviation from normal anatomic contour; limiting instrumental ADL",
        "Grade 3": "Gross deviation from normal anatomic contour; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to excessive fluid accumulation in the trunk area."
    },
    {
        "MedDRA v12.0 Code": 10016059,
        "SOC": "General disorders and administration site conditions",
        "name": "Facial pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the face."
    },
    {
        "MedDRA v12.0 Code": 10016256,
        "SOC": "General disorders and administration site conditions",
        "name": "Fatigue",
        "Grade 1": "Fatigue relieved by rest",
        "Grade 2": "Fatigue not relieved by rest; limiting instrumental ADL",
        "Grade 3": "Fatigue not relieved by rest, limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a state of generalized weakness with a pronounced inability to summon sufficient energy to accomplish daily activities."
    },
    {
        "MedDRA v12.0 Code": 10016558,
        "SOC": "General disorders and administration site conditions",
        "name": "Fever",
        "Grade 1": "38.0 - 39.0 degrees C  (100.4 - 102.2 degrees F)",
        "Grade 2": ">39.0 - 40.0 degrees C (102.3 - 104.0 degrees F)",
        "Grade 3": ">40.0 degrees C (>104.0 degrees F) for <=24 hrs",
        "Grade 4": ">40.0 degrees C (>104.0 degrees F) for >24 hrs",
        "Grade 5": "Death",
        "description": "A disorder characterized by elevation of the body's temperature above the upper limit of normal."
    },
    {
        "MedDRA v12.0 Code": 10016791,
        "SOC": "General disorders and administration site conditions",
        "name": "Flu like symptoms",
        "Grade 1": "Mild flu-like symptoms present",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a group of symptoms similar to those observed in patients with the flu. It includes fever, chills, body aches, malaise, loss of appetite and dry cough."
    },
    {
        "MedDRA v12.0 Code": 10017577,
        "SOC": "General disorders and administration site conditions",
        "name": "Gait disturbance",
        "Grade 1": "Mild change in gait (e.g., wide-based, limping or hobbling)",
        "Grade 2": "Moderate change in gait (e.g., wide-based, limping or hobbling); assistive device indicated; limiting instrumental ADL",
        "Grade 3": "Disabling; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by walking difficulties."
    },
    {
        "MedDRA v12.0 Code": 10021113,
        "SOC": "General disorders and administration site conditions",
        "name": "Hypothermia",
        "Grade 1": null,
        "Grade 2": "35 - >32 degrees C;  95 - >89.6 degrees F",
        "Grade 3": "32 - >28 degrees C;  89.6 - >82.4 degrees F",
        "Grade 4": "<=28 degrees C; 82.4 degrees F; life-threatening consequences (e.g., coma, hypotension, pulmonary edema, acidemia, ventricular fibrillation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormally low body temperature. Treatment is required when the body temperature is 35C (95F) or below."
    },
    {
        "MedDRA v12.0 Code": 10051792,
        "SOC": "General disorders and administration site conditions",
        "name": "Infusion related reaction",
        "Grade 1": "Mild transient reaction; infusion interruption not indicated; intervention not indicated",
        "Grade 2": "Therapy or infusion interruption indicated but responds promptly to symptomatic treatment (e.g., antihistamines, NSAIDS, narcotics, IV fluids); prophylactic medications indicated for <=24 hrs",
        "Grade 3": "Prolonged (e.g., not rapidly responsive to symptomatic medication and/or brief interruption of infusion); recurrence of symptoms following initial improvement; hospitalization indicated for clinical sequelae",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by adverse reaction to the infusion of pharmacological or biological substances."
    },
    {
        "MedDRA v12.0 Code": 10064774,
        "SOC": "General disorders and administration site conditions",
        "name": "Infusion site extravasation",
        "Grade 1": null,
        "Grade 2": "Erythema with associated symptoms (e.g., edema, pain, induration, phlebitis)",
        "Grade 3": "Ulceration or necrosis; severe tissue damage; operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by leakage of a pharmacologic or a biologic substance from the infusion site into the surrounding tissue. Signs and symptoms include induration, erythema, swelling, burning sensation and marked discomfort at the infusion site."
    },
    {
        "MedDRA v12.0 Code": 10022095,
        "SOC": "General disorders and administration site conditions",
        "name": "Injection site reaction",
        "Grade 1": "Tenderness with or without associated symptoms (e.g., warmth, erythema, itching)",
        "Grade 2": "Pain; lipodystrophy; edema; phlebitis",
        "Grade 3": "Ulceration or necrosis; severe tissue damage; operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an intense adverse reaction (usually immunologic) developing at the site of an injection."
    },
    {
        "MedDRA v12.0 Code": 10022998,
        "SOC": "General disorders and administration site conditions",
        "name": "Irritability",
        "Grade 1": "Mild; easily consolable",
        "Grade 2": "Moderate; limiting instrumental ADL; increased attention indicated",
        "Grade 3": "Severe abnormal or excessive response; limiting self care ADL; inconsolable",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an abnormal responsiveness to stimuli or physiological arousal; may be in response to pain, fright, a drug, an emotional situation or a medical condition."
    },
    {
        "MedDRA v12.0 Code": 10062466,
        "SOC": "General disorders and administration site conditions",
        "name": "Localized edema",
        "Grade 1": "Localized to dependent areas, no disability or functional impairment",
        "Grade 2": "Moderate localized edema and intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe localized edema and intervention indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to excessive fluid accumulation at a specific anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10025482,
        "SOC": "General disorders and administration site conditions",
        "name": "Malaise",
        "Grade 1": "Uneasiness or lack of well being",
        "Grade 2": "Uneasiness or lack of well being; limiting instrumental ADL",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a feeling of general discomfort or uneasiness, an out-of-sorts feeling."
    },
    {
        "MedDRA v12.0 Code": 10028154,
        "SOC": "General disorders and administration site conditions",
        "name": "Multi-organ failure",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Shock with azotemia and acid-base disturbances; significant coagulation abnormalities",
        "Grade 4": "Life-threatening consequences (e.g., vasopressor dependent and oliguric or anuric or ischemic colitis or lactic acidosis)",
        "Grade 5": "Death",
        "description": "A disorder characterized by progressive deterioration of the lungs, liver, kidney and clotting mechanisms."
    },
    {
        "MedDRA v12.0 Code": 10054482,
        "SOC": "General disorders and administration site conditions",
        "name": "Neck edema",
        "Grade 1": "Asymptomatic localized neck edema",
        "Grade 2": "Moderate neck edema; slight obliteration of anatomic landmarks; limiting instrumental ADL",
        "Grade 3": "Generalized neck edema (e.g., difficulty in turning neck); limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to an accumulation of excessive fluid in the neck."
    },
    {
        "MedDRA v12.0 Code": 10062501,
        "SOC": "General disorders and administration site conditions",
        "name": "Non-cardiac chest pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by discomfort in the chest unrelated to a heart disorder."
    },
    {
        "MedDRA v12.0 Code": 10033371,
        "SOC": "General disorders and administration site conditions",
        "name": "Pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the sensation of marked discomfort, distress or agony."
    },
    {
        "MedDRA v12.0 Code": 10042435,
        "SOC": "General disorders and administration site conditions",
        "name": "Sudden death NOS",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": "Death",
        "description": "An unexpected cessation of life that cannot be attributed to a CTCAE term associated with Grade 5."
    },
    {
        "MedDRA v12.0 Code": 10018065,
        "SOC": "General disorders and administration site conditions",
        "name": "General disorders and administration site conditions - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10051341,
        "SOC": "Hepatobiliary disorders",
        "name": "Bile duct stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; IV fluids indicated <24 hrs",
        "Grade 3": "Severely altered GI function; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the lumen of the bile duct."
    },
    {
        "MedDRA v12.0 Code": 10004665,
        "SOC": "Hepatobiliary disorders",
        "name": "Biliary fistula",
        "Grade 1": null,
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severely altered GI function; TPN indicated; endoscopic intervention indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the bile ducts and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10008612,
        "SOC": "Hepatobiliary disorders",
        "name": "Cholecystitis",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation involving the gallbladder. It may be associated with the presence of gallstones."
    },
    {
        "MedDRA v12.0 Code": 10017631,
        "SOC": "Hepatobiliary disorders",
        "name": "Gallbladder fistula",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Symptomatic or severely altered GI function; TPN indicated; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the gallbladder and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10059446,
        "SOC": "Hepatobiliary disorders",
        "name": "Gallbladder necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the gallbladder."
    },
    {
        "MedDRA v12.0 Code": 10017636,
        "SOC": "Hepatobiliary disorders",
        "name": "Gallbladder obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; altered GI function; IV fluids indicated  <24 hrs",
        "Grade 3": "Symptomatic and severely altered GI function; tube feeding, TPN or hospitalization indicated; non-emergent operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of the contents of the gallbladder."
    },
    {
        "MedDRA v12.0 Code": 10017638,
        "SOC": "Hepatobiliary disorders",
        "name": "Gallbladder pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the gallbladder region."
    },
    {
        "MedDRA v12.0 Code": 10017639,
        "SOC": "Hepatobiliary disorders",
        "name": "Gallbladder perforation",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the gallbladder wall."
    },
    {
        "MedDRA v12.0 Code": 10019663,
        "SOC": "Hepatobiliary disorders",
        "name": "Hepatic failure",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Asterixis; mild encephalopathy; limiting self care ADL",
        "Grade 4": "Moderate to severe encephalopathy; coma; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by the inability of the liver to metabolize chemicals in the body. Laboratory test results reveal abnormal plasma levels of ammonia, bilirubin, lactic dehydrogenase, and alkaline phosphatase."
    },
    {
        "MedDRA v12.0 Code": 10019678,
        "SOC": "Hepatobiliary disorders",
        "name": "Hepatic hemorrhage",
        "Grade 1": "Mild; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Transfusion indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the liver."
    },
    {
        "MedDRA v12.0 Code": 10019692,
        "SOC": "Hepatobiliary disorders",
        "name": "Hepatic necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the hepatic parenchyma."
    },
    {
        "MedDRA v12.0 Code": 10019705,
        "SOC": "Hepatobiliary disorders",
        "name": "Hepatic pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the liver region."
    },
    {
        "MedDRA v12.0 Code": 10034405,
        "SOC": "Hepatobiliary disorders",
        "name": "Perforation bile duct",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the wall of the extrahepatic or intrahepatic bile duct."
    },
    {
        "MedDRA v12.0 Code": 10036200,
        "SOC": "Hepatobiliary disorders",
        "name": "Portal hypertension",
        "Grade 1": null,
        "Grade 2": "Decreased portal vein flow",
        "Grade 3": "Reversal/retrograde portal vein flow; associated with varices and/or ascites",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in blood pressure in the portal venous system."
    },
    {
        "MedDRA v12.0 Code": 10036206,
        "SOC": "Hepatobiliary disorders",
        "name": "Portal vein thrombosis",
        "Grade 1": null,
        "Grade 2": "Intervention not indicated",
        "Grade 3": "Medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the formation of a thrombus (blood clot) in the portal vein."
    },
    {
        "MedDRA v12.0 Code": 10019805,
        "SOC": "Hepatobiliary disorders",
        "name": "Hepatobiliary disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10001718,
        "SOC": "Immune system disorders",
        "name": "Allergic reaction",
        "Grade 1": "Transient flushing or rash, drug fever <38 degrees C (<100.4 degrees F); intervention not indicated",
        "Grade 2": "Intervention or infusion interruption indicated; responds promptly to symptomatic treatment (e.g., antihistamines, NSAIDS, narcotics); prophylactic medications indicated for <=24 hrs",
        "Grade 3": "Prolonged (e.g., not rapidly responsive to symptomatic medication and/or brief interruption of infusion); recurrence of symptoms following initial improvement; hospitalization indicated for clinical sequelae (e.g., renal impairment, pulmonary infiltrates)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an adverse local or general response from exposure to an allergen."
    },
    {
        "MedDRA v12.0 Code": 10002218,
        "SOC": "Immune system disorders",
        "name": "Anaphylaxis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic bronchospasm, with or without urticaria; parenteral intervention indicated; allergy-related edema/angioedema; hypotension",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an acute inflammatory reaction resulting from the release of histamine and histamine-like substances from mast cells, causing a hypersensitivity immune response. Clinically, it presents with breathing difficulty, dizziness, hypotension, cyanosis and loss of consciousness and may lead to death."
    },
    {
        "MedDRA v12.0 Code": 10061664,
        "SOC": "Immune system disorders",
        "name": "Autoimmune disorder",
        "Grade 1": "Asymptomatic; serologic or other evidence of autoimmune reaction, with normal organ function;  intervention not indicated",
        "Grade 2": "Evidence of autoimmune reaction involving a non-essential organ or function (e.g., hypothyroidism)",
        "Grade 3": "Autoimmune reactions involving major organ (e.g., colitis, anemia, myocarditis, kidney)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder resulting from loss of function or tissue destruction of an organ or multiple organs, arising from humoral or cellular immune responses of the individual to his own tissue constituents."
    },
    {
        "MedDRA v12.0 Code": 10052015,
        "SOC": "Immune system disorders",
        "name": "Cytokine release syndrome",
        "Grade 1": "Mild reaction; infusion interruption not indicated; intervention not indicated",
        "Grade 2": "Therapy or infusion interruption indicated but responds promptly to symptomatic treatment (e.g., antihistamines, NSAIDS, narcotics, IV fluids); prophylactic medications indicated for <=24 hrs",
        "Grade 3": "Prolonged (e.g., not rapidly responsive to symptomatic medication and/or brief interruption of infusion); recurrence of symptoms following initial improvement; hospitalization indicated for clinical sequelae (e.g., renal impairment, pulmonary infiltrates)",
        "Grade 4": "Life-threatening consequences; pressor or ventilatory support indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by nausea, headache, tachycardia, hypotension, rash, and shortness of breath; it is caused by the release of cytokines from the cells."
    },
    {
        "MedDRA v12.0 Code": 10040400,
        "SOC": "Immune system disorders",
        "name": "Serum sickness",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate arthralgia; fever, rash, urticaria, antihistamines indicated",
        "Grade 3": "Severe arthralgia or arthritis; extensive rash; steroids or IV fluids indicated",
        "Grade 4": "Life-threatening consequences; pressor or ventilatory support indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a delayed-type hypersensitivity reaction to foreign proteins derived from an animal serum. It occurs approximately six to twenty-one days following the administration of the foreign antigen. Symptoms include fever, arthralgias, myalgias, skin eruptions, lymphadenopathy, chest marked discomfort and dyspnea."
    },
    {
        "MedDRA v12.0 Code": 10021428,
        "SOC": "Immune system disorders",
        "name": "Immune system disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10056519,
        "SOC": "Infections and infestations",
        "name": "Abdominal infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the abdominal cavity."
    },
    {
        "MedDRA v12.0 Code": 10061640,
        "SOC": "Infections and infestations",
        "name": "Anorectal infection",
        "Grade 1": "Localized; local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the anal area and the rectum."
    },
    {
        "MedDRA v12.0 Code": 10003011,
        "SOC": "Infections and infestations",
        "name": "Appendicitis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by acute inflammation to the vermiform appendix caused by a pathogenic agent."
    },
    {
        "MedDRA v12.0 Code": 10003012,
        "SOC": "Infections and infestations",
        "name": "Appendicitis perforated",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by acute inflammation to the vermiform appendix caused by a pathogenic agent with gangrenous changes resulting in the rupture of the appendiceal wall. The appendiceal wall rupture causes the release of inflammatory and bacterial contents from the appendiceal lumen into the abdominal cavity."
    },
    {
        "MedDRA v12.0 Code": 10065744,
        "SOC": "Infections and infestations",
        "name": "Arteritis infective",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving an artery."
    },
    {
        "MedDRA v12.0 Code": 10061695,
        "SOC": "Infections and infestations",
        "name": "Biliary tract infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the biliary tract."
    },
    {
        "MedDRA v12.0 Code": 10005047,
        "SOC": "Infections and infestations",
        "name": "Bladder infection",
        "Grade 1": null,
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the bladder."
    },
    {
        "MedDRA v12.0 Code": 10061017,
        "SOC": "Infections and infestations",
        "name": "Bone infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the bones."
    },
    {
        "MedDRA v12.0 Code": 10006259,
        "SOC": "Infections and infestations",
        "name": "Breast infection",
        "Grade 1": null,
        "Grade 2": "Local infection with moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "Severe infection; axillary adenitis;  IV antibacterial, antifungal, or antiviral intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the breast."
    },
    {
        "MedDRA v12.0 Code": 10055078,
        "SOC": "Infections and infestations",
        "name": "Bronchial infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the bronchi."
    },
    {
        "MedDRA v12.0 Code": 10007810,
        "SOC": "Infections and infestations",
        "name": "Catheter related infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process that arises secondary to catheter use."
    },
    {
        "MedDRA v12.0 Code": 10065761,
        "SOC": "Infections and infestations",
        "name": "Cecal infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the cecum."
    },
    {
        "MedDRA v12.0 Code": 10008330,
        "SOC": "Infections and infestations",
        "name": "Cervicitis infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the uterine cervix."
    },
    {
        "MedDRA v12.0 Code": 10010742,
        "SOC": "Infections and infestations",
        "name": "Conjunctivitis infective",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the conjunctiva. Clinical manifestations include pink or red color in the eyes."
    },
    {
        "MedDRA v12.0 Code": 10061788,
        "SOC": "Infections and infestations",
        "name": "Corneal infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the cornea."
    },
    {
        "MedDRA v12.0 Code": 10065765,
        "SOC": "Infections and infestations",
        "name": "Cranial nerve infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving a cranial nerve."
    },
    {
        "MedDRA v12.0 Code": 10064687,
        "SOC": "Infections and infestations",
        "name": "Device related infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the use of a medical device."
    },
    {
        "MedDRA v12.0 Code": 10065752,
        "SOC": "Infections and infestations",
        "name": "Duodenal infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; medical intervention indicated (e.g., oral antibiotics)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the duodenum."
    },
    {
        "MedDRA v12.0 Code": 10014594,
        "SOC": "Infections and infestations",
        "name": "Encephalitis infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; severe changes in mental status; self-limited seizure activity; focal neurologic abnormalities",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the brain tissue."
    },
    {
        "MedDRA v12.0 Code": 10014621,
        "SOC": "Infections and infestations",
        "name": "Encephalomyelitis infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the brain and spinal cord tissues."
    },
    {
        "MedDRA v12.0 Code": 10014678,
        "SOC": "Infections and infestations",
        "name": "Endocarditis infective",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the endocardial layer of the heart."
    },
    {
        "MedDRA v12.0 Code": 10014801,
        "SOC": "Infections and infestations",
        "name": "Endophthalmitis",
        "Grade 1": null,
        "Grade 2": "Local intervention indicated",
        "Grade 3": "Systemic intervention or hospitalization indicated",
        "Grade 4": "Blindness (20/200 or worse)",
        "Grade 5": null,
        "description": "A disorder characterized by an infectious process involving the internal structures of the eye."
    },
    {
        "MedDRA v12.0 Code": 10058838,
        "SOC": "Infections and infestations",
        "name": "Enterocolitis infectious",
        "Grade 1": null,
        "Grade 2": "Passage of >3 unformed stools per 24 hrs or duration of illness >48 hrs; moderate abdominal pain",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated; profuse watery diarrhea with signs of hypovolemia;  bloody diarrhea; fever; severe abdominal pain; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the small and large intestines."
    },
    {
        "MedDRA v12.0 Code": 10058804,
        "SOC": "Infections and infestations",
        "name": "Esophageal infection",
        "Grade 1": null,
        "Grade 2": "Local intervention indicated (e.g., oral antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the esophagus."
    },
    {
        "MedDRA v12.0 Code": 10015929,
        "SOC": "Infections and infestations",
        "name": "Eye infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated; enucleation",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the eye."
    },
    {
        "MedDRA v12.0 Code": 10062632,
        "SOC": "Infections and infestations",
        "name": "Gallbladder infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the gallbladder."
    },
    {
        "MedDRA v12.0 Code": 10018784,
        "SOC": "Infections and infestations",
        "name": "Gum infection",
        "Grade 1": "Local therapy indicated (swish and swallow)",
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the gums."
    },
    {
        "MedDRA v12.0 Code": 10056522,
        "SOC": "Infections and infestations",
        "name": "Hepatic infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the liver."
    },
    {
        "MedDRA v12.0 Code": 10019799,
        "SOC": "Infections and infestations",
        "name": "Hepatitis viral",
        "Grade 1": "Asymptomatic, treatment not indicated",
        "Grade 2": null,
        "Grade 3": "Symptomatic liver dysfunction; fibrosis by biopsy; compensated cirrhosis; reactivation of chronic hepatitis",
        "Grade 4": "Decompensated liver function (e.g., ascites, coagulopathy, encephalopathy, coma)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a viral pathologic process involving the liver parenchyma."
    },
    {
        "MedDRA v12.0 Code": 10021918,
        "SOC": "Infections and infestations",
        "name": "Infective myositis",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the skeletal muscles."
    },
    {
        "MedDRA v12.0 Code": 10023216,
        "SOC": "Infections and infestations",
        "name": "Joint infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated; oral intervention indicated (e.g., antibiotic, antifungal, antiviral); needle aspiration indicated (single or multiple)",
        "Grade 3": "Arthroscopic intervention indicated (e.g., drainage) or arthrotomy (e.g., open surgical drainage)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving a joint."
    },
    {
        "MedDRA v12.0 Code": 10023424,
        "SOC": "Infections and infestations",
        "name": "Kidney infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the kidney."
    },
    {
        "MedDRA v12.0 Code": 10023874,
        "SOC": "Infections and infestations",
        "name": "Laryngitis",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inflammatory process involving the larynx."
    },
    {
        "MedDRA v12.0 Code": 10065755,
        "SOC": "Infections and infestations",
        "name": "Lip infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an infectious process involving the lips."
    },
    {
        "MedDRA v12.0 Code": 10061229,
        "SOC": "Infections and infestations",
        "name": "Lung infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the lungs."
    },
    {
        "MedDRA v12.0 Code": 10050823,
        "SOC": "Infections and infestations",
        "name": "Lymph gland infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the lymph nodes."
    },
    {
        "MedDRA v12.0 Code": 10057483,
        "SOC": "Infections and infestations",
        "name": "Mediastinal infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the mediastinum."
    },
    {
        "MedDRA v12.0 Code": 10027199,
        "SOC": "Infections and infestations",
        "name": "Meningitis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated; focal neurologic deficit",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by acute inflammation of the meninges of the brain and/or spinal cord."
    },
    {
        "MedDRA v12.0 Code": 10065764,
        "SOC": "Infections and infestations",
        "name": "Mucosal infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving a mucosal surface."
    },
    {
        "MedDRA v12.0 Code": 10061304,
        "SOC": "Infections and infestations",
        "name": "Nail infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an infectious process involving the nail."
    },
    {
        "MedDRA v12.0 Code": 10033072,
        "SOC": "Infections and infestations",
        "name": "Otitis externa",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the outer ear and ear canal. Contributory factors include excessive water exposure (swimmer's ear infection) and cuts in the ear canal. Symptoms include fullness, itching, swelling and marked discomfort in the ear and ear drainage."
    },
    {
        "MedDRA v12.0 Code": 10033078,
        "SOC": "Infections and infestations",
        "name": "Otitis media",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the middle ear."
    },
    {
        "MedDRA v12.0 Code": 10055005,
        "SOC": "Infections and infestations",
        "name": "Ovarian infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the ovary."
    },
    {
        "MedDRA v12.0 Code": 10051741,
        "SOC": "Infections and infestations",
        "name": "Pancreas infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the pancreas."
    },
    {
        "MedDRA v12.0 Code": 10069138,
        "SOC": "Infections and infestations",
        "name": "Papulopustular rash",
        "Grade 1": "Papules and/or pustules covering <10% BSA, which may or may not be associated with symptoms of pruritus or tenderness",
        "Grade 2": "Papules and/or pustules covering 10-30% BSA, which may or may not be associated with symptoms of pruritus or tenderness; associated with psychosocial impact; limiting instrumental ADL",
        "Grade 3": "Papules and/or pustules covering >30% BSA, which may or may not be associated with symptoms of pruritus or tenderness; limiting self-care ADL; associated with local superinfection with oral antibiotics indicated",
        "Grade 4": "Papules and/or pustules covering  any % BSA, which may or may not be associated with symptoms of pruritus or tenderness and are associated with extensive superinfection with IV antibiotics indicated; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by an eruption consisting of papules (a small, raised pimple) and pustules (a small pus filled blister), typically appearing in face, scalp, and upper chest and back Unlike acne, this rash does not present with whiteheads or blackheads, and can be symptomatic, with itchy or tender lesions."
    },
    {
        "MedDRA v12.0 Code": 10034016,
        "SOC": "Infections and infestations",
        "name": "Paronychia",
        "Grade 1": "Nail fold edema or erythema; disruption of the cuticle",
        "Grade 2": "Localized intervention indicated; oral intervention indicated (e.g., antibiotic, antifungal, antiviral); nail fold edema or erythema with pain; associated with discharge or nail plate separation; limiting instrumental ADL",
        "Grade 3": "Surgical intervention or IV antibiotics indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an infectious process involving the soft tissues around the nail."
    },
    {
        "MedDRA v12.0 Code": 10058674,
        "SOC": "Infections and infestations",
        "name": "Pelvic infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the pelvic cavity."
    },
    {
        "MedDRA v12.0 Code": 10061912,
        "SOC": "Infections and infestations",
        "name": "Penile infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the penis."
    },
    {
        "MedDRA v12.0 Code": 10051472,
        "SOC": "Infections and infestations",
        "name": "Periorbital infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the orbit of the eye."
    },
    {
        "MedDRA v12.0 Code": 10065766,
        "SOC": "Infections and infestations",
        "name": "Peripheral nerve infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the peripheral nerves."
    },
    {
        "MedDRA v12.0 Code": 10057262,
        "SOC": "Infections and infestations",
        "name": "Peritoneal infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the peritoneum."
    },
    {
        "MedDRA v12.0 Code": 10034835,
        "SOC": "Infections and infestations",
        "name": "Pharyngitis",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the throat."
    },
    {
        "MedDRA v12.0 Code": 10056627,
        "SOC": "Infections and infestations",
        "name": "Phlebitis infective",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the vein. Clinical manifestations include erythema, marked discomfort, swelling, and induration along the course of the infected vein."
    },
    {
        "MedDRA v12.0 Code": 10061351,
        "SOC": "Infections and infestations",
        "name": "Pleural infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the pleura."
    },
    {
        "MedDRA v12.0 Code": 10050662,
        "SOC": "Infections and infestations",
        "name": "Prostate infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the prostate gland."
    },
    {
        "MedDRA v12.0 Code": 10037888,
        "SOC": "Infections and infestations",
        "name": "Rash pustular",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a circumscribed and elevated skin lesion filled with pus."
    },
    {
        "MedDRA v12.0 Code": 10059827,
        "SOC": "Infections and infestations",
        "name": "Rhinitis infective",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an infectious process involving the nasal mucosal."
    },
    {
        "MedDRA v12.0 Code": 10039413,
        "SOC": "Infections and infestations",
        "name": "Salivary gland infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the salivary gland."
    },
    {
        "MedDRA v12.0 Code": 10062156,
        "SOC": "Infections and infestations",
        "name": "Scrotal infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the scrotum."
    },
    {
        "MedDRA v12.0 Code": 10040047,
        "SOC": "Infections and infestations",
        "name": "Sepsis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the presence of pathogenic microorganisms in the blood stream that cause a rapidly progressing systemic reaction that may lead to shock."
    },
    {
        "MedDRA v12.0 Code": 10040753,
        "SOC": "Infections and infestations",
        "name": "Sinusitis",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the mucous membranes of the paranasal sinuses."
    },
    {
        "MedDRA v12.0 Code": 10040872,
        "SOC": "Infections and infestations",
        "name": "Skin infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the skin."
    },
    {
        "MedDRA v12.0 Code": 10065771,
        "SOC": "Infections and infestations",
        "name": "Small intestine infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the small intestine."
    },
    {
        "MedDRA v12.0 Code": 10062255,
        "SOC": "Infections and infestations",
        "name": "Soft tissue infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving soft tissues."
    },
    {
        "MedDRA v12.0 Code": 10062112,
        "SOC": "Infections and infestations",
        "name": "Splenic infection",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the spleen."
    },
    {
        "MedDRA v12.0 Code": 10064505,
        "SOC": "Infections and infestations",
        "name": "Stoma site infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving a stoma (surgically created opening on the surface of the body)."
    },
    {
        "MedDRA v12.0 Code": 10048762,
        "SOC": "Infections and infestations",
        "name": "Tooth infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving a tooth."
    },
    {
        "MedDRA v12.0 Code": 10044302,
        "SOC": "Infections and infestations",
        "name": "Tracheitis",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the trachea."
    },
    {
        "MedDRA v12.0 Code": 10046300,
        "SOC": "Infections and infestations",
        "name": "Upper respiratory infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the upper respiratory tract (nose, paranasal sinuses, pharynx, larynx, or trachea)."
    },
    {
        "MedDRA v12.0 Code": 10052298,
        "SOC": "Infections and infestations",
        "name": "Urethral infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the urethra."
    },
    {
        "MedDRA v12.0 Code": 10046571,
        "SOC": "Infections and infestations",
        "name": "Urinary tract infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the urinary tract, most commonly the bladder and the urethra."
    },
    {
        "MedDRA v12.0 Code": 10062233,
        "SOC": "Infections and infestations",
        "name": "Uterine infection",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the endometrium. It may extend to the myometrium and parametrial tissues."
    },
    {
        "MedDRA v12.0 Code": 10046914,
        "SOC": "Infections and infestations",
        "name": "Vaginal infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the vagina."
    },
    {
        "MedDRA v12.0 Code": 10065772,
        "SOC": "Infections and infestations",
        "name": "Vulval infection",
        "Grade 1": "Localized, local intervention indicated",
        "Grade 2": "Oral intervention indicated (e.g., antibiotic, antifungal, antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the vulva."
    },
    {
        "MedDRA v12.0 Code": 10048038,
        "SOC": "Infections and infestations",
        "name": "Wound infection",
        "Grade 1": null,
        "Grade 2": "Localized; local intervention indicated (e.g., topical antibiotic, antifungal, or antiviral)",
        "Grade 3": "IV antibiotic, antifungal, or antiviral intervention indicated; radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an infectious process involving the wound."
    },
    {
        "MedDRA v12.0 Code": 10021881,
        "SOC": "Infections and infestations",
        "name": "Infections and infestations - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10002544,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Ankle fracture",
        "Grade 1": "Mild; non-surgical intervention indicated",
        "Grade 2": "Limiting instrumental ADL; operative intervention indicated",
        "Grade 3": "Limiting self care ADL; elective surgery indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding of damage to the ankle joint characterized by a break in the continuity of the ankle bone. Symptoms include marked discomfort, swelling and difficulty moving the affected leg and foot."
    },
    {
        "MedDRA v12.0 Code": 10002899,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Aortic injury",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Severe symptoms; limiting self care ADL; disabling; repair or revision indicated",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the aorta."
    },
    {
        "MedDRA v12.0 Code": 10003162,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Arterial injury",
        "Grade 1": "Asymptomatic diagnostic finding; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., claudication); repair or revision not indicated",
        "Grade 3": "Severe symptoms; limiting self care ADL; disabling; repair or revision indicated",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to an artery."
    },
    {
        "MedDRA v12.0 Code": 10050458,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Biliary anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage of bile due to breakdown of a biliary anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065802,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Bladder anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage of urine due to breakdown of a bladder anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10006504,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Bruising",
        "Grade 1": "Localized or in a dependent area",
        "Grade 2": "Generalized",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding of injury of the soft tissues or bone characterized by leakage of blood into surrounding tissues."
    },
    {
        "MedDRA v12.0 Code": 10006634,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Burn",
        "Grade 1": "Minimal symptoms; intervention not indicated",
        "Grade 2": "Medical intervention; minimal debridement indicated",
        "Grade 3": "Moderate to major debridement or reconstruction indicated",
        "Grade 4": "Life-threatening consequences",
        "Grade 5": "Death",
        "description": "A finding of impaired integrity to the anatomic site of an adverse thermal reaction. Burns can be caused by exposure to chemicals, direct heat, electricity, flames and radiation. The extent of damage depends on the length and intensity of exposure and time until provision of treatment."
    },
    {
        "MedDRA v12.0 Code": 10061103,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Dermatitis radiation",
        "Grade 1": "Faint erythema or dry desquamation",
        "Grade 2": "Moderate to brisk erythema; patchy moist desquamation, mostly confined to skin folds and creases; moderate edema",
        "Grade 3": "Moist desquamation in areas other than skin folds and creases; bleeding induced by minor trauma or abrasion",
        "Grade 4": "Life-threatening consequences; skin necrosis or ulceration of full thickness dermis; spontaneous bleeding from involved site; skin graft indicated",
        "Grade 5": "Death",
        "description": "A finding of cutaneous inflammatory reaction occurring as a result of exposure to biologically effective levels of ionizing radiation."
    },
    {
        "MedDRA v12.0 Code": 10065961,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Esophageal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of an esophageal anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10016173,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Fall",
        "Grade 1": "Minor with no resultant injuries; intervention not indicated",
        "Grade 2": "Symptomatic; noninvasive intervention indicated",
        "Grade 3": "Hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding of sudden movement downward, usually resulting in injury."
    },
    {
        "MedDRA v12.0 Code": 10065788,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Fallopian tube anastomotic leak",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a fallopian tube anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065790,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Fallopian tube perforation",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated (e.g., organ resection)",
        "Grade 5": "Death",
        "description": "A finding of rupture of the fallopian tube wall."
    },
    {
        "MedDRA v12.0 Code": 10017076,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Fracture",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic but non-displaced; immobilization indicated",
        "Grade 3": "Severe symptoms; displaced or open wound with bone exposure; disabling; operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of traumatic injury to the bone in which the continuity of the bone is broken."
    },
    {
        "MedDRA v12.0 Code": 10065893,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Gastric anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a gastric anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065879,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Gastrointestinal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a gastrointestinal anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065712,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Gastrointestinal stoma necrosis",
        "Grade 1": null,
        "Grade 2": "Superficial necrosis; intervention not indicated",
        "Grade 3": "Severe symptoms; hospitalization or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of a necrotic process occurring in the gastrointestinal tract stoma."
    },
    {
        "MedDRA v12.0 Code": 10020100,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Hip fracture",
        "Grade 1": null,
        "Grade 2": "Hairline fracture; mild pain; limiting instrumental ADL; non-surgical intervention indicated",
        "Grade 3": "Severe pain; hospitalization or intervention indicated for pain control (e.g., traction); operative intervention indicated",
        "Grade 4": "Life-threatening consequences; symptoms associated with neurovascular compromise",
        "Grade 5": null,
        "description": "A finding of traumatic injury to the hip in which the continuity of either the femoral head, femoral neck, intertrochanteric or subtrochanteric regions is broken. "
    },
    {
        "MedDRA v12.0 Code": 10022161,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Injury to carotid artery",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Severe symptoms; limiting self care ADL (e.g., transient cerebral ischemia); repair or revision indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the carotid artery."
    },
    {
        "MedDRA v12.0 Code": 10022213,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Injury to inferior vena cava",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the inferior vena cava."
    },
    {
        "MedDRA v12.0 Code": 10065849,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Injury to jugular vein",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Symptomatic limiting self care ADL; disabling; repair or revision indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the jugular vein."
    },
    {
        "MedDRA v12.0 Code": 10022356,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Injury to superior vena cava",
        "Grade 1": "Asymptomatic diagnostic finding; intervention not indicated",
        "Grade 2": "Symptomatic; repair or revision not indicated",
        "Grade 3": "Severe symptoms; limiting self care ADL; disabling; repair or revision indicated",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the superior vena cava."
    },
    {
        "MedDRA v12.0 Code": 10059095,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intestinal stoma leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage of contents from an intestinal stoma (surgically created opening on the surface of the body)."
    },
    {
        "MedDRA v12.0 Code": 10059094,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intestinal stoma obstruction",
        "Grade 1": null,
        "Grade 2": "Self-limited; intervention not indicated",
        "Grade 3": "Severe symptoms; IV fluids, tube feeding, or TPN indicated >=24 hrs; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of blockage of the normal flow of the contents of the intestinal stoma."
    },
    {
        "MedDRA v12.0 Code": 10049468,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intestinal stoma site bleeding",
        "Grade 1": "Minimal bleeding identified on clinical exam; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of blood leakage from the intestinal stoma."
    },
    {
        "MedDRA v12.0 Code": 10065826,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative arterial injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to an artery during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065831,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative breast injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the breast parenchyma during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065843,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative cardiac injury",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Primary repair of injured organ/structure indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the heart during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065844,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative ear injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection of injured organ/structure indicated; disabling (e.g., impaired hearing; impaired balance)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the ear during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065834,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative endocrine injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the endocrine gland during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065825,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative gastrointestinal injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the gastrointestinal system during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065842,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative head and neck injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the head and neck during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10055298,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative hemorrhage",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Postoperative radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of uncontrolled bleeding during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065827,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative hepatobiliary injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the hepatic parenchyma and/or biliary tract during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065829,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative musculoskeletal injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the musculoskeletal system during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065830,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative neurological injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the nervous system during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065841,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative ocular injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the eye during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065845,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative renal injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the kidney during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065840,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative reproductive tract injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the reproductive organs during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065832,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative respiratory injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the respiratory system during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065846,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative skin injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the skin during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065847,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative splenic injury",
        "Grade 1": null,
        "Grade 2": "Primary repair of injured organ/structure indicated",
        "Grade 3": "Resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the spleen during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065828,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative urinary injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to the urinary system during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065848,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Intraoperative venous injury",
        "Grade 1": "Primary repair of injured organ/structure indicated",
        "Grade 2": "Partial resection of injured organ/structure indicated",
        "Grade 3": "Complete resection or reconstruction of injured organ/structure indicated; disabling",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to a vein during a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10065803,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Kidney anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage of urine due to breakdown of a kidney anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065891,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Large intestinal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of an anastomosis (surgical connection of two separate anatomic structures) in the large intestine."
    },
    {
        "MedDRA v12.0 Code": 10050457,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Pancreatic anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a pancreatic anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065705,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Pharyngeal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a pharyngeal anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10055322,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Postoperative hemorrhage",
        "Grade 1": "Minimal bleeding identified on clinical exam; intervention not indicated",
        "Grade 2": "Moderate bleeding; radiologic, endoscopic, or operative intervention indicated",
        "Grade 3": "Transfusion indicated of >=2 units (10 cc/kg for pediatrics) pRBCs beyond protocol specification; urgent radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of bleeding occurring after a surgical procedure."
    },
    {
        "MedDRA v12.0 Code": 10056745,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Postoperative thoracic procedure complication",
        "Grade 1": null,
        "Grade 2": "Extubated within 24 - 72 hrs postoperatively",
        "Grade 3": "Extubated >72 hrs postoperatively, but before tracheostomy indicated",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A finding of a previously undocumented problem that occurs after a thoracic procedure."
    },
    {
        "MedDRA v12.0 Code": 10065745,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Prolapse of intestinal stoma",
        "Grade 1": "Asymptomatic; reducible",
        "Grade 2": "Recurrent after manual reduction; local irritation or stool leakage; difficulty to fit appliance; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; elective operative intervention indicated; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of protrusion of the intestinal stoma (surgically created opening on the surface of the body) above the abdominal surface."
    },
    {
        "MedDRA v12.0 Code": 10065822,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Prolapse of urostomy",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Local care or maintenance; minor revision indicated",
        "Grade 3": "Dysfunctional stoma; elective operative intervention or major stomal revision indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of displacement of the urostomy."
    },
    {
        "MedDRA v12.0 Code": 10037767,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Radiation recall reaction (dermatologic)",
        "Grade 1": "Faint erythema or dry desquamation",
        "Grade 2": "Moderate to brisk erythema; patchy moist desquamation, mostly confined to skin folds and creases; moderate edema",
        "Grade 3": "Moist desquamation in areas other than skin folds and creases; bleeding induced by minor trauma or abrasion",
        "Grade 4": "Life-threatening consequences; skin necrosis or ulceration of full thickness dermis; spontaneous bleeding from involved site; skin graft indicated",
        "Grade 5": "Death",
        "description": "A finding of acute skin inflammatory reaction caused by drugs, especially chemotherapeutic agents, for weeks or months following radiotherapy. The inflammatory reaction is confined to the previously irradiated skin and the symptoms disappear after the removal of the pharmaceutical agent."
    },
    {
        "MedDRA v12.0 Code": 10065894,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Rectal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a rectal anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10040102,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Seroma",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; simple aspiration indicated",
        "Grade 3": "Symptomatic, elective radiologic or operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding of tumor-like collection of serum in the tissues."
    },
    {
        "MedDRA v12.0 Code": 10065892,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Small intestinal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of an anastomosis (surgical connection of two separate anatomic structures) in the small bowel."
    },
    {
        "MedDRA v12.0 Code": 10065897,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Spermatic cord anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a spermatic cord anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10041569,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Spinal fracture",
        "Grade 1": "Mild back pain; nonprescription analgesics indicated",
        "Grade 2": "Moderate back pain; prescription analgesics indicated; limiting instrumental ADL",
        "Grade 3": "Severe back pain; hospitalization or intervention indicated for pain control (e.g., vertebroplasty); limiting self care ADL; disability",
        "Grade 4": "Life-threatening consequences; symptoms associated with neurovascular compromise",
        "Grade 5": "Death",
        "description": "A finding of traumatic injury to the spine in which the continuity of a vertebral bone is broken."
    },
    {
        "MedDRA v12.0 Code": 10065898,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Stenosis of gastrointestinal stoma",
        "Grade 1": null,
        "Grade 2": "Symptomatic; IV fluids indicated <24 hrs; manual dilation at bedside",
        "Grade 3": "Severely altered GI function; tube feeding, TPN or hospitalization indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of narrowing of the gastrointestinal stoma (surgically created opening on the surface of the body)."
    },
    {
        "MedDRA v12.0 Code": 10042127,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Stomal ulcer",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a circumscribed, inflammatory and necrotic erosive lesion on the jejunal mucosal surface close to the anastomosis site following a gastroenterostomy procedure."
    },
    {
        "MedDRA v12.0 Code": 10062548,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Tracheal hemorrhage",
        "Grade 1": "Minimal bleeding identified on clinical or diagnostic exam; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of bleeding from the trachea."
    },
    {
        "MedDRA v12.0 Code": 10044291,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Tracheal obstruction",
        "Grade 1": "Partial asymptomatic obstruction on examination (e.g., visual, radiologic or endoscopic)",
        "Grade 2": "Symptomatic (e.g., noisy airway breathing), no respiratory distress; medical intervention indicated (e.g., steroids); limiting instrumental ADL",
        "Grade 3": "Stridor; radiologic or endoscopic intervention indicated (e.g., stent, laser); limiting self care ADL",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A finding of blockage of the lumen of the trachea."
    },
    {
        "MedDRA v12.0 Code": 10065749,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Tracheostomy site bleeding",
        "Grade 1": "Minimal bleeding identified on clinical exam; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of blood leakage from the tracheostomy site."
    },
    {
        "MedDRA v12.0 Code": 10065814,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Ureteric anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a ureteral anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065815,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Urethral anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a urethral anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065882,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Urostomy leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage of contents from a urostomy."
    },
    {
        "MedDRA v12.0 Code": 10065883,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Urostomy obstruction",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; dilation or endoscopic repair or stent placement indicated",
        "Grade 3": "Altered organ function (e.g., sepsis or hydronephrosis, or renal dysfunction); elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; organ failure; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of blockage of the urostomy."
    },
    {
        "MedDRA v12.0 Code": 10065748,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Urostomy site bleeding",
        "Grade 1": "Minimal bleeding identified on clinical exam; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of bleeding from the urostomy site."
    },
    {
        "MedDRA v12.0 Code": 10065885,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Urostomy stenosis",
        "Grade 1": null,
        "Grade 2": "Symptomatic but no hydronephrosis, no sepsis or no renal dysfunction; dilation or endoscopic repair or stent placement indicated",
        "Grade 3": "Symptomatic (e.g., hydronephrosis, or renal dysfunction); elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of narrowing of the opening of a urostomy."
    },
    {
        "MedDRA v12.0 Code": 10065886,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Uterine anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a uterine anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10046810,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Uterine perforation",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the uterine wall."
    },
    {
        "MedDRA v12.0 Code": 10065887,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Vaginal anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a vaginal anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10065888,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Vas deferens anastomotic leak",
        "Grade 1": "Asymptomatic diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of leakage due to breakdown of a vas deferens anastomosis (surgical connection of two separate anatomic structures)."
    },
    {
        "MedDRA v12.0 Code": 10062169,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Vascular access complication",
        "Grade 1": null,
        "Grade 2": "Device dislodgement, blockage, leak, or malposition; device replacement indicated",
        "Grade 3": "Deep vein or cardiac thrombosis; intervention indicated (e.g., anticoagulation, lysis, filter, invasive procedure)",
        "Grade 4": "Embolic event including pulmonary embolism or life-threatening thrombus",
        "Grade 5": "Death",
        "description": "A finding of a previously undocumented problem related to the vascular access site."
    },
    {
        "MedDRA v12.0 Code": 10047228,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Venous injury",
        "Grade 1": "Asymptomatic diagnostic finding; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., claudication); repair or revision not indicated",
        "Grade 3": "Severe symptoms; limiting self care ADL; repair or revision indicated; disabling",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A finding of damage to a vein."
    },
    {
        "MedDRA v12.0 Code": 10053692,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Wound complication",
        "Grade 1": "Incisional separation of <=25% of wound, no deeper than superficial fascia",
        "Grade 2": "Incisional separation >25% of wound; local care indicated",
        "Grade 3": "Hernia without evidence of strangulation; fascial disruption/dehiscence; primary wound closure or revision by operative intervention indicated",
        "Grade 4": "Hernia with evidence of strangulation; major reconstruction flap, grafting, resection, or amputation indicated",
        "Grade 5": "Death",
        "description": "A finding of development of a new problem at the site of an existing wound."
    },
    {
        "MedDRA v12.0 Code": 10048031,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Wound dehiscence",
        "Grade 1": "Incisional separation of <=25% of wound, no deeper than superficial fascia",
        "Grade 2": "Incisional separation >25% of wound with local care; asymptomatic hernia or symptomatic hernia without evidence of strangulation",
        "Grade 3": "Fascial disruption or dehiscence without evisceration; primary wound closure or revision by operative intervention indicated",
        "Grade 4": "Life-threatening consequences; symptomatic hernia with evidence of strangulation; fascial disruption with evisceration; major reconstruction flap, grafting, resection, or amputation indicated",
        "Grade 5": "Death",
        "description": "A finding of separation of the approximated margins of a surgical wound."
    },
    {
        "MedDRA v12.0 Code": 10048049,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Wrist fracture",
        "Grade 1": "Mild; non-surgical intervention indicated",
        "Grade 2": "Limiting instrumental ADL; operative intervention indicated",
        "Grade 3": "Limiting self care ADL; elective surgery indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding of traumatic injury to the wrist joint in which the continuity of a wrist bone is broken."
    },
    {
        "MedDRA v12.0 Code": 10022117,
        "SOC": "Injury, poisoning and procedural complications",
        "name": "Injury, poisoning and procedural complications - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10000636,
        "SOC": "Investigations",
        "name": "Activated partial thromboplastin time prolonged",
        "Grade 1": ">ULN - 1.5 x ULN",
        "Grade 2": ">1.5 - 2.5 x ULN",
        "Grade 3": ">2.5 x ULN; hemorrhage",
        "Grade 4": null,
        "Grade 5": null,
        "description": "An abnormal laboratory test result in which the partial thromboplastin time is found to be greater than the control value. As a possible indicator of coagulopathy, a prolonged partial thromboplastin time (PTT) may occur in a variety of diseases and disorders, both primary and related to treatment."
    },
    {
        "MedDRA v12.0 Code": 10001551,
        "SOC": "Investigations",
        "name": "Alanine aminotransferase increased",
        "Grade 1": ">ULN - 3.0 x ULN",
        "Grade 2": ">3.0 - 5.0 x ULN",
        "Grade 3": ">5.0 - 20.0 x ULN",
        "Grade 4": ">20.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the level of alanine aminotransferase (ALT or SGPT) in the blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10001675,
        "SOC": "Investigations",
        "name": "Alkaline phosphatase increased",
        "Grade 1": ">ULN - 2.5 x ULN",
        "Grade 2": ">2.5 - 5.0 x ULN",
        "Grade 3": ">5.0 - 20.0 x ULN",
        "Grade 4": ">20.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the level of alkaline phosphatase in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10003481,
        "SOC": "Investigations",
        "name": "Aspartate aminotransferase increased",
        "Grade 1": ">ULN - 3.0 x ULN",
        "Grade 2": ">3.0 - 5.0 x ULN",
        "Grade 3": ">5.0 - 20.0 x ULN",
        "Grade 4": ">20.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the level of aspartate aminotransferase (AST or SGOT) in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10005332,
        "SOC": "Investigations",
        "name": "Blood antidiuretic hormone abnormal",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate abnormal levels of antidiuretic hormone in the blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10005364,
        "SOC": "Investigations",
        "name": "Blood bilirubin increased",
        "Grade 1": ">ULN - 1.5 x ULN",
        "Grade 2": ">1.5 - 3.0 x ULN",
        "Grade 3": ">3.0 - 10.0 x ULN",
        "Grade 4": ">10.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an abnormally high level of bilirubin in the blood. Excess bilirubin is associated with jaundice."
    },
    {
        "MedDRA v12.0 Code": 10005452,
        "SOC": "Investigations",
        "name": "Blood corticotrophin decreased",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in levels of corticotrophin in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10005561,
        "SOC": "Investigations",
        "name": "Blood gonadotrophin abnormal",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate abnormal levels of gonadotrophin hormone in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10005778,
        "SOC": "Investigations",
        "name": "Blood prolactin abnormal",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate abnormal levels of prolactin hormone in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10065906,
        "SOC": "Investigations",
        "name": "Carbon monoxide diffusing capacity decreased",
        "Grade 1": "3 - 5 units below LLN; for follow-up, a decrease of 3 - 5 units (ml/min/mm Hg) below the baseline value",
        "Grade 2": "6 - 8 units below LLN; for follow-up, an asymptomatic decrease of >5 - 8 units (ml/min/mm Hg) below the baseline value",
        "Grade 3": "Asymptomatic decrease  of >8 units drop;  >5 units drop along with the presence of pulmonary symptoms (e.g. , >Grade 2  hypoxia or >Grade 2 or higher dyspnea)",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on lung function test results that indicate  a decrease in the lung capacity to absorb carbon monoxide."
    },
    {
        "MedDRA v12.0 Code": 10007612,
        "SOC": "Investigations",
        "name": "Cardiac troponin I increased",
        "Grade 1": "Levels above the upper limit of normal and below the level of myocardial infarction as defined by the manufacturer",
        "Grade 2": null,
        "Grade 3": "Levels consistent with myocardial infarction as defined by the manufacturer",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A laboratory test result which indicates increased levels of cardiac troponin I in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10007613,
        "SOC": "Investigations",
        "name": "Cardiac troponin T increased",
        "Grade 1": "Levels above the upper limit of normal and below the level of myocardial infarction as defined by the manufacturer",
        "Grade 2": null,
        "Grade 3": "Levels consistent with myocardial infarction as defined by the manufacturer",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A laboratory test result which indicates increased levels of cardiac troponin T in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10007839,
        "SOC": "Investigations",
        "name": "CD4 lymphocytes decreased",
        "Grade 1": "<LLN - 500/mm3;  <LLN - 0.5 x 10e9 /L",
        "Grade 2": "<500 - 200/mm3; <0.5 - 0.2 x 10e9 /L",
        "Grade 3": "<200 - 50/mm3; <0.2 x 0.05 - 10e9 /L",
        "Grade 4": "<50/mm3; <0.05 x 10e9 /L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in levels of CD4 lymphocytes in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10008661,
        "SOC": "Investigations",
        "name": "Cholesterol high",
        "Grade 1": ">ULN - 300 mg/dL; >ULN - 7.75 mmol/L",
        "Grade 2": ">300 - 400 mg/dL; >7.75 - 10.34 mmol/L",
        "Grade 3": ">400 - 500 mg/dL; >10.34 - 12.92 mmol/L",
        "Grade 4": ">500 mg/dL; >12.92 mmol/L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate higher than normal levels of cholesterol in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10011268,
        "SOC": "Investigations",
        "name": "CPK increased",
        "Grade 1": ">ULN - 2.5 x ULN",
        "Grade 2": ">2.5 x ULN - 5 x ULN",
        "Grade 3": ">5 x ULN - 10 x ULN",
        "Grade 4": ">10 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in levels of creatine phosphokinase in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10011368,
        "SOC": "Investigations",
        "name": "Creatinine increased",
        "Grade 1": ">1 - 1.5 x baseline; >ULN - 1.5 x ULN",
        "Grade 2": ">1.5 - 3.0 x baseline; >1.5 - 3.0 x ULN",
        "Grade 3": ">3.0 baseline; >3.0 - 6.0 x ULN",
        "Grade 4": ">6.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate increased levels of creatinine in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10050528,
        "SOC": "Investigations",
        "name": "Ejection fraction decreased",
        "Grade 1": null,
        "Grade 2": "Resting ejection fraction (EF) 50 - 40%; 10 - 19% drop from baseline",
        "Grade 3": "Resting ejection fraction (EF) 39 - 20%; >20% drop from baseline",
        "Grade 4": "Resting ejection fraction (EF) <20%",
        "Grade 5": null,
        "description": "The percentage computed when the amount of blood ejected during a ventricular contraction of the heart is compared to the amount that was present prior to the contraction."
    },
    {
        "MedDRA v12.0 Code": 10014383,
        "SOC": "Investigations",
        "name": "Electrocardiogram QT corrected interval prolonged",
        "Grade 1": "QTc 450 - 480 ms",
        "Grade 2": "QTc 481 - 500 ms",
        "Grade 3": "QTc >= 501 ms on at least two separate ECGs",
        "Grade 4": "QTc >= 501 or >60 ms change from baseline and Torsade de pointes or polymorphic ventricular tachycardia or signs/symptoms of serious arrhythmia",
        "Grade 5": null,
        "description": "A finding of a cardiac dysrhythmia characterized by an abnormally long corrected QT interval."
    },
    {
        "MedDRA v12.0 Code": 10016596,
        "SOC": "Investigations",
        "name": "Fibrinogen decreased",
        "Grade 1": "<1.0 - 0.75 x LLN  or <25% decrease from baseline",
        "Grade 2": "<0.75 - 0.5 x LLN or 25 - <50% decrease from baseline",
        "Grade 3": "<0.5 - 0.25 x LLN or 50 - <75% decrease from baseline",
        "Grade 4": "<0.25 x LLN  or 75% decrease from baseline or absolute value <50 mg/dL",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in levels of fibrinogen in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10016987,
        "SOC": "Investigations",
        "name": "Forced expiratory volume decreased",
        "Grade 1": "FEV1% (percentages of observed FEV1 and FVC related to their respective predicted values)  99 - 70% predicted",
        "Grade 2": "FEV1 60 - 69%",
        "Grade 3": "50 - 59%",
        "Grade 4": "<= 49%",
        "Grade 5": null,
        "description": "A finding based on test results that indicate a relative decrease in the fraction of the forced vital capacity that is exhaled in a specific number of seconds."
    },
    {
        "MedDRA v12.0 Code": 10056910,
        "SOC": "Investigations",
        "name": "GGT increased",
        "Grade 1": ">ULN - 2.5 x ULN",
        "Grade 2": ">2.5 - 5.0 x ULN",
        "Grade 3": ">5.0 - 20.0 x ULN",
        "Grade 4": ">20.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate higher than normal levels of the enzyme gamma-glutamyltransferase in the blood specimen. GGT (gamma-glutamyltransferase ) catalyzes the transfer of a gamma glutamyl group from a gamma glutamyl peptide to another peptide, amino acids or water."
    },
    {
        "MedDRA v12.0 Code": 10018748,
        "SOC": "Investigations",
        "name": "Growth hormone abnormal",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate abnormal levels of growth hormone in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10019150,
        "SOC": "Investigations",
        "name": "Haptoglobin decreased",
        "Grade 1": "<LLN",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in levels of haptoglobin in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10055599,
        "SOC": "Investigations",
        "name": "Hemoglobin increased",
        "Grade 1": "Increase in >0 - 2 gm/dL above ULN or above baseline if baseline is above ULN",
        "Grade 2": "Increase in >2 - 4 gm/dL above ULN or above baseline if baseline is above ULN",
        "Grade 3": "Increase in >4 gm/dL above ULN or above baseline if baseline is above ULN",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate increased levels of hemoglobin in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10022402,
        "SOC": "Investigations",
        "name": "INR increased",
        "Grade 1": ">1 - 1.5 x ULN; >1 - 1.5 times above baseline if on anticoagulation",
        "Grade 2": ">1.5 - 2.5 x ULN; >1.5 - 2.5 times above baseline if on anticoagulation",
        "Grade 3": ">2.5 x ULN; >2.5 times above baseline if on anticoagulation",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the ratio of the patient's prothrombin time to a control sample in the blood."
    },
    {
        "MedDRA v12.0 Code": 10024574,
        "SOC": "Investigations",
        "name": "Lipase increased",
        "Grade 1": ">ULN - 1.5 x ULN",
        "Grade 2": ">1.5 - 2.0 x ULN",
        "Grade 3": ">2.0 - 5.0 x ULN",
        "Grade 4": ">5.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the level of lipase in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10025256,
        "SOC": "Investigations",
        "name": "Lymphocyte count decreased",
        "Grade 1": "<LLN - 800/mm3;  <LLN - 0.8 x 10e9/L",
        "Grade 2": "<800 - 500/mm3; <0.8 - 0.5 x 10e9 /L",
        "Grade 3": "<500 - 200/mm3; <0.5 - 0.2 x 10e9 /L",
        "Grade 4": "<200/mm3; <0.2 x 10e9 /L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate a decrease in number of lymphocytes in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10025258,
        "SOC": "Investigations",
        "name": "Lymphocyte count increased",
        "Grade 1": null,
        "Grade 2": ">4000/mm3 - 20,000/mm3",
        "Grade 3": ">20,000/mm3",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an abnormal increase in the number of lymphocytes in the blood, effusions or bone marrow."
    },
    {
        "MedDRA v12.0 Code": 10029366,
        "SOC": "Investigations",
        "name": "Neutrophil count decreased",
        "Grade 1": "<LLN - 1500/mm3; <LLN - 1.5 x 10e9 /L",
        "Grade 2": "<1500 - 1000/mm3; <1.5 - 1.0 x 10e9 /L",
        "Grade 3": "<1000 - 500/mm3; <1.0 - 0.5 x 10e9 /L",
        "Grade 4": "<500/mm3; <0.5 x 10e9 /L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate a decrease in number of neutrophils in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10062646,
        "SOC": "Investigations",
        "name": "Pancreatic enzymes decreased",
        "Grade 1": "<LLN and asymptomatic",
        "Grade 2": "Increase in stool frequency, bulk, or odor; steatorrhea",
        "Grade 3": "Sequelae of absorption deficiency",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in levels of pancreatic enzymes in a biological specimen."
    },
    {
        "MedDRA v12.0 Code": 10035528,
        "SOC": "Investigations",
        "name": "Platelet count decreased",
        "Grade 1": "<LLN - 75,000/mm3; <LLN - 75.0 x 10e9 /L",
        "Grade 2": "<75,000 - 50,000/mm3; <75.0 - 50.0 x 10e9 /L",
        "Grade 3": "<50,000 - 25,000/mm3; <50.0 - 25.0 x 10e9 /L",
        "Grade 4": "<25,000/mm3; <25.0 x 10e9 /L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate a decrease in number of platelets in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10040139,
        "SOC": "Investigations",
        "name": "Serum amylase increased",
        "Grade 1": ">ULN - 1.5 x ULN",
        "Grade 2": ">1.5 - 2.0 x ULN",
        "Grade 3": ">2.0 - 5.0 x ULN",
        "Grade 4": ">5.0 x ULN",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an increase in the levels of amylase in a serum specimen."
    },
    {
        "MedDRA v12.0 Code": 10059895,
        "SOC": "Investigations",
        "name": "Urine output decreased",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Oliguria (<80 ml in 8 hr)",
        "Grade 4": "Anuria (<240 ml in 24 hr)",
        "Grade 5": null,
        "description": "A finding based on test results that indicate urine production is less relative to previous output."
    },
    {
        "MedDRA v12.0 Code": 10047580,
        "SOC": "Investigations",
        "name": "Vital capacity abnormal",
        "Grade 1": "90 - 75% of predicted value",
        "Grade 2": "<75 - 50% of predicted value; limiting instrumental ADL",
        "Grade 3": "<50% of predicted value; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding based on pulmonary function test results that indicate an abnormal vital capacity (amount of exhaled after a maximum inhalation) when compared to the predicted value."
    },
    {
        "MedDRA v12.0 Code": 10047896,
        "SOC": "Investigations",
        "name": "Weight gain",
        "Grade 1": "5 - <10% from baseline",
        "Grade 2": "10 - <20% from baseline",
        "Grade 3": ">=20% from baseline",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding characterized by an increase in overall body weight; for pediatrics, greater than the baseline growth curve."
    },
    {
        "MedDRA v12.0 Code": 10047900,
        "SOC": "Investigations",
        "name": "Weight loss",
        "Grade 1": "5 to <10% from baseline; intervention not indicated",
        "Grade 2": "10 - <20% from baseline; nutritional support indicated",
        "Grade 3": ">=20% from baseline; tube feeding or TPN indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A finding characterized by a decrease in overall body weight; for pediatrics, less than the baseline growth curve."
    },
    {
        "MedDRA v12.0 Code": 10049182,
        "SOC": "Investigations",
        "name": "White blood cell decreased",
        "Grade 1": "<LLN - 3000/mm3; <LLN - 3.0 x 10e9 /L",
        "Grade 2": "<3000 - 2000/mm3; <3.0 - 2.0 x 10e9 /L",
        "Grade 3": "<2000 - 1000/mm3; <2.0 - 1.0 x 10e9 /L",
        "Grade 4": "<1000/mm3; <1.0 x 10e9 /L",
        "Grade 5": null,
        "description": "A finding based on laboratory test results that indicate an decrease in number of white blood cells in a blood specimen."
    },
    {
        "MedDRA v12.0 Code": 10022891,
        "SOC": "Investigations",
        "name": "Investigations - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10000486,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Acidosis",
        "Grade 1": "pH <normal, but >=7.3",
        "Grade 2": null,
        "Grade 3": "pH <7.3",
        "Grade 4": "Life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by abnormally high acidity (high hydrogen-ion concentration) of the blood and other body tissues."
    },
    {
        "MedDRA v12.0 Code": 10001598,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Alcohol intolerance",
        "Grade 1": null,
        "Grade 2": "Present",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in sensitivity to the adverse effects of alcohol, which can include nasal congestion, skin flushes, heart dysrhythmias, nausea, vomiting, indigestion and headaches."
    },
    {
        "MedDRA v12.0 Code": 10001680,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Alkalosis",
        "Grade 1": "pH >normal, but <=7.5",
        "Grade 2": null,
        "Grade 3": "pH >7.5",
        "Grade 4": "Life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by abnormally high alkalinity (low hydrogen-ion concentration) of the blood and other body tissues."
    },
    {
        "MedDRA v12.0 Code": 10002646,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Anorexia",
        "Grade 1": "Loss of appetite without alteration in eating habits",
        "Grade 2": "Oral intake altered without significant weight loss or malnutrition; oral nutritional supplements indicated",
        "Grade 3": "Associated with significant weight loss or malnutrition (e.g., inadequate oral caloric and/or fluid intake); tube feeding or TPN indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a loss of appetite."
    },
    {
        "MedDRA v12.0 Code": 10012174,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Dehydration",
        "Grade 1": "Increased oral fluids indicated; dry mucous membranes; diminished skin turgor",
        "Grade 2": "IV fluids indicated <24 hrs",
        "Grade 3": "IV fluids or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by excessive loss of water from the body. It is usually caused by severe diarrhea, vomiting or diaphoresis."
    },
    {
        "MedDRA v12.0 Code": 10052426,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Glucose intolerance",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; dietary modification or oral agent indicated",
        "Grade 3": "Severe symptoms; insulin indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inability to properly metabolize glucose."
    },
    {
        "MedDRA v12.0 Code": 10020587,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypercalcemia",
        "Grade 1": "Corrected serum calcium of >ULN - 11.5 mg/dL; >ULN - 2.9 mmol/L;  Ionized calcium  >ULN - 1.5 mmol/L",
        "Grade 2": "Corrected serum calcium of >11.5 - 12.5 mg/dL; >2.9 - 3.1 mmol/L;  Ionized calcium >1.5 - 1.6 mmol/L; symptomatic",
        "Grade 3": "Corrected serum calcium of >12.5 - 13.5 mg/dL;>3.1 - 3.4 mmol/L;  Ionized calcium  >1.6 - 1.8 mmol/L; hospitalization indicated",
        "Grade 4": "Corrected serum calcium of >13.5 mg/dL; >3.4 mmol/L;  Ionized calcium  >1.8 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of calcium (corrected for albumin) in blood."
    },
    {
        "MedDRA v12.0 Code": 10020639,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hyperglycemia",
        "Grade 1": "Fasting glucose value >ULN - 160 mg/dL; Fasting glucose value >ULN - 8.9 mmol/L",
        "Grade 2": "Fasting glucose value >160 - 250 mg/dL; Fasting glucose value >8.9 - 13.9 mmol/L",
        "Grade 3": ">250 - 500 mg/dL; >13.9 - 27.8 mmol/L; hospitalization indicated",
        "Grade 4": ">500 mg/dL; >27.8 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of blood sugar. It is usually an indication of diabetes mellitus or glucose intolerance."
    },
    {
        "MedDRA v12.0 Code": 10020647,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hyperkalemia",
        "Grade 1": ">ULN - 5.5 mmol/L",
        "Grade 2": ">5.5 - 6.0 mmol/L",
        "Grade 3": ">6.0 - 7.0 mmol/L; hospitalization indicated",
        "Grade 4": ">7.0 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of potassium in the blood; associated with kidney failure or sometimes with the use of diuretic drugs."
    },
    {
        "MedDRA v12.0 Code": 10020670,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypermagnesemia",
        "Grade 1": ">ULN - 3.0 mg/dL; >ULN - 1.23 mmol/L",
        "Grade 2": null,
        "Grade 3": ">3.0 - 8.0 mg/dL; >1.23 - 3.30 mmol/L",
        "Grade 4": ">8.0 mg/dL; >3.30 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of magnesium in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10020680,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypernatremia",
        "Grade 1": ">ULN - 150 mmol/L",
        "Grade 2": ">150 - 155 mmol/L",
        "Grade 3": ">155 - 160 mmol/L; hospitalization indicated",
        "Grade 4": ">160 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of sodium in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10020870,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypertriglyceridemia",
        "Grade 1": "150 mg/dL - 300 mg/dL; 1.71 mmol/L - 3.42 mmol/L",
        "Grade 2": ">300 mg/dL - 500 mg/dL;  >3.42 mmol/L - 5.7 mmol/L",
        "Grade 3": ">500 mg/dL - 1000 mg/dL;  >5.7 mmol/L - 11.4 mmol/L",
        "Grade 4": ">1000 mg/dL; >11.4 mmol/L;  life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of triglyceride concentration in the blood."
    },
    {
        "MedDRA v12.0 Code": 10020907,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hyperuricemia",
        "Grade 1": ">ULN - 10 mg/dL (0.59 mmol/L) without physiologic consequences",
        "Grade 2": null,
        "Grade 3": ">ULN - 10 mg/dL (0.59 mmol/L) with physiologic consequences",
        "Grade 4": ">10 mg/dL; >0.59 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate an elevation in the concentration of uric acid."
    },
    {
        "MedDRA v12.0 Code": 10020943,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypoalbuminemia",
        "Grade 1": "<LLN - 3 g/dL; <LLN - 30 g/L",
        "Grade 2": "<3 - 2 g/dL; <30 - 20 g/L",
        "Grade 3": "<2 g/dL; <20 g/L",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of albumin in the blood."
    },
    {
        "MedDRA v12.0 Code": 10020949,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypocalcemia",
        "Grade 1": "Corrected serum calcium of <LLN - 8.0 mg/dL; <LLN - 2.0 mmol/L; Ionized calcium  <LLN - 1.0 mmol/L",
        "Grade 2": "Corrected serum calcium of <8.0 - 7.0 mg/dL; <2.0 - 1.75 mmol/L; Ionized calcium  <1.0 - 0.9 mmol/L; symptomatic",
        "Grade 3": "Corrected serum calcium of <7.0 - 6.0 mg/dL; <1.75 - 1.5 mmol/L;  Ionized calcium  <0.9 - 0.8 mmol/L; hospitalization indicated",
        "Grade 4": "Corrected serum calcium of  <6.0 mg/dL; <1.5 mmol/L;  Ionized calcium  <0.8 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of calcium (corrected for albumin) in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10021005,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypoglycemia",
        "Grade 1": "<LLN - 55 mg/dL; <LLN - 3.0 mmol/L",
        "Grade 2": "<55 - 40 mg/dL; <3.0 - 2.2 mmol/L",
        "Grade 3": "<40 - 30 mg/dL; <2.2 - 1.7 mmol/L",
        "Grade 4": "<30 mg/dL; <1.7 mmol/L; life-threatening consequences; seizures",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of glucose in the blood."
    },
    {
        "MedDRA v12.0 Code": 10021018,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypokalemia",
        "Grade 1": "<LLN - 3.0 mmol/L",
        "Grade 2": "<LLN - 3.0 mmol/L; symptomatic; intervention indicated",
        "Grade 3": "<3.0 - 2.5 mmol/L; hospitalization indicated",
        "Grade 4": "<2.5 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of potassium in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10021028,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypomagnesemia",
        "Grade 1": "<LLN - 1.2 mg/dL; <LLN - 0.5 mmol/L",
        "Grade 2": "<1.2 - 0.9 mg/dL; <0.5 - 0.4 mmol/L",
        "Grade 3": "<0.9 - 0.7 mg/dL; <0.4 - 0.3 mmol/L",
        "Grade 4": "<0.7 mg/dL; <0.3 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of magnesium in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10021038,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hyponatremia",
        "Grade 1": "<LLN - 130 mmol/L",
        "Grade 2": null,
        "Grade 3": "<130 - 120 mmol/L",
        "Grade 4": "<120 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of sodium in the blood."
    },
    {
        "MedDRA v12.0 Code": 10021059,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Hypophosphatemia",
        "Grade 1": "<LLN - 2.5 mg/dL; <LLN - 0.8 mmol/L",
        "Grade 2": "<2.5 - 2.0 mg/dL; <0.8 - 0.6 mmol/L",
        "Grade 3": "<2.0 - 1.0 mg/dL; <0.6 - 0.3 mmol/L",
        "Grade 4": "<1.0 mg/dL; <0.3 mmol/L; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate a low concentration of phosphates in the  blood."
    },
    {
        "MedDRA v12.0 Code": 10065973,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Iron overload",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; intervention not indicated",
        "Grade 3": "Severe symptoms; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by accumulation of iron in the tissues."
    },
    {
        "MedDRA v12.0 Code": 10029883,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Obesity",
        "Grade 1": null,
        "Grade 2": "BMI 25 - 29.9 kg/m2",
        "Grade 3": "BMI 30 - 39.9 kg/m2",
        "Grade 4": "BMI >=40 kg/m2",
        "Grade 5": null,
        "description": "A disorder characterized by having a high amount of body fat."
    },
    {
        "MedDRA v12.0 Code": 10045152,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Tumor lysis syndrome",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Present",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by metabolic abnormalities that result from a spontaneous or therapy-related cytolysis of tumor cells."
    },
    {
        "MedDRA v12.0 Code": 10027433,
        "SOC": "Metabolism and nutrition disorders",
        "name": "Metabolism and nutrition disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10065775,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Abdominal soft tissue necrosis",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g. tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the abdominal wall."
    },
    {
        "MedDRA v12.0 Code": 10003239,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Arthralgia",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in a joint."
    },
    {
        "MedDRA v12.0 Code": 10003246,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Arthritis",
        "Grade 1": "Mild pain with inflammation, erythema, or joint swelling",
        "Grade 2": "Moderate pain associated with signs of inflammation, erythema, or joint swelling; limiting instrumental ADL",
        "Grade 3": "Severe pain associated with signs of inflammation, erythema, or joint swelling; irreversible joint damage; disabling; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inflammation involving a joint."
    },
    {
        "MedDRA v12.0 Code": 10066480,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Avascular necrosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by necrotic changes in the bone tissue due to interruption of blood supply. Most often affecting the epiphysis of the long bones, the necrotic changes result in the collapse and the destruction of the bone structure."
    },
    {
        "MedDRA v12.0 Code": 10003988,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Back pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the back region."
    },
    {
        "MedDRA v12.0 Code": 10006002,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Bone pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the bones."
    },
    {
        "MedDRA v12.0 Code": 10048677,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Buttock pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the buttocks."
    },
    {
        "MedDRA v12.0 Code": 10008496,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Chest wall pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the chest wall region."
    },
    {
        "MedDRA v12.0 Code": 10015688,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Exostosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by non-neoplastic overgrowth of bone."
    },
    {
        "MedDRA v12.0 Code": 10065799,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Fibrosis deep connective tissue",
        "Grade 1": "Mild induration, able to move skin parallel to plane (sliding) and perpendicular to skin (pinching up)",
        "Grade 2": "Moderate induration, able to slide skin, unable to pinch skin; limiting instrumental ADL",
        "Grade 3": "Severe induration; unable to slide or pinch skin; limiting joint or orifice movement (e.g. mouth, anus); limiting self care ADL",
        "Grade 4": "Generalized; associated with signs or symptoms of impaired breathing or feeding",
        "Grade 5": "Death",
        "description": "A disorder characterized by fibrotic degeneration of the deep connective tissues."
    },
    {
        "MedDRA v12.0 Code": 10016750,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Flank pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation on the lateral side of the body in the region below the ribs and above the hip."
    },
    {
        "MedDRA v12.0 Code": 10062572,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Generalized muscle weakness",
        "Grade 1": "Symptomatic; weakness perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; weakness evident on physical exam; weakness limiting instrumental ADL",
        "Grade 3": "Weakness limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of muscles in multiple anatomic sites."
    },
    {
        "MedDRA v12.0 Code": 10018761,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Growth suppression",
        "Grade 1": "Reduction in growth velocity by 10 - 29% ideally measured over the period of a year",
        "Grade 2": "Reduction in growth velocity by 30 - 49% ideally measured over the period of a year or 0 - 49% reduction in growth from the baseline growth curve",
        "Grade 3": "Reduction in growth velocity of >=50% ideally measured over the period of a year",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by of stature that is smaller than normal as expected for age."
    },
    {
        "MedDRA v12.0 Code": 10065779,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Head soft tissue necrosis",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g., tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the head."
    },
    {
        "MedDRA v12.0 Code": 10023215,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Joint effusion",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; elective operative intervention indicated; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by excessive fluid in a joint, usually as a result of joint inflammation."
    },
    {
        "MedDRA v12.0 Code": 10048706,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Joint range of motion decreased",
        "Grade 1": "<=25% loss of ROM (range of motion); decreased ROM limiting athletic activity",
        "Grade 2": ">25 - 50% decrease in ROM; limiting instrumental ADL",
        "Grade 3": ">50% decrease in ROM; limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in joint flexibility of any joint."
    },
    {
        "MedDRA v12.0 Code": 10065796,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Joint range of motion decreased cervical spine",
        "Grade 1": "Mild restriction of rotation or flexion between 60 - 70 degrees",
        "Grade 2": "Rotation <60 degrees to right or left; <60 degrees of flexion",
        "Grade 3": "Ankylosed/fused over multiple segments with no C-spine rotation",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in flexibility of a cervical spine joint."
    },
    {
        "MedDRA v12.0 Code": 10065800,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Joint range of motion decreased lumbar spine",
        "Grade 1": "Stiffness; difficulty bending to the floor to pick up a very light object but able to do athletic activity",
        "Grade 2": "Pain with range of motion (ROM) in lumbar spine; requires a reaching aid to pick up a very light object from the floor",
        "Grade 3": "<50% lumbar spine flexion; associated with symptoms of ankylosis or fused over multiple segments with no L-spine flexion (e.g., unable to reach to floor to pick up a very light object)",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in flexibility of a lumbar spine joint."
    },
    {
        "MedDRA v12.0 Code": 10023509,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Kyphosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate accentuation; limiting instrumental ADL",
        "Grade 3": "Severe accentuation; operative intervention indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an abnormal increase in the curvature of the thoracic portion of the spine."
    },
    {
        "MedDRA v12.0 Code": 10024842,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Lordosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate accentuation; limiting instrumental ADL",
        "Grade 3": "Severe accentuation; operative intervention indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an abnormal increase in the curvature of the lumbar portion of the spine."
    },
    {
        "MedDRA v12.0 Code": 10065780,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Muscle weakness left-sided",
        "Grade 1": "Symptomatic; perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; evident on physical exam; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the muscles on the left side of the body."
    },
    {
        "MedDRA v12.0 Code": 10065776,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Muscle weakness lower limb",
        "Grade 1": "Symptomatic; perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; evident on physical exam; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the lower limb muscles."
    },
    {
        "MedDRA v12.0 Code": 10065794,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Muscle weakness right-sided",
        "Grade 1": "Symptomatic; perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; evident on physical exam; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the muscles on the right side of the body."
    },
    {
        "MedDRA v12.0 Code": 10065795,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Muscle weakness trunk",
        "Grade 1": "Symptomatic; perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; evident on physical exam; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the trunk muscles."
    },
    {
        "MedDRA v12.0 Code": 10065895,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Muscle weakness upper limb",
        "Grade 1": "Symptomatic; perceived by patient but not evident on physical exam",
        "Grade 2": "Symptomatic; evident on physical exam; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the upper limb muscles."
    },
    {
        "MedDRA v12.0 Code": 10065783,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Musculoskeletal deformity",
        "Grade 1": "Cosmetically and functionally insignificant hypoplasia",
        "Grade 2": "Deformity, hypoplasia, or asymmetry able to be remediated by prosthesis (e.g., shoe insert) or covered by clothing",
        "Grade 3": "Significant deformity, hypoplasia, or asymmetry, unable to be remediated by prosthesis or covered by clothing; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by of a malformation of the musculoskeletal system."
    },
    {
        "MedDRA v12.0 Code": 10028411,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Myalgia",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation originating from a muscle or group of muscles."
    },
    {
        "MedDRA v12.0 Code": 10028653,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Myositis",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain associated with weakness; pain limiting instrumental ADL",
        "Grade 3": "Pain associated with severe weakness; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inflammation involving the skeletal muscles."
    },
    {
        "MedDRA v12.0 Code": 10028836,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Neck pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the neck area."
    },
    {
        "MedDRA v12.0 Code": 10065781,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Neck soft tissue necrosis",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g., tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the neck."
    },
    {
        "MedDRA v12.0 Code": 10064658,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Osteonecrosis of jaw",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated (e.g., topical agents); limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the bone of the mandible."
    },
    {
        "MedDRA v12.0 Code": 10031282,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Osteoporosis",
        "Grade 1": "Radiologic evidence of osteoporosis or Bone Mineral Density (BMD) t-score -1 to -2.5 (osteopenia); no loss of height or intervention indicated",
        "Grade 2": "BMD t-score <-2.5; loss of height <2 cm; anti-osteoporotic therapy indicated; limiting instrumental ADL",
        "Grade 3": "Loss of height >=2 cm; hospitalization indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by reduced bone mass, with a decrease in cortical thickness and in the number and size of the trabeculae of cancellous bone (but normal chemical composition), resulting in increased fracture incidence."
    },
    {
        "MedDRA v12.0 Code": 10033425,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Pain in extremity",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the upper or lower extremities."
    },
    {
        "MedDRA v12.0 Code": 10065793,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Pelvic soft tissue necrosis",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g., tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the pelvis."
    },
    {
        "MedDRA v12.0 Code": 10039722,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Scoliosis",
        "Grade 1": "<20 degrees; clinically undetectable",
        "Grade 2": ">20 - 45 degrees; visible by forward flexion; limiting instrumental ADL",
        "Grade 3": ">45 degrees; scapular prominence in forward flexion; operative intervention indicated; limiting self care ADL; disabling",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a malformed, lateral curvature of the spine."
    },
    {
        "MedDRA v12.0 Code": 10065777,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Soft tissue necrosis lower limb",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g., tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the lower extremity."
    },
    {
        "MedDRA v12.0 Code": 10065778,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Soft tissue necrosis upper limb",
        "Grade 1": null,
        "Grade 2": "Local wound care; medical intervention indicated (e.g., dressings or topical medications)",
        "Grade 3": "Operative debridement or other invasive intervention indicated (e.g., tissue reconstruction, flap or grafting)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the soft tissues of the upper extremity."
    },
    {
        "MedDRA v12.0 Code": 10065798,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Superficial soft tissue fibrosis",
        "Grade 1": "Mild induration, able to move skin parallel to plane (sliding) and perpendicular to skin (pinching up)",
        "Grade 2": "Moderate induration, able to slide skin, unable to pinch skin; limiting instrumental ADL",
        "Grade 3": "Severe induration; unable to slide or pinch skin; limiting joint or orifice movement (e.g., mouth, anus); limiting self care ADL",
        "Grade 4": "Generalized; associated with signs or symptoms of impaired breathing or feeding",
        "Grade 5": "Death",
        "description": "A disorder characterized by fibrotic degeneration of the superficial soft tissues."
    },
    {
        "MedDRA v12.0 Code": 10044684,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Trismus",
        "Grade 1": "Decreased ROM (range of motion) without impaired eating",
        "Grade 2": "Decreased ROM requiring small bites, soft foods or purees",
        "Grade 3": "Decreased ROM with inability to adequately aliment or hydrate orally",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by lack of ability to open the mouth fully due to a decrease in the range of motion of the muscles of mastication."
    },
    {
        "MedDRA v12.0 Code": 10065738,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Unequal limb length",
        "Grade 1": "Mild length discrepancy <2 cm",
        "Grade 2": "Moderate length discrepancy 2 - 5 cm; shoe lift indicated; limiting instrumental ADL",
        "Grade 3": "Severe length discrepancy >5 cm; limiting self care ADL; disabling; operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by of a discrepancy between the lengths of the lower or upper extremities."
    },
    {
        "MedDRA v12.0 Code": 10028395,
        "SOC": "Musculoskeletal and connective tissue disorders",
        "name": "Musculoskeletal and connective tissue disorder - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10048293,
        "SOC": "Neoplasms benign, malignant and unspecified (incl cysts and polyps)",
        "name": "Leukemia secondary to oncology chemotherapy",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Present",
        "Grade 5": "Death",
        "description": "A disorder characterized by leukemia arising as a result of the mutagenic effect of chemotherapy agents."
    },
    {
        "MedDRA v12.0 Code": 10028533,
        "SOC": "Neoplasms benign, malignant and unspecified (incl cysts and polyps)",
        "name": "Myelodysplastic syndrome",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by insufficiently healthy hematapoietic cell production by the bone marrow. "
    },
    {
        "MedDRA v12.0 Code": 10049737,
        "SOC": "Neoplasms benign, malignant and unspecified (incl cysts and polyps)",
        "name": "Treatment related secondary malignancy",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Non life-threatening secondary malignancy",
        "Grade 4": "Acute life-threatening secondary malignancy; blast crisis in leukemia",
        "Grade 5": "Death",
        "description": "A disorder characterized by development of a malignancy most probably as a result of treatment for a previously existing malignancy."
    },
    {
        "MedDRA v12.0 Code": 10045158,
        "SOC": "Neoplasms benign, malignant and unspecified (incl cysts and polyps)",
        "name": "Tumor pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort from a neoplasm that may be pressing on a nerve, blocking blood vessels, inflamed or fractured from metastasis."
    },
    {
        "MedDRA v12.0 Code": 10029104,
        "SOC": "Neoplasms benign, malignant and unspecified (incl cysts and polyps)",
        "name": "Neoplasms benign, malignant and unspecified (incl cysts and polyps) - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10053662,
        "SOC": "Nervous system disorders",
        "name": "Abducens nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the abducens nerve (sixth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10060929,
        "SOC": "Nervous system disorders",
        "name": "Accessory nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the accessory nerve (eleventh cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10000521,
        "SOC": "Nervous system disorders",
        "name": "Acoustic nerve disorder NOS",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the acoustic nerve (eighth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10001540,
        "SOC": "Nervous system disorders",
        "name": "Akathisia",
        "Grade 1": "Mild restlessness or increased motor activity",
        "Grade 2": "Moderate restlessness or increased motor activity; limiting instrumental ADL",
        "Grade 3": "Severe restlessness or increased motor activity; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an uncomfortable feeling of inner restlessness and inability to stay still; this is a side effect of some psychotropic drugs."
    },
    {
        "MedDRA v12.0 Code": 10001949,
        "SOC": "Nervous system disorders",
        "name": "Amnesia",
        "Grade 1": "Mild; transient memory loss",
        "Grade 2": "Moderate; short term memory loss; limiting instrumental ADL",
        "Grade 3": "Severe; long term memory loss; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by systematic and extensive loss of memory."
    },
    {
        "MedDRA v12.0 Code": 10002953,
        "SOC": "Nervous system disorders",
        "name": "Aphonia",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Voicelessness; unable to speak",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the inability to speak. It may result from injuries to the vocal cords or may be functional (psychogenic)."
    },
    {
        "MedDRA v12.0 Code": 10003074,
        "SOC": "Nervous system disorders",
        "name": "Arachnoiditis",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the arachnoid membrane and adjacent subarachnoid space."
    },
    {
        "MedDRA v12.0 Code": 10003591,
        "SOC": "Nervous system disorders",
        "name": "Ataxia",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; mechanical assistance indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by lack of coordination of muscle movements resulting in the impairment or inability to perform voluntary activities."
    },
    {
        "MedDRA v12.0 Code": 10065417,
        "SOC": "Nervous system disorders",
        "name": "Brachial plexopathy",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by regional paresthesia of the brachial plexus, marked discomfort and muscle weakness, and limited movement in the arm or hand."
    },
    {
        "MedDRA v12.0 Code": 10065784,
        "SOC": "Nervous system disorders",
        "name": "Central nervous system necrosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; corticosteroids indicated",
        "Grade 3": "Severe symptoms; medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the brain and/or spinal cord."
    },
    {
        "MedDRA v12.0 Code": 10008164,
        "SOC": "Nervous system disorders",
        "name": "Cerebrospinal fluid leakage",
        "Grade 1": "Post-craniotomy: asymptomatic; Post-lumbar puncture: transient headache; postural care indicated",
        "Grade 2": "Post-craniotomy: moderate symptoms; medical intervention indicated; Post-lumbar puncture: persistent moderate symptoms; blood patch indicated",
        "Grade 3": "Severe symptoms; medical intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by loss of cerebrospinal fluid into the surrounding tissues."
    },
    {
        "MedDRA v12.0 Code": 10009845,
        "SOC": "Nervous system disorders",
        "name": "Cognitive disturbance",
        "Grade 1": "Mild cognitive disability; not interfering with work/school/life performance; specialized educational services/devices not indicated",
        "Grade 2": "Moderate cognitive disability; interfering with work/school/life performance but capable of independent living; specialized resources on part time basis indicated",
        "Grade 3": "Severe cognitive disability; significant impairment of work/school/life performance",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a conspicuous change in cognitive function."
    },
    {
        "MedDRA v12.0 Code": 10010250,
        "SOC": "Nervous system disorders",
        "name": "Concentration impairment",
        "Grade 1": "Mild inattention or decreased level of concentration",
        "Grade 2": "Moderate impairment in attention or decreased level of concentration; limiting instrumental ADL",
        "Grade 3": "Severe impairment in attention or decreased level of concentration; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a deterioration in the ability to concentrate."
    },
    {
        "MedDRA v12.0 Code": 10012373,
        "SOC": "Nervous system disorders",
        "name": "Depressed level of consciousness",
        "Grade 1": "Decreased level of alertness",
        "Grade 2": "Sedation; slow response to stimuli; limiting instrumental ADL",
        "Grade 3": "Difficult to arouse",
        "Grade 4": "Life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by a decrease in ability to perceive and respond."
    },
    {
        "MedDRA v12.0 Code": 10013573,
        "SOC": "Nervous system disorders",
        "name": "Dizziness",
        "Grade 1": "Mild unsteadiness or sensation of movement",
        "Grade 2": "Moderate unsteadiness or sensation of movement; limiting instrumental ADL",
        "Grade 3": "Severe unsteadiness or sensation of movement; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a disturbing sensation of lightheadedness, unsteadiness, giddiness, spinning or rocking."
    },
    {
        "MedDRA v12.0 Code": 10013887,
        "SOC": "Nervous system disorders",
        "name": "Dysarthria",
        "Grade 1": "Mild slurred speech",
        "Grade 2": "Moderate impairment of articulation or slurred speech",
        "Grade 3": "Severe impairment of articulation or slurred speech",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by slow and slurred speech resulting from an inability to coordinate the muscles used in speech."
    },
    {
        "MedDRA v12.0 Code": 10062872,
        "SOC": "Nervous system disorders",
        "name": "Dysesthesia",
        "Grade 1": "Mild sensory alteration",
        "Grade 2": "Moderate sensory alteration; limiting instrumental ADL",
        "Grade 3": "Severe sensory alteration; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by distortion of sensory perception, resulting in an abnormal and unpleasant sensation."
    },
    {
        "MedDRA v12.0 Code": 10013911,
        "SOC": "Nervous system disorders",
        "name": "Dysgeusia",
        "Grade 1": "Altered taste but no change in diet",
        "Grade 2": "Altered taste with change in diet (e.g., oral supplements); noxious or unpleasant taste; loss of taste",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by abnormal sensual experience with the taste of foodstuffs; it can be related to a decrease in the sense of smell."
    },
    {
        "MedDRA v12.0 Code": 10013951,
        "SOC": "Nervous system disorders",
        "name": "Dysphasia",
        "Grade 1": "Awareness of receptive or expressive characteristics; not impairing ability to communicate",
        "Grade 2": "Moderate receptive or expressive characteristics; impairing ability to communicate spontaneously",
        "Grade 3": "Severe receptive or expressive characteristics; impairing ability to read, write or communicate intelligibly",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by impairment of verbal communication skills, often resulting from brain damage."
    },
    {
        "MedDRA v12.0 Code": 10014217,
        "SOC": "Nervous system disorders",
        "name": "Edema cerebral",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to an excessive accumulation of fluid in the brain."
    },
    {
        "MedDRA v12.0 Code": 10014625,
        "SOC": "Nervous system disorders",
        "name": "Encephalopathy",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a pathologic process involving the brain."
    },
    {
        "MedDRA v12.0 Code": 10015832,
        "SOC": "Nervous system disorders",
        "name": "Extrapyramidal disorder",
        "Grade 1": "Mild involuntary movements",
        "Grade 2": "Moderate involuntary movements; limiting instrumental ADL",
        "Grade 3": "Severe involuntary movements or torticollis; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by abnormal, repetitive, involuntary muscle movements, frenzied speech and extreme restlessness."
    },
    {
        "MedDRA v12.0 Code": 10051272,
        "SOC": "Nervous system disorders",
        "name": "Facial muscle weakness",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a reduction in the strength of the facial muscles."
    },
    {
        "MedDRA v12.0 Code": 10061457,
        "SOC": "Nervous system disorders",
        "name": "Facial nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the facial nerve (seventh cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10061185,
        "SOC": "Nervous system disorders",
        "name": "Glossopharyngeal nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by involvement of the glossopharyngeal nerve (ninth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10019211,
        "SOC": "Nervous system disorders",
        "name": "Headache",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in various parts of the head, not confined to the area of distribution of any nerve."
    },
    {
        "MedDRA v12.0 Code": 10020508,
        "SOC": "Nervous system disorders",
        "name": "Hydrocephalus",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; intervention not indicated",
        "Grade 3": "Severe symptoms or neurological deficit; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal increase of cerebrospinal fluid in the ventricles of the brain."
    },
    {
        "MedDRA v12.0 Code": 10020765,
        "SOC": "Nervous system disorders",
        "name": "Hypersomnia",
        "Grade 1": "Mild increased need for sleep",
        "Grade 2": "Moderate increased need for sleep",
        "Grade 3": "Severe increased need for sleep",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by characterized by excessive sleepiness during the daytime."
    },
    {
        "MedDRA v12.0 Code": 10061212,
        "SOC": "Nervous system disorders",
        "name": "Hypoglossal nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the hypoglossal nerve (twelfth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10022763,
        "SOC": "Nervous system disorders",
        "name": "Intracranial hemorrhage",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Ventriculostomy, ICP monitoring, intraventricular thrombolysis, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the cranium."
    },
    {
        "MedDRA v12.0 Code": 10023030,
        "SOC": "Nervous system disorders",
        "name": "Ischemia cerebrovascular",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease or absence of blood supply to the brain caused by obstruction (thrombosis or embolism) of an artery resulting in neurological damage."
    },
    {
        "MedDRA v12.0 Code": 10065836,
        "SOC": "Nervous system disorders",
        "name": "IVth nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the trochlear nerve (fourth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10024264,
        "SOC": "Nervous system disorders",
        "name": "Lethargy",
        "Grade 1": "Mild symptoms; reduced alertness and awareness",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in consciousness characterized by mental and physical inertness."
    },
    {
        "MedDRA v12.0 Code": 10024382,
        "SOC": "Nervous system disorders",
        "name": "Leukoencephalopathy",
        "Grade 1": "Asymptomatic; small focal T2/FLAIR hyperintensities; involving periventricular white matter or <1/3 of susceptible areas of cerebrum +/- mild increase in subarachnoid space (SAS) and/or mild ventriculomegaly",
        "Grade 2": "Moderate symptoms; focal T2/FLAIR hyperintensities, involving periventricular white matter extending into centrum semiovale or involving 1/3 to 2/3 of susceptible areas of cerebrum +/- moderate increase in SAS and/or moderate ventriculomegaly",
        "Grade 3": "Severe symptoms; extensive T2/FLAIR hyperintensities, involving periventricular white matter involving 2/3 or more of susceptible areas of cerebrum +/- moderate to severe increase in SAS and/or moderate to severe ventriculomegaly",
        "Grade 4": "Life-threatening consequences; extensive T2/FLAIR hyperintensities, involving periventricular white matter involving most of susceptible areas of cerebrum +/- moderate to severe increase in SAS and/or moderate to severe ventriculomegaly",
        "Grade 5": "Death",
        "description": "A disorder characterized by diffuse reactive astrocytosis with multiple areas of necrotic foci without inflammation."
    },
    {
        "MedDRA v12.0 Code": 10027175,
        "SOC": "Nervous system disorders",
        "name": "Memory impairment",
        "Grade 1": "Mild memory impairment",
        "Grade 2": "Moderate memory impairment; limiting instrumental ADL",
        "Grade 3": "Severe memory impairment; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a deterioration in memory function."
    },
    {
        "MedDRA v12.0 Code": 10027198,
        "SOC": "Nervous system disorders",
        "name": "Meningismus",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by neck stiffness, headache, and photophobia resulting from irritation of the cerebral meninges."
    },
    {
        "MedDRA v12.0 Code": 10028041,
        "SOC": "Nervous system disorders",
        "name": "Movements involuntary",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by uncontrolled and purposeless movements."
    },
    {
        "MedDRA v12.0 Code": 10028524,
        "SOC": "Nervous system disorders",
        "name": "Myelitis",
        "Grade 1": "Asymptomatic; mild signs (e.g., Babinski's reflex or Lhermitte's sign)",
        "Grade 2": "Moderate weakness or sensory loss; limiting instrumental ADL",
        "Grade 3": "Severe weakness or sensory loss; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation involving the spinal cord. Symptoms include weakness, paresthesia, sensory loss, marked discomfort and incontinence."
    },
    {
        "MedDRA v12.0 Code": 10029223,
        "SOC": "Nervous system disorders",
        "name": "Neuralgia",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by intense painful sensation along a nerve or group of nerves."
    },
    {
        "MedDRA v12.0 Code": 10029864,
        "SOC": "Nervous system disorders",
        "name": "Nystagmus",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involuntary movements of the eyeballs."
    },
    {
        "MedDRA v12.0 Code": 10053661,
        "SOC": "Nervous system disorders",
        "name": "Oculomotor nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the oculomotor nerve (third cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10056388,
        "SOC": "Nervous system disorders",
        "name": "Olfactory nerve disorder",
        "Grade 1": null,
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the olfactory nerve (first cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10033987,
        "SOC": "Nervous system disorders",
        "name": "Paresthesia",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by functional disturbances of sensory neurons resulting in abnormal cutaneous sensations of tingling, numbness, pressure, cold, and warmth that are experienced in the absence of a stimulus."
    },
    {
        "MedDRA v12.0 Code": 10034580,
        "SOC": "Nervous system disorders",
        "name": "Peripheral motor neuropathy",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; assistive device indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation or degeneration of the peripheral motor nerves."
    },
    {
        "MedDRA v12.0 Code": 10034620,
        "SOC": "Nervous system disorders",
        "name": "Peripheral sensory neuropathy",
        "Grade 1": "Asymptomatic; loss of deep tendon reflexes or paresthesia",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation or degeneration of the peripheral sensory nerves."
    },
    {
        "MedDRA v12.0 Code": 10056238,
        "SOC": "Nervous system disorders",
        "name": "Phantom pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort related to a limb or an organ that is removed from or is not physically part of the body."
    },
    {
        "MedDRA v12.0 Code": 10036653,
        "SOC": "Nervous system disorders",
        "name": "Presyncope",
        "Grade 1": null,
        "Grade 2": "Present (e.g., near fainting)",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an episode of lightheadedness and dizziness which may precede an episode of syncope."
    },
    {
        "MedDRA v12.0 Code": 10063636,
        "SOC": "Nervous system disorders",
        "name": "Pyramidal tract syndrome",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by dysfunction of the corticospinal (pyramidal) tracts of the spinal cord. Symptoms include  an increase in the muscle tone in the lower extremities, hyperreflexia, positive Babinski and a decrease in fine motor coordination."
    },
    {
        "MedDRA v12.0 Code": 10061928,
        "SOC": "Nervous system disorders",
        "name": "Radiculitis",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL; medical intervention indicated",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation involving a nerve root. Patients experience marked discomfort radiating along a nerve path because of spinal pressure on the connecting nerve root."
    },
    {
        "MedDRA v12.0 Code": 10038130,
        "SOC": "Nervous system disorders",
        "name": "Recurrent laryngeal nerve palsy",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms",
        "Grade 3": "Severe symptoms; medical intervention indicated (e.g., thyroplasty, vocal cord injection)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by paralysis of the recurrent laryngeal nerve."
    },
    {
        "MedDRA v12.0 Code": 10063761,
        "SOC": "Nervous system disorders",
        "name": "Reversible posterior leukoencephalopathy syndrome",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; abnormal imaging studies; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; very abnormal imaging studies; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by headaches, mental status changes, visual disturbances, and seizures associated with imaging findings of posterior leukoencephalopathy. It has been observed in association with hypertensive encephalopathy, eclampsia, and immunosuppressive and cytotoxic drug treatment. It is an acute or subacute reversible condition."
    },
    {
        "MedDRA v12.0 Code": 10039906,
        "SOC": "Nervous system disorders",
        "name": "Seizure",
        "Grade 1": "Brief partial seizure; no loss of consciousness",
        "Grade 2": "Brief generalized seizure",
        "Grade 3": "Multiple seizures despite medical intervention",
        "Grade 4": "Life-threatening; prolonged repetitive seizures",
        "Grade 5": "Death",
        "description": "A disorder characterized by a sudden, involuntary skeletal muscular contractions of cerebral or brain stem origin."
    },
    {
        "MedDRA v12.0 Code": 10040747,
        "SOC": "Nervous system disorders",
        "name": "Sinus pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort in the face, between the eyes, or upper teeth originating from the sinuses."
    },
    {
        "MedDRA v12.0 Code": 10041349,
        "SOC": "Nervous system disorders",
        "name": "Somnolence",
        "Grade 1": "Mild but more than usual drowsiness or sleepiness",
        "Grade 2": "Moderate sedation; limiting instrumental ADL",
        "Grade 3": "Obtundation or stupor",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by characterized by excessive sleepiness and drowsiness."
    },
    {
        "MedDRA v12.0 Code": 10041416,
        "SOC": "Nervous system disorders",
        "name": "Spasticity",
        "Grade 1": "Mild or slight increase in muscle tone",
        "Grade 2": "Moderate increase in muscle tone and increase in resistance through range of motion",
        "Grade 3": "Severe increase in muscle tone and increase in resistance through range of motion",
        "Grade 4": "Life-threatening; unable to move active or passive range of motion",
        "Grade 5": "Death",
        "description": "A disorder characterized by increased involuntary muscle tone that affects the regions interfering with voluntary movement. It results in gait, movement, and speech disturbances."
    },
    {
        "MedDRA v12.0 Code": 10042244,
        "SOC": "Nervous system disorders",
        "name": "Stroke",
        "Grade 1": "Asymptomatic or mild neurologic deficit; radiographic findings only",
        "Grade 2": "Moderate neurologic deficit",
        "Grade 3": "Severe neurologic deficit",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a sudden loss of sensory function due to an intracranial vascular event."
    },
    {
        "MedDRA v12.0 Code": 10042772,
        "SOC": "Nervous system disorders",
        "name": "Syncope",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Fainting; orthostatic collapse",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by spontaneous loss of consciousness caused by insufficient blood supply to the brain."
    },
    {
        "MedDRA v12.0 Code": 10044391,
        "SOC": "Nervous system disorders",
        "name": "Transient ischemic attacks",
        "Grade 1": "Mild neurologic deficit with or without imaging confirmation",
        "Grade 2": "Moderate neurologic deficit with or without imaging confirmation",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a brief attack (less than 24 hours) of cerebral dysfunction of vascular origin, with no persistent neurological deficit."
    },
    {
        "MedDRA v12.0 Code": 10044565,
        "SOC": "Nervous system disorders",
        "name": "Tremor",
        "Grade 1": "Mild symptoms",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the uncontrolled shaking movement of the whole body or individual parts."
    },
    {
        "MedDRA v12.0 Code": 10060890,
        "SOC": "Nervous system disorders",
        "name": "Trigeminal nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involvement of the trigeminal nerve (fifth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10061403,
        "SOC": "Nervous system disorders",
        "name": "Vagus nerve disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by involvement of the vagus nerve (tenth cranial nerve)."
    },
    {
        "MedDRA v12.0 Code": 10047166,
        "SOC": "Nervous system disorders",
        "name": "Vasovagal reaction",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Present",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a sudden drop of the blood pressure, bradycardia, and peripheral vasodilation that may lead to loss of consciousness. It results from an increase in the stimulation of the vagus nerve."
    },
    {
        "MedDRA v12.0 Code": 10029205,
        "SOC": "Nervous system disorders",
        "name": "Nervous system disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10016479,
        "SOC": "Pregnancy, puerperium and perinatal conditions",
        "name": "Fetal death",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": "Fetal loss at any gestational age",
        "description": "A disorder characterized by death in utero; failure of the product of conception to show evidence of respiration, heartbeat, or definite movement of a voluntary muscle after expulsion from the uterus, without possibility of resuscitation."
    },
    {
        "MedDRA v12.0 Code": 10054746,
        "SOC": "Pregnancy, puerperium and perinatal conditions",
        "name": "Fetal growth retardation",
        "Grade 1": null,
        "Grade 2": "<10% percentile of weight for gestational age",
        "Grade 3": "<5% percentile of weight for gestational age",
        "Grade 4": "<1% percentile of weight for gestational age",
        "Grade 5": null,
        "description": "A disorder characterized by inhibition of fetal growth resulting in the inability of the fetus to achieve its potential weight."
    },
    {
        "MedDRA v12.0 Code": 10036595,
        "SOC": "Pregnancy, puerperium and perinatal conditions",
        "name": "Premature delivery",
        "Grade 1": "Delivery of a liveborn infant at >34 to 37 weeks gestation",
        "Grade 2": "Delivery of a liveborn infant at >28 to 34 weeks gestation",
        "Grade 3": "Delivery of a liveborn infant at 24 to 28 weeks gestation",
        "Grade 4": "Delivery of a liveborn infant at 24 weeks of gestation or less",
        "Grade 5": null,
        "description": "A disorder characterized by delivery of a viable infant before the normal end of gestation. Typically, viability is achievable between the twentieth and thirty-seventh week of gestation."
    },
    {
        "MedDRA v12.0 Code": 10045542,
        "SOC": "Pregnancy, puerperium and perinatal conditions",
        "name": "Unintended pregnancy",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Unintended pregnancy",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an unexpected pregnancy at the time of conception."
    },
    {
        "MedDRA v12.0 Code": 10036585,
        "SOC": "Pregnancy, puerperium and perinatal conditions",
        "name": "Pregnancy, puerperium and perinatal conditions - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate, local or noninvasive intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10001497,
        "SOC": "Psychiatric disorders",
        "name": "Agitation",
        "Grade 1": "Mild mood alteration",
        "Grade 2": "Moderate mood alteration",
        "Grade 3": "Severe agitation; hospitalization not indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a state of restlessness associated with unpleasant feelings of irritability and tension."
    },
    {
        "MedDRA v12.0 Code": 10002652,
        "SOC": "Psychiatric disorders",
        "name": "Anorgasmia",
        "Grade 1": "Inability to achieve orgasm not adversely affecting relationship",
        "Grade 2": "Inability to achieve orgasm adversely affecting relationship",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an inability to achieve orgasm."
    },
    {
        "MedDRA v12.0 Code": 10002855,
        "SOC": "Psychiatric disorders",
        "name": "Anxiety",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; hospitalization not indicated",
        "Grade 4": "Life-threatening; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by apprehension of danger and dread accompanied by restlessness, tension, tachycardia, and dyspnea unattached to a clearly identifiable stimulus."
    },
    {
        "MedDRA v12.0 Code": 10010300,
        "SOC": "Psychiatric disorders",
        "name": "Confusion",
        "Grade 1": "Mild disorientation",
        "Grade 2": "Moderate disorientation; limiting instrumental ADL",
        "Grade 3": "Severe disorientation; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a lack of clear and orderly thought and behavior."
    },
    {
        "MedDRA v12.0 Code": 10057066,
        "SOC": "Psychiatric disorders",
        "name": "Delayed orgasm",
        "Grade 1": "Delay in achieving orgasm not adversely affecting relationship",
        "Grade 2": "Delay in achieving orgasm adversely affecting relationship",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by sexual dysfunction characterized by a delay in climax."
    },
    {
        "MedDRA v12.0 Code": 10012218,
        "SOC": "Psychiatric disorders",
        "name": "Delirium",
        "Grade 1": "Mild acute confusional state",
        "Grade 2": "Moderate and acute confusional state; limiting instrumental ADL",
        "Grade 3": "Severe and acute confusional state; limiting self care ADL; hospitalization indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the acute and sudden development of confusion, illusions, movement changes, inattentiveness, agitation, and hallucinations. Usually, it is a reversible condition."
    },
    {
        "MedDRA v12.0 Code": 10012260,
        "SOC": "Psychiatric disorders",
        "name": "Delusions",
        "Grade 1": null,
        "Grade 2": "Moderate delusional symptoms",
        "Grade 3": "Severe delusional symptoms; hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by false personal beliefs held contrary to reality, despite contradictory evidence and common sense."
    },
    {
        "MedDRA v12.0 Code": 10012378,
        "SOC": "Psychiatric disorders",
        "name": "Depression",
        "Grade 1": "Mild depressive symptoms",
        "Grade 2": "Moderate depressive symptoms; limiting instrumental ADL",
        "Grade 3": "Severe depressive symptoms; limiting self care ADL; hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by melancholic feelings of grief or unhappiness."
    },
    {
        "MedDRA v12.0 Code": 10015533,
        "SOC": "Psychiatric disorders",
        "name": "Euphoria",
        "Grade 1": "Mild mood elevation",
        "Grade 2": "Moderate mood elevation",
        "Grade 3": "Severe mood elevation (e.g., hypomania)",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an exaggerated feeling of well-being which is disproportionate to events and stimuli."
    },
    {
        "MedDRA v12.0 Code": 10019077,
        "SOC": "Psychiatric disorders",
        "name": "Hallucinations",
        "Grade 1": "Mild hallucinations (e.g., perceptual distortions)",
        "Grade 2": "Moderate hallucinations",
        "Grade 3": "Severe hallucinations; hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a false sensory perception in the absence of an external stimulus."
    },
    {
        "MedDRA v12.0 Code": 10022437,
        "SOC": "Psychiatric disorders",
        "name": "Insomnia",
        "Grade 1": "Mild difficulty falling asleep, staying asleep or waking up early",
        "Grade 2": "Moderate difficulty falling asleep, staying asleep or waking up early",
        "Grade 3": "Severe difficulty in falling asleep, staying asleep or waking up early",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by difficulty in falling asleep and/or remaining asleep."
    },
    {
        "MedDRA v12.0 Code": 10024419,
        "SOC": "Psychiatric disorders",
        "name": "Libido decreased",
        "Grade 1": "Decrease in sexual interest not adversely affecting relationship",
        "Grade 2": "Decrease in sexual interest adversely affecting relationship",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in sexual desire."
    },
    {
        "MedDRA v12.0 Code": 10024421,
        "SOC": "Psychiatric disorders",
        "name": "Libido increased",
        "Grade 1": "Mild increase in sexual interest not adversely affecting relationship",
        "Grade 2": "Moderate increase in sexual interest adversely affecting relationship",
        "Grade 3": "Severe increase in sexual interest leading to dangerous behavior",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an increase in sexual desire."
    },
    {
        "MedDRA v12.0 Code": 10026749,
        "SOC": "Psychiatric disorders",
        "name": "Mania",
        "Grade 1": "Mild manic symptoms (e.g., elevated mood, rapid thoughts, rapid speech, decreased need for sleep)",
        "Grade 2": "Moderate manic symptoms (e.g., relationship and work difficulties; poor hygiene)",
        "Grade 3": "Severe manic symptoms (e.g., hypomania; major sexual or financial indiscretions); hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by excitement of psychotic proportions manifested by mental and physical hyperactivity, disorganization of behavior and elevation of mood."
    },
    {
        "MedDRA v12.0 Code": 10034719,
        "SOC": "Psychiatric disorders",
        "name": "Personality change",
        "Grade 1": "Mild personality change",
        "Grade 2": "Moderate personality change",
        "Grade 3": "Severe personality change; hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a conspicuous change in a person's behavior and thinking."
    },
    {
        "MedDRA v12.0 Code": 10037234,
        "SOC": "Psychiatric disorders",
        "name": "Psychosis",
        "Grade 1": "Mild psychotic symptoms",
        "Grade 2": "Moderate psychotic symptoms (e.g., disorganized speech; impaired reality testing)",
        "Grade 3": "Severe psychotic symptoms (e.g., paranoid; extreme disorganization); hospitalization not indicated",
        "Grade 4": "Life-threatening consequences,  threats of harm to self or others; hospitalization indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by personality change, impaired functioning, and loss of touch with reality. It may be a manifestation of schizophrenia, bipolar disorder or brain tumor."
    },
    {
        "MedDRA v12.0 Code": 10038743,
        "SOC": "Psychiatric disorders",
        "name": "Restlessness",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an inability to rest, relax or be still."
    },
    {
        "MedDRA v12.0 Code": 10042458,
        "SOC": "Psychiatric disorders",
        "name": "Suicidal ideation",
        "Grade 1": "Increased thoughts of death but no wish to kill oneself",
        "Grade 2": "Suicidal ideation with no specific plan or intent",
        "Grade 3": "Specific plan to commit suicide without serious intent to die which may not require hospitalization",
        "Grade 4": "Specific plan to commit suicide with serious intent to die which requires hospitalization",
        "Grade 5": null,
        "description": "A disorder characterized by thoughts of taking one's own life."
    },
    {
        "MedDRA v12.0 Code": 10042464,
        "SOC": "Psychiatric disorders",
        "name": "Suicide attempt",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Suicide attempt or gesture without intent to die which may not require hospitalization",
        "Grade 4": "Suicide attempt with intent to die which requires hospitalization",
        "Grade 5": "Death",
        "description": "A disorder characterized by self-inflicted harm in an attempt to end one's own life."
    },
    {
        "MedDRA v12.0 Code": 10037175,
        "SOC": "Psychiatric disorders",
        "name": "Psychiatric disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; hospitalization or urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10069339,
        "SOC": "Renal and urinary disorders",
        "name": "Acute kidney injury",
        "Grade 1": "Creatinine level increase of >0.3 mg/dL; creatinine 1.5 - 2.0 x above baseline",
        "Grade 2": "Creatinine 2 - 3 x above baseline",
        "Grade 3": "Creatinine >3 x baseline or >4.0 mg/dL; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; dialysis indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the acute loss of renal function and is traditionally classified as pre-renal (low blood flow into kidney), renal (kidney damage) and post-renal causes (ureteral or bladder outflow obstruction)."
    },
    {
        "MedDRA v12.0 Code": 10063575,
        "SOC": "Renal and urinary disorders",
        "name": "Bladder perforation",
        "Grade 1": null,
        "Grade 2": "Extraperitoneal perforation, indwelling catheter indicated",
        "Grade 3": "Intraperitoneal perforation; elective radiologic, endoscopic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; organ failure; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the bladder wall."
    },
    {
        "MedDRA v12.0 Code": 10048994,
        "SOC": "Renal and urinary disorders",
        "name": "Bladder spasm",
        "Grade 1": "Intervention not indicated",
        "Grade 2": "Antispasmodics indicated",
        "Grade 3": "Hospitalization indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sudden and involuntary contraction of the bladder wall."
    },
    {
        "MedDRA v12.0 Code": 10064848,
        "SOC": "Renal and urinary disorders",
        "name": "Chronic kidney disease",
        "Grade 1": "eGFR (estimated Glomerular Filtration Rate) or CrCl (creatinine clearance) <LLN - 60 ml/min/1.73 m2 or proteinuria 2+ present; urine protein/creatinine >0.5",
        "Grade 2": "eGFR or CrCl 59 - 30 ml/min/1.73 m2",
        "Grade 3": "eGFR or CrCl 29 - 15 ml/min/1.73 m2",
        "Grade 4": "eGFR or CrCl <15 ml/min/1.73 m2; dialysis or renal transplant indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by gradual and usually permanent loss of kidney function resulting in renal failure."
    },
    {
        "MedDRA v12.0 Code": 10063057,
        "SOC": "Renal and urinary disorders",
        "name": "Cystitis noninfective",
        "Grade 1": "Microscopic hematuria; minimal increase in frequency, urgency, dysuria, or nocturia; new onset of incontinence",
        "Grade 2": "Moderate hematuria; moderate increase in frequency, urgency, dysuria, nocturia or incontinence; urinary catheter placement or bladder irrigation indicated; limiting instrumental ADL",
        "Grade 3": "Gross hematuria; transfusion, IV medications or hospitalization indicated; elective endoscopic, radiologic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the bladder which is not caused by an infection of the urinary tract."
    },
    {
        "MedDRA v12.0 Code": 10019450,
        "SOC": "Renal and urinary disorders",
        "name": "Hematuria",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; urinary catheter or bladder irrigation indicated; limiting instrumental ADL",
        "Grade 3": "Gross hematuria; transfusion, IV medications or hospitalization indicated; elective endoscopic, radiologic or operative intervention indicated; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by laboratory test results that indicate blood in the urine."
    },
    {
        "MedDRA v12.0 Code": 10019489,
        "SOC": "Renal and urinary disorders",
        "name": "Hemoglobinuria",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by laboratory test results that indicate the presence of free hemoglobin in the urine."
    },
    {
        "MedDRA v12.0 Code": 10037032,
        "SOC": "Renal and urinary disorders",
        "name": "Proteinuria",
        "Grade 1": "1+ proteinuria; urinary protein <1.0 g/24 hrs",
        "Grade 2": "Adults: 2+ proteinuria; urinary protein 1.0 - 3.4 g/24 hrs; Pediatric: urine P/C (Protein/Creatinine) ratio 0.5 - 1.9",
        "Grade 3": "Adults: urinary protein >=3.5 g/24 hrs;\n\nPediatric: urine P/C >1.9",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by laboratory test results that indicate the presence of excessive protein in the urine. It is predominantly albumin, but also globulin."
    },
    {
        "MedDRA v12.0 Code": 10038385,
        "SOC": "Renal and urinary disorders",
        "name": "Renal calculi",
        "Grade 1": "Asymptomatic or mild symptoms; occasional use of nonprescription analgesics indicated",
        "Grade 2": "Symptomatic; oral antiemetics indicated; around the clock nonprescription analgesics or any oral narcotic analgesics indicated",
        "Grade 3": "Hospitalization indicated; IV intervention (e.g., analgesics, antiemetics); elective endoscopic or radiologic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent radiologic, endoscopic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the formation of crystals in the pelvis of the kidney."
    },
    {
        "MedDRA v12.0 Code": 10038419,
        "SOC": "Renal and urinary disorders",
        "name": "Renal colic",
        "Grade 1": "Mild pain not interfering with activity; nonprescription medication indicated",
        "Grade 2": "Moderate pain; limiting instrumental ADL; prescription medication indicated",
        "Grade 3": "Hospitalization indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by paroxysmal and severe flank marked discomfort radiating to the inguinal area. Often, the cause is the passage of kidney stones."
    },
    {
        "MedDRA v12.0 Code": 10038463,
        "SOC": "Renal and urinary disorders",
        "name": "Renal hemorrhage",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Analgesics and hematocrit monitoring indicated",
        "Grade 3": "Transfusion, radiation, or hospitalization indicated; elective radiologic, endoscopic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the kidney."
    },
    {
        "MedDRA v12.0 Code": 10065368,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary fistula",
        "Grade 1": null,
        "Grade 2": "Noninvasive intervention indicated; urinary or suprapubic catheter placement indicated",
        "Grade 3": "Limiting self care ADL; elective radiologic, endoscopic or operative intervention indicated; permanent urinary diversion indicated",
        "Grade 4": "Life-threatening consequences; urgent radiologic or operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between any part of the urinary system and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10046539,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary frequency",
        "Grade 1": "Present",
        "Grade 2": "Limiting instrumental ADL; medical management indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by urination at short intervals."
    },
    {
        "MedDRA v12.0 Code": 10046543,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary incontinence",
        "Grade 1": "Occasional (e.g., with coughing, sneezing, etc.), pads not indicated",
        "Grade 2": "Spontaneous; pads indicated; limiting instrumental ADL",
        "Grade 3": "Intervention indicated (e.g., clamp, collagen injections); operative intervention indicated; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inability to control the flow of urine from the bladder."
    },
    {
        "MedDRA v12.0 Code": 10046555,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary retention",
        "Grade 1": "Urinary, suprapubic or intermittent catheter placement not indicated; able to void with some residual",
        "Grade 2": "Placement of urinary, suprapubic or intermittent catheter placement indicated; medication indicated",
        "Grade 3": "Elective operative or radiologic intervention indicated; substantial loss of affected kidney function or mass",
        "Grade 4": "Life-threatening consequences; organ failure; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by accumulation of urine within the bladder because of the inability to urinate."
    },
    {
        "MedDRA v12.0 Code": 10061574,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary tract obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only",
        "Grade 2": "Symptomatic but no hydronephrosis, sepsis or renal dysfunction; urethral dilation, urinary or suprapubic catheter indicated",
        "Grade 3": "Symptomatic and altered organ function (e.g., hydronephrosis, or renal dysfunction); elective radiologic, endoscopic or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the normal flow of contents of the urinary tract."
    },
    {
        "MedDRA v12.0 Code": 10062225,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary tract pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the urinary tract."
    },
    {
        "MedDRA v12.0 Code": 10046593,
        "SOC": "Renal and urinary disorders",
        "name": "Urinary urgency",
        "Grade 1": "Present",
        "Grade 2": "Limiting instrumental ADL; medical management indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sudden compelling urge to urinate."
    },
    {
        "MedDRA v12.0 Code": 10046628,
        "SOC": "Renal and urinary disorders",
        "name": "Urine discoloration",
        "Grade 1": "Present",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a change in the color of the urine."
    },
    {
        "MedDRA v12.0 Code": 10038359,
        "SOC": "Renal and urinary disorders",
        "name": "Renal and urinary disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate, local or noninvasive intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10003883,
        "SOC": "Reproductive system and breast disorders",
        "name": "Azoospermia",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Absence of sperm in ejaculate",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by laboratory test results that indicate complete absence of spermatozoa in the semen."
    },
    {
        "MedDRA v12.0 Code": 10006179,
        "SOC": "Reproductive system and breast disorders",
        "name": "Breast atrophy",
        "Grade 1": "Minimal asymmetry; minimal atrophy",
        "Grade 2": "Moderate asymmetry; moderate atrophy",
        "Grade 3": "Asymmetry >1/3 of breast volume; severe atrophy",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by underdevelopment of the breast."
    },
    {
        "MedDRA v12.0 Code": 10006298,
        "SOC": "Reproductive system and breast disorders",
        "name": "Breast pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the breast region."
    },
    {
        "MedDRA v12.0 Code": 10013934,
        "SOC": "Reproductive system and breast disorders",
        "name": "Dysmenorrhea",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by abnormally painful abdominal cramps during menses."
    },
    {
        "MedDRA v12.0 Code": 10013941,
        "SOC": "Reproductive system and breast disorders",
        "name": "Dyspareunia",
        "Grade 1": "Mild discomfort or pain associated with vaginal penetration; discomfort relieved with use of vaginal lubricants or estrogen",
        "Grade 2": "Moderate discomfort or pain associated with vaginal penetration; discomfort or pain partially relieved with use of vaginal lubricants or estrogen",
        "Grade 3": "Severe discomfort or pain associated with vaginal penetration; discomfort or pain unrelieved by vaginal lubricants or estrogen",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by painful or difficult coitus."
    },
    {
        "MedDRA v12.0 Code": 10014326,
        "SOC": "Reproductive system and breast disorders",
        "name": "Ejaculation disorder",
        "Grade 1": "Diminished ejaculation",
        "Grade 2": "Anejaculation or retrograde ejaculation",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by problems related to ejaculation. This category includes premature, delayed, retrograde and painful ejaculation."
    },
    {
        "MedDRA v12.0 Code": 10061461,
        "SOC": "Reproductive system and breast disorders",
        "name": "Erectile dysfunction",
        "Grade 1": "Decrease in erectile function (frequency or rigidity of erections) but intervention not indicated (e.g., medication or use of mechanical device, penile pump)",
        "Grade 2": "Decrease in erectile function (frequency/rigidity of erections), erectile intervention indicated, (e.g., medication or mechanical devices such as penile pump)",
        "Grade 3": "Decrease in erectile function (frequency/rigidity of erections) but erectile intervention not helpful (e.g., medication or mechanical devices such as penile pump); placement of a permanent penile prosthesis indicated (not previously present)",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the persistent or recurrent inability to achieve or to maintain an erection during sexual activity."
    },
    {
        "MedDRA v12.0 Code": 10065789,
        "SOC": "Reproductive system and breast disorders",
        "name": "Fallopian tube obstruction",
        "Grade 1": "Diagnostic observations only; intervention not indicated",
        "Grade 2": "Mild symptoms; elective intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by blockage of the normal flow of the contents in the fallopian tube."
    },
    {
        "MedDRA v12.0 Code": 10065791,
        "SOC": "Reproductive system and breast disorders",
        "name": "Fallopian tube stenosis",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated (e.g., organ resection)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the fallopian tube lumen."
    },
    {
        "MedDRA v12.0 Code": 10061149,
        "SOC": "Reproductive system and breast disorders",
        "name": "Female genital tract fistula",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between a female reproductive system organ and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10054382,
        "SOC": "Reproductive system and breast disorders",
        "name": "Feminization acquired",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the development of secondary female sex characteristics in males due to extrinsic factors."
    },
    {
        "MedDRA v12.0 Code": 10018146,
        "SOC": "Reproductive system and breast disorders",
        "name": "Genital edema",
        "Grade 1": "Mild swelling or obscuration of anatomic architecture on close inspection",
        "Grade 2": "Readily apparent obscuration of anatomic architecture; obliteration of skin folds; readily apparent deviation from normal anatomic contour",
        "Grade 3": "Lymphorrhea; gross deviation from normal anatomic contour; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to an excessive accumulation of fluid in the genitals."
    },
    {
        "MedDRA v12.0 Code": 10018801,
        "SOC": "Reproductive system and breast disorders",
        "name": "Gynecomastia",
        "Grade 1": "Asymptomatic breast enlargement",
        "Grade 2": "Symptomatic (e.g., pain or psychosocial impact)",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by excessive development of the breasts in males."
    },
    {
        "MedDRA v12.0 Code": 10060602,
        "SOC": "Reproductive system and breast disorders",
        "name": "Hematosalpinx",
        "Grade 1": "Minimal bleeding identified on imaging study or laparoscopy; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the presence of blood in a fallopian tube."
    },
    {
        "MedDRA v12.0 Code": 10022992,
        "SOC": "Reproductive system and breast disorders",
        "name": "Irregular menstruation",
        "Grade 1": "Intermittent menses with skipped menses for no more than 1 to 3 months",
        "Grade 2": "Intermittent menses with skipped menses for more than 4 to 6 months",
        "Grade 3": "Persistent amenorrhea for more than 6 months",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by irregular cycle or duration of menses."
    },
    {
        "MedDRA v12.0 Code": 10061261,
        "SOC": "Reproductive system and breast disorders",
        "name": "Lactation disorder",
        "Grade 1": "Mild changes in lactation, not significantly affecting production or expression of breast milk",
        "Grade 2": "Changes in lactation, significantly affecting breast production or expression of breast milk",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by disturbances of milk secretion. It is not necessarily related to pregnancy that is observed in females and can be observed in males."
    },
    {
        "MedDRA v12.0 Code": 10027313,
        "SOC": "Reproductive system and breast disorders",
        "name": "Menorrhagia",
        "Grade 1": "Mild; iron supplements indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated (e.g., hormones)",
        "Grade 3": "Severe; transfusion indicated; surgical intervention indicated (e.g., hysterectomy)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by abnormally heavy vaginal bleeding during menses."
    },
    {
        "MedDRA v12.0 Code": 10065823,
        "SOC": "Reproductive system and breast disorders",
        "name": "Nipple deformity",
        "Grade 1": "Asymptomatic; asymmetry with slight retraction and/or thickening of the nipple areolar complex",
        "Grade 2": "Symptomatic; asymmetry of nipple areolar complex with moderate retraction and/or thickening of the nipple areolar complex",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a malformation of the nipple."
    },
    {
        "MedDRA v12.0 Code": 10030300,
        "SOC": "Reproductive system and breast disorders",
        "name": "Oligospermia",
        "Grade 1": "Sperm concentration >48 million/mL or motility >68%",
        "Grade 2": "Sperm concentration 13 - 48 million/mL or motility 32 - 68%",
        "Grade 3": "Sperm concentration <13 million/mL or motility <32%",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in the number of spermatozoa in the semen."
    },
    {
        "MedDRA v12.0 Code": 10065763,
        "SOC": "Reproductive system and breast disorders",
        "name": "Ovarian hemorrhage",
        "Grade 1": "Minimal bleeding identified on imaging study or laproscopy; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic  intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the ovary."
    },
    {
        "MedDRA v12.0 Code": 10033279,
        "SOC": "Reproductive system and breast disorders",
        "name": "Ovarian rupture",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by tearing or disruption of the ovarian tissue."
    },
    {
        "MedDRA v12.0 Code": 10033314,
        "SOC": "Reproductive system and breast disorders",
        "name": "Ovulation pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in one side of the abdomen between menstrual cycles, around the time of the discharge of the ovum from the ovarian follicle."
    },
    {
        "MedDRA v12.0 Code": 10064026,
        "SOC": "Reproductive system and breast disorders",
        "name": "Pelvic floor muscle weakness",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic, not interfering with bladder, bowel, or vaginal function; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a reduction in the strength of the muscles of the pelvic floor."
    },
    {
        "MedDRA v12.0 Code": 10034263,
        "SOC": "Reproductive system and breast disorders",
        "name": "Pelvic pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the pelvis."
    },
    {
        "MedDRA v12.0 Code": 10034310,
        "SOC": "Reproductive system and breast disorders",
        "name": "Penile pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the penis."
    },
    {
        "MedDRA v12.0 Code": 10061339,
        "SOC": "Reproductive system and breast disorders",
        "name": "Perineal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the area between the genital organs and the anus."
    },
    {
        "MedDRA v12.0 Code": 10036601,
        "SOC": "Reproductive system and breast disorders",
        "name": "Premature menopause",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Present",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by ovarian failure before the age of 40. Symptoms include hot flashes, night sweats, mood swings and a decrease in sex drive."
    },
    {
        "MedDRA v12.0 Code": 10055325,
        "SOC": "Reproductive system and breast disorders",
        "name": "Prostatic hemorrhage",
        "Grade 1": "Minimal bleeding identified on imaging study; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the prostate gland."
    },
    {
        "MedDRA v12.0 Code": 10055026,
        "SOC": "Reproductive system and breast disorders",
        "name": "Prostatic obstruction",
        "Grade 1": "Diagnostic observations only; intervention not indicated",
        "Grade 2": "Mild symptoms; elective intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by compression of the urethra secondary to enlargement of the prostate gland. This results in voiding difficulties (straining to void, slow urine stream, and incomplete emptying of the bladder)."
    },
    {
        "MedDRA v12.0 Code": 10036968,
        "SOC": "Reproductive system and breast disorders",
        "name": "Prostatic pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the prostate gland."
    },
    {
        "MedDRA v12.0 Code": 10039757,
        "SOC": "Reproductive system and breast disorders",
        "name": "Scrotal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the scrotal area."
    },
    {
        "MedDRA v12.0 Code": 10065762,
        "SOC": "Reproductive system and breast disorders",
        "name": "Spermatic cord hemorrhage",
        "Grade 1": "Minimal bleeding identified on imaging study; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the spermatic cord."
    },
    {
        "MedDRA v12.0 Code": 10065805,
        "SOC": "Reproductive system and breast disorders",
        "name": "Spermatic cord obstruction",
        "Grade 1": "Diagnostic observations only; intervention not indicated",
        "Grade 2": "Mild symptoms; elective intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by blockage of the normal flow of the contents of the spermatic cord."
    },
    {
        "MedDRA v12.0 Code": 10043306,
        "SOC": "Reproductive system and breast disorders",
        "name": "Testicular disorder",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic but not interfering with urination or sexual activities; intervention not indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; interfering with urination or sexual function; limiting self care ADL; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by involvement of the testis."
    },
    {
        "MedDRA v12.0 Code": 10055347,
        "SOC": "Reproductive system and breast disorders",
        "name": "Testicular hemorrhage",
        "Grade 1": "Minimal bleeding identified on imaging study; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the testis."
    },
    {
        "MedDRA v12.0 Code": 10043345,
        "SOC": "Reproductive system and breast disorders",
        "name": "Testicular pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the testis."
    },
    {
        "MedDRA v12.0 Code": 10065811,
        "SOC": "Reproductive system and breast disorders",
        "name": "Uterine fistula",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the uterus and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10046789,
        "SOC": "Reproductive system and breast disorders",
        "name": "Uterine hemorrhage",
        "Grade 1": "Minimal bleeding identified on imaging study; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the uterus."
    },
    {
        "MedDRA v12.0 Code": 10065928,
        "SOC": "Reproductive system and breast disorders",
        "name": "Uterine obstruction",
        "Grade 1": "Diagnostic observations only; intervention not indicated",
        "Grade 2": "Mild symptoms; elective intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by blockage of the uterine outlet."
    },
    {
        "MedDRA v12.0 Code": 10046809,
        "SOC": "Reproductive system and breast disorders",
        "name": "Uterine pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the uterus."
    },
    {
        "MedDRA v12.0 Code": 10046901,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal discharge",
        "Grade 1": "Mild vaginal discharge (greater than baseline for patient)",
        "Grade 2": "Moderate to heavy vaginal discharge; use of perineal pad or tampon indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by vaginal secretions. Mucus produced by the cervical glands is discharged from the vagina naturally, especially during the childbearing years."
    },
    {
        "MedDRA v12.0 Code": 10046904,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal dryness",
        "Grade 1": "Mild vaginal dryness not interfering with sexual function",
        "Grade 2": "Moderate vaginal dryness interfering with sexual function or causing frequent discomfort",
        "Grade 3": "Severe vaginal dryness resulting in dyspareunia or severe discomfort",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an uncomfortable feeling of itching and burning in the vagina."
    },
    {
        "MedDRA v12.0 Code": 10065813,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal fistula",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the vagina and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10046912,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal hemorrhage",
        "Grade 1": "Minimal bleeding identified on clinical exam or imaging study; intervention not indicated",
        "Grade 2": "Moderate bleeding; medical intervention indicated",
        "Grade 3": "Severe bleeding; transfusion indicated; radiologic or endoscopic intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the vagina."
    },
    {
        "MedDRA v12.0 Code": 10046916,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal inflammation",
        "Grade 1": "Mild discomfort or pain, edema, or redness",
        "Grade 2": "Moderate discomfort or pain, edema, or redness; limiting instrumental ADL",
        "Grade 3": "Severe discomfort or pain, edema, or redness; limiting self care ADL; small areas of mucosal ulceration",
        "Grade 4": "Widespread areas of mucosal ulceration; life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation involving the vagina. Symptoms may include redness, edema, marked discomfort and an increase in vaginal discharge."
    },
    {
        "MedDRA v12.0 Code": 10065817,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal obstruction",
        "Grade 1": "Diagnostic observations only; intervention not indicated",
        "Grade 2": "Mild symptoms; elective intervention indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by blockage of vaginal canal."
    },
    {
        "MedDRA v12.0 Code": 10046937,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a sensation of marked discomfort in the vagina."
    },
    {
        "MedDRA v12.0 Code": 10065818,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal perforation",
        "Grade 1": "Asymptomatic clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic and intervention not indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a rupture in the vaginal wall."
    },
    {
        "MedDRA v12.0 Code": 10053496,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginal stricture",
        "Grade 1": "Asymptomatic; mild vaginal shortening or narrowing",
        "Grade 2": "Vaginal narrowing and/or shortening not interfering with physical examination",
        "Grade 3": "Vaginal narrowing and/or shortening interfering with the use of tampons, sexual activity or physical examination",
        "Grade 4": null,
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the vaginal canal."
    },
    {
        "MedDRA v12.0 Code": 10046947,
        "SOC": "Reproductive system and breast disorders",
        "name": "Vaginismus",
        "Grade 1": "Mild discomfort or pain associated with vaginal spasm/tightening; no impact upon sexual function or physical examination",
        "Grade 2": "Moderate discomfort or pain associated with vaginal spasm/tightening; disruption in sexual function and physical examination",
        "Grade 3": "Severe discomfort or pain associated with vaginal spasm/tightening; unable to tolerate vaginal penetration or physical examination",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by involuntary spasms of the pelvic floor muscles, resulting in pathologic tightness of the vaginal wall during penetration such as during sexual intercourse."
    },
    {
        "MedDRA v12.0 Code": 10038604,
        "SOC": "Reproductive system and breast disorders",
        "name": "Reproductive system and breast disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10001409,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Adult respiratory distress syndrome",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Present with radiologic findings; intubation not indicated",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by progressive and life-threatening pulmonary distress in the absence of an underlying pulmonary condition, usually following major trauma or surgery."
    },
    {
        "MedDRA v12.0 Code": 10001723,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Allergic rhinitis",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an inflammation of the nasal mucous membranes caused by an IgE-mediated response to external allergens. The inflammation may also involve the mucous membranes of the sinuses, eyes, middle ear, and pharynx. Symptoms include sneezing, nasal congestion, rhinorrhea and itching."
    },
    {
        "MedDRA v12.0 Code": 10002972,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Apnea",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Present; medical intervention indicated",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by cessation of breathing."
    },
    {
        "MedDRA v12.0 Code": 10003504,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Aspiration",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Altered eating habits; coughing or choking episodes after eating or swallowing; medical intervention indicated (e.g., suction or oxygen)",
        "Grade 3": "Dyspnea and pneumonia symptoms (e.g., aspiration pneumonia); hospitalization indicated; unable to aliment orally",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inhalation of solids or liquids into the lungs."
    },
    {
        "MedDRA v12.0 Code": 10003598,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Atelectasis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., dyspnea, cough); medical intervention indicated (e.g., chest physiotherapy, suctioning); bronchoscopic suctioning",
        "Grade 3": "Oxygen indicated; hospitalization or elective operative intervention indicated (e.g., stent, laser)",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the collapse of part or the entire lung."
    },
    {
        "MedDRA v12.0 Code": 10006437,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchial fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical management indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; endoscopic or operative intervention indicated (e.g., stent or primary closure)",
        "Grade 4": "Life-threatening consequences; urgent operative intervention with thoracoplasty, chronic open drainage or multiple thoracotomies indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the bronchus and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10006440,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchial obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., mild wheezing); endoscopic evaluation indicated; radiographic evidence of atelectasis/lobar collapse; medical management indicated (e.g., steroids, bronchodilators)",
        "Grade 3": "Shortness of breath with stridor; endoscopic intervention indicated (e.g., laser, stent placement)",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of a bronchus passage, most often by bronchial secretions and exudates."
    },
    {
        "MedDRA v12.0 Code": 10063524,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchial stricture",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., rhonchi or wheezing) but without respiratory distress; medical intervention indicated (e.g., steroids, bronchodilators)",
        "Grade 3": "Shortness of breath with stridor; endoscopic intervention indicated (e.g., laser, stent placement)",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the bronchial tube."
    },
    {
        "MedDRA v12.0 Code": 10053481,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchopleural fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; endoscopic or operative intervention indicated (e.g., stent or primary closure)",
        "Grade 4": "Life-threatening consequences; urgent operative intervention with thoracoplasty, chronic open drainage or multiple thoracotomies indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between a bronchus and the pleural cavity."
    },
    {
        "MedDRA v12.0 Code": 10065746,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchopulmonary hemorrhage",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or operative intervention indicated (e.g., hemostasis of bleeding site)",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the bronchial wall and/or lung parenchyma."
    },
    {
        "MedDRA v12.0 Code": 10006482,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Bronchospasm",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; oxygen saturation decreased",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a sudden contraction of the smooth muscles of the bronchial wall."
    },
    {
        "MedDRA v12.0 Code": 10051228,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Chylothorax",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; thoracentesis or tube drainage indicated",
        "Grade 3": "Severe symptoms; elective operative intervention indicated",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by milky pleural effusion (abnormal collection of fluid) resulting from accumulation of lymph fluid in the pleural cavity."
    },
    {
        "MedDRA v12.0 Code": 10011224,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Cough",
        "Grade 1": "Mild symptoms; nonprescription intervention indicated",
        "Grade 2": "Moderate symptoms, medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by sudden, often repetitive, spasmodic contraction of the thoracic cavity, resulting in violent release of air from the lungs and usually accompanied by a distinctive sound."
    },
    {
        "MedDRA v12.0 Code": 10013963,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Dyspnea",
        "Grade 1": "Shortness of breath with moderate exertion",
        "Grade 2": "Shortness of breath with minimal exertion; limiting instrumental ADL",
        "Grade 3": "Shortness of breath at rest; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an uncomfortable sensation of difficulty breathing."
    },
    {
        "MedDRA v12.0 Code": 10015090,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Epistaxis",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated (e.g., nasal packing, cauterization; topical vasoconstrictors)",
        "Grade 3": "Transfusion, radiologic, endoscopic, or operative intervention indicated (e.g., hemostasis of bleeding site)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the nose."
    },
    {
        "MedDRA v12.0 Code": 10020039,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Hiccups",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; interfering with sleep; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by repeated gulp sounds that result from an involuntary opening and closing of the glottis. This is attributed to a spasm of the diaphragm."
    },
    {
        "MedDRA v12.0 Code": 10020201,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Hoarseness",
        "Grade 1": "Mild or intermittent voice change; fully understandable; self-resolves",
        "Grade 2": "Moderate or persistent voice changes; may require occasional repetition but understandable on telephone; medical evaluation indicated",
        "Grade 3": "Severe voice changes including predominantly whispered speech",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by harsh and raspy voice arising from or spreading to the larynx."
    },
    {
        "MedDRA v12.0 Code": 10021143,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Hypoxia",
        "Grade 1": null,
        "Grade 2": "Decreased oxygen saturation with exercise (e.g., pulse oximeter <88%); intermittent supplemental oxygen",
        "Grade 3": "Decreased oxygen saturation at rest (e.g., pulse oximeter <88% or PaO2 <=55 mm Hg)",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a decrease in the level of oxygen in the body."
    },
    {
        "MedDRA v12.0 Code": 10023838,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal edema",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated (e.g., dexamethasone, epinephrine, antihistamines)",
        "Grade 3": "Stridor; respiratory distress; hospitalization indicated",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by swelling due to an excessive accumulation of fluid in the larynx."
    },
    {
        "MedDRA v12.0 Code": 10065786,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical management indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; endoscopic or operative intervention indicated (e.g., stent or primary closure)",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated (e.g., thoracoplasty, chronic open drainage or multiple thoracotomies)",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the larynx and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10065759,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal hemorrhage",
        "Grade 1": "Mild cough or trace hemoptysis; laryngoscopic findings",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or operative intervention indicated (e.g., hemostasis of bleeding site)",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the larynx."
    },
    {
        "MedDRA v12.0 Code": 10065735,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal inflammation",
        "Grade 1": "Mild sore throat; raspy voice",
        "Grade 2": "Moderate sore throat; analgesics indicated",
        "Grade 3": "Severe throat pain; endoscopic intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an inflammation involving the larynx."
    },
    {
        "MedDRA v12.0 Code": 10065880,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal mucositis",
        "Grade 1": "Endoscopic findings only; mild discomfort with normal intake",
        "Grade 2": "Moderate discomfort; altered oral intake",
        "Grade 3": "Severe pain; severely altered eating/swallowing; medical intervention indicated",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inflammation involving the mucous membrane of the larynx."
    },
    {
        "MedDRA v12.0 Code": 10059639,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal obstruction",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., noisy airway breathing), but causing no respiratory distress; medical management indicated (e.g., steroids); limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; stridor; endoscopic intervention indicated (e.g., stent, laser)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by blockage of the laryngeal airway."
    },
    {
        "MedDRA v12.0 Code": 10023862,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngeal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., noisy airway breathing), but causing no respiratory distress; medical management indicated (e.g., steroids)",
        "Grade 3": "Limiting self care ADL; stridor; endoscopic intervention indicated (e.g., stent, laser)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the laryngeal airway."
    },
    {
        "MedDRA v12.0 Code": 10062667,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngopharyngeal dysesthesia",
        "Grade 1": "Mild symptoms; no anxiety; intervention not indicated",
        "Grade 2": "Moderate symptoms; mild anxiety, but no dyspnea; short duration of observation and or anxiolytic indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; dyspnea and swallowing difficulty; limiting self care ADL",
        "Grade 4": "Life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by an uncomfortable persistent sensation in the area of the laryngopharynx."
    },
    {
        "MedDRA v12.0 Code": 10023891,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Laryngospasm",
        "Grade 1": null,
        "Grade 2": "Transient episode; intervention not indicated",
        "Grade 3": "Recurrent episodes; noninvasive intervention indicated (e.g., breathing technique, pressure point massage)",
        "Grade 4": "Persistent or severe episodes associated with syncope; urgent intervention indicated (e.g., fiberoptic laryngoscopy, intubation, botox injection)",
        "Grade 5": "Death",
        "description": "A disorder characterized by paroxysmal spasmodic muscular contraction of the vocal cords."
    },
    {
        "MedDRA v12.0 Code": 10056356,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Mediastinal hemorrhage",
        "Grade 1": "Radiologic evidence only; minimal symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated (e.g., hemostasis of bleeding site)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the mediastinum."
    },
    {
        "MedDRA v12.0 Code": 10028735,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Nasal congestion",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Associated with bloody nasal discharge or epistaxis",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by obstruction of the nasal passage due to mucosal edema."
    },
    {
        "MedDRA v12.0 Code": 10034825,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngeal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; endoscopic or operative intervention indicated (e.g., stent or primary closure)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the pharynx and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10055315,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngeal hemorrhage",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or operative intervention indicated (e.g., hemostasis of bleeding site)",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the pharynx."
    },
    {
        "MedDRA v12.0 Code": 10065881,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngeal mucositis",
        "Grade 1": "Endoscopic findings only; minimal symptoms with normal oral intake; mild pain but analgesics not indicated",
        "Grade 2": "Moderate pain and analgesics indicated; altered oral intake; limiting instrumental ADL",
        "Grade 3": "Severe pain; unable to adequately aliment or hydrate orally; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inflammation involving the mucous membrane of the pharynx."
    },
    {
        "MedDRA v12.0 Code": 10065706,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngeal necrosis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Inability to aliment adequately by GI tract; tube feeding or TPN indicated; radiologic, endoscopic, or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a necrotic process occurring in the pharynx."
    },
    {
        "MedDRA v12.0 Code": 10050028,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngeal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., noisy airway breathing), but causing no respiratory distress; medical management indicated (e.g., steroids); limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; stridor; endoscopic intervention indicated (e.g., stent, laser)",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the pharyngeal airway."
    },
    {
        "MedDRA v12.0 Code": 10034844,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pharyngolaryngeal pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the pharyngolaryngeal region."
    },
    {
        "MedDRA v12.0 Code": 10035598,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pleural effusion",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; intervention indicated (e.g., diuretics or limited therapeutic thoracentesis)",
        "Grade 3": "Symptomatic with respiratory distress and hypoxia; surgical intervention including chest tube or pleurodesis indicated",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in amounts of fluid within the pleural cavity. Symptoms include shortness of breath, cough and marked chest discomfort."
    },
    {
        "MedDRA v12.0 Code": 10055319,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pleural hemorrhage",
        "Grade 1": "Asymptomatic; mild hemorrhage confirmed by thoracentesis",
        "Grade 2": "Symptomatic or associated with pneumothorax; chest tube drainage indicated",
        "Grade 3": ">1000 ml of blood evacuated; persistent bleeding (150-200 ml/hr for 2 - 4 hr); persistent transfusion indicated; elective operative intervention indicated",
        "Grade 4": "Life-threatening respiratory or hemodynamic compromise; intubation or urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by bleeding from the pleural cavity."
    },
    {
        "MedDRA v12.0 Code": 10035623,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pleuritic pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the pleura."
    },
    {
        "MedDRA v12.0 Code": 10035742,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pneumonitis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; oxygen indicated",
        "Grade 4": "Life-threatening respiratory compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation focally or diffusely affecting the lung parenchyma."
    },
    {
        "MedDRA v12.0 Code": 10035759,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pneumothorax",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; intervention indicated (e.g., tube placement without sclerosis)",
        "Grade 3": "Sclerosis and/or operative intervention indicated; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by abnormal presence of air in the pleural cavity resulting in the collapse of the lung."
    },
    {
        "MedDRA v12.0 Code": 10036402,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Postnasal drip",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by excessive mucous secretion in the back of the nasal cavity or throat, causing sore throat and/or coughing."
    },
    {
        "MedDRA v12.0 Code": 10036790,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Productive cough",
        "Grade 1": "Occasional/minimal production of sputum with cough",
        "Grade 2": "Moderate sputum production; limiting instrumental ADL",
        "Grade 3": "Persistent or copious production of sputum; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by expectorated secretions upon coughing."
    },
    {
        "MedDRA v12.0 Code": 10037375,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pulmonary edema",
        "Grade 1": "Radiologic findings only; minimal dyspnea on exertion",
        "Grade 2": "Moderate dyspnea on exertion; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe dyspnea or dyspnea at rest; oxygen indicated; limiting self care ADL",
        "Grade 4": "Life-threatening respiratory compromise; urgent intervention or intubation with ventilatory support indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by accumulation of fluid in the lung tissues that causes a disturbance of the gas exchange that may lead to respiratory failure."
    },
    {
        "MedDRA v12.0 Code": 10037383,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pulmonary fibrosis",
        "Grade 1": "Mild hypoxemia; radiologic pulmonary fibrosis <25% of lung volume",
        "Grade 2": "Moderate hypoxemia; evidence of pulmonary hypertension; radiographic pulmonary fibrosis 25 - 50%",
        "Grade 3": "Severe hypoxemia; evidence of right-sided heart failure; radiographic pulmonary fibrosis >50 - 75%",
        "Grade 4": "Life-threatening consequences (e.g., hemodynamic/pulmonary complications); intubation with ventilatory support indicated; radiographic pulmonary fibrosis >75% with severe honeycombing",
        "Grade 5": "Death",
        "description": "A disorder characterized by the replacement of the lung tissue by connective tissue, leading to progressive dyspnea, respiratory failure or right heart failure."
    },
    {
        "MedDRA v12.0 Code": 10065873,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pulmonary fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical management indicated; limiting instrumental ADL",
        "Grade 3": "Limiting self care ADL; endoscopic stenting or operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the lung and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10037400,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Pulmonary hypertension",
        "Grade 1": "Minimal dyspnea; findings on physical exam or other evaluation",
        "Grade 2": "Moderate dyspnea, cough; requiring evaluation by cardiac catheterization and medical intervention",
        "Grade 3": "Severe symptoms, associated with hypoxemia, right heart failure; oxygen indicated",
        "Grade 4": "Life-threatening airway consequences; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in pressure within the pulmonary circulation due to lung or heart disorder."
    },
    {
        "MedDRA v12.0 Code": 10038695,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Respiratory failure",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Life-threatening consequences; urgent intervention, intubation, or ventilatory support indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by impaired gas exchange by the respiratory system resulting in hypoxemia and a decrease in oxygenation of the tissues that may be associated with an increase in arterial levels of carbon dioxide."
    },
    {
        "MedDRA v12.0 Code": 10038921,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Retinoic acid syndrome",
        "Grade 1": "Fluid retention; <3 kg of weight gain; intervention with fluid restriction and/or diuretics indicated",
        "Grade 2": "Moderate signs or symptoms; steroids indicated",
        "Grade 3": "Severe symptoms; hospitalization indicated",
        "Grade 4": "Life-threatening consequences; ventilatory support indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by weight gain, dyspnea, pleural and pericardial effusions, leukocytosis and/or renal failure originally described in patients treated with all-trans retinoic acid."
    },
    {
        "MedDRA v12.0 Code": 10062244,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Sinus disorder",
        "Grade 1": "Asymptomatic mucosal crusting; blood-tinged secretions",
        "Grade 2": "Symptomatic stenosis or edema/narrowing interfering with airflow; limiting instrumental ADL",
        "Grade 3": "Stenosis with significant nasal obstruction; limiting self care ADL",
        "Grade 4": "Necrosis of soft tissue or bone; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by involvement of the paranasal sinuses."
    },
    {
        "MedDRA v12.0 Code": 10040975,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Sleep apnea",
        "Grade 1": "Snoring and nocturnal sleep arousal without apneic periods",
        "Grade 2": "Moderate apnea and oxygen desaturation; excessive daytime sleepiness; medical evaluation indicated; limiting instrumental ADL",
        "Grade 3": "Oxygen desaturation; associated with hypertension; medical intervention indicated;  limiting self care ADL",
        "Grade 4": "Cardiovascular or neuropsychiatric symptoms; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by cessation of breathing for short periods during sleep."
    },
    {
        "MedDRA v12.0 Code": 10041232,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Sneezing",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the involuntary expulsion of air from the nose."
    },
    {
        "MedDRA v12.0 Code": 10041367,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Sore throat",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL; limiting ability to swallow",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by of marked discomfort in the throat"
    },
    {
        "MedDRA v12.0 Code": 10042241,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Stridor",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Respiratory distress limiting self care ADL; medical intervention indicated",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a high pitched breathing sound due to laryngeal or upper airway obstruction."
    },
    {
        "MedDRA v12.0 Code": 10065787,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Tracheal fistula",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; tube thoracostomy or medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL; endoscopic or operative intervention indicated (e.g., stent or primary closure)",
        "Grade 4": "Life-threatening consequences; urgent operative intervention indicated (e.g., thoracoplasty, chronic open drainage or multiple thoracotomies)",
        "Grade 5": "Death",
        "description": "A disorder characterized by an abnormal communication between the trachea and another organ or anatomic site."
    },
    {
        "MedDRA v12.0 Code": 10065900,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Tracheal mucositis",
        "Grade 1": "Endoscopic findings only; minimal hemoptysis, pain, or respiratory symptoms",
        "Grade 2": "Moderate symptoms; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe pain; hemorrhage or respiratory symptoms; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an inflammation involving the mucous membrane of the trachea."
    },
    {
        "MedDRA v12.0 Code": 10050816,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Tracheal stenosis",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic (e.g., noisy airway breathing), but causing no respiratory distress; medical management indicated (e.g., steroids)",
        "Grade 3": "Stridor or respiratory distress limiting self care ADL; endoscopic intervention indicated (e.g., stent, laser)",
        "Grade 4": "Life-threatening airway compromise; urgent intervention indicated (e.g., tracheotomy or intubation)",
        "Grade 5": "Death",
        "description": "A disorder characterized by a narrowing of the trachea."
    },
    {
        "MedDRA v12.0 Code": 10047681,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Voice alteration",
        "Grade 1": "Mild or intermittent change from normal voice",
        "Grade 2": "Moderate or persistent change from normal voice; still understandable",
        "Grade 3": "Severe voice changes including predominantly whispered speech; may require frequent repetition or face-to-face contact for understandability; may require assistive technology",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a change in the sound and/or speed of the voice."
    },
    {
        "MedDRA v12.0 Code": 10047924,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Wheezing",
        "Grade 1": "Detectable airway noise with minimal symptoms",
        "Grade 2": "Moderate symptoms; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Severe respiratory symptoms limiting self care ADL; oxygen therapy or hospitalization indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a high-pitched, whistling sound during breathing. It results from the narrowing or obstruction of the respiratory airways."
    },
    {
        "MedDRA v12.0 Code": 10038738,
        "SOC": "Respiratory, thoracic and mediastinal disorders",
        "name": "Respiratory, thoracic and mediastinal disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling; limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10001760,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Alopecia",
        "Grade 1": "Hair loss of <50% of normal for that individual that is not obvious from a distance but only on close inspection; a different hair style may be required to cover the hair loss but it does not require a wig or hair piece to camouflage",
        "Grade 2": "Hair loss of >=50% normal for that individual that is readily apparent to others; a wig or hair piece is necessary if the patient desires to completely camouflage the hair loss; associated with psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a decrease in density of hair compared to normal for a given individual at a given age and body location."
    },
    {
        "MedDRA v12.0 Code": 10005901,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Body odor",
        "Grade 1": "Mild odor; physician intervention not indicated; self care interventions",
        "Grade 2": "Pronounced odor; psychosocial impact; patient seeks medical intervention",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an abnormal body smell resulting from the growth of bacteria on the body."
    },
    {
        "MedDRA v12.0 Code": 10006556,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Bullous dermatitis",
        "Grade 1": "Asymptomatic; blisters covering <10% BSA",
        "Grade 2": "Blisters covering 10 - 30% BSA; painful blisters; limiting instrumental ADL",
        "Grade 3": "Blisters covering >30% BSA; limiting self care ADL",
        "Grade 4": "Blisters covering >30% BSA; associated with fluid or electrolyte abnormalities; ICU care or burn unit indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation of the skin characterized by the presence of bullae which are filled with fluid."
    },
    {
        "MedDRA v12.0 Code": 10013786,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Dry skin",
        "Grade 1": "Covering <10% BSA and no associated erythema or pruritus",
        "Grade 2": "Covering 10 - 30% BSA and associated with erythema or pruritus; limiting instrumental ADL",
        "Grade 3": "Covering >30% BSA and associated with pruritus; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by flaky and dull skin; the pores are generally fine, the texture is a papery thin texture."
    },
    {
        "MedDRA v12.0 Code": 10015218,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Erythema multiforme",
        "Grade 1": "Target lesions covering <10% BSA and not associated with skin tenderness",
        "Grade 2": "Target lesions covering 10 - 30% BSA and associated with skin tenderness",
        "Grade 3": "Target lesions covering >30% BSA and associated with oral or genital erosions",
        "Grade 4": "Target lesions covering >30% BSA; associated with fluid or electrolyte abnormalities; ICU care or burn unit indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by target lesions (a pink-red ring around a pale center)."
    },
    {
        "MedDRA v12.0 Code": 10015277,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Erythroderma",
        "Grade 1": null,
        "Grade 2": "Erythema covering >90% BSA without associated symptoms; limiting instrumental ADL",
        "Grade 3": "Erythema covering >90% BSA with associated symptoms (e.g., pruritus or tenderness); limiting self care ADL",
        "Grade 4": "Erythema covering >90% BSA with associated fluid or electrolyte abnormalities; ICU care or burn unit indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by generalized inflammatory erythema and exfoliation. The inflammatory process involves > 90% of the body surface area."
    },
    {
        "MedDRA v12.0 Code": 10016241,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Fat atrophy",
        "Grade 1": "Covering <10% BSA and asymptomatic",
        "Grade 2": "Covering 10 - 30% BSA and associated with erythema or tenderness; limiting instrumental ADL",
        "Grade 3": "Covering >30% BSA; associated with erythema or tenderness; limiting self-care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by shrinking of adipose tissue."
    },
    {
        "MedDRA v12.0 Code": 10020112,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Hirsutism",
        "Grade 1": "In women, increase in length, thickness or density of hair in a male distribution that the patient is able to camouflage by periodic shaving, bleaching, or removal of hair",
        "Grade 2": "In women, increase in length, thickness or density of hair in a male distribution that requires daily shaving or consistent destructive means of hair removal to camouflage; associated with psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the presence of excess hair growth in women in anatomic sites where growth is considered to be a secondary male characteristic and under androgen control (beard, moustache, chest, abdomen)."
    },
    {
        "MedDRA v12.0 Code": 10020642,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Hyperhidrosis",
        "Grade 1": "Limited to one site (palms, soles, or axillae); self care interventions",
        "Grade 2": "Involving >1 site; patient seeks medical intervention; associated with psychosocial impact",
        "Grade 3": "Generalized involving sites other than palms, soles, or axillae; associated with electrolyte/hemodynamic imbalance",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by excessive perspiration."
    },
    {
        "MedDRA v12.0 Code": 10020864,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Hypertrichosis",
        "Grade 1": "Increase in length, thickness or density of hair that the patient is either able to camouflage by periodic shaving or removal of hairs or is not concerned enough about the overgrowth to use any form of hair removal",
        "Grade 2": "Increase in length, thickness or density of hair at least on the usual exposed areas of the body [face (not limited to beard/moustache area) plus/minus arms] that requires frequent  shaving or use of destructive means of hair removal to camouflage; associated with psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by hair density or length beyond the accepted limits of normal in a particular body region, for a particular age or race."
    },
    {
        "MedDRA v12.0 Code": 10021013,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Hypohidrosis",
        "Grade 1": null,
        "Grade 2": "Symptomatic; limiting instrumental ADL",
        "Grade 3": "Increase in body temperature; limiting self care ADL",
        "Grade 4": "Heat stroke",
        "Grade 5": "Death",
        "description": "A disorder characterized by reduced sweating."
    },
    {
        "MedDRA v12.0 Code": 10062315,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Lipohypertrophy",
        "Grade 1": "Asymptomatic and covering <10% BSA",
        "Grade 2": "Covering 10 - 30% BSA and associated tenderness; limiting instrumental ADL",
        "Grade 3": "Covering >30% BSA and associated tenderness and narcotics or NSAIDs indicated; lipohypertrophy; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by hypertrophy of the subcutaneous adipose tissue at the site of multiple subcutaneous injections of insulin."
    },
    {
        "MedDRA v12.0 Code": 10028691,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Nail discoloration",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a change in the color of the nail plate."
    },
    {
        "MedDRA v12.0 Code": 10049281,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Nail loss",
        "Grade 1": "Asymptomatic separation of the nail bed from the nail plate or nail loss",
        "Grade 2": "Symptomatic separation of the nail bed from the nail plate or nail loss; limiting instrumental ADL",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by loss of all or a portion of the nail."
    },
    {
        "MedDRA v12.0 Code": 10062283,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Nail ridging",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by vertical or horizontal ridges on the nails."
    },
    {
        "MedDRA v12.0 Code": 10033474,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Pain of skin",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the skin."
    },
    {
        "MedDRA v12.0 Code": 10054524,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Palmar-plantar erythrodysesthesia syndrome",
        "Grade 1": "Minimal skin changes or dermatitis (e.g., erythema, edema, or hyperkeratosis) without pain",
        "Grade 2": "Skin changes (e.g., peeling, blisters, bleeding, edema, or hyperkeratosis) with pain; limiting instrumental ADL",
        "Grade 3": "Severe skin changes (e.g., peeling, blisters, bleeding, edema, or hyperkeratosis) with pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by redness, marked discomfort, swelling, and tingling in the palms of the hands or the soles of the feet."
    },
    {
        "MedDRA v12.0 Code": 10054541,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Periorbital edema",
        "Grade 1": "Soft or non-pitting",
        "Grade 2": "Indurated or pitting edema; topical intervention indicated",
        "Grade 3": "Edema associated with visual disturbance; increased intraocular pressure, glaucoma or retinal hemorrhage; optic neuritis; diuretics indicated; operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by swelling due to an excessive accumulation of fluid around the orbits of the face."
    },
    {
        "MedDRA v12.0 Code": 10034966,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Photosensitivity",
        "Grade 1": "Painless erythema and erythema covering <10% BSA",
        "Grade 2": "Tender erythema covering 10 - 30% BSA",
        "Grade 3": "Erythema covering >30% BSA and erythema with blistering; photosensitivity; oral corticosteroid therapy indicated; pain control indicated (e.g., narcotics or NSAIDs)",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by an increase in sensitivity of the skin to light."
    },
    {
        "MedDRA v12.0 Code": 10037087,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Pruritus",
        "Grade 1": "Mild or localized; topical intervention indicated",
        "Grade 2": "Intense or widespread; intermittent; skin changes from scratching (e.g., edema, papulation, excoriations, lichenification, oozing/crusts); oral intervention indicated; limiting instrumental ADL",
        "Grade 3": "Intense or widespread; constant; limiting self care ADL or sleep; oral corticosteroid or immunosuppressive therapy indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an intense itching sensation."
    },
    {
        "MedDRA v12.0 Code": 10037549,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Purpura",
        "Grade 1": "Combined area of lesions covering <10% BSA",
        "Grade 2": "Combined area of lesions covering 10 - 30% BSA; bleeding with trauma",
        "Grade 3": "Combined area of lesions covering >30% BSA; spontaneous bleeding",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by hemorrhagic areas of the skin and mucous membrane. Newer lesions appear reddish in color. Older lesions are usually a darker purple color and eventually become a brownish-yellow color."
    },
    {
        "MedDRA v12.0 Code": 10037847,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Rash acneiform",
        "Grade 1": "Papules and/or pustules covering <10% BSA, which may or may not be associated with symptoms of pruritus or tenderness",
        "Grade 2": "Papules and/or pustules covering 10 - 30% BSA, which may or may not be associated with symptoms of pruritus or tenderness; associated with psychosocial impact; limiting instrumental ADL",
        "Grade 3": "Papules and/or pustules covering >30% BSA, which may or may not be associated with symptoms of pruritus or tenderness; limiting self care ADL; associated with local superinfection with oral antibiotics indicated",
        "Grade 4": "Papules and/or pustules covering any % BSA, which may or may not be associated with symptoms of pruritus or tenderness and are associated with extensive superinfection with IV antibiotics indicated; life-threatening consequences",
        "Grade 5": "Death",
        "description": "A disorder characterized by an eruption of papules and pustules, typically appearing in face, scalp, upper chest and back."
    },
    {
        "MedDRA v12.0 Code": 10037868,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Rash maculo-papular",
        "Grade 1": "Macules/papules covering <10% BSA with or without symptoms (e.g., pruritus, burning, tightness)",
        "Grade 2": "Macules/papules covering 10 - 30% BSA with or without symptoms (e.g., pruritus, burning, tightness); limiting instrumental ADL",
        "Grade 3": "Macules/papules covering >30% BSA with or without associated symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the presence of macules (flat) and papules (elevated). Also known as morbillform rash, it is one of the most common cutaneous adverse events, frequently affecting the upper trunk, spreading centripetally and associated with pruritis."
    },
    {
        "MedDRA v12.0 Code": 10049120,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Scalp pain",
        "Grade 1": "Mild pain",
        "Grade 2": "Moderate pain; limiting instrumental ADL",
        "Grade 3": "Severe pain; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by marked discomfort sensation in the skin covering the top and the back of the head."
    },
    {
        "MedDRA v12.0 Code": 10040799,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin atrophy",
        "Grade 1": "Covering <10% BSA; associated with telangiectasias or changes in skin color",
        "Grade 2": "Covering 10 - 30% BSA; associated with striae or adnexal structure loss",
        "Grade 3": "Covering >30% BSA; associated with ulceration",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the degeneration and thinning of the epidermis and dermis."
    },
    {
        "MedDRA v12.0 Code": 10040865,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin hyperpigmentation",
        "Grade 1": "Hyperpigmentation covering <10% BSA; no psychosocial impact",
        "Grade 2": "Hyperpigmentation covering >10% BSA; associated psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by darkening of the skin due to excessive melanin deposition."
    },
    {
        "MedDRA v12.0 Code": 10040868,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin hypopigmentation",
        "Grade 1": "Hypopigmentation or depigmentation covering <10% BSA; no psychosocial impact",
        "Grade 2": "Hypopigmentation or depigmentation covering >10% BSA; associated psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by loss of skin pigment."
    },
    {
        "MedDRA v12.0 Code": 10051837,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin induration",
        "Grade 1": "Mild induration, able to move skin parallel to plane (sliding) and perpendicular to skin (pinching up)",
        "Grade 2": "Moderate induration, able to slide skin, unable to pinch skin; limiting instrumental ADL",
        "Grade 3": "Severe induration, unable to slide or pinch skin; limiting joint movement or orifice (e.g., mouth, anus); limiting self care ADL",
        "Grade 4": "Generalized; associated with signs or symptoms of impaired breathing or feeding",
        "Grade 5": "Death",
        "description": "A disorder characterized by an area of hardness in the skin."
    },
    {
        "MedDRA v12.0 Code": 10040947,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin ulceration",
        "Grade 1": "Combined area of ulcers <1 cm; nonblanchable erythema of intact skin with associated warmth or edema",
        "Grade 2": "Combined area of ulcers 1 - 2 cm; partial thickness skin loss involving skin or subcutaneous fat",
        "Grade 3": "Combined area of ulcers >2 cm; full-thickness skin loss involving damage to or necrosis of subcutaneous tissue that may extend down to fascia",
        "Grade 4": "Any size ulcer with extensive destruction, tissue necrosis, or damage to muscle, bone, or supporting structures with or without full thickness skin loss",
        "Grade 5": "Death",
        "description": "A disorder characterized by circumscribed, inflammatory and necrotic erosive lesion on the skin."
    },
    {
        "MedDRA v12.0 Code": 10042033,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Stevens-Johnson syndrome",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": "Skin sloughing covering <10% BSA with associated signs (e.g., erythema, purpura, epidermal detachment and mucous membrane detachment)",
        "Grade 4": "Skin sloughing covering 10 - 30% BSA with associated signs (e.g., erythema, purpura, epidermal detachment and mucous membrane detachment)",
        "Grade 5": "Death",
        "description": "A disorder characterized by less than 10% total body skin area separation of dermis. The syndrome is thought to be a hypersensitivity complex affecting the skin and the mucous membranes."
    },
    {
        "MedDRA v12.0 Code": 10043189,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Telangiectasia",
        "Grade 1": "Telangiectasias covering <10% BSA",
        "Grade 2": "Telangiectasias covering >10% BSA; associated with psychosocial impact",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by local dilatation of small vessels resulting in red discoloration of the skin or mucous membranes."
    },
    {
        "MedDRA v12.0 Code": 10044223,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Toxic epidermal necrolysis",
        "Grade 1": null,
        "Grade 2": null,
        "Grade 3": null,
        "Grade 4": "Skin sloughing covering >=30% BSA with associated symptoms (e.g., erythema, purpura, or epidermal detachment)",
        "Grade 5": "Death",
        "description": "A disorder characterized by greater than 30% total body skin area separation of dermis. The syndrome is thought to be a hypersensitivity complex affecting the skin and the mucous membranes."
    },
    {
        "MedDRA v12.0 Code": 10046735,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Urticaria",
        "Grade 1": "Urticarial lesions covering <10% BSA; topical intervention indicated",
        "Grade 2": "Urticarial lesions covering 10 - 30% BSA; oral intervention indicated",
        "Grade 3": "Urticarial lesions covering >30% BSA; IV intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an itchy skin eruption characterized by wheals with pale interiors and well-defined red margins."
    },
    {
        "MedDRA v12.0 Code": 10040785,
        "SOC": "Skin and subcutaneous tissue disorders",
        "name": "Skin and subcutaneous tissue disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10027308,
        "SOC": "Social circumstances",
        "name": "Menopause",
        "Grade 1": "Menopause occurring at age 46 - 53 years of age",
        "Grade 2": "Menopause occurring at age 40 - 45 years of age",
        "Grade 3": "Menopause occurring before age 40 years of age",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by the permanent cessation of menses, usually defined by 12 consecutive months of amenorrhea in a woman over 45 years of age."
    },
    {
        "MedDRA v12.0 Code": 10041244,
        "SOC": "Social circumstances",
        "name": "Social circumstances - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10042613,
        "SOC": "Surgical and medical procedures",
        "name": "Surgical and medical procedures - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    },
    {
        "MedDRA v12.0 Code": 10007196,
        "SOC": "Vascular disorders",
        "name": "Capillary leak syndrome",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by leakage of intravascular fluids into the extravascular space. This syndrome is observed in patients who demonstrate a state of generalized leaky capillaries following shock syndromes, low-flow states, ischemia-reperfusion injuries, toxemias, medications, or poisoning.  It can lead to generalized edema and multiple organ failure."
    },
    {
        "MedDRA v12.0 Code": 10016825,
        "SOC": "Vascular disorders",
        "name": "Flushing",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate symptoms; medical intervention indicated; limiting instrumental ADL",
        "Grade 3": "Symptomatic, associated with hypotension and/or tachycardia; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by episodic reddening of the face."
    },
    {
        "MedDRA v12.0 Code": 10019428,
        "SOC": "Vascular disorders",
        "name": "Hematoma",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Minimally invasive evacuation or aspiration indicated",
        "Grade 3": "Transfusion, radiologic, endoscopic, or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a localized collection of blood, usually clotted, in an organ, space, or tissue, due to a break in the wall of a blood vessel."
    },
    {
        "MedDRA v12.0 Code": 10020407,
        "SOC": "Vascular disorders",
        "name": "Hot flashes",
        "Grade 1": "Mild symptoms; intervention not indicated",
        "Grade 2": "Moderate symptoms; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by an uncomfortable and temporary sensation of intense body warmth, flushing, sometimes accompanied by sweating upon cooling."
    },
    {
        "MedDRA v12.0 Code": 10020772,
        "SOC": "Vascular disorders",
        "name": "Hypertension",
        "Grade 1": "Prehypertension (systolic BP 120 - 139 mm Hg or diastolic BP  80 - 89 mm Hg)",
        "Grade 2": "Stage 1 hypertension (systolic BP 140 - 159 mm Hg or diastolic BP 90 - 99 mm Hg); medical intervention indicated; recurrent or persistent (>=24 hrs); symptomatic increase by >20 mm Hg (diastolic) or to >140/90 mm Hg if previously WNL; monotherapy indicated\n\nPediatric: recurrent or persistent (>=24 hrs) BP >ULN; monotherapy indicated",
        "Grade 3": "Stage 2 hypertension (systolic BP >=160 mm Hg or diastolic BP >=100 mm Hg); medical intervention indicated; more than one drug or more intensive therapy than previously used indicated\n\nPediatric: Same as adult",
        "Grade 4": "Life-threatening consequences (e.g., malignant hypertension, transient or permanent neurologic deficit, hypertensive crisis); urgent intervention indicated\n\nPediatric: Same as adult",
        "Grade 5": "Death",
        "description": "A disorder characterized by a pathological increase in blood pressure; a repeatedly elevation in the blood pressure exceeding 140 over 90 mm Hg."
    },
    {
        "MedDRA v12.0 Code": 10021097,
        "SOC": "Vascular disorders",
        "name": "Hypotension",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Non-urgent medical intervention indicated",
        "Grade 3": "Medical intervention or hospitalization indicated",
        "Grade 4": "Life-threatening and urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a blood pressure that is below the normal expected for an individual in a given environment."
    },
    {
        "MedDRA v12.0 Code": 10065773,
        "SOC": "Vascular disorders",
        "name": "Lymph leakage",
        "Grade 1": null,
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by the loss of lymph fluid into the surrounding tissue or body cavity."
    },
    {
        "MedDRA v12.0 Code": 10025233,
        "SOC": "Vascular disorders",
        "name": "Lymphedema",
        "Grade 1": "Trace thickening or faint discoloration",
        "Grade 2": "Marked discoloration; leathery skin texture; papillary formation; limiting instrumental ADL",
        "Grade 3": "Severe symptoms; limiting self care ADL",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by excessive fluid collection in tissues that causes swelling."
    },
    {
        "MedDRA v12.0 Code": 10048642,
        "SOC": "Vascular disorders",
        "name": "Lymphocele",
        "Grade 1": "Asymptomatic; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Symptomatic; medical intervention indicated",
        "Grade 3": "Severe symptoms; radiologic, endoscopic or elective operative intervention indicated",
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a cystic lesion containing lymph."
    },
    {
        "MedDRA v12.0 Code": 10034578,
        "SOC": "Vascular disorders",
        "name": "Peripheral ischemia",
        "Grade 1": null,
        "Grade 2": "Brief (<24 hrs) episode of ischemia managed non-surgically and without permanent deficit",
        "Grade 3": "Recurring or prolonged (>=24 hrs) and/or invasive intervention indicated",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by impaired circulation to an extremity."
    },
    {
        "MedDRA v12.0 Code": 10034879,
        "SOC": "Vascular disorders",
        "name": "Phlebitis",
        "Grade 1": null,
        "Grade 2": "Present",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by inflammation of the wall of a vein."
    },
    {
        "MedDRA v12.0 Code": 10042554,
        "SOC": "Vascular disorders",
        "name": "Superficial thrombophlebitis",
        "Grade 1": null,
        "Grade 2": "Present",
        "Grade 3": null,
        "Grade 4": null,
        "Grade 5": null,
        "description": "A disorder characterized by a blood clot and inflammation involving a superficial vein of the extremities. "
    },
    {
        "MedDRA v12.0 Code": 10042569,
        "SOC": "Vascular disorders",
        "name": "Superior vena cava syndrome",
        "Grade 1": "Asymptomatic; incidental finding of SVC thrombosis",
        "Grade 2": "Symptomatic; medical intervention indicated (e.g., anticoagulation, radiation or chemotherapy)",
        "Grade 3": "Severe symptoms; multi-modality intervention indicated  (e.g., anticoagulation, chemotherapy, radiation, stenting)",
        "Grade 4": "Life-threatening consequences; urgent multi-modality intervention indicated (e.g., lysis, thrombectomy, surgery)",
        "Grade 5": "Death",
        "description": "A disorder characterized by obstruction of the blood flow in the superior vena cava. Signs and symptoms include swelling and cyanosis of the face, neck, and upper arms, cough, orthopnea and headache."
    },
    {
        "MedDRA v12.0 Code": 10043565,
        "SOC": "Vascular disorders",
        "name": "Thromboembolic event",
        "Grade 1": "Venous thrombosis (e.g., superficial thrombosis)",
        "Grade 2": "Venous thrombosis (e.g., uncomplicated deep vein thrombosis), medical intervention indicated",
        "Grade 3": "Thrombosis (e.g., uncomplicated pulmonary embolism [venous], non-embolic cardiac mural [arterial] thrombus), medical intervention indicated",
        "Grade 4": "Life-threatening (e.g., pulmonary embolism, cerebrovascular event, arterial insufficiency); hemodynamic or neurologic instability; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by occlusion of a vessel by a thrombus that has migrated from a distal site via the blood stream."
    },
    {
        "MedDRA v12.0 Code": 10047115,
        "SOC": "Vascular disorders",
        "name": "Vasculitis",
        "Grade 1": "Asymptomatic, intervention not indicated",
        "Grade 2": "Moderate symptoms, medical intervention indicated",
        "Grade 3": "Severe symptoms, medical intervention indicated (e.g., steroids)",
        "Grade 4": "Life-threatening; evidence of peripheral or visceral ischemia; urgent intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by inflammation involving the wall of a vessel. "
    },
    {
        "MedDRA v12.0 Code": 10054692,
        "SOC": "Vascular disorders",
        "name": "Visceral arterial ischemia",
        "Grade 1": null,
        "Grade 2": "Brief (<24 hrs) episode of ischemia managed medically and without permanent deficit",
        "Grade 3": "Prolonged (>=24 hrs) or recurring symptoms and/or invasive intervention indicated",
        "Grade 4": "Life-threatening consequences; evidence of end organ damage; urgent operative intervention indicated",
        "Grade 5": "Death",
        "description": "A disorder characterized by a decrease in blood supply due to narrowing or blockage of a visceral (mesenteric) artery."
    },
    {
        "MedDRA v12.0 Code": 10047065,
        "SOC": "Vascular disorders",
        "name": "Vascular disorders - Other, specify",
        "Grade 1": "Asymptomatic or mild symptoms; clinical or diagnostic observations only; intervention not indicated",
        "Grade 2": "Moderate; minimal, local or noninvasive intervention indicated; limiting age-appropriate instrumental ADL",
        "Grade 3": "Severe or medically significant but not immediately life-threatening; hospitalization or prolongation of existing hospitalization indicated; disabling;  limiting self care ADL",
        "Grade 4": "Life-threatening consequences; urgent intervention indicated",
        "Grade 5": "Death",
        "description": null
    }
]   

/* 
 * Return the description for corresponding data tox elements
 */ 
exports.getDescription = (dataElement) => {
    switch(dataElement) {
    case "toxicity": 
        return "Side effects to treatment, important for effective evaluation of disease and treatment, based on Common Terminology Criteria for Adverse Events (CTCAE) version 4.03 (June 14, 2010).";
    case "adverseEvent":
        return "Any unfavorable and unintended sign, symptom, or disease temporally associated with the use of a medical treatment or procedure that may or may not be considered related to the medical treatment or procedure.";
    case "grade": 
        return "The severity of the adverse event. The CTCAE displays Grades 1 through 5 with unique clinical descriptions of severity for each adverse event.";
    case "attribution":
        return "The relationship of the event or cause to the adverse event.";
    default: 
        return null;
    }
}

exports.getAttributionOptions = () => {
    return attributionOptions;
}

exports.getGradeOptionsForAdverseEvent = (adverseEventName) => {
    const adverseEvent = exports.findAdverseEvent(adverseEventName);
    return gradeOptions.filter((grade) => {
        return (!Lang.isNull(adverseEvent[grade.name]));
    });
}

exports.getGradeOptions = () => {
    return gradeOptions;
}

exports.getAdverseEventOptionsForGrade = (currentGrade) => {
    return adverseEventOptions.filter((adverseEvent) => {
        return !Lang.isNull(adverseEvent[currentGrade]);
    });
}

exports.getAdverseEventOptions = () => {
    return adverseEventOptions;
}

/*
 * Finds the index of a possible attribution; returns -1 if it's invalid
 */
exports.findAttributionIndex = (possibleAttribution) => {
    return attributionOptions.findIndex((attribution) => { return attribution.name.toLowerCase() === possibleAttribution.toLowerCase()});
}

exports.findAttribution = (possibleAttribution) => {
    const index = exports.findAttributionIndex(possibleAttribution);
    if (index === -1) return null;
    return attributionOptions[index];
}

/*
 * Searches for attribution in attributionOptions list
 * Will return CodeableConcept object with empty strings if not found
 * If attribution found in list, function will return CodeableConcept with value, codeSystem, and displayText
 */
exports.getAttributionCodeableConcept = (possibleAttribution) => {
    const attribution = exports.findAttribution(possibleAttribution);
    let tuple = {
        value: "",
        codeSystem: "",
        displayText: ""
    };

    if(!Lang.isNull(attribution)) {
        tuple = {
            value: `#${attribution.name}`,
            codeSystem: "https://www.meddra.org/",
            displayText: attribution.name
        };
    }

    return codeableConcept.getCodeableConceptFromTuple(tuple);
}

/* 
 * Finds the index of a possible grade; returns -1 if it's invalid
 */ 
exports.findGradeIndex = (possibleGrade) => {
    return gradeOptions.findIndex((grade) => { return grade.name.toLowerCase() === possibleGrade.toLowerCase()});
}

exports.findGrade = (possibleGrade) => {
    const index = exports.findGradeIndex(possibleGrade);
    if (index === -1) return null;
    return gradeOptions[index];
}

/*
 * Searches for adverse event grade in gradeOptions list
 * Will return CodeableConcept object with empty strings if not found
 * If adverse event grade found in list, function will return CodeableConcept with value, codeSystem, and displayText
 */
exports.getAdverseEventGradeCodeableConcept = (possibleGrade) => {
    const grade = exports.findGrade(possibleGrade);
    let tuple = {
        value: "",
        codeSystem: "",
        displayText: ""
    };

    if(!Lang.isNull(grade)) {
        tuple = {
            value: grade.code,
            codeSystem: "http://ncimeta.nci.nih.gov",
            displayText: grade.name
        };
    }
    
    return codeableConcept.getCodeableConceptFromTuple(tuple);
}

/* 
 * Finds the index of a possible adverseEvent; returns -1 if it's invalid
 */ 
exports.findAdverseEventIndex = (possibleAdverseEvent) => {
    return adverseEventOptions.findIndex((adverseEvent) => { return adverseEvent.name.toLowerCase() === possibleAdverseEvent.toLowerCase()});
}

exports.findAdverseEvent = (possibleAdverseEvent) => {
    const index = exports.findAdverseEventIndex(possibleAdverseEvent);
    if (index === -1) return null;
    return adverseEventOptions[index];
}

/*
 * Searches for adverse event in adverseEventOptions list
 * Will return CodeableConcept object with empty strings if not found
 * If adverse event found in list, function will return CodeableConcept with value, codeSystem, and displayText
 */
exports.getAdverseEventCodeableConcept = (possibleAdverseEvent) => {
    const adverseEvent = exports.findAdverseEvent(possibleAdverseEvent);
    let tuple = {
        value: "",
        codeSystem: "",
        displayText: ""
    };

    if(!Lang.isNull(adverseEvent)) {
        tuple = {
            value: `${adverseEvent['MedDRA v12.0 Code']}`, 
            codeSystem: "https://www.meddra.org/", 
            displayText: adverseEvent['name']
        };
    }
    
    return codeableConcept.getCodeableConceptFromTuple(tuple);
}

/* 
 * Determines if a possibleGrade is in the list of grades
 */ 
exports.isValidGrade = (possibleGrade) => {
    return gradeOptions.some((grade) => { return grade.name.toLowerCase() === possibleGrade.toLowerCase()});
}

/* 
 * Returns true if a possibleAdverseEvent is in the list of events; returns false otherwise
 */ 
exports.isValidAdverseEvent = (possibleAdverseEvent) => {
    if(Lang.isEmpty(possibleAdverseEvent)) { return false; }
    return adverseEventOptions.some((adverseEvent) => { 
        return adverseEvent.name.toLowerCase() === possibleAdverseEvent.toLowerCase()
    });
}

/* 
 * Returns true if a grade is defined for a given event; returns false otherwise
 */ 
exports.isValidGradeForAdverseEvent = (possibleGrade, possibleAdverseEvent) => {
    if(Lang.isUndefined(possibleGrade)) { 
        // A null grade isn't valid
        return false;
    } else if (Lang.isUndefined(possibleAdverseEvent) || Lang.isNull(possibleAdverseEvent)) { 
        // Any grade is valid when there is no event
        return false;
    }

    // If they are both
    if (exports.isValidGrade(possibleGrade) && exports.isValidAdverseEvent(possibleAdverseEvent)) { 
        // Find the object
        const adverseEventInLookup = adverseEventOptions.find((adverseEvent) => { return adverseEvent.name.toLowerCase() === possibleAdverseEvent.toLowerCase()});
        return !Lang.isNull(adverseEventInLookup[possibleGrade])
    } else {
        return false;
    }
}