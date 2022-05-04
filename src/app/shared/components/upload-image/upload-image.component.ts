import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MAX_FILE_SIZE } from '@shared/constants/file.constant';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() action = '';
  @Input() className = '';
  @Input() disable = false;
  @Input() isShow = true;
  @Input() easyUpload = true;
  @Input() multiple = false;
  @Input() acceptTypeFiles: string[] = [
    'default' || 'docx' || 'excel' || 'pdf' || 'image',
  ];
  @Output() emitter: EventEmitter<any> = new EventEmitter();
  readonly typeFiles = [
    {
      type: 'docx',
      value:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    {
      type: 'docx',
      value: 'application/msword',
    },
    {
      type: 'excel',
      value:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    {
      type: 'excel',
      value: 'application/vnd.ms-excel',
    },
    {
      type: 'pdf',
      value: 'application/pdf',
    },
    {
      type: 'image',
      value: 'image/jpeg',
    },
    {
      type: 'image',
      value: 'image/png',
    },
  ];
  acceptFiles: string[] = [];
  files: NzUploadFile[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filesAccept();
  }

  handleChange(event: any) {
    const file = event.target.files[0];
    this.files = this.valid([file]);
    this.emitter.emit(this.files);
  }

  filesAccept(): void {
    if (this.acceptTypeFiles.includes('default')) {
      this.acceptFiles = this.typeFiles.map((file) => file.value);
    } else {
      this.acceptFiles = this.typeFiles
        .filter((file) => this.acceptTypeFiles.includes(file.type))
        .map((val) => val.value);
    }
  }

  valid(files: any) {
    return files.filter(
      (file: any) =>
        this.acceptFiles.includes(file?.type) && file?.size <= MAX_FILE_SIZE
    );
  }

  getSource() {
    if (this.action && this.action !== undefined && this.action !== null) {
      return this.action;
    }
    return `assets/images/icon/avatar.png`;
  }

  getSourceAvatar() {
    return `assets/images/button/camera.png`;
  }
}
