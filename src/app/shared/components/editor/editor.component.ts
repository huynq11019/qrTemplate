import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { API_STORAGE } from '@shared/constants/base.constant';
import { MAX_LENGTH_EDITOR } from '@shared/constants/common.constant';
import * as ClassicEditor from '@shared/lib/ckeditor5';
import { AuthService } from '@shared/services/auth/auth.service';
import CommonUtil from '@shared/utils/common-utils';
// https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/basic-api.html
@Component({
  selector: 'mb-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['editor.component.scss'],
})
export class EditorComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  constructor(private authService: AuthService) {
    this.TOKEN = this.authService.getToken();
  }

  public Editor = ClassicEditor;
  public editor: any;
  public idEditor = EditorComponent.generateId();

  TOKEN = '';
  fileName = '';
  isLoadCKeditor = false;

  @Input() placeholder = 'Nội dung';
  @Input() maxLength = MAX_LENGTH_EDITOR;
  @Input() value = '';
  @Input() isReadOnly = false;

  @Output() data: EventEmitter<any> = new EventEmitter();
  @Output() inputInvalid: EventEmitter<any> = new EventEmitter();

  private static generateId(): string {
    return (
      'editor' + Math.ceil(Math.random() * 100) + Math.ceil(Math.random() * 100)
    );
  }

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    await this.afterView();
  }

  async ngAfterViewChecked(): Promise<void> {
    // this.editor.setData('<p>Some text.</p>');
  }

  async afterView(): Promise<void> {
    setTimeout(async () => {
      const self = this;
      if (document.querySelector(`#${this.idEditor}`) && !this.isLoadCKeditor) {
        this.isLoadCKeditor = true;
        ClassicEditor.builtinPlugins.map((plugin: any) => {});
        await ClassicEditor.create(
          document.querySelector(`#${this.idEditor}`),
          {
            toolbar: {
              items: [
                'heading',
                'bold',
                'italic',
                'underline',
                'alignment',
                'fontFamily',
                'fontColor',
                'fontSize',
                'highlight',
                'link',
                'strikethrough',
                'bulletedList',
                'numberedList',
                'blockQuote',
                'outdent',
                'indent',
                'code',
                'insertTable',
                // "paragraph",
                // "uploadImage",
              ],
            },
            image: {
              toolbar: ['imageStyle:full', 'imageStyle:side'],
            },
            placeholder: this.placeholder,
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }
        )
          .then((editor: any) => {
            this.editor = editor;
            editor.isReadOnly = this.isReadOnly;
            editor.model.document.on('change:data', (evt: any, data: any) => {
              this.data.emit(editor.getData());
            });
          })
          .catch((error: any) => {});
      }

      function MyCustomUploadAdapterPlugin(editor: any): void {
        editor.plugins.get('FileRepository').createUploadAdapter = (
          loader: any
        ) => {
          // Configure the URL to the upload script in your back-end here!
          return new MyUploadAdapter(loader);
        };

        class MyUploadAdapter {
          loader: any;
          xhr = new XMLHttpRequest();

          constructor(loader: any) {
            // The file loader instance to use during the upload.
            this.loader = loader;
          }

          upload() {
            return this.loader.file.then(
              (file: any) =>
                new Promise((resolve, reject) => {
                  this._initRequest();
                  this._initListeners(resolve, reject, file);
                  this._sendRequest(file);
                  self.fileName = file.name;
                })
            );
          }

          abort() {
            if (this.xhr) {
              this.xhr.abort();
            }
          }

          _initRequest() {
            const xhr = (this.xhr = new XMLHttpRequest());
            xhr.open('POST', API_STORAGE + '/file/...', true);
            xhr.responseType = 'json';
            xhr.setRequestHeader('Authorization', 'Bearer ' + self.TOKEN);
          }

          _initListeners(resolve: any, reject: any, file: any) {
            const xhr = this.xhr;
            const loader = this.loader;
            const genericErrorText = `Couldn't upload file: ${file.name}.`;

            xhr.addEventListener('error', () => reject(genericErrorText));
            xhr.addEventListener('abort', () => reject());
            xhr.addEventListener('load', () => {
              const response = xhr.response;
              if (!response || response.error) {
                return reject(
                  response && response.error
                    ? response.error.message
                    : genericErrorText
                );
              }
              resolve({
                default: response.url,
              });
            });
            if (xhr.upload) {
              xhr.upload.addEventListener('progress', (evt) => {
                if (evt.lengthComputable) {
                  loader.uploadTotal = evt.total;
                  loader.uploaded = evt.loaded;
                }
              });
            }
          }

          _sendRequest(file: any) {
            // Prepare the form data.
            const data = new FormData();

            data.append('file', file);
            this.xhr.send(data);
          }
        }
      }
    }, 300);
  }

  getLengthStripHTML(value: string): number {
    return CommonUtil.stripHTML(value).length;
  }

  getClass() {
    if (this.getLengthStripHTML(this.value) > this.maxLength) {
      this.inputInvalid.emit(true);
      return 'text-danger';
    } else {
      this.inputInvalid.emit(false);
      return '';
    }
  }
}
