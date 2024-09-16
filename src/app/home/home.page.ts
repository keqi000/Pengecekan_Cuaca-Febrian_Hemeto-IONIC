import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonList,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  thermometerOutline,
  sunnyOutline,
  cloudOutline,
  waterOutline,
  speedometerOutline,
  leafOutline,
  compassOutline,
  snowOutline,
} from 'ionicons/icons';

// Register the icons you will use in your app
addIcons({
  'thermometer-outline': thermometerOutline,
  'sunny-outline': sunnyOutline,
  'cloud-outline': cloudOutline,
  'water-outline': waterOutline,
  'speedometer-outline': speedometerOutline,
  'leaf-outline': leafOutline,
  'compass-outline': compassOutline,
  'snow-outline': snowOutline,
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonList,
  ],
})
export class HomePage {
  weatherData: any;
  inputCity: string = ''; // Bind to the input field
  city: string = 'Manado'; // Default city
  apiKey: string = '5c2b164494dfc843a2b18e8d268bd82e'; // Replace with your OpenWeather API key
  errorMessage: string = ''; // Define errorMessage

  constructor(private http: HttpClient, private platform: Platform) {}

  ngOnInit() {
    this.platform
      .ready()
      .then(() => {
        console.log('Platform ready');
        this.getWeather(this.city);
      })
      .catch((error) => {
        console.error('Error in platform ready:', error);
      });
  }

  // Fetch weather data by city name
  getWeather(city: string) {
    console.log('Fetching weather for:', city);
    const geoCodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.apiKey}`;

    this.http.get<any[]>(geoCodingUrl).subscribe(
      (geoData) => {
        console.log('Geocoding data:', geoData);
        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

          this.http.get(weatherUrl).subscribe(
            (data) => {
              console.log('Weather data:', data);
              this.weatherData = data;
              this.city =
                city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
              this.errorMessage = '';
            },
            (error) => {
              console.error('Error fetching weather data', error);
              this.errorMessage =
                'Error fetching weather data. Please try again.';
              this.weatherData = null;
            }
          );
        } else {
          console.log('City not found in geocoding data');
          this.errorMessage = 'City not found. Please enter a valid city name.';
          this.weatherData = null;
        }
      },
      (error) => {
        console.error('Error fetching geocoding data', error);
        this.errorMessage = 'Error fetching city data. Please try again.';
        this.weatherData = null;
      }
    );
  }

  // Search city
  searchCity() {
    if (this.inputCity) {
      this.getWeather(this.inputCity);
    } else {
      this.errorMessage = 'Please enter a city name';
    }
  }

  getBackgroundClass(): string {
    if (this.weatherData) {
      const description = this.weatherData.weather[0].description.toLowerCase();

      if (description.includes('clear')) {
        return 'clear-sky';
      } else if (description.includes('cloud')) {
        return 'cloudy-sky';
      } else if (description.includes('rain')) {
        return 'rainy-sky';
      }
    }
    return 'default-background';
  }
}
