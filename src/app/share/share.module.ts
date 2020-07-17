import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginateComponent } from '../paginate/paginate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from '../admin/admin-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [PaginateComponent],
  exports:[PaginateComponent, FormsModule, ReactiveFormsModule, AdminRoutingModule]
  
})
export class ShareModule { }
