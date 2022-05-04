import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BOOLEAN_STRING } from '@shared/constants/common.constant';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IFile } from '@shared/models/file.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { Observable } from 'rxjs';
import CommonUtil from '../utils/common-utils';
import { AbstractService, EntityResponseType } from './common/abstract.service';
@Injectable({
  providedIn: 'root',
})
export class FileService extends AbstractService {
  public resourceUrl = SERVICE.STORAGE + '/files';

  public publicUrl = SERVICE.STORAGE;

  constructor(
    protected http: HttpClient,
    protected httpClient: HttpClient,
    private authService: AuthService
  ) {
    super(http);
  }

  /**
   * @description : check file exist by id
   * @param fileId
   * @return IFileResponse
   */
  ensureExistedFile(fileId: string): Observable<EntityResponseType<IFile>> {
    return super.get<IFile>(`${this.resourceUrl}/${fileId}`);
  }

  /**
   * @description : upload file
   * @return IFileResponse[]
   * @param fileIds
   */
  ensureExistedListFileId(
    fileIds: string[]
  ): Observable<EntityResponseType<IFile[]>> {
    return super.post<IFile[]>(`${this.resourceUrl}/find-by-ids`, { fileIds });
  }

  /**
   * @description : upload single file
   * @param file
   * @param ownerId
   * @param ownerType
   */
  uploadFile(
    file: File,
    ownerId?: string,
    ownerType?: string
  ): Observable<EntityResponseType<IFile>> {
    const formData = new FormData();
    formData.append('file', file);
    if (ownerId) {
      formData.append('ownerId', ownerId);
    }
    if (ownerType) {
      formData.append('ownerType', ownerType);
    }
    return super.post<IFile>(`${this.resourceUrl}/upload`, formData);
  }

  /**
   * @description : update list file
   * @param files
   * @param ownerId id of owner
   * @param ownerType type of owner
   * @return FileList
   */
  uploadListFile(
    files: File[],
    ownerId?: string,
    ownerType?: string
  ): Observable<EntityResponseType<IFile>> {
    const formData = new FormData();
    if (!!ownerId) {
      formData.append('ownerId', ownerId);
    }
    if (!!ownerType) {
      formData.append('ownerType', ownerType);
    }
    files.forEach((file) => {
      formData.append('files', file);
    });
    return super.post<IFile>(`${this.resourceUrl}/uploads`, formData);
  }

  uploadListFilePublic(
    files: File[],
    ownerId?: string,
    ownerType?: string
  ): Observable<EntityResponseType<IFile>> {
    const formData = new FormData();
    if (!!ownerId) {
      formData.append('ownerId', ownerId);
    }
    if (!!ownerType) {
      formData.append('ownerType', ownerType);
    }
    files.forEach((file) => {
      formData.append('files', file);
    });
    return super.post<IFile>(
      `${this.publicUrl}/public/files/uploads`,
      formData
    );
  }

  /**
   * @description : delete file
   * @param fileId
   */
  deleteFile(fileId: string): Observable<EntityResponseType<IFile>> {
    return super.delete<IFile>(`${this.resourceUrl}/${fileId}`);
  }

  /**
   * view resource file
   * @param fileId
   */
  viewFileResource(fileId: string): string {
    return `${
      this.resourceUrl
    }/${fileId}/view?token=${this.authService.getToken()}`;
  }

  // viewFileResource(fileId: string): Observable<EntityResponseType> {
  //   return this.httpClient.get<IBaseResponse>(`${this.resourceUrl}/${fileId}/view`, {observe: 'response'});
  // }

  /**
   * download resource file
   * @param fileId
   */
  downloadFileResource(fileId: string): string {
    return `${
      this.resourceUrl
    }/${fileId}/download?token=${this.authService.getToken()}`;
  }

  /**
   * search file
   * @param options
   */
  searchFile(options: any): Observable<EntityResponseType<IFile>> {
    // const httpParam = CommonUtil.formatParams(options);
    return super.get<IFile>(`${this.resourceUrl}/search`);
  }

  downloadFileByUrl(url: string, loading: boolean): Observable<Blob> {
    return this.httpClient.get(url, {
      headers: loading
        ? new HttpHeaders({ loading: BOOLEAN_STRING.TRUE })
        : new HttpHeaders(),
      responseType: 'blob',
    });
  }

  downloadFile(file: any): void {
    this.downloadFileByUrl(file?.downloadUrl, false).subscribe((response) => {
      CommonUtil.download(response, file?.originalName);
    });
  }
}
