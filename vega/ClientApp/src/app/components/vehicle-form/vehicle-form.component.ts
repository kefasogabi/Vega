import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, SaveVehicle } from '../../models/vehicle';
import * as _ from 'underscore'; 

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[]; 
  models: any[];
  features: any[];
  vehicle:SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '',
      phone: '',
    }
  };

  constructor(private vehicleService:VehicleService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,) { 
                route.params.subscribe(p => { this.vehicle.id = +p['id']});
              }

  ngOnInit() {

    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures(),
    ];    

    if(this.vehicle.id)
      sources.push( this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe( (data:any) => {
      this.makes = data[0];
      this.features = data[1];

      if(this.vehicle.id){
        this.setVehicle(data[2]);
        this.populateModels();
      }
        this.setVehicle(data[2]);
    }, error => {
      if(error.status == 404)
        this.router.navigate(['/home']);
    });
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  } 

  onMakeChange(){
    this.populateModels()
    delete this.vehicle.modelId;
  }

  private populateModels(){
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId, $event){
    if($event.target.checked)
      this.vehicle.features.push(featureId);
    else{
      var index = this.vehicle.features.indexOf(featureId);
       this.vehicle.features.splice(index, 1);
    }
  }

  submit(){
    if(this.vehicle.id){
      this.vehicleService.updateVehicle(this.vehicle).subscribe((data:any)=>{
        this.toastr.success("Vehicle Updated Successfully", "Success")
      });
    }else{
      this.vehicleService.create(this.vehicle).subscribe((data:any)=> { 
        this.toastr.success("Vehicle Created Successfully", "Success")
      });
    }
    
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe((data:any) => {
          this.router.navigate(['/home']);
        });
    }
  }



}
