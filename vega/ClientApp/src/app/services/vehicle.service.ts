import { SaveVehicle } from './../models/vehicle';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class VehicleService {
private readonly vehiclesEndpoint = '/api/vehicles/';

  constructor(private http:HttpClient) { }

  getMakes() {
    return this.http.get('/api/makes');
  }
  
  getFeatures(){
    return this.http.get('/api/features');
  }

  create(vehicle:SaveVehicle){
    return this.http.post(this.vehiclesEndpoint, vehicle);
  }

  getVehicle(id){
    return this.http.get(this.vehiclesEndpoint + id);
  }

  getVehicles(filter){
    return this.http.get(this.vehiclesEndpoint + '?' + this.toQueryString(filter))
  }

  toQueryString(obj){
    var parts = [];

        for(var  property in obj){
        var value = obj[property];
        if(value != null && value != undefined)

        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
      }
    
      return parts.join('&');
    
  }

  updateVehicle(vehicle:SaveVehicle){
    return this.http.put(this.vehiclesEndpoint + vehicle.id, vehicle);
  }

  delete(id) {
    return this.http.delete('/api/vehicles/' + id);
  }

}
