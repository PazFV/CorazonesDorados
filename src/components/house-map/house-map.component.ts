
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-house-map',
  templateUrl: './house-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HouseMapComponent {
  currentRoom = input.required<string>();

  rooms = [
    { name: 'Living', label: 'Sala de Estar', position: 'col-span-2 row-span-2' },
    { name: 'Kitchen', label: 'Cocina', position: 'col-span-1 row-span-1' },
    { name: 'Bathroom', label: 'Baño', position: 'col-span-1 row-span-1' },
    { name: 'Bedroom', label: 'Dormitorio', position: 'col-span-2 row-span-1' },
  ];
}
