// import { Injectable } from '@angular/core';
// import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
// import { ClearCustomerFilter } from '@stores/actions/customer.action';
// import { STATE_UTILS } from '@stores/common/state.constants';
// import { ICustomerSateModel } from '@stores/models/customer.sate.model';

// @State<ICustomerSateModel>({
//   name: STATE_UTILS.CUSTOMER,
//   defaults: {
//     filter: {},
//     entities: [],
//     entity: {},
//   },
// })
// @Injectable()
// export class CustomerSate implements NgxsOnInit {

//   ngxsOnInit(ctx?: StateContext<any>) {}

//   @Action(ClearCustomerFilter)
//   clearFilterState({ setState, getState }: StateContext<ICustomerSateModel>) {
//     const state = getState();
//     setState({ ...state, filter: {} });
//   }
// }
