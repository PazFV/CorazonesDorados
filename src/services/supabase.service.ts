
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { PatientData } from '../models/patient-data.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly http = inject(HttpClient);
  
  private readonly supabaseUrl = 'https://nkfhburtmexhnltxhkyu.supabase.co';
  private readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZmhidXJ0bWV4aG5sdHhoa3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTMyMDIsImV4cCI6MjA3OTU2OTIwMn0.kHSkKtfeBzyOgRAgumTXhPsVZAXv7hM4eLWeK0aWbCg';

  getLatestPatientData(): Observable<PatientData> {
    const headers = new HttpHeaders({
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Range': '0-0' // Supabase specific way to get first row
    });

    const url = `${this.supabaseUrl}/rest/v1/pir_sensor_data?select=*&order=id.desc&limit=1`;
    
    return this.http.get<any[]>(url, { headers }).pipe(
      map(response => {
        if (!response || response.length === 0) {
          throw new Error('No patient data found.');
        }
        const data = response[0];
        // The movementhistory from Supabase is a JSON string, so we need to parse it.
        const movementHistoryArray = typeof data.movementhistory === 'string' 
          ? JSON.parse(data.movementhistory) 
          : data.movementhistory;

        return {
          ...data,
          movementhistory: movementHistoryArray
        } as PatientData;
      })
    );
  }
}
