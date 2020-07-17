import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.scss']
})
export class PaginateComponent implements OnInit {

  @Output() setPaginate: EventEmitter<{ start: number; end: number }> = new EventEmitter();

  pages: number[] = []; // pages num
  perPage: number; // number album(s) per page variable d'env 
  total: number = 0; // total albums
  numberPages: number = 0;
  currentPage: number;

  constructor(private aS: AlbumService) {
    this.perPage = this.aS.paginateNumberPage();
  }

  ngOnInit() {
    this.init();

    // Observable qui va recevoir le journal ...
    this.aS.sendCurrentNumberPage.subscribe(numberPage => {
      this.currentPage = numberPage;
      this.init(this.currentPage);
    });
  }

  /**
   *  init paginate
   * @param page 
   */
  init(page: number = 1) {
    this.aS.count(page,this.perPage).subscribe(count => {
      this.numberPages = Math.ceil(count / this.perPage);
      this.currentPage = page;
      this.pages = [];
      for (let i = 1; i < this.numberPages + 1; i++) {
        this.pages.push(i);
      }
    })
    
    // this.total = this.aS.count();
    // this.numberPages = Math.ceil(this.total / this.perPage);
    // this.currentPage = page;
    // this.pages = [];
    // for (let i = 1; i < this.numberPages + 1; i++) {
    //   this.pages.push(i);
    // }
  }

  selectedPage(page: number) {
    this.currentPage = page;
    this.setPaginate.emit(this.paginate(page));
    this.aS.currentPage(this.currentPage); // mettre à jour les autres components paginate
  }

  next() {
    if (this.currentPage >= this.numberPages) {
      this.currentPage = 1;
    } else {
      this.currentPage++;
    }
    this.setPaginate.emit(this.paginate(this.currentPage)); // émettre la page courante
    this.aS.currentPage(this.currentPage); // mettre à jour les autres components paginate
  }

  previous() {
    if (this.currentPage == 1) {
      this.currentPage = this.numberPages;
    } else {
      this.currentPage--;
    }
    this.setPaginate.emit(this.paginate(this.currentPage));
    this.aS.currentPage(this.currentPage); // mettre à jour les autres components paginate
  }

  paginate(page: number): { start: number, end: number } {
    let start = (page - 1) * this.perPage; // 0 2
    let end = start + this.perPage; // 2 4

    return { start: start, end: end };
  }

}