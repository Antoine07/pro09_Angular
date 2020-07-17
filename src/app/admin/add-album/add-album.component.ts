import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { AlbumService } from 'src/app/album.service';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent implements OnInit {

  albumForm: FormGroup;

  constructor(private aS: AlbumService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.albumForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ]),
    })
  }

  get name() {
    return this.albumForm.get('name');
  }

  onSubmit(){

    const { name } = this.albumForm.value;

    console.log(name);
  }

}
