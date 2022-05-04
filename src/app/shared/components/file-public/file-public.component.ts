import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from '@shared/services/file.service';

@Component({
  selector: 'mb-file-public',
  templateUrl: './file-public.component.html',
  styleUrls: ['./file-public.component.scss'],
})
export class FilePublicComponent implements OnInit {
  @Input() imageUrls: any[] = [];
  @Input() filesOrigin: File[] | any = []; // Files đã tải lên hệ thống
  @Input() filesUpload: any[] = []; // Files upload chưa tải lên hệ thống
  @Input() type = 'default';
  @Input() isDownload = false;
  @Input() isRemove = true;
  @Input() oversized = false;
  @Input() files: [] | any;
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

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
    this.oversized = this.filesUpload.length > 5;
    const imgs: any[] = [];

    this.filesUpload.forEach((item) => {
      this.getBase64(item.originFileObj).then((data) => {
        imgs.push(data);
      });
    });
    this.onChangeFilesUpload.emit(
      this.filesUpload.filter((x: any) => x !== null)
    );
    this.imageUrls = imgs;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
