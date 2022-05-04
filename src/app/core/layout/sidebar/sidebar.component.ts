import { Component, Input, OnInit } from '@angular/core';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import { SidebarConstant } from './sidebar.constant';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  sidebar = SidebarConstant;

  ROUTER_UTILS = ROUTER_UTILS;
  constructor() {}

  ngOnInit(): void {}
}
