
export interface PatientData {
  id: number;
  patientid: string;
  lastmovementtimestamp: string;
  currentroom: string;
  ismoving: boolean;
  activitylevel: string;
  falldetected: boolean;
  dailystepcount: number;
  movementhistory: string[];
}
