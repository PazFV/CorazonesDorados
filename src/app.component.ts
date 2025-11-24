
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './services/supabase.service';
import { GeminiService } from './services/gemini.service';
import { PatientData } from './models/patient-data.model';
import { HouseMapComponent } from './components/house-map/house-map.component';
import { catchError, of, repeat, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HouseMapComponent]
})
export class AppComponent implements OnInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  private geminiService = inject(GeminiService);

  patientData = signal<PatientData | null>(null);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(true);

  dailyReport = signal<string | null>(null);
  isLoadingReport = signal<boolean>(false);

  private pollingInterval: any;
  
  ngOnInit(): void {
    this.fetchData();
    // Poll every 10 seconds
    this.pollingInterval = setInterval(() => this.fetchData(), 10000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
  
  fetchData(): void {
    this.supabaseService.getLatestPatientData().subscribe({
      next: (data) => {
        this.patientData.set(data);
        this.error.set(null);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch data from Supabase', err);
        this.error.set('No se pudo cargar la información del paciente. Por favor, verifique su conexión.');
        this.isLoading.set(false);
      }
    });
  }

  async generateReport() {
    const currentData = this.patientData();
    if (!currentData) return;
    
    this.isLoadingReport.set(true);
    this.dailyReport.set(null);
    try {
      const report = await this.geminiService.generateDailyReport(currentData);
      this.dailyReport.set(report);
    } catch (e) {
      this.dailyReport.set('Ocurrió un error al generar el informe.');
    } finally {
      this.isLoadingReport.set(false);
    }
  }
}
