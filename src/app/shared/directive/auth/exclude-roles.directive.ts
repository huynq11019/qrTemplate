import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

/**
 * Check exc roles
 *
 * @author hieu.daominh
 * @date 2021-12-24
 * @export ExcludeRolesDirective
 * @howToUse
 * ```
 *     <some-element *appExcludeRoles="'USER_READ'">...</some-element>
 *
 *     <some-element *appExcludeRoles="['USER_READ', 'USER_CREATE']">...</some-element>
 * ```
 */
@Directive({
  selector: '[appExcludeRoles]',
})
export class ExcludeRolesDirective {
  private authorities: string[] = [];

  constructor(
    protected authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input() set excludeRoles(value: string | string[]) {
    this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
  }

  private updateView(): void {
    const hasAnyAuthority = this.authService.hasAnyAuthority(this.authorities);
    this.viewContainerRef.clear();
    if (!hasAnyAuthority) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
