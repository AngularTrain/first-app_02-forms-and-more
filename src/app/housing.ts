import { Injectable } from '@angular/core';
import { HousingLocationInfo } from './housinglocation';
import { SubmittedApplication } from './submitted-application';

@Injectable({
  providedIn: 'root',
})

export class HousingService {

    url = 'http://localhost:3000/locations';

    async getAllHousingLocations(): Promise<HousingLocationInfo[]> {
      const data = await fetch(this.url);
      return (await data.json()) ?? [];
    }

    async getHousingLocationById(id: number): Promise<HousingLocationInfo | undefined> {
      const data = await fetch(`${this.url}?id=${id}`);
      const locationJson = await data.json();
      return locationJson[0] as HousingLocationInfo | undefined;
    }

    submitApplication(application: SubmittedApplication): void {

    console.log(
      `Homes application received: firstName: ${application.firstName}, lastName: ${application.lastName}, email: ${application.email}, phone: ${application.phone}.`,
    );
  }
  
}
