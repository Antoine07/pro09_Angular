import { Component, OnInit } from '@angular/core';
import { AlbumService } from 'src/app/album.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'app-update-album',
  templateUrl: './update-album.component.html',
  styleUrls: ['./update-album.component.scss']
})
export class UpdateAlbumComponent implements OnInit {

  updateAlbumForm: FormGroup;

  constructor(
    private as: AlbumService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    this.initForm();

    this.as.getAlbum(id).subscribe(album => {
      // Hydratation du formulaire avec les valeurs
      this.updateAlbumForm.patchValue(album);

    });
  }

  initForm() {
    this.updateAlbumForm = this.fb.group(
      {
        // Controler un champ 
        name: new FormControl('', [
          Validators.required, // pour définir dans le controle un champ requis
          Validators.minLength(5)  // au min de longueur 5 caractères
        ]),
        title: new FormControl('', [
          Validators.required
        ]),
        ref: new FormControl('', [
          Validators.required
        ]),
        duration: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]*'),
          Validators.max(900)
        ]),
        description: new FormControl('', [
          Validators.required
        ]),
        tags: new FormControl('', []),
        status: '',
        note: new FormControl('', []),
        like: '',
        id: ''
      }
    );
  }

  get name() { return this.updateAlbumForm.get('name'); }
  get title() { return this.updateAlbumForm.get('title'); }
  get ref() { return this.updateAlbumForm.get('ref'); }
  get duration() { return this.updateAlbumForm.get('duration'); }
  get description() { return this.updateAlbumForm.get('description'); }
  get tags() { return this.updateAlbumForm.get('tags'); }
  get note() { return this.updateAlbumForm.get('note'); }

  onSubmit() {

    const { tags, note } = this.updateAlbumForm.value;
    const album = { ...this.updateAlbumForm.value };

    if (Array.isArray(tags) == false)
      album.tags = tags.split(',');

    if (Array.isArray(note) == false)
      album.note = note.split(',').map(n => parseInt(n));

    this.as.updateAlbum(album.id, album).subscribe(
      () => {
        this.router.navigate(['/admin'])
      }
    )
  }

}