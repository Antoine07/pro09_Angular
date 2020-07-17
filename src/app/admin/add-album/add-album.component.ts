import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { AlbumService } from 'src/app/album.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent implements OnInit {

  albumForm: FormGroup;

  constructor(private aS: AlbumService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.albumForm = this.fb.group(
      { 
        name: new FormControl("", [
          Validators.required, // pour définir dans le controle un champ requis
          Validators.minLength(5)  // au min de longueur 5 caractères
        ]),
        title: new FormControl("", [
          Validators.required
        ]),
        ref: new FormControl("", [
          Validators.required
        ]),
        duration: new FormControl("", [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.max(900)
        ]),
        description: new FormControl("", [
          Validators.required
        ]),
        tags: new FormControl('', []),
        status: "off",
        notes: new FormControl("", []),
        like: "",
        id: "",
      }
    );
  }

  get name() { return this.albumForm.get('name'); }
  get title() { return this.albumForm.get('title'); }
  get ref() { return this.albumForm.get('ref'); }
  get duration() { return this.albumForm.get('duration'); }
  get description() { return this.albumForm.get('description'); }
  get tags() { return this.albumForm.get('tags'); }
  get notes() { return this.albumForm.get('notes'); }

  onSubmit() {
    const { tags, notes } = this.albumForm.value;

    // console.log(tags);

    const album = this.albumForm.value ;

    if (Array.isArray(tags) == false) album.tags = tags.split(',');

    if (Array.isArray(notes) == false) album.notes = notes.split(',').map(n => parseInt(n));

    this.aS.addAlbum(album).subscribe(
      () => this.router.navigate(['/admin'])
    )
  }

}
