"use strict";(self.webpackChunkmb_amc_mstt=self.webpackChunkmb_amc_mstt||[]).push([[631],{9631:(Y,d,e)=>{e.r(d),e.d(d,{AuthModule:()=>J});var u=e(8583),c=e(5987),r=e(3679),p=e(4913),h=e(4891),n=e(7716),v=e(6256),f=e(3948),x=e(9790),Z=e(2595),A=e(8714),T=e(8753),m=e(7674),b=e(4514),M=e(2079),C=e(4453),L=e(9374),_=e(464);function y(t,a){1&t&&(n.TgZ(0,"span",19),n.TgZ(1,"small"),n._uU(2),n.ALo(3,"translate"),n.qZA(),n.qZA()),2&t&&(n.xp6(2),n.Oqu(n.lcZ(3,1,"model.login.error.username")))}function O(t,a){if(1&t&&(n.ynx(0),n.YNc(1,y,4,3,"span",18),n.BQk()),2&t){const o=n.oxw();let i;n.xp6(1),n.Q6J("ngIf",null==(i=o.loginForm.get("userName"))?null:i.hasError("required"))}}function z(t,a){if(1&t){const o=n.EpF();n.TgZ(0,"i",20),n.NdJ("click",function(){n.CHM(o);const l=n.oxw();return l.passwordVisible=!l.passwordVisible}),n.qZA()}if(2&t){const o=n.oxw();n.Q6J("nzType",o.passwordVisible?"eye-invisible":"eye")}}function N(t,a){1&t&&(n.TgZ(0,"span",19),n.TgZ(1,"small"),n._uU(2),n.ALo(3,"translate"),n.qZA(),n.qZA()),2&t&&(n.xp6(2),n.Oqu(n.lcZ(3,1,"model.login.error.password")))}function S(t,a){if(1&t&&(n.ynx(0),n.YNc(1,N,4,3,"span",18),n.BQk()),2&t){const o=n.oxw();let i;n.xp6(1),n.Q6J("ngIf",null==(i=o.loginForm.get("password"))?null:i.hasError("required"))}}const w=[{path:"",redirectTo:"login",pathMatch:"full"},{path:"login",component:(()=>{class t{constructor(o,i,l,s,g,E,I,U){this.fb=o,this.authService=i,this.localStorage=l,this.sessionStorage=s,this.translateService=g,this.toast=E,this.router=I,this.eventManagerService=U,this.passwordVisible=!1,this.LENGTH_VALIDATOR=h.sP,this.isTokenUnexpired()}ngOnInit(){this.loginForm=this.fb.group({userName:["",[r.kI.required,r.kI.maxLength(h.sP.USERNAME_MAX_LENGTH.MAX),r.kI.minLength(1)]],password:["",[r.kI.required]],rememberMe:[!0]})}get f(){return this.loginForm.controls}submitForm(){this.loginForm.valid?this.authService.login(this.f.userName.value,this.f.password.value,this.f.rememberMe.value).subscribe(o=>{o&&this.authService.storeProfile("/dashboard")}):Object.values(this.loginForm.controls).forEach(o=>{o.invalid&&(o.markAsDirty(),o.updateValueAndValidity({onlySelf:!0}))})}isTokenUnexpired(){this.eventManagerService.subscribe("reload",i=>{this.router.navigate(["/"])}),(this.localStorage.retrieve(p.H.JWT_TOKEN)||this.sessionStorage.retrieve(p._.JWT_TOKEN))&&(null===this.authService.getCurrentUser()?this.authService.storeProfile("/",!1):this.router.navigate(["/"]))}}return t.\u0275fac=function(o){return new(o||t)(n.Y36(r.qu),n.Y36(v.e),n.Y36(f.n2),n.Y36(f.uR),n.Y36(x.sK),n.Y36(Z.k),n.Y36(c.F0),n.Y36(A.O))},t.\u0275cmp=n.Xpm({type:t,selectors:[["app-login"]],decls:34,vars:26,consts:[[1,"login"],[1,"center"],[1,"container"],[1,"content"],["nz-form","",1,"login-form",3,"formGroup","ngSubmit"],[1,"row"],[1,"col-12","logo"],["src","assets/images/login-logo.png","alt","login"],[1,"text-left-important","col-12","mt-2","mb-2","text-left"],[1,"mb-2"],["type","text","nz-input","","formControlName","userName",3,"maxLength","placeholder"],[4,"ngIf"],[3,"nzSuffix"],["formControlName","password","nz-input","",3,"type","placeholder"],["suffixTemplate",""],["nz-checkbox","","formControlName","rememberMe"],[1,"col-12","mt-2","login-button"],["nz-button","",3,"nzType","disabled"],["class","text-danger",4,"ngIf"],[1,"text-danger"],["nz-icon","",3,"nzType","click"]],template:function(o,i){if(1&o&&(n.TgZ(0,"div",0),n.TgZ(1,"div",1),n.TgZ(2,"div",2),n.TgZ(3,"section",3),n.TgZ(4,"form",4),n.NdJ("ngSubmit",function(){return i.submitForm()}),n.TgZ(5,"div",5),n.TgZ(6,"div",6),n._UZ(7,"img",7),n.qZA(),n.TgZ(8,"div",8),n.TgZ(9,"label",9),n._uU(10),n.ALo(11,"translate"),n.qZA(),n._UZ(12,"input",10),n.ALo(13,"translate"),n.YNc(14,O,2,1,"ng-container",11),n.qZA(),n.TgZ(15,"div",8),n.TgZ(16,"label",9),n._uU(17),n.ALo(18,"translate"),n.qZA(),n.TgZ(19,"nz-input-group",12),n._UZ(20,"input",13),n.ALo(21,"translate"),n.qZA(),n.YNc(22,z,1,1,"ng-template",null,14,n.W1O),n.YNc(24,S,2,1,"ng-container",11),n.qZA(),n.TgZ(25,"div",8),n.TgZ(26,"label",15),n.TgZ(27,"span"),n._uU(28),n.ALo(29,"translate"),n.qZA(),n.qZA(),n.qZA(),n.TgZ(30,"div",16),n.TgZ(31,"button",17),n._uU(32),n.ALo(33,"translate"),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA(),n.qZA()),2&o){const l=n.MAs(23);let s,g;n.xp6(4),n.Q6J("formGroup",i.loginForm),n.xp6(6),n.hij("",n.lcZ(11,14,"model.login.username"),":"),n.xp6(2),n.Q6J("maxLength",i.LENGTH_VALIDATOR.USERNAME_MAX_LENGTH.MAX)("placeholder",n.lcZ(13,16,"model.login.placeholder.username")),n.xp6(2),n.Q6J("ngIf",(null==(s=i.loginForm.get("userName"))?null:s.touched)||(null==(s=i.loginForm.get("userName"))?null:s.dirty)),n.xp6(3),n.hij("",n.lcZ(18,18,"model.login.password"),":"),n.xp6(2),n.Q6J("nzSuffix",l),n.xp6(1),n.Q6J("type",i.passwordVisible?"text":"password")("placeholder",n.lcZ(21,20,"model.login.placeholder.password")),n.xp6(4),n.Q6J("ngIf",(null==(g=i.loginForm.get("password"))?null:g.touched)||(null==(g=i.loginForm.get("password"))?null:g.dirty)),n.xp6(4),n.Oqu(n.lcZ(29,22,"model.login.remember")),n.xp6(3),n.Q6J("nzType","primary")("disabled",i.loginForm.invalid),n.xp6(1),n.hij(" ",n.lcZ(33,24,"model.login.msg")," ")}},directives:[r._Y,r.JL,T.Lr,r.sg,m.Zp,r.Fj,r.JJ,r.u,u.O5,b.w,m.gB,m.ke,M.Ie,C.ix,L.dQ,_.Ls],pipes:[x.X$],styles:[".login[_ngcontent-%COMP%]{width:100%;height:100%;background-image:url(login.2a1c13a7bf3f22ec732a.png);background-color:#fff}.center[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;text-align:center;min-height:100vh}section.content[_ngcontent-%COMP%]{border-radius:24px;background:#fff;padding:60px;width:50%;margin:0 auto}.text-left-important[_ngcontent-%COMP%]{text-align:left!important}@media only screen and (max-width: 1000px){section.content[_ngcontent-%COMP%]{border-radius:24px;background:#fff;padding:60px;width:100%;margin:0 auto}}@media only screen and (max-width: 414px){section.content[_ngcontent-%COMP%]{border-radius:24px;background:#fff;padding:24px;width:100%;margin:0 auto}.logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:80%}}i[_ngcontent-%COMP%]{cursor:pointer;font-size:18px}.ant-input-affix-wrapper[_ngcontent-%COMP%]{padding:0 11px 0 0;height:50px;border-radius:12px}label[_ngcontent-%COMP%]{font-weight:bold;font-size:16px}input[_ngcontent-%COMP%]{border-radius:12px;height:48px}.logo[_ngcontent-%COMP%]{padding-bottom:40px}button[_ngcontent-%COMP%]{height:50px;width:75%}.login-button[_ngcontent-%COMP%]{padding-top:30px}small[_ngcontent-%COMP%]{font-weight:600}"]}),t})()}];let F=(()=>{class t{}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[[c.Bz.forChild(w)],c.Bz]}),t})();var P=e(2753);let J=(()=>{class t{}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=n.oAB({type:t}),t.\u0275inj=n.cJS({imports:[[u.ez,P.m,F]]}),t})()}}]);