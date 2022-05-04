import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@shared/services/helpers/loading.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit {
  constructor(public loadingService: LoadingService) {}

  ngOnInit(): void {}
}
