import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  isDevMode,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FILE_SIZE, MAX_FILE_SIZE } from '@shared/constants/file.constant';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, of } from 'rxjs';

@Component({
  selector: 'mb-upload-simple',
  templateUrl: './upload-simple.component.html',
  styleUrls: ['./upload-simple.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadSimpleComponent implements OnInit {
  @Input() type = 'default';
  @Input() filesUpload: NzUploadFile[] = [];
  @Input() filesOrigin = [];
  @Input() easyUpload = true;
  @Input() multiple = false;
  @Input() disabled = false;
  @Input() maxFileUpload = 10;
  @Input() titleUpload = '';
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

  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService,
    private fileService: FileService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.filesAccept();
  }

  handleChange({ file, fileList, event }: NzUploadChangeParam): void {
    if (this.multiple) {
      if (
        (this.filesOrigin?.length || 0) + this.valid(fileList).length >
        this.maxFileUpload
      ) {
        this.toast.warning('common.maxUploadFile', {
          count: this.maxFileUpload,
        });
      } else {
        this.emitter.emit(this.valid(fileList));
      }
    } else {
      this.emitter.emit(this.valid([file]));
    }
  }

  beforeUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (!file) {
        return;
      }
      const isFileAccept = this.acceptFiles.includes(file.type || '');
      if (!isFileAccept) {
        let type = '';
        if (this.acceptTypeFiles.includes('default')) {
          type = ['docx', 'excel', 'pdf', 'image'].toString();
        } else {
          type = this.acceptTypeFiles.toString();
        }
        this.toast.warning('common.fileAccept', { type });
        observer.complete();
        return;
      }
      const isLessThan = (file.size || 0 / 1024 / 1024 < FILE_SIZE) as boolean;
      if (!isLessThan) {
        this.toast.warning('common.maxFileSize', { size: FILE_SIZE });
        observer.complete();
        return;
      }
      observer.next(isFileAccept && isLessThan);
      observer.complete();
    });

  handleCustomUploadReq = (item: any) => {
    return of(item).subscribe(
      (next) => {
        if (isDevMode()) {
        }
      },
      (err) => {
        if (isDevMode()) {
        }
      }
    );
  };

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
}
