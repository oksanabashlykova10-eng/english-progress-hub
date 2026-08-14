const grades=[
  {legacyId:'5b',technicalId:'5B',label:'5Б'},
  {legacyId:'6b',technicalId:'6B',label:'6Б'},
  {legacyId:'6v',technicalId:'6V',label:'6В'},
  {legacyId:'6g',technicalId:'6G',label:'6Г'},
  {legacyId:'7d',technicalId:'7D',label:'7Д'},
  {legacyId:'9b',technicalId:'9B',label:'9Б'},
];

export const gradeOptions=grades.map(grade=>({...grade}));

export const gradeIdByClassId=Object.fromEntries(grades.map(({legacyId,technicalId})=>[legacyId,technicalId]));
export const classIdByGradeId=Object.fromEntries(grades.map(({legacyId,technicalId})=>[technicalId,legacyId]));
export const gradeLabelByTechnicalId={
  ...Object.fromEntries(grades.map(({technicalId,label})=>[technicalId,label])),
};
export const gradeLabelByLegacyId=Object.fromEntries(grades.map(({legacyId,label})=>[legacyId,label]));

export const toGradeId=classId=>gradeIdByClassId[classId]||classId;
export const toClassId=gradeId=>classIdByGradeId[gradeId]||gradeId;
export const gradeLabel=value=>gradeLabelByLegacyId[value]||gradeLabelByTechnicalId[value]||value;
export const normalizeGradeIds=classIds=>[...new Set(classIds.map(toGradeId))];
