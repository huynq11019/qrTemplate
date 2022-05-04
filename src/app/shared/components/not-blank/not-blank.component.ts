import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'mb-not-blank',
  templateUrl: './not-blank.component.html',
  styleUrls: ['./not-blank.component.scss']
})
export class NotBlankComponent implements OnInit {

  @Input() value = '';

  constructor() { }

  ngOnInit(): void {
  }

}
