import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from '@shared/services/file.service';

@Component({
  selector: 'mb-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit {
  @Input() imageUrls: any[] = [];
  @Input() filesOrigin: File[] | any = []; // Files đã tải lên hệ thống
  @Input() filesUpload: any; // Files upload chưa tải lên hệ thống
  @Input() type = 'default';
  @Input() isDownload = false;
  @Input() isRemove = true;
  @Output() onChangeFilesOrigin: EventEmitter<any> = new EventEmitter();
  @Output() onChangeFilesUpload: EventEmitter<any> = new EventEmitter();

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    if (this.isDownload) {
      this.isRemove = false;
    }
  }

  remove(file: File | any, index: number, type: string) {
    if (type === 'origin') {
      this.filesOrigin.forEach((value: any, i: number) => {
        if (index === i) {
          delete this.filesOrigin[i];
        }
      });
      this.onChangeFilesOrigin.emit(
        this.filesOrigin.filter((x: any) => x !== null)
      );
    } else {
      this.filesUpload.forEach((value: any, i: number) => {
        if (index === i) {
          delete this.filesUpload[i];
        }
      });
      this.onChangeFilesUpload.emit(
        this.filesUpload.filter((x: any) => x !== null)
      );
    }
  }

  download(file: any) {
    this.fileService.downloadFile(file);
  }
}
