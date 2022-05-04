import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE } from '@shared/constants/gateway-routes-api.constant';
import { IBuilding } from '@shared/models/building.model';
import { IUser } from '@shared/models/user.model';
import { Observable } from 'rxjs';
import { CustomerContact, ICustomerContact } from '../models/customer-contact.model';
import { CustomerRent, ICustomerRent } from '../models/customer-rent.model';
import { Customer, ICustomer } from '../models/customer.model';
import { AbstractService, EntityResponseType } from './common/abstract.service';
@Injectable({
  providedIn: 'root',
})
export class CustomerService extends AbstractService {

  public resourceUrl = SERVICE.IAM + '/organizations';

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  find(id: any, loading = false): Observable<EntityResponseType<ICustomer>> {
    return super.get<ICustomer>(`${this.resourceUrl}/${id}`, {loading});
  }

  findIds(ids: { ids: string[] }, loading = false): Observable<EntityResponseType<ICustomer[]>> {
    return super.post<ICustomer[]>(`${this.resourceUrl}/find-by-ids`, ids, {loading});
  }

  search(params?: {}, loading = false): Observable<EntityResponseType<ICustomer[]>> {
    return super
      .get<ICustomer[]>(`${this.resourceUrl}`, {params, loading});
  }

  searchContacts(organizationId: any, params?: {},
                 loading = false): Observable<EntityResponseType<ICustomerContact[]>> {
    return super
      .get<ICustomerContact[]>(`${this.resourceUrl}/${organizationId}/contacts`, {params, loading});
  }

  searchLeasing(organizationId: any, params?: {}, loading = false): Observable<EntityResponseType<ICustomerRent[]>> {
    return super
      .get<ICustomerRent[]>(`${this.resourceUrl}/${organizationId}/leasing-info`, {params, loading});
  }

  create(body: Customer, loading = false): Observable<EntityResponseType<ICustomer>> {
    return super
      .post<ICustomer>(`${this.resourceUrl}`, body, {loading});
  }

  createContacts(organizationId: any, body: CustomerContact,
                 loading = false): Observable<EntityResponseType<ICustomerContact>> {
    return super
      .post<ICustomerContact>(`${this.resourceUrl}/${organizationId}/contacts`, body, {loading});
  }

  update(body: Customer, id: any, loading = false): Observable<EntityResponseType<ICustomer>> {
    return super
      .post<ICustomer>(`${this.resourceUrl}/${(id)}/update`, body, {loading});
  }

  updateContacts(organizationId: any, contactId: any, body: CustomerContact,
                 loading = false): Observable<EntityResponseType<ICustomerContact>> {
    return super
      .post<ICustomerContact>(`${this.resourceUrl}/${organizationId}/contacts/${contactId}`, body, {loading});
  }

  deleteContact(organizationId: any, contactId: any, loading = false): Observable<EntityResponseType<boolean>> {
    return super
      .post<boolean>(`${this.resourceUrl}/${organizationId}/contacts/${contactId}/delete`, {}, {loading});
  }

  active(id: any, loading = false): Observable<EntityResponseType<boolean>> {
    return super
      .post<boolean>(`${this.resourceUrl}/${id}/active`, {}, {loading});
  }

  inactive(id: any, loading = false): Observable<EntityResponseType<boolean>> {
    return super
      .post<boolean>(`${this.resourceUrl}/${id}/inactive`, {}, {loading});
  }

  createUnit(organizationId: any, body: CustomerRent, loading = false): Observable<EntityResponseType<any>> {
    return super
      .post<any>(`${this.resourceUrl}/${organizationId}/leasing-unit`, body, {loading});
  }

  deleteUnit(organizationId: any, unitId: { unitId: string },
             loading = false): Observable<EntityResponseType<boolean>> {
    return super
      .post<boolean>(`${this.resourceUrl}/${organizationId}/delete-unit`, unitId, {loading});
  }

  returnUnit(organizationId: any, unitId: { unitId: string }, loading = false): Observable<EntityResponseType<any>> {
    return super
      .post<any>(`${this.resourceUrl}/${organizationId}/return-unit`, unitId, {loading});
  }

  leaseUnit(organizationId: any, unitId: { unitId: string }, loading = false): Observable<EntityResponseType<any>> {
    return super
      .post<any>(`${this.resourceUrl}/${organizationId}/lease-unit`, unitId, {loading});
  }

  findLeasingInfoByUnitIds(ids: { ids: string[] }, loading = false): Observable<EntityResponseType<any>> {
    return super.post<any>(`${this.resourceUrl}/find-leasing-info-by-unit-ids`, ids, {loading});
  }

  findBuildingsByOrganizationId(organizationId: string, loading = false): Observable<EntityResponseType<IBuilding[]>> {
    return super.post<IBuilding[]>(`${this.resourceUrl}/${organizationId}/buildings`, organizationId, {loading});
  }

  findByCurrentUser(loading = false): Observable<EntityResponseType<ICustomer[]>> {
    return super
      .get<ICustomer[]>(`${SERVICE.IAM}/me/organizations`, {loading});
  }

  findFloors(ids: { ids: string[] }, loading = false): Observable<EntityResponseType<ICustomer[]>> {
    return super.post<ICustomer[]>(`${this.resourceUrl}/find-by-floor-ids`, ids, {loading});
  }

  findCustomers(ids: { ids: string[] }, loading = false): Observable<EntityResponseType<ICustomer[]>> {
    return super.post<ICustomer[]>(`${this.resourceUrl}/find-by-building-ids`, ids, {loading});
  }

  autoCompleteUserFromOrganization(id: string, loading = false): Observable<EntityResponseType<IUser[]>> {
    return super.get<IUser[]>(`${this.resourceUrl}/${id}/users/auto-complete`, {loading});
  }

  findByBusinessCode(businessCode: string, loading = false): Observable<EntityResponseType<ICustomer>> {
    return super.get<ICustomer>(`${this.resourceUrl}/find-by-business-code`, {
      params: {
        businessCode,
      },
      loading
    });
  }

}
