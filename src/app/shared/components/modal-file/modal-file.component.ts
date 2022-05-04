import {Component, Input, OnInit} from '@angular/core';
import {File} from '../../models/file.model';

@Component({
  selector: 'app-modal-file',
  templateUrl: './modal-file.component.html',
  styleUrls: ['./modal-file.component.scss']
})
export class ModalFileComponent implements OnInit {

  @Input() files: File[] | any = [];
  isExistFiles = false;

  constructor() { }

  ngOnInit(): void {
    this.isExistFiles = (this.files?.length || 0) > 0;
  }

}
