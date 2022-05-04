// import { Injectable } from '@angular/core';
// import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
// import { ClearRoleFilter, StoreRoleFilter } from '@stores/actions/role.action';
// import { AbstractState } from '@stores/common/abstract.state.model';
// import { STATE_UTILS } from '@stores/common/state.constants';
// import { IRoleSateModel } from '@stores/models/role.sate.model';

// @State<IRoleSateModel>({
//   name: STATE_UTILS.ROLE,
//   defaults: {
//     filter: {},
//     entities: [],
//     entity: {},
//   },
// })
// @Injectable()
// export class RoleSate extends AbstractState implements NgxsOnInit {
//   ngxsOnInit(ctx?: StateContext<any>) {}

//   @Action(StoreRoleFilter)
//   storeRoleFilter(
//     { setState, getState }: StateContext<IRoleSateModel>, search: any) {
//     const state = getState();
//     setState({ ...state, filter: {...search.payload} });
//   }

//   @Action(ClearRoleFilter)
//   clearFilterState({ setState, getState }: StateContext<IRoleSateModel>) {
//     const state = getState();
//     setState({ ...state, filter: {} });
//   }
// }
